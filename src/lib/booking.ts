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
  createdAt: Date;
  updatedAt: Date;
};

export type HydratedBlogPage = {
  id: string;
  title: Translatable;
  content: FlatBlogPageBlock[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBlogPageInput = Omit<BlogPage, "id" | "createdAt" | "updatedAt">;
export type UpdateBlogPageInput = Omit<BlogPage, "id" | "createdAt" | "updatedAt">;

// ============================================================
// CRUD FUNCTIONS
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
    });

    return createResult<HydratedBlogPage, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
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
    });

    return createResult<HydratedBlogPage, string>({
      id: result.id,
      title: input.title,
      content: flatContent,
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
    return createResult<HydratedBlogPage, string>(hydrateRecord(result), null);
  } catch (error) {
    return createResult<HydratedBlogPage, string>(null, `${error}`);
  }
}

export async function listBlogPages(): Promise<Result<HydratedBlogPage[], string>> {
  try {
    const results = await pb.collection("Posts").getFullList({
      filter: 'type = "blog"',
    });
    return createResult<HydratedBlogPage[], string>(results.map(hydrateRecord), null);
  } catch (error) {
    return createResult<HydratedBlogPage[], string>(null, `${error}`);
  }
}

// ============================================================
// INTERNAL HELPERS
// ============================================================

async function flattenBlocks(blocks: BlogPageBlock[]): Promise<FlatBlogPageBlock[]> {
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

function hydrateRecord(record: Record<string, any>): HydratedBlogPage {
  return {
    id: record.id,
    title: typeof record.title === "string" ? JSON.parse(record.title) : record.title,
    content: record.content ?? [],
    createdAt: new Date(record.created),
    updatedAt: new Date(record.updated),
  };
}