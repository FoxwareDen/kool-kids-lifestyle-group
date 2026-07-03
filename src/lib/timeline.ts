import { listBlogPages, listEvents } from "./blog";
import type {
  HydratedBlogPage,
  HydratedEvent,
} from "./blog";
import { resolveTranslatable, type Language } from "./experiences";

/**
 * Discriminator describing whether a {@link TimelineEntry} originated from a
 * blog post or an event in the CMS.
 * @typedef {"blog" | "event"} TimelineEntryKind
 */
export type TimelineEntryKind = "blog" | "event";

/**
 * A single, normalised item rendered on a timeline. Blog posts and events are
 * flattened into this shared shape so the UI can sort and render either content
 * type with the same components.
 *
 * @typedef {Object} TimelineEntry
 * @property {string} id - CMS record id, used to link to the detail route.
 * @property {TimelineEntryKind} kind - Whether the entry is a blog or an event.
 * @property {string} title - Display title of the entry.
 * @property {string} excerpt - Short plain-text preview derived from content.
 * @property {string} date - ISO date string used for sorting and display.
 *   Events use their start date; blogs use their creation date.
 * @property {string} [startDate] - Event start date (ISO), events only.
 * @property {string} [endDate] - Event end date (ISO), events only.
 */
export interface TimelineEntry {
  id: string;
  kind: TimelineEntryKind;
  title: string;
  excerpt: string;
  date: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Flattened content block as stored on hydrated blog/event records. Only the
 * text-bearing blocks ("header"/"paragraph") are relevant for building an
 * excerpt; media blocks are ignored.
 * @typedef {Object} TextualBlock
 */
type TextualBlock = {
  type: string;
  text?: { default?: string };
};

/**
 * Maps a route slug (or pathname) to the {@link TimelineEntryKind} whose data
 * should be loaded. Anything containing "event" resolves to events; everything
 * else falls back to blogs.
 *
 * @param {string} slug - The route slug or pathname, e.g. "/events" or "/blogs".
 * @returns {TimelineEntryKind} The content kind to fetch for that route.
 */
export function kindFromSlug(slug: string): TimelineEntryKind {
  return slug.toLowerCase().includes("event") ? "event" : "blog";
}

/**
 * Derives a short plain-text preview from a record's flattened content blocks.
 * Prefers the first paragraph and falls back to the first header.
 *
 * @param {TextualBlock[] | undefined} content - The record's content blocks.
 * @param {number} [max=180] - Maximum length of the excerpt.
 * @returns {string} A trimmed excerpt, ellipsised if it exceeds {@link max}.
 */
function extractExcerpt(content: TextualBlock[] | undefined, max = 180): string {
  if (!Array.isArray(content)) return "";

  const paragraph = content.find((block) => block.type === "paragraph");
  const header = content.find((block) => block.type === "header");
  const source = (paragraph ?? header)?.text?.default ?? "";

  const plain = source.replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

/**
 * Normalises a hydrated blog record into a {@link TimelineEntry}.
 *
 * @param {HydratedBlogPage} record - The hydrated blog page.
 * @param {Language} lang - Language used to resolve the translatable title.
 * @returns {TimelineEntry} The normalised entry.
 */
function blogToEntry(record: HydratedBlogPage, lang: Language): TimelineEntry {
  return {
    id: record.id,
    kind: "blog",
    title: resolveTranslatable(record.title, lang)?.trim() || "Untitled",
    excerpt: extractExcerpt(record.content as TextualBlock[]),
    date: record.createdAt.toISOString(),
  };
}

/**
 * Normalises a hydrated event record into a {@link TimelineEntry}.
 *
 * @param {HydratedEvent} record - The hydrated event.
 * @param {Language} lang - Language used to resolve the translatable title.
 * @returns {TimelineEntry} The normalised entry.
 */
function eventToEntry(record: HydratedEvent, lang: Language): TimelineEntry {
  return {
    id: record.id,
    kind: "event",
    title: resolveTranslatable(record.title, lang)?.trim() || "Untitled",
    excerpt: extractExcerpt(record.content as TextualBlock[]),
    date: record.startDate.toISOString(),
    startDate: record.startDate.toISOString(),
    endDate: record.endDate.toISOString(),
  };
}

/**
 * Sorts timeline entries newest-first by their primary {@link TimelineEntry.date}.
 *
 * @param {TimelineEntry[]} entries - Entries to sort (mutated in place).
 * @returns {TimelineEntry[]} The same array, sorted newest-first.
 */
function sortNewestFirst(entries: TimelineEntry[]): TimelineEntry[] {
  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Fetches the timeline entries for a single content kind and returns them
 * ordered newest-first. The kind is chosen from the route slug, so the blogs
 * route loads blog posts and the events route loads events. Any CMS/network
 * failure resolves to an empty array so the UI can show a graceful empty state
 * instead of an error.
 *
 * @param {TimelineEntryKind} kind - Which content type to load.
 * @param {Language} [lang="en"] - Language used to resolve translatable titles.
 * @returns {Promise<TimelineEntry[]>} The chronologically sorted entries.
 */
export async function fetchTimelineEntries(
  kind: TimelineEntryKind,
  lang: Language = "en",
): Promise<TimelineEntry[]> {
  if (kind === "event") {
    const result = await listEvents();
    if (!result.success || !result.value) return [];
    return sortNewestFirst(result.value.map((record) => eventToEntry(record, lang)));
  }

  const result = await listBlogPages();
  if (!result.success || !result.value) return [];
  return sortNewestFirst(result.value.map((record) => blogToEntry(record, lang)));
}
