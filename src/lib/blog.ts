import { createResult, pb, Result, uploadAsset, type Asset } from "./pocketbase";
import type {
  HeaderBlock,
  ParagraphBlock,
  ImageBlock,
  VideoBlock,
  Translatable,
  FlatMedia,
} from "./experiences";

// ============================================================
// STATUS
// ============================================================

export type PostStatus = "Published" | "Draft";

// ============================================================
// BLOCK TYPES (no SelectableBlock)
// ============================================================

export type BlogPageBlock =
  | HeaderBlock
  | ParagraphBlock
  | Omit<ImageBlock, "id">
  | Omit<VideoBlock, "id">;

type FlatBlogPageBlock = HeaderBlock | ParagraphBlock | Omit<FlatMedia, "id">;

// ============================================================
// BLOG PAGE
// ============================================================

export type BlogPage = {
  id: string;
  title: Translatable;
  content: BlogPageBlock[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type HydratedBlogPage = {
  id: string;
  title: Translatable;
  content: FlatBlogPageBlock[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBlogPageInput = Omit<BlogPage, "id" | "createdAt" | "updatedAt">;
export type UpdateBlogPageInput = Omit<BlogPage, "id" | "createdAt" | "updatedAt">;

// ============================================================
// EVENT
// ============================================================
export type EventBlock =
  | HeaderBlock
  | ParagraphBlock
  | Omit<ImageBlock, "id">
  | Omit<VideoBlock, "id">;

type FlatEventBlock = HeaderBlock | ParagraphBlock | Omit<FlatMedia, "id">;

export type Event = {
  id: string;
  title: Translatable;
  content: EventBlock[];
  status: PostStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type HydratedEvent = {
  id: string;
  title: Translatable;
  content: FlatEventBlock[];
  status: PostStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;
export type UpdateEventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

// ============================================================
// CRUD FUNCTIONS — BLOG PAGE
// ============================================================
export async function createBlogPage(
  input: CreateBlogPageInput
): Promise<Result<HydratedBlogPage, string>> {
  try {
    const flatContent = await flattenBlocks(input.content);

    const result = await pb.collection("Posts").create({
      title: JSON.stringify(input.title),
      content: flatContent,
      type: "blog",
      status: input.status,
    });

    return createResult<HydratedBlogPage, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
      status: input.status,
      createdAt: new Date(result.created),
      updatedAt: new Date(result.updated),
    }, null);
  } catch (error) {
    return createResult<HydratedBlogPage, string>(null, `${error}`);
  }
}

export async function updateBlogPage(
  id: string,
  input: UpdateBlogPageInput
): Promise<Result<HydratedBlogPage, string>> {
  try {
    const flatContent = await flattenBlocks(input.content);

    const result = await pb.collection("Posts").update(id, {
      title: JSON.stringify(input.title),
      content: flatContent,
      type: "blog",
      status: input.status,
    });

    return createResult<HydratedBlogPage, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
      status: input.status,
      createdAt: new Date(result.created),
      updatedAt: new Date(result.updated),
    }, null);
  } catch (error) {
    return createResult<HydratedBlogPage, string>(null, `${error}`);
  }
}

export async function deleteBlogPage(id: string): Promise<Result<true, string>> {
  try {
    await pb.collection("Posts").delete(id);
    return createResult<true, string>(true, null);
  } catch (error) {
    return createResult<true, string>(null, `${error}`);
  }
}

export async function getBlogPage(id: string): Promise<Result<HydratedBlogPage, string>> {
  try {
    const result = await pb.collection("Posts").getOne(id, {
      filter: 'type = "blog"',
    });
    return createResult<HydratedBlogPage, string>(hydrateBlogRecord(result), null);
  } catch (error) {
    return createResult<HydratedBlogPage, string>(null, `${error}`);
  }
}

export async function listBlogPages(): Promise<Result<HydratedBlogPage[], string>> {
  try {
    const results = await pb.collection("Posts").getFullList({
      filter: 'type = "blog"',
    });
    return createResult<HydratedBlogPage[], string>(results.map(hydrateBlogRecord), null);
  } catch (error) {
    return createResult<HydratedBlogPage[], string>(null, `${error}`);
  }
}

// ============================================================
// CRUD FUNCTIONS — EVENT
// ============================================================
export async function createEvent(
  input: CreateEventInput
): Promise<Result<HydratedEvent, string>> {
  try {
    const flatContent = await flattenBlocks(input.content);

    const result = await pb.collection("Posts").create({
      title: JSON.stringify(input.title),
      content: flatContent,
      start_date: input.startDate.toISOString(),
      end_date: input.endDate.toISOString(),
      type: "event",
      status: input.status,
    });

    return createResult<HydratedEvent, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
      status: input.status,
      startDate: new Date(result.start_date),
      endDate: new Date(result.end_date),
      createdAt: new Date(result.created),
      updatedAt: new Date(result.updated),
    }, null);
  } catch (error) {
    return createResult<HydratedEvent, string>(null, `${error}`);
  }
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<Result<HydratedEvent, string>> {
  try {
    const flatContent = await flattenBlocks(input.content);

    const result = await pb.collection("Posts").update(id, {
      title: JSON.stringify(input.title),
      content: flatContent,
      start_date: input.startDate.toISOString(),
      end_date: input.endDate.toISOString(),
      type: "event",
      status: input.status,
    });

    return createResult<HydratedEvent, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
      status: input.status,
      startDate: new Date(result.start_date),
      endDate: new Date(result.end_date),
      createdAt: new Date(result.created),
      updatedAt: new Date(result.updated),
    }, null);
  } catch (error) {
    return createResult<HydratedEvent, string>(null, `${error}`);
  }
}

