import { createContext, useState, useCallback } from 'react'

const DEFAULT_PROFILE = {
  name: '',
  level: '',
  year: '',
  accessibility: {
    dyslexia: false,
    font: 'Arial',
    highContrast: false,
    fontSize: 'normal',
    adhd: false,
    reducedMotion: false,
  },
  students: [],
}

const STORAGE_KEY = 'utilactif_class'

export const ClassContext = createContext(null)

export function ClassProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE
    } catch {
      return DEFAULT_PROFILE
    }
  })

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const resetProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setProfile(DEFAULT_PROFILE)
  }, [])

  return (
    <ClassContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </ClassContext.Provider>
  )
}
