import { useEffect, useState } from 'react';
import { handleGoogleLogin } from '#/lib/pocketbase';
import { createFileRoute } from '@tanstack/react-router';

import orangeRiverImg from "../images/orange-river.jpeg"
import riverImg3 from "../images/river3.jpeg"
import trailImg from "../images/trail.jpeg"
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  component: RouteComponent,
})

// Drop your own photos in here — swap the src values.
const SLIDES = [
  { src: riverImg3, alt: 'Heritage church in Prieska' },
  { src: orangeRiverImg, alt: 'Orange River' },
  { src: trailImg, alt: 'Karoo landscape' },
];

function Carousel() {
  const [active, setActive] = useState(0);
 
  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);
 
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'var(--brand-navy)' }}>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <img src={slide.src} alt={slide.alt} className="h-full w-full object-cover" draggable={false} />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(12,26,51,0.9) 0%, rgba(12,26,51,0.55) 45%, rgba(12,26,51,0.25) 100%)' }}
          />
        </div>
      ))}
 
      <div className="absolute left-0 top-0 max-w-md px-16 pt-16">
        <h2 className="display-title text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Explore upcoming Prieska experiences
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          Connect with local guides, heritage custodians and river outfitters,
          and plan the trip that fits the way you want to see the Karoo.
        </p>
        <a
          href="/experiences"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline"
          style={{ color: 'var(--brand-orange)', textDecorationColor: 'var(--brand-orange)' }}
        >
          Browse experiences
          <span aria-hidden="true">→</span>
        </a>
      </div>
 
      <div className="absolute bottom-10 right-10 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === active}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: i === active ? '24px' : '6px', background: i === active ? 'var(--brand-orange)' : 'rgba(255,255,255,0.4)' }}
          />
        ))}
      </div>
    </div>
  );
}


function RouteComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSubmit = async () => {
    setLoading(true);
    setError(null);

    const result = await handleGoogleLogin();

    if (result.success) {
      location.href = "/";
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: 'var(--foam)', fontFamily: 'var(--font-sans)' }}>
 
      <div
  className="relative flex flex-col px-10 pt-12 sm:px-14 overflow-hidden"
  style={{ width: '380px', flexShrink: 0, background: 'var(--foam)' }}
>
  {/* Diagonal navy layer */}
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background: 'var(--brand-navy)',
    clipPath: 'polygon(0 0, 55% 0, 0 20%)',
  }}
  aria-hidden="true"
/>

        
          <a href="/" className="absolute left-0 top-0 z-20 flex items-center" aria-label="360 Experiences home">
            <span className="inline-flex items-center px-1 py-3">
              <img src="/logo-2.png" alt="360 Experiences" className="h-17 w-auto object-contain" />
            </span>
          </a>
 
          <h1 className="display-title text-3xl font-semibold leading-tight text-balance mt-24 rounded-lg z-50" style={{ color: 'var(--sea-ink-soft)' }}>
            Log in to your Admin account
          </h1>
 
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleGoogleSubmit}
              type="button"
              className="flex items-center justify-center gap-3 rounded-md border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--brand-orange)] active:translate-y-0 active:scale-[0.98]"
              style={{ borderColor: 'var(--line)', color: 'var(--sea-ink)', background: 'var(--surface-strong)' }}
            >
            <GoogleIcon /> Google
            </button>
          </div>
 
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
            <span className="whitespace-nowrap text-xs" style={{ color: 'var(--sea-ink)' }}>Go back</span>
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href='/'
              className="flex items-center justify-center gap-3 rounded-md border px-4 py-2.5 text-sm font-semibold !no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--brand-orange)] active:translate-y-0 active:scale-[0.98]"
              style={{ borderColor: 'var(--line)', color: 'var(--sea-ink)', background: 'var(--surface-strong)' }}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </a>
          </div>
        
      </div>
 
      <div className="relative flex-1" style={{ minWidth: '320px' }}>
        <Carousel />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.96 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}
