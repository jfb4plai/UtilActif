import { useContext } from 'react'
import { ClassContext } from '../context/ClassContext'

export function useClass() {
  const ctx = useContext(ClassContext)
  if (!ctx) throw new Error('useClass must be used within ClassProvider')
  const { profile, updateProfile, resetProfile } = ctx
  return {
    profile,
    updateProfile,
    resetProfile,
    isDyslexia: profile.accessibility.dyslexia,
    isADHD: profile.accessibility.adhd,
    students: profile.students,
    hasProfile: profile.name.trim().length > 0,
  }
}
