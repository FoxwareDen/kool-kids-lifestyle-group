import PocketBase from 'pocketbase';

// ============= Client (singleton) =============
export const pb = new PocketBase(import.meta.env.VITE_CMS_URI);

export function buildImageUrl(assetCollId: string, assetId:string, filename: string) {
  return `${import.meta.env.VITE_CMS_URI}/api/files/${assetCollId}/${assetId}/${filename}`  
}

export async function fetchPageData(slug: string, language: "en" | "af" = "en"): Promise<PageData | null> {
  try {
    const record = await pb.collection('pages').getFirstListItem(
      `slug = "${slug}" && language = "${language}"`,
      { expand: 'components_via_pages' }
    );

    const components: Record<string, Component> = record.expand?.components_via_pages.reduce((prev: Record<string, Component>, current:Component)=> {
      prev[current.components] = current
      return prev
    }, {})

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
      components
    } as PageData;
  } catch (error: any) {
    if (error?.status === 404) return null;
    throw error;
  }
}

// ============= Types =============
export interface Asset {
    alt: string,
    collectionId: string,
    collectionName: string,
    file: string,
    id: string
    name:string,
    type: string,
}

export interface Component {
  id: string;
  collectionId: string;
  collectionName: string;
  components: string;
  type: 'navbar' | 'hero' | 'cardblock';
  content: Record<string, any>;
  media: Record<string,Asset>;
  pages: string;
  created: string;
  updated: string;
  expand?: {
    media: Asset[]
  }
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
  components: Record<string, Component>
}

// ============= SSR =============
// On the server, never share a PocketBase instance across requests
// — each request gets its own to avoid leaking auth state between users.
export function createPB(): PocketBase {
  return new PocketBase(process.env.CMS_URI);
}

export async function fetchPageDataSSR(
  slug: string,
  language: "en" | "af" = "en"
): Promise<PageData | null> {
  const client = createPB(); // fresh instance per requesXt

  try {
    const record = await client.collection('pages').getFirstListItem(
      `slug = "${slug}" && language = "${language}"`,
      { expand: 'components_via_pages.media, components_via_pages' }
    );

    const components: Record<string, Component> = record.expand?.components_via_pages.reduce((prev: Record<string, Component>, current:Component)=> {
      // const media = current?.expand.media.length > 0 ? 
      const media: Record<string, Asset> = current?.expand?.media && current.expand.media.length > 0 ? 
        current.expand.media.reduce((prev, c) => {
          prev[c.name] = c;
          return prev;
        }, {} as Record<string, Asset>)  // ← Type assertion here
        : {};

        
      
      prev[current.components] = {
        ...current,
        media,
        expand: undefined
      }
      return prev
    }, {})


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
      components
    } as PageData;

  } catch (error: any) {
    if (error?.status === 404) return null;
    throw error;
  }
}