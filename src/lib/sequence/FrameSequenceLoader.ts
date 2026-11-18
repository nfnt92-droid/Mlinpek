import { frameUrl } from "./manifest";
import type { LoadProgress, SequenceVariant } from "./types";

export type Frame = HTMLImageElement | ImageBitmap;

interface LoaderOptions {
  /** Frames loaded first, in order, before anything else (above-the-fold). */
  initialCount?: number;
  /** Parallel requests. 6 matches typical HTTP/1.1 per-host limits; fine on HTTP/2. */
  concurrency?: number;
  /**
   * How many frames may be held as GPU-ready ImageBitmaps at once (a window around the
   * playhead). Everything else stays as a compressed <img> that the browser decodes and
   * discards on its own. Keeps decoded memory bounded: 48 × 1600×900 ≈ 280 MB instead of
   * 366 frames ≈ 2.1 GB.
   */
  bitmapBudget?: number;
  onProgress?: (p: LoadProgress) => void;
  /** Fired once the first frame is decoded and drawable. */
  onFirstFrame?: () => void;
  /** Fired when the sequence is unusable (first frame failed or too many failures). */
  onFatal?: (reason: string) => void;
}

/**
 * Progressive, priority-ordered frame loader with bounded decoded memory.
 *
 * Network order:
 *   1. the first `initialCount` frames (what the visitor sees immediately)
 *   2. coarse-to-fine refinement: every 32nd frame, then 16th, 8th, 4th, 2nd, rest
 *   3. `prioritize(index)` pulls frames around the current scroll position forward
 *
 * Memory: every frame is kept as a decoded-once <img> (the browser may evict its
 * pixels under pressure); only a sliding window around the playhead is promoted to
 * ImageBitmap so drawing during scrubbing never waits on a decode.
 */
export class FrameSequenceLoader {
  private readonly images: (HTMLImageElement | undefined)[];
  private readonly bitmaps = new Map<number, ImageBitmap>();
  private readonly pendingBitmaps = new Set<number>();
  private readonly failed = new Set<number>();
  private readonly queued = new Set<number>();
  private queue: number[] = [];
  private inFlight = 0;
  private destroyed = false;
  private firstFrameFired = false;
  private loadedCount = 0;
  private playhead = 0;

  constructor(
    private readonly variant: SequenceVariant,
    private readonly opts: LoaderOptions = {},
  ) {
    this.images = new Array(variant.frameCount);
    this.queue = this.buildOrder();
    this.queue.forEach((i) => this.queued.add(i));
  }

  start(): void {
    this.pump();
  }

  destroy(): void {
    this.destroyed = true;
    this.queue = [];
    for (const b of this.bitmaps.values()) b.close();
    this.bitmaps.clear();
  }

  get progress(): LoadProgress {
    return { loaded: this.loadedCount, failed: this.failed.size, total: this.variant.frameCount };
  }

  /** Decoded frame `i` if loaded (bitmap when warm, otherwise the <img>). */
  get(i: number): Frame | undefined {
    return this.bitmaps.get(i) ?? this.images[i];
  }

  /**
   * Closest loaded frame to `index` within `maxDistance` frames.
   * A limit stops a fast jump from flashing a frame of a different scene;
   * the caller keeps the previous picture instead until the right one arrives.
   */
  nearest(index: number, maxDistance = Infinity): Frame | undefined {
    const i = this.nearestIndex(index, maxDistance);
    return i < 0 ? undefined : this.get(i);
  }

  /** Index of the closest loaded frame within `maxDistance`, or -1. */
  nearestIndex(index: number, maxDistance = Infinity): number {
    const n = this.variant.frameCount;
    const i0 = Math.max(0, Math.min(n - 1, index));
    if (this.get(i0)) return i0;
    const lim = Math.min(n, maxDistance);
    for (let d = 1; d <= lim; d++) {
      if (i0 - d >= 0 && this.get(i0 - d)) return i0 - d;
      if (i0 + d < n && this.get(i0 + d)) return i0 + d;
    }
    return -1;
  }

  /** Network priority + bitmap window follow the playhead. */
  prioritize(index: number, radius = 8): void {
    this.playhead = index;
    const near: number[] = [];
    for (let d = 0; d <= radius; d++) {
      for (const i of d === 0 ? [index] : [index + d, index - d]) {
        if (i >= 0 && i < this.variant.frameCount && this.queued.has(i)) near.push(i);
      }
    }
    if (near.length) {
      const nearSet = new Set(near);
      this.queue = [...near, ...this.queue.filter((i) => !nearSet.has(i))];
    }
    this.warm();
  }

