import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PageBlock } from '#/lib/experiences'
import { createEmptyBlock } from '#/lib/experiences'

/** Images may be at most 5MB. */
export const MAX_IMAGE_SIZE = 5_242_880
/** Videos may be at most 50MB. */
export const MAX_VIDEO_SIZE = 52_428_800

/**
 * Turns a `File` into an object URL and revokes the previous one whenever the
 * file changes or the component unmounts. Centralizes the blob-URL lifecycle
 * so editors don't leak a new URL on every keystroke-triggered re-render.
 *
 * @param file - The file to preview, or a nullish value to clear the preview.
 * @returns The current object URL, or `null` when there is no file.
 */
export function useObjectUrl(file: File | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return url
}

/** A block paired with a stable, never-reused client id used for React keys. */
export type BlockEntry = { id: string; block: PageBlock }

/**
 * Owns block CRUD plus stable identity for React keys. A block's `index` is a
 * data-model concept (serialized order) and is unsafe as a render key, since
 * deleting a block can make a later block's index collide with a survivor's.
 * We therefore track a separate client-side id per block for `key` purposes.
 *
 * @returns Handlers and derived views over the current block list.
 */
export function useBlocks() {
  const [entries, setEntries] = useState<BlockEntry[]>([])

  const addBlock = useCallback((type: PageBlock['type']) => {
    setEntries((prev) => [
      ...prev,
      { id: crypto.randomUUID(), block: createEmptyBlock(type, prev.length) },
    ])
  }, [])

  const updateBlock = useCallback((id: string, updated: PageBlock) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, block: updated } : e)))
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const blocks = useMemo(() => entries.map((e) => e.block), [entries])

  /** Blocks re-indexed by current position, ready to submit. */
  const serialize = useCallback(
    (): PageBlock[] => entries.map((e, i) => ({ ...e.block, index: i })),
    [entries],
  )

  return { entries, blocks, addBlock, updateBlock, deleteBlock, serialize }
}
