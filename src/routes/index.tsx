import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/hero/HeroSection'

// 1. It is inputValidator, and it must return the value
// export const getPageData = createServerFn()
//   .inputValidator((slug: string) => {
//     return slug
//   })
//   .handler(async ({ data: slug }) => {

//     console.log("slug: " + slug)
//     // Put your actual DB/CMS call here
//     const result = await fetchPageData(slug, "en");
    
//     return {
//       title: slug === "" ? "Welcome Home" : `Page: ${slug}`,
//       content: `Loaded server data for slug: "${slug}"`,
//       test: result
//     }
//   })

// 2. Setup the route context
export const Route = createFileRoute('/')({
  // loader: async ({ location }) => {
  //   // Clean up slash formatting so "/" becomes "" and "/about" becomes "about"
  //   const slug = location.pathname.replace(/^\/|\/$/g, '')
    
  //   // Pass the payload as { data: value }
  //   const pageData = await getPageData({ data: slug })
    
  //   return { pageData }
  // },
  component: Home,
})

function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  )
}