  /** Promote frames around the playhead to ImageBitmap; evict the farthest beyond budget. */
  private warm(): void {
    if (typeof createImageBitmap !== "function" || NO_BITMAPS || this.destroyed) return;
    const budget = this.opts.bitmapBudget ?? 48;
    const half = Math.floor(budget / 2) - 2;
    const n = this.variant.frameCount;
    for (let d = 0; d <= half; d++) {
      for (const i of d === 0 ? [this.playhead] : [this.playhead + d, this.playhead - d]) {
        if (i < 0 || i >= n || this.bitmaps.has(i) || this.pendingBitmaps.has(i)) continue;
        const img = this.images[i];
        if (!img) continue;
        this.pendingBitmaps.add(i);
        createImageBitmap(img)
          .then((bmp) => {
            this.pendingBitmaps.delete(i);
            if (this.destroyed) return bmp.close();
            this.bitmaps.set(i, bmp);
            this.evict(budget);
          })
          .catch(() => this.pendingBitmaps.delete(i));
      }
    }
  }

  private evict(budget: number): void {
    if (this.bitmaps.size <= budget) return;
    const byDistance = [...this.bitmaps.keys()].sort(
      (a, b) => Math.abs(b - this.playhead) - Math.abs(a - this.playhead),
    );
    for (const i of byDistance.slice(0, this.bitmaps.size - budget)) {
      this.bitmaps.get(i)?.close();
      this.bitmaps.delete(i);
    }
  }

  private buildOrder(): number[] {
    const n = this.variant.frameCount;
    const initial = Math.min(this.opts.initialCount ?? 12, n);
    const order: number[] = [];
    const seen = new Set<number>();
    const add = (i: number) => {
      if (i >= 0 && i < n && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    for (let i = 0; i < initial; i++) add(i);
    add(n - 1);
    for (const stride of [32, 16, 8, 4, 2, 1]) {
      for (let i = 0; i < n; i += stride) add(i);
    }
    return order;
  }

  private pump(): void {
    const max = this.opts.concurrency ?? 6;
    while (!this.destroyed && this.inFlight < max && this.queue.length) {
      const index = this.queue.shift()!;
      this.queued.delete(index);
      this.inFlight++;
      this.loadOne(index).finally(() => {
        this.inFlight--;
        this.pump();
      });
    }
  }

  private async loadOne(index: number): Promise<void> {
    const url = frameUrl(this.variant, index);
    try {
      const img = await loadImage(url);
      if (this.destroyed) return;
      this.images[index] = img;
      this.loadedCount++;
      if (Math.abs(index - this.playhead) < (this.opts.bitmapBudget ?? 48) / 2) this.warm();
      if (!this.firstFrameFired) {
        this.firstFrameFired = true;
        this.opts.onFirstFrame?.();
      }
    } catch {
      if (this.destroyed) return;
      this.failed.add(index);
      if (index === 0 && !this.firstFrameFired) {
        this.opts.onFatal?.(`First frame failed to load: ${url}`);
        this.destroy();
        return;
      }
      // More than 25% broken → the sequence is not trustworthy, fall back.
      if (this.failed.size > this.variant.frameCount * 0.25) {
        this.opts.onFatal?.(`${this.failed.size} frames failed to load`);
        this.destroy();
        return;
      }
    }
    this.opts.onProgress?.(this.progress);
  }
}

/**
 * WebKit (Safari, and every browser on iOS) draws <img> frames directly just as fast, while
 * its ImageBitmaps count against a small per-tab memory ceiling and have produced blank
 * bitmaps in some versions — so the bitmap window is a Chromium/Firefox-only optimisation.
 */
const NO_BITMAPS =
  typeof navigator !== "undefined" &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (/AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|Firefox|Android/.test(navigator.userAgent)));

/**
 * Load + decode one frame without relying on `img.decode()` alone: on iOS Safari that
 * promise can reject spuriously or never settle for off-DOM images, which left the hero
 * blank on iPhones. The load event is authoritative; decode() is a bounded best-effort
 * warm-up. One retry covers a dropped request on flaky mobile connections.
 */
async function loadImage(url: string, attempt = 0): Promise<HTMLImageElement> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      const timer = setTimeout(() => reject(new Error("timeout")), 20000);
      im.onload = () => {
        clearTimeout(timer);
        resolve(im);
      };
      im.onerror = () => {
        clearTimeout(timer);
        reject(new Error("error"));
      };
      im.src = url;
    });
    if (!img.naturalWidth) throw new Error("empty");
    if (typeof img.decode === "function") {
      await Promise.race([img.decode().catch(() => undefined), new Promise((r) => setTimeout(r, 1500))]);
    }
    return img;
  } catch (e) {
    if (attempt < 1) return loadImage(url, attempt + 1);
    throw e;
  }
}
