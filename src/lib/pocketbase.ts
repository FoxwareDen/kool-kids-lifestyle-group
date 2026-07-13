import PocketBase from 'pocketbase';
import { environmentManager } from '@tanstack/react-query';

// ============= Client (singleton) =============
export const pb = new PocketBase(import.meta.env.VITE_CMS_URI);

export const getPBSession = (cookieHeader?: string) => {
  if (environmentManager.isServer()) {
    return createPB_SSR(cookieHeader);
  } else {
    // Dynamic import on the client side
    return pb
  }
}

/**
 * Client-side helper to check if the current user session exists and is valid.
 */
export function isAuthenticated(cookieHeader?:string): boolean {
  const client = getPBSession(cookieHeader)
  return client.authStore.isValid;
}

/**
 * Client-side helper to get the currently authenticated user record.
 * Replaces the deprecated .model property with the modern .record property.
 */
export function getCurrentUser() {
  const client = getPBSession()
  return client.authStore.record;
}

/**
 * Log out and clear tokens from both PocketBase memory and browser cookies.
 */
export function handleLogout() {
  const client = getPBSession()
  client.authStore.clear();
  // Clear the cookie by setting an expired date
  document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
}

export function buildImageUrl(assetCollId: string, assetId:string, filename: string) {
  return `${import.meta.env.VITE_CMS_URI}/api/files/${assetCollId}/${assetId}/${filename}`  
}

/**
 * Upload a file to the assets collection.
 * @param file - File object from an <input type="file"> element
 * @param meta - Optional name, alt, and type metadata
 */
export async function uploadAsset(
  file: File,
  meta?: { name: string; alt?: string; type: "image" | "video" | "svg" }
): Promise<Result<Asset, string>> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", meta?.type ?? "image");
    if (meta?.name) formData.append("name", meta.name);
    if (meta?.alt)  formData.append("alt", meta.alt);

    const record = await pb.collection("assets").create(formData);

    return createResult<Asset, string>(
      {
        id:             record.id,
        collectionId:   record.collectionId,
        collectionName: record.collectionName,
        file:           record.file,
        type:           record.type,
        name:           record.name,
        alt:            record.alt,
      },
      null
    );
  } catch (error: any) {
    // 🚨 THIS extracts the nested JSON that says exactly what field was rejected
    console.error("EXACT VALIDATION ERROR:", JSON.stringify(error.response, null, 2));
    
    return createResult<Asset, string>(null, error.message ?? "Upload failed.");
  }
}

/** Infer asset type from the browser File MIME type */
function inferType(file: File): "image" | "video" | "svg" {
  if (file.type === "image/svg+xml") return "svg";
  if (file.type.startsWith("video/")) return "video";
  return "image";
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
export type MetaData = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}
export interface Asset {
    alt: string,
    collectionId: string,
    collectionName: string,
    file: string,
    id: string
    name:string,
    type: string,
}

export interface Component<T = unknown> {
  id: string;
  collectionId: string;
  collectionName: string;
  components: string;
  content: Record<string, Content<T>>;
  media: Record<string,Asset>;
  pages: string;
  created?: string;
  updated?: string;
  expand?: {
    media: Asset[]
  }
}

export interface Content<T=unknown> {
  collectionId: string;
  collectionName: string;
  component: string,
  content: T
  created: string,
  updated: string,
  lang: "en"|"af",
  media: Record<string, Asset>
  pages?: string
  id?: string
}

export interface Page<T = unknown> {
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
    components_via_pages: Component<T>[];
  };
}

export interface PageData<T = unknown>  {
  id: string;
  collectionId: string;
  collectionName: string;
  title: string;
  slug: string;
  language: 'en' | 'af';
  project: string;
  created: string;
  updated: string;
  components: Record<string, Component<T>>
}


export class Result<T,E> {
  public value: T | null;
  public error: E | null;
  public success: boolean = false;
  constructor(value: T|null, error: E|null) {
    this.value=value;
    this.error = error;
    this.success = this.error === null;
  }
}

// Simplify the return type to just Result<T, E>
export function createResult<T, E>(value: T | null, error: E | null): Result<T, E> {
  return new Result<T, E>(value, error); // Use 'as' here so TS knows the prototype injection is safe
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