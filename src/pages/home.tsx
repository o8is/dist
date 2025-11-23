import { Plus, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileEditor } from '../components/file-editor'
import { useCreateGist, type GistFile } from '../hooks/use-gist'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { createGist } = useCreateGist()
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<GistFile[]>([
    { filename: '', content: '', language: 'javascript', size: 0 }
  ])

  const handleAddFile = (): void => {
    setFiles([...files, { filename: '', content: '', language: 'javascript', size: 0 }])
  }

  const handleFileChange = (index: number, updatedFile: GistFile): void => {
    const newFiles = [...files]
    newFiles[index] = updatedFile
    setFiles(newFiles)
  }

  const handleRemoveFile = (index: number): void => {
    if (files.length === 1) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  const handleSubmit = async (): Promise<void> => {
    // Validation
    const validFiles = files.filter(f => f.filename.trim() !== '' && f.content.trim() !== '')
    if (validFiles.length === 0) {
      alert('Please add at least one file with a name and content')
      return
    }

    try {
      setIsSubmitting(true)
      const id = await createGist(validFiles, description)
      navigate(`/${id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to create gist')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-3 py-8 relative z-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <input
          type="text"
          placeholder="dist description..."
          className="w-full bg-transparent border-b border-o8-gray-400 px-0 py-2 text-lg text-o8-white focus:ring-0 focus:border-o8-primary transition-colors placeholder:text-o8-gray-300"
          value={description}
          onChange={(e) => { setDescription(e.target.value) }}
        />
      </div>

      <div className="space-y-6">
        {files.map((file, index) => (
          <FileEditor
            key={index}
            file={file}
            onChange={(updated) => { handleFileChange(index, updated) }}
            onRemove={() => { handleRemoveFile(index) }}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleAddFile}
          className="view-button flex items-center gap-2"
        >
          <Plus size={16} />
          Add file
        </button>

        <div className="flex-1" />

        <button
          onClick={() => { void handleSubmit() }}
          disabled={isSubmitting}
          className="view-button view-button--primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          Create dist
        </button>
      </div>
    </div>
  )
}
