// ============================================================
// BLOCK TYPES
// ============================================================

import { createResult, pb, Result, uploadAsset, type Asset } from "./pocketbase";

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

// ============================================================
// CRUD FUNCTION SIGNATURES
// ============================================================
export type CreateBookingPageInput = Omit<BookingPage, "id" | "createdAt" | "updatedAt">;
export type UpdateBookingPageInput = Omit<BookingPage, "id" | "createdAt" | "updatedAt">;

export async function createBookingPage(input: CreateBookingPageInput): Promise<Result<FlatBookingPage, string>> {
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
      status: "Draft",
    });

    return createResult<FlatBookingPage, string>({
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
    return createResult<FlatBookingPage, string>(null, `${error}`);
  }
}

export declare function getBookingPageById(id: string): Promise<BookingPage | null>;
export declare function getBookingPageBySlug(slug: string): Promise<BookingPage | null>;
export declare function listBookingPages(): Promise<BookingPage[]>;
export declare function updateBookingPage(id: string, input: UpdateBookingPageInput): Promise<BookingPage>;
export declare function deleteBookingPage(id: string): Promise<void>;
export declare function publishBookingPage(id: string): Promise<BookingPage>;

// ============================================================
// BLOCK OPERATIONS
// ============================================================
export declare function addBlock(pageId: string, block: PageBlock): Promise<BookingPage>;
export declare function updateBlock(pageId: string, blockId: string, block: Partial<PageBlock>): Promise<BookingPage>;
export declare function removeBlock(pageId: string, blockId: string): Promise<BookingPage>;
export declare function reorderBlocks(pageId: string, orderedBlockIds: string[]): Promise<BookingPage>;

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