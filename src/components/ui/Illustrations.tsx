/**
 * Original line illustrations in the spirit of the new Mlinpek flour packaging (a fine gold
 * drawing of the mill). Drawn here from simple shapes — not traced from any photo or artwork.
 * All use currentColor and non-scaling strokes, so the colour and weight come from the page.
 */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

type SvgProps = { className?: string; title?: string };

function svgA11y(title?: string) {
  return title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
}

/** The mill complex: old mill hall, silo battery with elevator tower, tall silo block, warehouse. */
export function MillIllustration({ className = "", title }: SvgProps) {
  const G = 330; // ground line
  const silos = range(5).map((i) => 560 + i * 42);
  return (
    <svg viewBox="0 0 1200 360" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={className} {...svgA11y(title)}>
      <g>
        {/* ground */}
        <path d={`M10 ${G}H1190`} />
        <path d={`M60 ${G + 10}H420M520 ${G + 10}H1120`} strokeDasharray="2 7" opacity={0.6} />

        {/* left: low houses with pitched roofs */}
        <path d={`M40 ${G}V262L92 232L144 262V${G}`} />
        <path d="M40 262H144" />
        {range(3).map((i) => (
          <rect key={`h1w${i}`} x={54 + i * 30} y={278} width={14} height={18} />
        ))}
        <path d={`M150 ${G}V250H300V${G}`} />
        <path d="M144 250L190 222H262L300 250" />
        {range(4).map((i) => (
          <rect key={`h2w${i}`} x={164 + i * 34} y={266} width={16} height={20} />
        ))}
        {range(4).map((i) => (
          <rect key={`h2d${i}`} x={164 + i * 34} y={300} width={16} height={20} />
        ))}

        {/* old mill hall: four storeys, flat roof with cornice */}
        <path d={`M300 ${G}V150H520V${G}`} />
        <path d="M294 150H526M298 158H522" />
        <path d="M300 205H520M300 255H520" opacity={0.5} />
        {range(4).map((row) =>
          range(6).map((col) => {
            const x = 316 + col * 34;
            const y = 170 + row * 40;
            return <path key={`mw${row}-${col}`} d={`M${x} ${y + 24}V${y + 6}Q${x + 8} ${y} ${x + 16} ${y + 6}V${y + 24}Z`} />;
          }),
        )}
        <path d={`M396 ${G}V296H424V${G}`} />
        {/* chimney */}
        <path d="M480 150V96H498V150" />
        <path d="M476 96H502" />

        {/* conveyor bridge to the silos */}
        <path d="M520 178L572 120M520 190L572 132" />
        {range(5).map((i) => (
          <path key={`br${i}`} d={`M${528 + i * 10} ${181 - i * 11}V${169 - i * 11}`} opacity={0.6} />
        ))}

        {/* silo battery */}
        {silos.map((x, i) => (
          <g key={`s${i}`}>
            <path d={`M${x} ${G}V100M${x + 40} 100V${G}`} />
            <path d={`M${x} 100Q${x + 20} 90 ${x + 40} 100`} />
            {/* right-side hatching for volume */}
            {range(9).map((k) => (
              <path key={k} d={`M${x + 33} ${118 + k * 22}V${130 + k * 22}`} opacity={0.45} />
            ))}
            <path d={`M${x + 4} 140H${x + 36}M${x + 4} 230H${x + 36}`} opacity={0.35} />
          </g>
        ))}
        {/* gallery over the silos */}
        <path d="M556 100V78H770V100" />
        {range(10).map((i) => (
          <rect key={`g${i}`} x={566 + i * 20} y={84} width={8} height={9} />
        ))}

        {/* elevator tower */}
        <path d={`M770 ${G}V36H836V${G}`} />
        <path d="M764 36H842M770 46H836" />
        <path d="M790 36V22H818V36" />
        {range(7).map((i) => (
          <rect key={`t${i}`} x={790} y={60 + i * 34} width={10} height={16} />
        ))}
        {range(7).map((i) => (
          <rect key={`t2${i}`} x={808} y={60 + i * 34} width={10} height={16} />
        ))}

        {/* tall silo block with vertical ribs */}
        <path d={`M836 ${G}V68H968V${G}`} />
        <path d="M832 68H972" />
        {range(5).map((i) => (
          <path key={`r${i}`} d={`M${858 + i * 22} 76V${G}`} opacity={0.5} />
        ))}
        <path d="M940 120V310" opacity={0.35} strokeDasharray="3 5" />

        {/* warehouse with sawtooth roof */}
        <path d={`M968 ${G}V246H1160V${G}`} />
        <path d="M968 246L1000 222V246L1032 222V246L1064 222V246L1096 222V246L1128 222V246L1160 222V246" />
        <path d={`M996 ${G}V286H1048V${G}M1022 286V${G}`} />
        {range(3).map((i) => (
          <rect key={`wh${i}`} x={1066 + i * 30} y={266} width={18} height={14} />
        ))}

        {/* truck at the loading door */}
        <path d={`M1072 ${G - 8}V296H1128V${G - 8}H1072M1128 304H1148L1158 316V${G - 8}H1128`} />
        <circle cx={1088} cy={G - 6} r={6} />
        <circle cx={1144} cy={G - 6} r={6} />

        {/* wheat ears at the edges */}
        <WheatEar x={20} y={G} />
        <WheatEar x={1180} y={G} flip />
      </g>
    </svg>
  );
}

