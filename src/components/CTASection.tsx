export function CTASection() {
  return (
    <section className="bg-[#0f1a2b]">
      <div className="grid gap-0 lg:grid-cols-3">
        {/* Testimonials */}
        <div className="border-b border-white/10 px-6 py-12 lg:border-b-0 lg:border-r lg:px-10 lg:py-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            TESTIMONIALS
          </p>
          <h3 className="display-title mb-6 text-2xl font-bold text-white md:text-3xl">
            What Visitors Say
          </h3>

          {/* Quote */}
          <div className="relative">
            <svg className="absolute -left-2 -top-2 h-8 w-8 text-[#ED9029]/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="mb-6 pl-6 text-sm italic leading-relaxed text-white/70 md:text-base">
              Prieska exceeded all our expectations. The people, the landscapes and the stories make it a truly special place.
            </p>
            <p className="pl-6 text-sm font-semibold text-white">
              – Sarah & Mark, Cape Town
            </p>
          </div>

          {/* Pagination dots */}
          <div className="mt-6 flex gap-2 pl-6">
            <button className="h-2 w-2 rounded-full bg-[#ED9029]" aria-label="Testimonial 1" />
            <button className="h-2 w-2 rounded-full bg-white/30" aria-label="Testimonial 2" />
            <button className="h-2 w-2 rounded-full bg-white/30" aria-label="Testimonial 3" />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="border-b border-white/10 bg-[#ED9029] px-6 py-12 lg:border-b-0 lg:border-r lg:px-10 lg:py-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            UPCOMING EVENTS
          </p>
          <h3 className="display-title mb-6 text-2xl font-bold text-white md:text-3xl">
            {"What's Happening"}
            <br />
            in Prieska
          </h3>

          {/* Event card */}
          <div className="mb-6 flex gap-4 rounded-lg bg-white p-4">
            <div className="flex flex-col items-center justify-center rounded bg-[#0f1a2b] px-3 py-2 text-center">
              <span className="text-2xl font-bold text-white">24</span>
              <span className="text-xs font-semibold uppercase text-[#ED9029]">MAY</span>
            </div>
            <div>
              <h4 className="font-bold text-[#0f1a2b]">Heritage Walk & Storytelling Tour</h4>
              <p className="text-xs text-gray-500">10:00 AM • Prieska</p>
            </div>
          </div>

          <a
            href="/events"
            className="inline-flex items-center gap-2 rounded-md border-2 border-white bg-transparent px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            VIEW ALL EVENTS
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Ready to Explore CTA */}
        <div className="px-6 py-12 lg:px-10 lg:py-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            READY TO EXPLORE?
          </p>
          <h3 className="display-title mb-4 text-2xl font-bold text-white md:text-3xl">
            Ready to Experience
            <br />
            Prieska?
          </h3>
          <p className="mb-8 text-sm leading-relaxed text-white/70">
            {"Whether you're looking for adventure, heritage, relaxation or discovery, your next experience starts here."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="/book"
              className="flex items-center gap-2 rounded-md bg-[#ED9029] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d17a1f]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              BOOK NOW
            </a>
            <a
              href="/contact"
              className="flex items-center gap-2 rounded-md bg-[#4A5568] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2D3748]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              CONTACT US
            </a>
            <a
              href="https://wa.me/"
              className="flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#128C7E]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WHATSAPP US
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
