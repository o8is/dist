import { useState, useEffect } from 'react'
import { useGun } from '../providers/gun-provider'

export interface Gist {
  id: string
  description: string
  files: Record<string, GistFile>
  createdAt: number
  updatedAt: number
  owner?: string
}

export interface GistFile {
  filename: string
  content: string
  language: string
  size: number
}

export function useGist (id?: string): { gist: Gist | null, loading: boolean} {
  const { gun } = useGun()
  const [gist, setGist] = useState<Gist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ((gun === null) || (id === undefined)) {
      setLoading(false)
      return
    }

    setLoading(true)
    
    // Subscribe to the gist node
    // We use the ID (hash) to find the gist directly at the root level
    // This avoids the "fat parent" issue where a single 'gists' node becomes too large
    const gistNode = gun.get(id)
    
    const listener = async (data: any) => {
      if (data !== null && data !== undefined) {
        // Gun returns the object with metadata, we need to parse it
        const cleanData = { ...data }
        delete cleanData._
        
        // Parse files if stored as string
        if (typeof cleanData.files === 'string') {
          try {
            cleanData.files = JSON.parse(cleanData.files)
          } catch (e) {
            console.error('Failed to parse gist files', e)
            cleanData.files = {}
          }
        } else if (cleanData.files === undefined || cleanData.files === null) {
          cleanData.files = {}
        }

        // Verify integrity (Content Addressing)
        // We reconstruct the content and hash it to ensure it matches the ID
        // This prevents anyone (including the owner) from modifying the content after creation
        try {
          const filesArray = Object.values(cleanData.files).map((f: any) => ({
            filename: f.filename,
            content: f.content,
            language: (f.language !== undefined) ? f.language : 'text',
            size: (f.size !== undefined) ? f.size : 0
          }))
          // Sort to ensure deterministic order
          filesArray.sort((a: any, b: any) => a.filename.localeCompare(b.filename))

          const stableContent = JSON.stringify({
            description: (cleanData.description !== undefined && cleanData.description !== '') ? cleanData.description : '',
            files: filesArray
          })
          
          const msgBuffer = new TextEncoder().encode(stableContent)
          const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const calculatedId = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)

          if (calculatedId !== id) {
            console.warn(`Security Alert: Content hash mismatch for gist ${id}. The data may have been tampered with.`)

            setGist(null)
            setLoading(false)
            return
          }
        } catch (err) {
          console.error('Error verifying gist integrity:', err)
        }

        setGist(cleanData as Gist)
      } else {
        setGist(null)
      }
      setLoading(false)
    }

    gistNode.on(listener)

    return () => {
      gistNode.off(listener)
    }
  }, [gun, id])

  return { gist, loading }
}

export function useCreateGist (): { createGist(files: GistFile[], description?: string): Promise<string> } {
  const { gun, user } = useGun()

  const createGist = async (files: GistFile[], description: string = ''): Promise<string> => {
    if (gun === null) throw new Error('Gun not initialized')

    const filesMap: Record<string, GistFile> = {}
    files.forEach(f => {
      filesMap[f.filename] = {
        filename: f.filename,
        content: f.content,
        language: (f.language !== '') ? f.language : 'text',
        size: (f.size !== 0) ? f.size : 0
      }
    })

    // Generate content hash for ID
    const stableContent = JSON.stringify({
      description: (description !== '') ? description : '',
      files: Object.values(filesMap).sort((a, b) => a.filename.localeCompare(b.filename))
    })
    
    const msgBuffer = new TextEncoder().encode(stableContent)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const id = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)

    const timestamp = Date.now()

    const newGist: any = {
      id,
      description: (description !== '') ? description : '',
      files: JSON.stringify(filesMap),
      createdAt: timestamp,
      updatedAt: timestamp
    }

    if (user?.is?.pub !== undefined && user?.is?.pub !== null) {
      newGist.owner = user.is.pub
    }

    // Save to public gists list (or user's list)
    // We use a simpler object for the list to avoid large data
    const listEntry = {
      id,
      description: (description !== '') ? description : '',
      createdAt: timestamp,
      filename: files[0]?.filename ?? ''
    }

    // Save full data to the specific node at the root level
    // This ensures O(1) lookup and avoids the 'gists' node bottleneck
    gun.get(id).put(newGist)
    
    // Add to public list (optional, maybe we want a global feed?)
    // gun.get('gists').get('public').set(listEntry)
    
    if (user?.is !== undefined && user?.is !== null) {
      user.get('gists').get(id).put(listEntry)
    }

    return id
  }

  return { createGist }
}

export function useMyGists (): { gists: Gist[], loading: boolean } {
  const { gun, user } = useGun()
  const [gists, setGists] = useState<Gist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ((gun === null) || (user === null) || (user.is === undefined)) {
      setLoading(false)
      return
    }

    setLoading(true)
    const gistsMap = new Map<string, Gist>()

    // Subscribe to user's gists
    user.get('gists').map().on((data: any, id: string) => {
      if (data !== null && data !== undefined) {
        const gist: Gist = {
          id: (data.id !== undefined) ? data.id : id,
          description: data.description,
          createdAt: data.createdAt,
          updatedAt: (data.updatedAt !== undefined) ? data.updatedAt : data.createdAt,
          files: (data.filename !== undefined && data.filename !== null && data.filename !== '')
            ? { [data.filename]: { filename: data.filename, content: '', language: '', size: 0 } }
            : {},
          owner: user.is.pub
        }
        
        gistsMap.set(id, gist)
        setGists(Array.from(gistsMap.values()).sort((a, b) => b.createdAt - a.createdAt))
      } else {
        // null means deleted
        gistsMap.delete(id)
        setGists(Array.from(gistsMap.values()).sort((a, b) => b.createdAt - a.createdAt))
      }
      setLoading(false)
    })

    return () => {
      user.get('gists').map().off()
    }
  }, [gun, user])

  return { gists, loading }
}
