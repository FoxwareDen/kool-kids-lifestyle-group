import { pb } from "./pocketbase";

export interface Asset {
    type: "image" | "video" | "svg";
    file: any;
}

export interface Header {
    type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    content: string;
}

export interface TextBlock {
    type: "text" | "richtext";
    content: string;
}

export type ContentBlock = Header | Asset | TextBlock;

export interface Blog {
    title: string;
    content: ContentBlock[];
    created: string;
}

export interface CMSBlogType {
    title: string;
    content: ContentBlock[];
    created: string;
}

export async function createBlogPost(
    blog: Blog
): Promise<{ data: null; error: string | null }> {
    try {
        await pb.collection("blog").create({
            title: blog.title,
            content: blog.content,
        });

        return {
            data: null,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: String(error),
        };
    }
}

export async function getBlogPost(
    id: string
): Promise<{ data: Blog | null; error: string | null }> {
    try {
        const record = await pb.collection("blog").getOne<CMSBlogType>(id);

        return {
            data: {
                title: record.title,
                content: record.content,
                created: record.created,
            },
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: String(error),
        };
    }
}

export async function getAllBlogPosts(
    page = 1,
    perPage = 10,
    sort: "newest" | "oldest" = "newest"
): Promise<{
    data: Blog[] | null;
    totalPages: number;
    totalItems: number;
    page: number;
    error: string | null;
}> {
    try {
        const result = await pb.collection("blog").getList<CMSBlogType>(
            page,
            perPage,
            {
                sort: sort === "newest" ? "-created" : "created",
            }
        );

        return {
            data: result.items.map((item) => ({
                title: item.title,
                content: item.content,
                created: item.created,
            })),
            totalPages: result.totalPages,
            totalItems: result.totalItems,
            page: result.page,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            totalPages: 0,
            totalItems: 0,
            page,
            error: String(error),
        };
    }
}