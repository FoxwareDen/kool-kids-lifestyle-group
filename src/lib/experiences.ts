// ============================================================
// BLOCK TYPES
// ============================================================

import { environmentManager } from "@tanstack/react-query";
import { buildImageUrl, createPB_SSR, createResult, pb, Result, uploadAsset, type Asset } from "./pocketbase";

export type Language = "en" | "af";

export type Translatable<T = string> = {
  default: T;
  translations?: Partial<Record<Language, T>>;
};

export type HeaderBlock = {
  index: number;
  type: "header";
  level: 1 | 2 | 3;
  text: Translatable;
};

export type ParagraphBlock = {
  index: number;
  type: "paragraph";
  text: Translatable;
};

export type ImageBlock = {
  index: number;
  file: File;
  type: "image";
  alt: Translatable;
  caption?: Translatable;
};

export type VideoBlock = {
  index: number;
  file: File;
  type: "video";
  title?: Translatable;
};

export type FlatMedia = {
  id: string;
  index: number;
  asset_id: string;
  type: "image" | "video";
  alt?: string;
  caption?: string;
};

export type SelectableOption = {
  id: string;
  label: Translatable;
  description?: Translatable;
  priceModifier?: number;
};

export type SelectableBlock = {
  index: number;
  type: "selectable";
  prompt: Translatable;
  options: SelectableOption[];
  required: boolean;
};

export type PageBlock =
  | HeaderBlock
  | ParagraphBlock
  | Omit<ImageBlock, "id">
  | Omit<VideoBlock, "id">
  | SelectableBlock;

// ============================================================
// BOOKING PAGE
// ============================================================

// NOTE: `category` stays a plain string because that's what the PocketBase
// field actually is (Text, single column — see collection schema). It is NOT
// a single-category string though: it holds multiple categories joined by
// commas, e.g. "hiking,family,outdoors". Always go through
// parseCategories()/serializeCategories() below instead of touching the
// comma-joined string by hand.
export type BookingPage = {
  id: string;
  slug: string;
  title: Translatable;
  description?: Translatable;
  coverImage: File;
  category: string;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  blocks: PageBlock[];
  createdAt: Date;
  updatedAt: Date;
};

type FlatPageBlock = HeaderBlock | ParagraphBlock | SelectableBlock | Omit<FlatMedia, "id">;

export type FlatBookingPage = {
  id: string;
  slug: string;
  title: Translatable;
  description?: Translatable;
  coverImage: File;
  category: string;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  blocks: FlatPageBlock[];
  createdAt: Date;
  updatedAt: Date;
};

export type HydratedBookingPage = {
  id: string;
  slug: string;
  title: Translatable;
  description?: Translatable;
  coverImage: string;
  category: string;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  blocks: FlatPageBlock[];
  createdAt: Date;
  updatedAt: Date;  
}

// ============================================================
// CRUD FUNCTION SIGNATURES
// ============================================================
export type CreateBookingPageInput = Omit<BookingPage, "id" | "createdAt" | "updatedAt">;
export type UpdateBookingPageInput = Omit<BookingPage, "id" | "createdAt" | "updatedAt">;

export async function createBookingPage(input: CreateBookingPageInput): Promise<Result<HydratedBookingPage, string>> {
  try {
    const fCover = await uploadAsset(input.coverImage, {
      name: `${input.title.default}-cover`,
      type: "image"
    });

    if (!fCover.success) {
      return createResult(null, "Failed to upload cover image");
    }

    const blockToBe = input.blocks.map(async (block, index) => {
      if (["image", "video"].includes(block.type)) {
        // @ts-ignore
        if (!block.file) throw new Error(`Block at index ${index} has no file`);
        // @ts-ignore
        return [await uploadAsset(block.file), index, block];
      } else {
        return [block, index, null];
      }
    });

    const mal = await Promise.all(blockToBe);

    const flatPack: FlatPageBlock[] = mal.map((rk) => {
      const [bb, index, originalBlock] = rk;
      if (bb instanceof Result) {
        if (bb.success) {
          const f = bb.value as Asset;
          return {
            type: f.type,
            asset_id: f.id,
            index: index,
            alt: (originalBlock as ImageBlock).alt.default,
            caption: (originalBlock as ImageBlock).caption?.default,
          } as Omit<FlatMedia, "id">;
        } else {
          throw new Error("Failed to upload asset based block");
        }
      } else {
        return bb as FlatPageBlock;
      }
    });

    const result = await pb.collection("Experiences").create({
      title: JSON.stringify(input.title),
      description: input.description ? JSON.stringify(input.description) : undefined,
      category: input.category,
      enabledLanguages: input.enabledLanguages,
      coverImage: fCover.value!.id,
      blocks: flatPack,
      status: "Published",
    });

    return createResult<HydratedBookingPage, string>({
      id: result.id,
      slug: input.slug,
      title: input.title,
      description: input.description,
      coverImage: fCover.value!.id,
      category: input.category,
      defaultLanguage: input.defaultLanguage,
      enabledLanguages: input.enabledLanguages,
      blocks: flatPack,
      createdAt: new Date(result.created),
      updatedAt: new Date(result.updated),
    }, null);
  } catch (error) {
    return createResult<HydratedBookingPage, string>(null, `${error}`);
  }
}

