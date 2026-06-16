// ============================================================
// BLOCK TYPES
// ============================================================

import { createResult, pb, Result, uploadAsset, type Asset } from "./pocketbase";

export type Language = string;

export type Translatable<T = string> = {
  default: T;
  translations?: Record<Language, T>;
};

export type HeaderBlock = {
  index: number;
  id: string;
  type: "header";
  level: 1 | 2 | 3;
  text: Translatable;
};

export type ParagraphBlock = {
  index: number;
  id: string;
  type: "paragraph";
  text: Translatable;
};

export type ImageBlock = {
  index: number;
  id: string;
  file:File;
  type: "image";
  alt: Translatable;
  caption?: Translatable;
};

export type VideoBlock = {
  index: number;
  id: string;
  file:File;
  type: "video";
  title?: Translatable;
};
export type FlatMedia = {
  index: number;
  id: string;
  asset_id: string,
  type: "image" | "video"
  alt?: string,
  caption?:string
}

export type SelectableOption = {
  index: number;
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

export type BookingPage = {
  id: string;
  slug: string;
  title: Translatable;
  description?: Translatable;
  coverImage: File;         
  category: string[];
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
  coverImage: string;
  category: string[];
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

export async function createBookingPage(input: CreateBookingPageInput): Promise<Result<FlatBookingPage, string>> {
  try {
    const fCover = await uploadAsset(input.coverImage, {
      name: `${input.title}-cover`,
      type: "image"
    });

    if (!fCover.success) {
      return createResult(null, "Failed to upload cover image")
    }

    const blockToBe = input.blocks.map(async (block,index)=>{
      if (["image", "video"].includes(block.type)) {
        // @ts-ignore
        return [uploadAsset(block.file), index]
      }else {
        return [block, index];
      }
    })

    const mal = await Promise.all(blockToBe);

    const flatPack: FlatPageBlock[] = mal.map((rk)=>{
      const [bb, index] = rk;
      if (bb instanceof Result) {
        // bb is Result<Asset, string>w
        // @ts-ignore
        if (bb.success) {
          // @ts-ignore
          const f = bb.value as Asset // Asset
          return {
            type: f.type,
            asset_id: f.id,
            index: index,
            alt: f.alt,
            caption: ""
            // asset_id: bb
          } as Omit<FlatMedia, "id">
        } else {
          // @ts-ignore
          throw new Error("Failed to upload asset based block");     
        }
      } else {
        // bb is PageBlock
        return bb as FlatPageBlock
      }
    })

    const result = await pb.collection("Experiences").create({
      title: JSON.stringify(input.title),
      description: input.description ? JSON.stringify(input.description) : undefined,
      category: input.category,
      enabledLanguages: input.enabledLanguages,
      coverImage: fCover.value!.id,   // relation → just the asset id
      blocks: flatPack,                // JSON field → PB accepts plain objects
      status: "Draft",
    });
    // Tell the factory function exactly what types this Result is meant to hold
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

export function createEmptyBlock(type: PageBlock["type"], id: string): PageBlock {
  const base = { id, index: 0 };
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