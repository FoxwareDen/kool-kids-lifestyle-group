import { useCallback, useMemo, useState } from 'react'
import type { PageBlock } from '#/lib/experiences'
import { createEmptyBlock } from '#/lib/experiences'

/**
 * Owns block CRUD + stable identity for React keys. `createEmptyBlock`'s
 * `index` is a data-model concept (serialized order) and is not safe to reuse
 * as a render key, since deleting a block can make a later-added block's
 * index collide with a surviving block's index. We track a separate,
 * never-reused client-side id per block for `key` purposes only.
 */
export function useBlocks() {
  const [entries, setEntries] = useState<{ id: string; block: PageBlock }[]>([])

  const addBlock = useCallback((type: PageBlock['type']) => {
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), block: createEmptyBlock(type, prev.length) }])
  }, [])

  const updateBlock = useCallback((id: string, updated: PageBlock) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, block: updated } : e)))
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const blocks = useMemo(() => entries.map((e) => e.block), [entries])

  /** Blocks re-indexed by current position, ready to submit. */
  const serialize = useCallback((): PageBlock[] => entries.map((e, i) => ({ ...e.block, index: i })), [entries])

  return { entries, blocks, addBlock, updateBlock, deleteBlock, serialize }
}