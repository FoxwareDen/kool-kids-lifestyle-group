import PocketBase from 'pocketbase';

// ============= Client (singleton) =============
export const pb = new PocketBase(import.meta.env.VITE_CMS_URI);

/**
 * Client-side helper to check if the current user session exists and is valid.
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Client-side helper to get the currently authenticated user record.
 * Replaces the deprecated .model property with the modern .record property.
 */
export function getCurrentUser() {
  return pb.authStore.record;
}

/**
 * Log out and clear tokens from both PocketBase memory and browser cookies.
 */
export function handleLogout() {
  pb.authStore.clear();
  // Clear the cookie by setting an expired date
  document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
}

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

// ============= Google OAuth Integration =============
export async function handleGoogleLogin() {
  try {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    
    // EXPORT TO COOKIE: Sync auth data to a cookie so the SSR side can read it on subsequent page requests.
    // Secure flag should be appended in production environments (https)
    document.cookie = `pb_auth=${encodeURIComponent(pb.authStore.exportToCookie())}; path=/; SameSite=Strict`;

    return {
      success: true,
      token: authData.token,
      record: authData.record,
      error: null
    };
  } catch (error: any) {
    return {
      success: false,
      token: null,
      record: null,
      error: error.message || "Google authentication failed."
    };
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

export interface Result<T, E> {
  value: T | null,
  error: E | null
}

const resultPrototype = {
  isSuccess() {
    // @ts-ignore
    return this.error === null;
  }
}

// Simplify the return type to just Result<T, E>
export function createResult<T, E>(value: T | null, error: E | null): Result<T, E> {
  return Object.assign(Object.create(resultPrototype), {
    value,
    error,
  }) as Result<T, E>; // Use 'as' here so TS knows the prototype injection is safe
}

// ============= SSR Auth Sharing =============

/**
 * Creates an isolated server-side PocketBase instance hydrated with the user's cookie.
 * Pass the raw request cookie string fetched from your framework's server context.
 */
export function createPB_SSR(cookieString?: string): PocketBase {
  const client = new PocketBase(process.env.CMS_URI);
  
  if (cookieString) {
    // Parse our specific pb_auth cookie key out of the headers
    const match = cookieString.match(/pb_auth=([^;]+)/);
    if (match && match[1]) {
      const rawCookie = decodeURIComponent(match[1]);
      // Instantly populates client.authStore.model and client.authStore.isValid on the server side
      client.authStore.loadFromCookie(rawCookie);
    }
  }
  
  return client;
}

/**
 * Server-side route guard helper.
 * Returns true if the session cookie contains a valid, unexpired authentication state.
 */
export function isAuthenticatedSSR(cookieString?: string): boolean {
  const client = createPB_SSR(cookieString);
  return client.authStore.isValid;
}

/**
 * Server-side helper to fetch the authenticated user record during SSR.
 */
export function getCurrentUserSSR(cookieString?: string) {
  const client = createPB_SSR(cookieString);
  return client.authStore.record;
}

export async function fetchPageDataSSR(
  slug: string,
  language: "en" | "af" = "en",
  cookieHeader?: string // <-- Accept cookies from incoming server request headers
): Promise<PageData | null> {
  // Hydrate an authenticated instance on the server side
  const client = createPB_SSR(cookieHeader);

  try {
    // If you ever need to restrict pages based on role/auth on the SSR side, you can now run:
    // if (!client.authStore.isValid) { ... handle server side redirect/401 ... }

    const record = await client.collection('pages').getFirstListItem(
      `slug = "${slug}" && language = "${language}"`,
      { expand: 'components_via_pages.media, components_via_pages' }
    );

    const components: Record<string, Component> = record.expand?.components_via_pages.reduce((prev: Record<string, Component>, current:Component)=> {
      const media: Record<string, Asset> = current?.expand?.media && current.expand.media.length > 0 ? 
        current.expand.media.reduce((prev, c) => {
          prev[c.name] = c;
          return prev;
        }, {} as Record<string, Asset>)
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