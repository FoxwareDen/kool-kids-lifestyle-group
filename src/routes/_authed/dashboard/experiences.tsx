import { Button } from '#/components/dashboard/form-controls'
import { ExperienceListCard } from '#/components/experiences/ExperienceListCard'
import { deleteExperienceById, fetchExperiences } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Compass, Loader2, Trash2Icon } from 'lucide-react'
import { useRef, useState } from 'react'

const getPageData = createServerFn()
  .handler(async () =>{
    const res = await fetchExperiences();

    if (!res.success) {
      return { error: "Failed to get experiences", data: null };
    }
    return { error: null, data: res.value };
  });

export const Route = createFileRoute('/_authed/dashboard/experiences')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: {lang} }) => ({lang}),
  loader: async ({ deps: { lang }}) => {
    const data = await getPageData();
    return { lang, data }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, lang, } = Route.useLoaderData();
  const [error, setError] = useState<string|null>(data.error);
  const isSubmitting = useRef(false);
  const [filtered, setFiltered] = useState(data.data || [])

  const handleDelete = async (id: string) => {
    if (isSubmitting.current) return;

    isSubmitting.current = true
    try {
      const res = await deleteExperienceById(id);
      
      if (res) setFiltered(prev=>(prev.filter(e=> e.id == id)));
    } catch (error) {
      console.error(error);
            
      setError("Failed to delete experience")
    }finally {
      isSubmitting.current = false;
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      { error ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-(--brand-navy)/20 bg-white/60 py-20 text-center">
              <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
              <p className="text-base font-semibold text-[var(--brand-navy)]">
                We couldn&apos;t load experiences
              </p>
              <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
                Something went wrong while fetching experiences. Please refresh the page to try again.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 border border-dashed border-(--brand-navy)/20 bg-white/60 py-20 text-center">
              <Compass className="h-8 w-8 text-[var(--brand-navy)]/30" strokeWidth={1.5} />
              <p className="text-base font-semibold text-[var(--brand-navy)]">
                No experiences here yet
              </p>
              <p className="max-w-sm text-sm text-[var(--brand-navy)]/55">
                There are no experiences in this category right now. Check back soon or browse all of
                our adventures.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((experience) => (
                <div key={experience.id} className='relative'>
                  <div className='absolute z-30 top-0 right-0 px-2.5 py-2.5'>
                    <button onClick={()=>handleDelete(experience.id)} className="rounded-full bg-[var(--destructive-foreground)]/65 hover:bg-[var(--destructive)]/90 hover:scale-110 px-0.5 py-1 text-white backdrop-blur-sm">
                      <Trash2Icon className='h-4' />
                    </button>
                  </div>
                  <ExperienceListCard key={experience.id} experience={experience} lang={lang} />
                </div>
              ))}
            </div>
          )}
    </div>
  )
}