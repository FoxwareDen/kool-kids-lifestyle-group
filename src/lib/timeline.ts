import { pb } from "./pocketbase";
import type { ContentBlock } from "./cms";

/**
 * Discriminator describing whether a {@link TimelineEntry} originated from a
 * blog post or an event in the CMS.
 * @typedef {"blog" | "event"} TimelineEntryKind
 */
export type TimelineEntryKind = "blog" | "event";

/**
 * A single, normalised item rendered in the combined blogs + events timeline.
 * Both blog posts and events are flattened into this shape so the UI can sort
 * and render them in one chronological feed.
 *
 * @typedef {Object} TimelineEntry
 * @property {string} id - CMS record id, used to link to the detail route.
 * @property {TimelineEntryKind} kind - Whether the entry is a blog or an event.
 * @property {string} title - Display title of the entry.
 * @property {string} excerpt - Short plain-text preview derived from content.
 * @property {string} date - ISO date string used for sorting and display.
 *   Events use their start date, blogs use their creation date.
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
 * Raw PocketBase record shape for the shared "blog" collection that stores both
 * blog posts and events, discriminated by the `type` field.
 */
interface RawPostRecord {
  id: string;
  title?: string;
  content?: ContentBlock[];
  type?: TimelineEntryKind;
  created?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Strips HTML tags and collapses whitespace from a string so rich-text content
 * can be shown as a clean plain-text preview.
 *
 * @param {string} value - The raw (possibly HTML) string.
 * @returns {string} A trimmed, tag-free string.
 */
function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Derives a short preview from a CMS content block array. Prefers the first
 * paragraph/rich-text block and falls back to the first heading.
 *
 * @param {ContentBlock[] | undefined} content - The entry's content blocks.
 * @param {number} [max=180] - Maximum length of the excerpt.
 * @returns {string} A plain-text excerpt, truncated with an ellipsis if needed.
 */
function extractExcerpt(content: ContentBlock[] | undefined, max = 180): string {
  if (!Array.isArray(content)) return "";

  const textual = content.find(
    (block) => block.type === "text" || block.type === "richtext",
  ) as { content?: string } | undefined;

  const heading = content.find((block) =>
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(block.type),
  ) as { content?: string } | undefined;

  const source = textual?.content ?? heading?.content ?? "";
  const plain = toPlainText(source);

  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

/**
 * Normalises a raw CMS record into a {@link TimelineEntry}.
 *
 * @param {RawPostRecord} record - The PocketBase record.
 * @returns {TimelineEntry} The normalised timeline entry.
 */
function toTimelineEntry(record: RawPostRecord): TimelineEntry {
  const kind: TimelineEntryKind = record.type === "event" ? "event" : "blog";
  const date =
    kind === "event" && record.start_date ? record.start_date : (record.created ?? "");

  return {
    id: record.id,
    kind,
    title: record.title?.trim() || "Untitled",
    excerpt: extractExcerpt(record.content),
    date,
    startDate: record.start_date || undefined,
    endDate: record.end_date || undefined,
  };
}

/**
 * Fetches all blog posts and events from the CMS and merges them into a single
 * timeline ordered newest-first. Network/CMS failures resolve to an empty array
 * so the UI can show a graceful empty state rather than an error.
 *
 * @returns {Promise<TimelineEntry[]>} The combined, chronologically sorted feed.
 */
export async function fetchTimeline(): Promise<TimelineEntry[]> {
  try {
    const records = await pb.collection("blog").getFullList<RawPostRecord>({
      sort: "-created",
    });

    return records
      .map(toTimelineEntry)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}
