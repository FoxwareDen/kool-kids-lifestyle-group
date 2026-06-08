import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_CMS_URI);

export interface Component {
  id: string;
  collectionId: string;
  collectionName: string;
  components: string;
  type: 'navbar' | 'hero' | 'cardblock';
  content: Record<string, any>;
  media: string[];
  pages: string;
  created: string;
  updated: string;
}

export interface Page {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  slug: string;
  language: 'en' | 'af';
  project: string;
  created: string;
  updated: string;
  expand?: {
    components_via_pages: Component[];
  };
}

export interface PageData {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  slug: string;
  language: 'en' | 'af';
  project: string;
  created: string;
  updated: string;
  components: Component[]
}

export async function fetchPageData(slug: string, language: "en"| "af"="en") {
    try {
    // Query the components collection directly
    // page.expand.components_via_pages = [ navbar, hero, cardblock, ... ]
      const record: Page = await pb.collection('pages').getFirstListItem(
        `slug = "${slug}" && language = "${language}"`,
        { expand: 'components_via_pages' }
      );

      return {
        id: record.id,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        title: record.title,
        slug: record.slug,
        language: record.language,
        project: record.project,
        created: record.created,
        updated: record.updated,
        components: record.expand?.components_via_pages || []
      } as PageData;
  } catch (error) {
    console.error("Error fetching components:", error);
  }
}

// TODO: add way to upload media components