import { Loader2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useMyGists } from '../hooks/use-gist'

export const MyGistsPage: React.FC = () => {
  const { gists, loading } = useMyGists()

  if (loading && gists.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-o8-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="px-3 py-8 relative z-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-o8-white mb-8">My dists</h1>
      
      {gists.length === 0
        ? (
        <div className="text-center py-12 border border-dashed border-o8-gray-400/30 rounded-lg">
          <p className="text-o8-gray-200 mb-4">You haven&apos;t created any dists yet.</p>
          <Link to="/new" className="view-button view-button--primary no-underline inline-flex">
            Create your first dist
          </Link>
        </div>
          )
        : (
        <div className="grid gap-4">
          {gists.map(gist => (
            <Link
              key={gist.id}
              to={`/${gist.id}`}
              className="block p-6 border border-o8-gray-400/30 rounded-lg bg-o8-black/20 hover:bg-o8-black/40 transition-colors no-underline group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-o8-primary group-hover:underline">dist:{gist.id.substring(0, 8)}...</span>
                    {(Object.keys(gist.files).length > 0) && (
                      <span className="text-o8-gray-300 text-sm font-mono">/ {Object.keys(gist.files)[0]}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-o8-gray-400">
                  {new Date(gist.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-o8-gray-200 line-clamp-2">
                {(gist.description !== '') ? gist.description : <span className="italic text-o8-gray-400">No description</span>}
              </p>
            </Link>
          ))}
        </div>
          )}
    </div>
  )
}
