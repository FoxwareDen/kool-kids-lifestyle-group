import PocketBase from 'pocketbase';

const pb = new PocketBase("https://cms.foxwareden.co.za");

export async function fetchPageData(slug: string, language: "en"| "af") {
    try {
    // Query the components collection directly
    const records = await pb.collection('components').getFullList({
      // Filter components where the related page's slug matches your target
      // filter: `pages.slug = "${slug}"`,
      // Optional: If you also want to fetch the page data itself in the same request
      // expand: 'pages', 
    });

    return records;
  } catch (error) {
    console.error("Error fetching components:", error);
  }
}

