import { SectionHeading } from '#/components/sections/SectionHeading'
import churchImg from '../../images/church.jpeg'
import prieskaImg from '../../images/prieska.jpeg'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * The "Heritage Intro" section. A two-column layout pairing an introductory
 * narrative about Prieska's history with a stacked pair of heritage
 * photographs. Sits on the cream background to open the page softly after the
 * hero.
 *
 * @returns {JSX.Element} The rendered intro section.
 */
export function HeritageIntro({ lang = 'en' }: { lang?: Language }) {
  const eyebrow = resolveTranslatable({ default: 'Where It All Began', translations: { af: 'Waar Dit Alles Begin Het' } }, lang)
  const title = resolveTranslatable({ default: 'A Heritage Shaped by Land & People', translations: { af: 'n Erfenis Geverf deur Land & Mense' } }, lang)
  const paragraph1 = resolveTranslatable({ default: 'Set on the banks of the mighty Orange River, Prieska has long been a meeting place of cultures, trade and tradition. From the first communities who lived along its waters to the farmers, miners and travellers who followed, every era has left its mark on the town we know today.', translations: { af: 'Gelee aan die oewers van die magtige Oranjerivier, was Prieska al lank ’n ontmoetingsplek van kulture, handel en tradisie. Van die eerste gemeenskappe wat langs sy waters gebly het tot die boere, myners en reisigers wat gevolg het, het elke era sy stempel gelaat op die dorp wat ons vandag ken.' } }, lang)
  const paragraph2 = resolveTranslatable({ default: 'Our heritage is written in the tiger\'s-eye stone quarried from the surrounding hills, in the historic buildings that line our streets, and in the stories passed down through generations of Northern Cape families.', translations: { af: 'Ons erfenis is geskryf in die tiger’s-eye-klip wat uit die omliggende heuwels ontgin word, in die historiese geboue wat ons strate linieer, en in die stories wat deur generasies Noord-Kaap-families oorgedra is.' } }, lang)
  const paragraph3 = resolveTranslatable({ default: 'Preserving and sharing this legacy is at the heart of what we do — inviting visitors to walk through living history and understand the spirit that makes Prieska unique.', translations: { af: 'Om hierdie nalatenskap te bewaar en te deel, is die hart van wat ons doen — om besoekers uit te nooi om deur lewende geskiedenis te loop en die gees te verstaan wat Prieska uniek maak.' } }, lang)
  const imageBadge = resolveTranslatable({ default: 'A town built on stone & river', translations: { af: 'n Dorpie gebou op klip & rivier' } }, lang)
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <div>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            theme="light"
            align="left"
          />
          <div className="mt-6 space-y-4 text-pretty leading-relaxed text-[var(--brand-navy)]/75">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
            <p>{paragraph3}</p>
          </div>
        </div>

        {/* Image collage */}
        <div className="grid grid-cols-2 gap-4">
          <img
            src={churchImg}
            alt="Historic church building in Prieska"
            className="col-span-2 h-64 w-full object-cover shadow-md"
          />
          <img
            src={prieskaImg}
            alt="Street view of the town of Prieska"
            className="h-48 w-full object-cover shadow-md"
          />
          <div className="flex flex-col justify-center bg-[var(--brand-navy)] p-6 text-white shadow-md">
            <span className="script-title text-2xl text-[var(--brand-orange)]">Since 1882</span>
            <span className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">
              {imageBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
