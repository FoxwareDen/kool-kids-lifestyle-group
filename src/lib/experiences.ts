// ============================================================
// BLOCK TYPES
// ============================================================

export type Language = string; // e.g. "en", "fr", "af"

export type Translatable<T = string> = {
  default: T;
  translations?: Record<Language, T>;
};

export type HeaderBlock = {
  id: string;
  type: "header";
  level: 1 | 2 | 3;
  text: Translatable;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  text: Translatable;
};

export type ImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt: Translatable;
  caption?: Translatable;
};

export type VideoBlock = {
  id: string;
  type: "video";
  url: string;
  title?: Translatable;
};

export type SelectableOption = {
  id: string;
  label: Translatable;
  description?: Translatable;
  priceModifier?: number;
};

export type SelectableBlock = {
  id: string;
  type: "selectable";
  prompt: Translatable;
  options: SelectableOption[];
  required: boolean;
};

export type PageBlock =
  | HeaderBlock
  | ParagraphBlock
  | ImageBlock
  | VideoBlock
  | SelectableBlock;

// ============================================================
// BOOKING PAGE
// ============================================================

export type BookingPage = {
  id: string;
  slug: string;
  title: Translatable;
  description?: Translatable;
  defaultLanguage: Language;
  enabledLanguages: Language[];
  blocks: PageBlock[];
  createdAt: Date;
  updatedAt: Date;
};

// ============================================================
// CRUD FUNCTION SIGNATURES
// ============================================================

export type CreateBookingPageInput = Omit<BookingPage, "id" | "createdAt" | "updatedAt">;
export type UpdateBookingPageInput = Partial<Omit<BookingPage, "id" | "createdAt" | "updatedAt">>;

export declare function createBookingPage(input: CreateBookingPageInput): Promise<BookingPage>;
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

/** Resolve a translatable field for a given language, falling back to default */
export function resolveTranslatable<T>(field: Translatable<T>, lang: Language): T {
  return field.translations?.[lang] ?? field.default;
}

/** Generate a blank block of a given type with a fresh ID */
export function createEmptyBlock(type: PageBlock["type"], id: string): PageBlock {
  const base = { id };
  switch (type) {
    case "header":
      return { ...base, type, level: 1, text: { default: "" } };
    case "paragraph":
      return { ...base, type, text: { default: "" } };
    case "image":
      return { ...base, type, url: "", alt: { default: "" } };
    case "video":
      return { ...base, type, url: "" };
    case "selectable":
      return { ...base, type, prompt: { default: "" }, options: [], required: true };
  }
}