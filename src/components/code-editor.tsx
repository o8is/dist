import React, { useRef, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  language: string
  onChange: (value: string | undefined) => void
  readOnly?: boolean
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, language, onChange, readOnly = false }) => {
  const editorRef = useRef<any>(null)
  const [height, setHeight] = useState('600px')

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    
    const updateHeight = () => {
      const contentHeight = editor.getContentHeight()
      // Set a minimum height of 600px, otherwise fit content
      setHeight(`${Math.max(600, contentHeight)}px`)
    }

    editor.onDidContentSizeChange(updateHeight)
    updateHeight()
  }

  return (
    <div className="border rounded-md overflow-hidden transition-[height] duration-100 ease-out" style={{ height }}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
          scrollbar: {
            vertical: 'hidden',
            handleMouseWheel: false,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
      />
    </div>
  )
}
