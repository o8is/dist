import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGist } from '../hooks/use-gist'
import { FileEditor } from '../components/file-editor'
import { Loader2, Share2 } from 'lucide-react'

export const ViewGistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { gist, loading } = useGist(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-o8-primary" size={32} />
      </div>
    )
  }

  if (!gist) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-o8-white mb-4">dist not found</h2>
        <p className="text-o8-gray-200 mb-8">The dist you are looking for does not exist or has been removed.</p>
        <Link to="/" className="view-button view-button--primary no-underline inline-flex">
          Go Home
        </Link>
      </div>
    )
  }

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href)
    // Could add a toast here
  }

  return (
    <div className="px-3 py-8 relative z-10 max-w-5xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-mono text-o8-primary">dist:{id?.substring(0, 8)}...</h1>
            <span className="text-xs px-2 py-1 rounded-full bg-o8-gray-500 text-o8-gray-200 border border-o8-gray-400">
              {Object.keys(gist.files).length} files
            </span>
          </div>
          <p className="text-o8-gray-100 text-lg">{gist.description || 'No description'}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-o8-gray-300">
            <span>Created {new Date(gist.createdAt).toLocaleDateString()}</span>
            {gist.updatedAt !== gist.createdAt && (
              <span>Updated {new Date(gist.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopyLink}
            className="view-button flex items-center gap-2"
          >
            <Share2 size={16} />
            Share
          </button>
          {/* We could add an edit button here if we implement editing, would link to the homepage with the content. */}
          {/* <Link to={`/gist/${id}/edit`} className="view-button view-button--primary flex items-center gap-2 no-underline">
            <Edit size={16} />
            Edit
          </Link> */}
        </div>
      </div>

      <div className="space-y-6">
        {Object.values(gist.files).map((file, index) => (
          <FileEditor
            key={index}
            file={file}
            onChange={() => {}} // Read-only
            onRemove={() => {}} // Read-only
            readOnly={true}
          />
        ))}
      </div>
    </div>
  )
}
