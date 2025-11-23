import { Trash2, Code, Eye, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeEditor } from './code-editor'

interface GistFile {
  filename: string
  content: string
  language: string
  size: number
}

interface FileEditorProps {
  file: GistFile
  onChange(file: GistFile): void
  onRemove(): void
  readOnly?: boolean
}

export const FileEditor: React.FC<FileEditorProps> = ({ file, onChange, onRemove, readOnly = false }) => {
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview')
  const [copied, setCopied] = useState(false)
  const isMarkdown = file.language === 'markdown' || file.filename.toLowerCase().endsWith('.md')

  const handleContentChange = (value: string | undefined): void => {
    onChange({ ...file, content: value ?? '' })
  }

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...file, filename: e.target.value })
  }

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => { setCopied(false) }, 2000)
  }

  return (
    <div className="mb-6 border border-o8-gray-400/30 rounded-lg overflow-hidden bg-o8-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-between p-3 border-b border-o8-gray-400/30 bg-o8-black/40">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={file.filename}
            onChange={handleFilenameChange}
            placeholder="Filename including extension..."
            className="bg-transparent border-none focus:ring-0 font-mono text-sm w-full max-w-md text-o8-white placeholder:text-o8-gray-300"
            readOnly={readOnly}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {readOnly && (
            <button
              onClick={() => { void handleCopy() }}
              className="p-2 text-o8-gray-300 hover:text-o8-white transition-colors mr-2"
              title="Copy content"
            >
              {copied ? <Check size={16} className="text-o8-success" /> : <Copy size={16} />}
            </button>
          )}

          {readOnly && isMarkdown && (
            <div className="flex items-center bg-o8-black/40 rounded-lg p-1 border border-o8-gray-400/30 mr-2">
              <button
                onClick={() => { setViewMode('code') }}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'code' ? 'bg-o8-primary text-o8-white' : 'text-o8-gray-300 hover:text-o8-white'}`}
                title="Code"
              >
                <Code size={14} />
              </button>
              <button
                onClick={() => { setViewMode('preview') }}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-o8-primary text-o8-white' : 'text-o8-gray-300 hover:text-o8-white'}`}
                title="Preview"
              >
                <Eye size={14} />
              </button>
            </div>
          )}
          
          {!readOnly && (
            <button
              onClick={onRemove}
              className="p-2 text-o8-gray-300 hover:text-o8-error transition-colors"
              title="Remove file"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      {readOnly && isMarkdown && viewMode === 'preview' ? (
        <div className="p-6 bg-[#0d1117] min-h-[600px] overflow-auto">
          <div className="markdown-body" style={{ backgroundColor: 'transparent' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.content}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <CodeEditor
          value={file.content}
          language={(file.language !== '') ? file.language : 'javascript'}
          onChange={handleContentChange}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}
