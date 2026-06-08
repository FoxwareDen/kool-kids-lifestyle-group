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

// --- Blog Types ---

export interface Blog {
    title: string;
    content: ContentBlock[];
    created: string;
}

export interface CMSBlogType {
    title: string;
    type: "blog";
    content: ContentBlock[];
    created: string;
}

// --- Event Types ---

export interface Event {
    title: string;
    content: ContentBlock[];
    created: string;
    start_date: string;
    end_date: string;
}

export interface CMSEventType {
    title: string;
    type: "event";
    content: ContentBlock[];
    created: string;
    start_date: string;
    end_date: string;
}

// --- Blog Functions ---
export async function createBlogPost(
    blog: Blog
): Promise<{ data: null; error: string | null }> {
    try {
        await pb.collection("blog").create({
            title: blog.title,
            content: blog.content,
            type: "blog",
        });

        return { data: null, error: null };
    } catch (error) {
        return { data: null, error: String(error) };
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
        return { data: null, error: String(error) };
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
                filter: 'type = "blog"',
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
        return { data: null, totalPages: 0, totalItems: 0, page, error: String(error) };
    }
}

// --- Event Functions ---

export async function createEvent(
    event: Event
): Promise<{ data: null; error: string | null }> {
    try {
        await pb.collection("blog").create({
            title: event.title,
            content: event.content,
            type: "event",
            start_date: event.start_date,
            end_date: event.end_date,
        });

        return { data: null, error: null };
    } catch (error) {
        return { data: null, error: String(error) };
    }
}

export async function getEvent(
    id: string
): Promise<{ data: Event | null; error: string | null }> {
    try {
        const record = await pb.collection("blog").getOne<CMSEventType>(id);

        return {
            data: {
                title: record.title,
                content: record.content,
                created: record.created,
                start_date: record.start_date,
                end_date: record.end_date,
            },
            error: null,
        };
    } catch (error) {
        return { data: null, error: String(error) };
    }
}

export async function getAllEvents(
    page = 1,
    perPage = 10,
    sort: "newest" | "oldest" = "newest"
): Promise<{
    data: Event[] | null;
    totalPages: number;
    totalItems: number;
    page: number;
    error: string | null;
}> {
    try {
        const result = await pb.collection("blog").getList<CMSEventType>(
            page,
            perPage,
            {
                sort: sort === "newest" ? "-created" : "created",
                filter: 'type = "event"',
            }
        );

        return {
            data: result.items.map((item) => ({
                title: item.title,
                content: item.content,
                created: item.created,
                start_date: item.start_date,
                end_date: item.end_date,
            })),
            totalPages: result.totalPages,
            totalItems: result.totalItems,
            page: result.page,
            error: null,
        };
    } catch (error) {
        return { data: null, totalPages: 0, totalItems: 0, page, error: String(error) };
    }
}