function WheatEar({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} 1)`} opacity={0.8}>
      <path d="M0 0Q4 -40 14 -78" />
      {range(6).map((i) => {
        const yy = -30 - i * 9;
        const xx = 4 + i * 1.7;
        return (
          <g key={i}>
            <path d={`M${xx} ${yy}q-9 -3 -11 -12q9 2 11 12z`} />
            <path d={`M${xx + 1} ${yy}q9 -5 9 -14q-8 4 -9 14z`} />
          </g>
        );
      })}
    </g>
  );
}

/* ── role vignettes for the careers section ─────────────────────────────── */

export type RoleId = "prodavac" | "pekar" | "tehnolog" | "laborant" | "mlinar" | "vozac";

export function RoleIllustration({ role, className = "" }: { role: RoleId; className?: string }) {
  return (
    <svg viewBox="6 6 108 108" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <g>{ROLE_ART[role]}</g>
    </svg>
  );
}

const ROLE_ART: Record<RoleId, React.ReactNode> = {
  // sales assistant behind the counter, bread on the shelf
  prodavac: (
    <>
      <path d="M14 104H106M20 104V76H100V104" />
      <path d="M20 84H100" opacity={0.5} />
      <circle cx={60} cy={38} r={10} />
      <path d="M44 76V62Q44 52 60 52Q76 52 76 62V76" />
      <path d="M52 52L60 64L68 52" opacity={0.7} />
      <path d="M14 30H40M80 30H106" />
      <path d="M18 30q4 -8 9 0q4 -8 9 0" />
      <path d="M84 30q0 -9 10 -9q10 0 10 9" />
      <path d="M30 92q6 -6 12 0M78 92q6 -6 12 0" opacity={0.7} />
    </>
  ),
  // baker with hat and peel, loaf on the peel
  pekar: (
    <>
      <path d="M46 34Q40 22 50 20Q54 12 62 16Q70 12 74 20Q84 22 76 34Z" />
      <path d="M48 34H74" />
      <circle cx={61} cy={44} r={9} />
      <path d="M42 96V68Q42 56 61 56Q80 56 80 68V96" />
      <path d="M61 56V96" opacity={0.5} />
      <path d="M80 72L108 44" />
      <path d="M100 38Q112 32 114 42Q110 52 104 48" />
      <path d="M98 42q4 -4 10 -2" opacity={0.6} />
      <path d="M20 104H100" />
    </>
  ),
  // technologist: clipboard with checklist and a loaf cross-section
  tehnolog: (
    <>
      <rect x={26} y={20} width={50} height={78} rx={3} />
      <path d="M40 16H62V26H40Z" />
      {[38, 52, 66].map((y) => (
        <g key={y}>
          <path d={`M34 ${y}l4 4l7 -8`} />
          <path d={`M50 ${y}H68`} opacity={0.6} />
        </g>
      ))}
      <path d="M34 82H68" opacity={0.6} />
      <path d="M72 96Q72 74 90 74Q108 74 108 96Z" />
      <path d="M80 86q3 -3 6 0M92 84q3 -3 6 0M86 92q3 -3 6 0" opacity={0.6} />
    </>
  ),
  // laboratory: microscope and flask
  laborant: (
    <>
      <path d="M30 100H70M38 100V92H62V100" />
      <path d="M50 92V84M42 84H66" />
      <path d="M54 84L44 46L52 42L62 80" />
      <path d="M42 40L54 36L56 42L44 46Z" />
      <path d="M46 70Q30 66 34 50" opacity={0.6} />
      <path d="M86 40V58L74 92Q72 100 80 100H100Q108 100 106 92L94 58V40" />
      <path d="M82 40H98" />
      <path d="M78 82H102" opacity={0.6} />
      <circle cx={88} cy={74} r={2} />
      <circle cx={95} cy={88} r={2.5} />
    </>
  ),
  // miller: sack and wheat ears beside a mill wheel
  mlinar: (
    <>
      <circle cx={42} cy={58} r={26} />
      <circle cx={42} cy={58} r={6} />
      {range(8).map((i) => {
        const a = (i * Math.PI) / 4;
        return <path key={i} d={`M${42 + 6 * Math.cos(a)} ${58 + 6 * Math.sin(a)}L${42 + 26 * Math.cos(a)} ${58 + 26 * Math.sin(a)}`} opacity={0.7} />;
      })}
      <path d="M72 102Q66 100 68 90L72 62Q70 56 78 54H96Q104 56 102 62L106 90Q108 100 102 102Z" />
      <path d="M74 64H100" opacity={0.6} />
      <path d="M78 82H98" opacity={0.6} />
      <path d="M14 104H112" />
    </>
  ),
  // driver: delivery van
  vozac: (
    <>
      <path d="M12 86V40H72V86" />
      <path d="M72 52H92L106 68V86H72" />
      <path d="M78 58H90L98 68H78Z" opacity={0.7} />
      <circle cx={32} cy={88} r={9} />
      <circle cx={88} cy={88} r={9} />
      <path d="M12 86H22M42 86H78M98 86H106" />
      <path d="M24 56q6 -8 12 0q6 -8 12 0q6 -8 12 0" opacity={0.7} />
      <path d="M8 104H112" opacity={0.5} />
    </>
  ),
};
