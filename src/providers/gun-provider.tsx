import Gun from 'gun'
import 'gun/sea'
import 'gun/lib/radix'
import 'gun/lib/radisk'
import 'gun/lib/store'
import 'gun/lib/rindexed'
import 'gun/lib/webrtc'
import React, { createContext, useContext, useState, useEffect } from 'react'

// Types for our Gun data
export interface GunContextType {
  gun: any // Gun instance type is complex, using any for simplicity
  user: any
  isReady: boolean
}

const GunContext = createContext<GunContextType>({
  gun: null,
  user: null,
  isReady: false
})

export const useGun = (): GunContextType => useContext(GunContext)

interface GunProviderProps {
  children: React.ReactNode
}

export const GunProvider: React.FC<GunProviderProps> = ({ children }) => {
  const [gun, setGun] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize Gun with the o8 relay
    const gunInstance = Gun({
      peers: ['https://gun.o8.is/gun', 'https://gun.octalmage.com/gun'],
      localStorage: true,
      radisk: true
    })

    const userInstance = gunInstance.user().recall({ sessionStorage: true })

    // Auto-login or create anonymous user
    gunInstance.on('auth', () => {
      setUser(userInstance)
    })

    // Check if we have a stored session or need to create one
    // Gun uses 'gun/' prefix in sessionStorage by default for recall
    // We check if we have our own credentials stored
    const alias = localStorage.getItem('dist_user_alias')
    const pass = localStorage.getItem('dist_user_pass')

    if (alias !== null && pass !== null) {
      userInstance.auth(alias, pass)
    } else if (localStorage.getItem('dist_user_alias') === null) {
      // Only create if we don't have credentials
      const newAlias = 'dist_' + Math.random().toString(36).substring(2)
      const newPass = 'dist_' + Math.random().toString(36).substring(2)

      userInstance.create(newAlias, newPass, (ack: any) => {
        if (ack.err === undefined || ack.err === null) {
          userInstance.auth(newAlias, newPass)
          localStorage.setItem('dist_user_alias', newAlias)
          localStorage.setItem('dist_user_pass', newPass)
        }
      })
    }

    setGun(gunInstance)
    setUser(userInstance)
    setIsReady(true)

    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <GunContext.Provider value={{ gun, user, isReady }}>
      {children}
    </GunContext.Provider>
  )
}
