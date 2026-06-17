import { uploadAsset } from '#/lib/pocketbase'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/test')({
  component: RouteComponent,
})

function RouteComponent() {
const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0])
        }
    }

    // 🚨 THIS IS WHERE IT GOES:
    const submitFile = async () => {
        if (!selectedFile) {
        console.warn("No file selected yet.")
        return
        }

        setIsUploading(true)
        try {
        const result = await uploadAsset(selectedFile, {
            name: "aw",
            alt: "Manual dashboard test upload",
            type: "image"
        })

        // Checking your wrapper's .success property
        if (!result.success) {
            console.error("❌ Upload failed from response wrapper:", result.error)
        } else {
            // 🔥 FIX: Use .value here to log the actual record data from your class!
            console.log("✅ Asset uploaded successfully! Payload:", result.value)
        }
        
        } catch (err) {
        console.error("💥 Unexpected crashing exception in submission:", err)
        } finally {
        setIsUploading(false)
        }
    }

    return (
    <div style={{ padding: '2rem' }}>
        <input type='file' onChange={handleFileChange} />
        <button onClick={submitFile} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
    </div>
    )
}
