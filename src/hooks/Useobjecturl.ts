import { useEffect, useState } from 'react'

/**
 * Turns a File into an object URL and revokes the previous one whenever the
 * file changes or the component unmounts. Centralizes the blob-URL lifecycle
 * so editors don't leak a new URL on every keystroke-triggered re-render.
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