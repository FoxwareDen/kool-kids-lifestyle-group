const TEAM_MEMBERS = [
  {
    name: 'Lubabalo Olyn',
    position: 'Standing left',
    role: 'Marketing Director',
  },
  {
    name: 'Lesley Nel',
    position: 'Standing right',
    role: 'Administrative Director',
  },
  {
    name: 'Luvuyo Plaatjies',
    position: 'Sitting left',
    role: 'Operations Director',
  },
  {
    name: 'Marlize Melk',
    position: 'Sitting middle',
    role: 'Community & Heritage Director',
  },
  {
    name: 'Mellygan Yawa',
    position: 'Sitting right',
    role: 'Finance Director',
  },
]

export function MeetTheTeam() {
  return (
    <section aria-labelledby="meet-the-team-title" className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
            Rooted in Prieska
          </p>
          <h2
            id="meet-the-team-title"
            className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] text-[var(--brand-navy)] sm:text-4xl"
          >
            Meet the Directors
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--brand-navy)]/75">
            Five young directors, one shared mission: bringing the stories and
            heritage of our hometown to life.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <figure className="overflow-hidden bg-[var(--brand-navy)] shadow-lg">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/team-i9nkkBVnCUXZSCTRNuCsJ6gbpVFEgv.jpeg"
              alt="The five directors of 360 Experiences together in Prieska"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="px-5 py-4 text-sm text-white/80 sm:px-6">
              The team behind 360 Experiences
            </figcaption>
          </figure>

          <ul className="divide-y divide-[var(--brand-navy)]/15">
            {TEAM_MEMBERS.map((member, index) => (
              <li key={member.name} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <span className="display-title pt-0.5 text-xl text-[var(--brand-orange)]">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-navy)]/55">
                    {member.position}
                  </p>
                  <h3 className="display-title mt-1 text-xl font-medium text-[var(--brand-navy)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--brand-navy)]/70">
                    {member.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
