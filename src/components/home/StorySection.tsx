import { ArrowLink, Eyebrow } from "@/components/ui/Editorial";
import { Photo } from "@/components/ui/Photo";
import { MillIllustration } from "@/components/ui/Illustrations";

/** 02 — the first page after the film: one headline, one paragraph, one photograph. */
export function StorySection() {
  return (
    <section aria-labelledby="prica-title" className="relative overflow-hidden bg-paper text-charcoal">
      {/* the mill, drawn like on the new flour packaging — quiet background line art */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <MillIllustration className="w-[max(100%,900px)] max-w-[1600px] shrink-0 text-wheat-deep opacity-[0.16]" />
      </div>
      <div className="wrap section relative grid gap-14 md:grid-cols-12 md:items-center md:gap-8">
        <div className="md:col-span-6">
          <Eyebrow>Naša priča</Eyebrow>
          <h2 id="prica-title" className="title mt-8">
            <span data-lines className="block">Jedna priča.</span>
            <span data-lines className="block italic text-wheat-deep">Od zrna do kruha.</span>
          </h2>
          <p className="lede measure mt-10 text-charcoal/75" data-reveal>
            Od pažljivo odabranog zrna, preko mljevenja i proizvodnje, do svježeg kruha u našim pekarama. Svaki korak
            povezuje ista posvećenost kvaliteti.
          </p>
          <div className="mt-10" data-reveal>
            <ArrowLink href="/o-nama/">Više o nama</ArrowLink>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Photo id="manifest-grain" ratio="aspect-[4/5]" sizes="(min-width: 768px) 40vw, 100vw" reveal />
        </div>
      </div>
    </section>
  );
}
