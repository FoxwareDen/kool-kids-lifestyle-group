import { useQuery } from '@tanstack/react-query'
import { fetchExperiencesClient } from '#/lib/pocketbase'
import { deriveCategories, type HydratedBookingPage } from '#/lib/experiences'

/**
 * React Query hook that loads all published experiences from the client-side
 * PocketBase instance. Shared by the nav dropdown and the experiences pages so
 * the list is fetched once and cached.
 *
 * @returns The list of experiences plus the query's loading/error state.
 */
export function useExperiences() {
  const query = useQuery({
    queryKey: ['experiences', 'published'],
    queryFn: async (): Promise<HydratedBookingPage[]> => {
      const result = await fetchExperiencesClient()
      if (!result.success || !result.value) return []
      return result.value
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    experiences: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}

/**
 * Convenience hook returning the unique, visitor-facing category list derived
 * from all published experiences.
 */
export function useExperienceCategories() {
  const { experiences, isLoading } = useExperiences()
  return { categories: deriveCategories(experiences), isLoading }
}
