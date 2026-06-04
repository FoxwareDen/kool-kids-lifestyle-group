import { fetchPageData } from '#/lib/pocketbase';
import { createFileRoute } from '@tanstack/react-router'
// import { createServerFn } from '@tanstack/react-start'
import { useEffect } from 'react';

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
  // const { pageData } = Route.useLoaderData()

  useEffect(()=>{
    (async () => {
      console.log("running fetch request...");      
      const test = await fetchPageData("", "en");

      console.log(test);      
    })()
  },[])

  return (
    <div className="p-8">
      {/* <h1 className="text-4xl font-bold">{pageData.title}</h1> */}
    </div>
  )
}