export async function deleteEvent(id: string): Promise<Result<true, string>> {
  try {
    await pb.collection("Posts").delete(id);
    return createResult<true, string>(true, null);
  } catch (error) {
    return createResult<true, string>(null, `${error}`);
  }
}

export async function getEvent(id: string): Promise<Result<HydratedEvent, string>> {
  try {
    const result = await pb.collection("Posts").getOne(id, {
      filter: 'type = "event"',
    });
    return createResult<HydratedEvent, string>(hydrateEventRecord(result), null);
  } catch (error) {
    return createResult<HydratedEvent, string>(null, `${error}`);
  }
}

export async function listEvents(): Promise<Result<HydratedEvent[], string>> {
  try {
    const results = await pb.collection("Posts").getFullList({
      filter: 'type = "event"',
    });
    return createResult<HydratedEvent[], string>(results.map(hydrateEventRecord), null);
  } catch (error) {
    return createResult<HydratedEvent[], string>(null, `${error}`);
  }
}

// ============================================================
// INTERNAL HELPERS
// ============================================================
async function flattenBlocks(blocks: BlogPageBlock[] | EventBlock[]): Promise<FlatBlogPageBlock[]> {
  const pending = blocks.map(async (block, index) => {
    if (["image", "video"].includes(block.type)) {
      // @ts-ignore
      if (!block.file) throw new Error(`Block at index ${index} has no file`);
      // @ts-ignore
      return [await uploadAsset(block.file), index, block];
    } else {
      return [block, index, null];
    }
  });

  const settled = await Promise.all(pending);

  return settled.map(([bb, index, originalBlock]) => {
    if (bb instanceof Result) {
      if (bb.success) {
        const f = bb.value as Asset;
        return {
          type: f.type,
          asset_id: f.id,
          index,
          alt: (originalBlock as ImageBlock).alt.default,
          caption: (originalBlock as ImageBlock).caption?.default,
        } as Omit<FlatMedia, "id">;
      } else {
        throw new Error("Failed to upload asset-based block");
      }
    } else {
      return bb as FlatBlogPageBlock;
    }
  });
}

function hydrateBlogRecord(record: Record<string, any>): HydratedBlogPage {
  return {
    id: record.id,
    title: typeof record.title === "string" ? JSON.parse(record.title) : record.title,
    content: record.content ?? [],
    status: (record.status as PostStatus) ?? "Draft",
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated),
  };
}

function hydrateEventRecord(record: Record<string, any>): HydratedEvent {
  return {
    id: record.id,
    title: typeof record.title === "string" ? JSON.parse(record.title) : record.title,
    content: record.content ?? [],
    status: (record.status as PostStatus) ?? "Draft",
    startDate: new Date(record.start_date),
    endDate: new Date(record.end_date),
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated),
  };
}