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
    <section aria-labelledby="meet-the-team-title" className="relative overflow-hidden bg-[#f1ede6] py-20 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[var(--brand-orange)]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-[#1d79a8]/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-orange)]/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]">
              <span aria-hidden="true" className="size-2 rounded-full bg-[var(--brand-orange)]" />
              Rooted in Prieska
            </p>
            <h2
              id="meet-the-team-title"
              className="display-title mt-4 text-balance text-3xl font-medium leading-[1.15] text-[var(--brand-navy)] sm:text-4xl"
            >
              Meet the Directors
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--brand-navy)]/75">
              Five young directors, one shared mission: bringing the stories and
              heritage of our hometown to life.
            </p>
          </div>
          <p className="display-title hidden text-6xl font-medium text-[var(--brand-navy)]/10 sm:block" aria-hidden="true">
            360°
          </p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <figure className="group overflow-hidden rounded-2xl bg-[var(--brand-navy)] shadow-[0_24px_60px_-28px_rgba(12,35,58,0.55)] ring-1 ring-[var(--brand-navy)]/10">
            <div className="relative overflow-hidden">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/team-i9nkkBVnCUXZSCTRNuCsJ6gbpVFEgv.jpeg"
                alt="The five directors of 360 Experiences together in Prieska"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[var(--brand-orange)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)] shadow-md sm:left-5 sm:top-5">
                The people behind the journey
              </span>
            </div>
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-white/85 sm:px-6">
              <span>The team behind 360 Experiences</span>
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[var(--brand-orange)] shadow-[0_0_14px_var(--brand-orange)]" />
            </figcaption>
          </figure>

          <ul className="flex flex-col gap-3">
            {TEAM_MEMBERS.map((member, index) => (
              <li
                key={member.name}
                className="group flex items-center gap-4 rounded-xl border border-[var(--brand-navy)]/5 bg-white/75 p-4 shadow-[0_8px_24px_-18px_rgba(12,35,58,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-orange)]/35 hover:bg-white hover:shadow-md sm:p-4"
              >
                <span className="display-title flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-navy)] text-sm font-medium text-white transition-colors group-hover:bg-[var(--brand-orange)] group-hover:text-[var(--brand-navy)]">
                  0{index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b75d24]">
                    {member.position}
                  </p>
                  <h3 className="display-title mt-1 text-lg font-medium leading-tight text-[var(--brand-navy)] sm:text-xl">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--brand-navy)]/65">
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