export type FeatureCard = Omit<FlatBookingPage, "expand" | "blocks" | "slug" | "coverImage"> & {
  coverImage: string;
  lang: Language;
}

export async function fetchFeaturedExperienceCard(lang: Language="en", cookieHeader?: string): Promise<Result<FeatureCard[], string>>{
  let client;

  if (environmentManager.isServer()) {
    client = createPB_SSR(cookieHeader);
  } else {
    // Dynamic import on the client side
    const { pb } = await import("@/lib/pocketbase");
    client = pb;
  }

  try {
    const records: FlatBookingPage[] = await client.collection("Experiences").getFullList({
      filter:  `(category = "featured" || category ~ "featured," || category ~ ",featured") && status = "Published"`,
      expand: 'coverImage'
    })

    const t: FeatureCard[] = records.map((obj)=>{
      // @ts-ignore
      const image = obj.expand["coverImage"];      
      return {
        id: obj.id,
        category: obj.category,
        defaultLanguage: obj.defaultLanguage,
        enabledLanguages: obj.enabledLanguages,
        title: typeof obj.title === "string" ? JSON.parse(obj.title) : obj.title,
        description: obj.description
          ? (typeof obj.description === "string" ? JSON.parse(obj.description) : obj.description)
          : undefined,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        coverImage: buildImageUrl(image.collectionId, image.id, image.file),
        lang,
      }
    })

    return createResult(t, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "failed to retrieve data")
  }
}

export async function fetchExperiences(cookieHeader?: string): Promise<Result<HydratedBookingPage[], string>> {
  let client;

  if (environmentManager.isServer()) {
    client = createPB_SSR(cookieHeader);
  } else {
    // Dynamic import on the client side
    const { pb } = await import("@/lib/pocketbase");
    client = pb;
  }

  try {
    const records: FlatBookingPage[] = await client.collection("Experiences").getFullList({
      filter:  `status = "Published"`,
      expand: 'coverImage'
    });

    const t: HydratedBookingPage[] = records.map((obj)=>{
      // @ts-ignore
      const image = obj.expand["coverImage"];      
      return {
        ...obj,
        title: typeof obj.title === "string" ? JSON.parse(obj.title) : obj.title,
        description: obj.description
          ? (typeof obj.description === "string" ? JSON.parse(obj.description) : obj.description)
          : undefined,
        coverImage: buildImageUrl(image.collectionId, image.id, image.file)
      }
    });

    return createResult(t, null);    
  } catch (error) {
    console.error(error);
    return createResult(null, "failed to get experiences")        
  }
}

export async function fetchExperienceById(id:string, cookieHeader?:string) {
  let client;

  if (environmentManager.isServer()) {
    client = createPB_SSR(cookieHeader);
  } else {
    // Dynamic import on the client side
    const { pb } = await import("@/lib/pocketbase");
    client = pb;
  }

  try {
    const record: FlatBookingPage | null = await client.collection("Experiences").getOne(id, {
      expand: "coverImage"
    });
    if (!record) return createResult(null, "Failed to get experiences")

    // @ts-ignore
    const image = record.expand["coverImage"];

    return createResult<HydratedBookingPage, string>({
        ...record,
        title: typeof record.title === "string" ? JSON.parse(record.title) : record.title,
        description: record.description
          ? (typeof record.description === "string" ? JSON.parse(record.description) : record.description)
          : undefined,
        coverImage: buildImageUrl(image.collectionId, image.id, image.file)
      }, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to get experiences");
  }
}

// ============================================================
// UTILITIES
// ============================================================
export function resolveTranslatable<T>(field: Translatable<T>, lang: Language): T {
  return field.translations?.[lang] ?? field.default;
}

// `category` on BookingPage is a single comma-separated string (matches the
// PocketBase Text field). These two helpers are the only places that should
// ever split/join it, so the comma-joining logic isn't duplicated wherever a
// page is read or written.
export function parseCategories(category: string): string[] {
  return category
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function serializeCategories(categories: string[]): string {
  return categories
    .map((c) => c.trim())
    .filter(Boolean)
    .join(",");
}

export function createEmptyBlock(type: PageBlock["type"], index: number): PageBlock {
  const base = { index };
  switch (type) {
    case "header":
      return { ...base, type, level: 1, text: { default: "" } };
    case "paragraph":
      return { ...base, type, text: { default: "" } };
    case "image":
      return { ...base, type, file: null as unknown as File, alt: { default: "" } };
    case "video":
      return { ...base, type, file: null as unknown as File };
    case "selectable":
      return { ...base, type, prompt: { default: "" }, options: [], required: true };
  }
}