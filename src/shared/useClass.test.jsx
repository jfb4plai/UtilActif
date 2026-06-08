import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ClassProvider } from '../context/ClassContext'
import { useClass } from './useClass'

const wrapper = ({ children }) => <ClassProvider>{children}</ClassProvider>

const defaultProfile = {
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

beforeEach(() => {
  localStorage.clear()
})

describe('useClass', () => {
  it('returns default profile when localStorage is empty', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    expect(result.current.profile).toEqual(defaultProfile)
  })

  it('isDyslexia is false by default', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    expect(result.current.isDyslexia).toBe(false)
  })

  it('isADHD is false by default', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    expect(result.current.isADHD).toBe(false)
  })

  it('students is empty array by default', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    expect(result.current.students).toEqual([])
  })

  it('updateProfile persists to localStorage', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    act(() => {
      result.current.updateProfile({ name: '4B', level: 'P4' })
    })
    const stored = JSON.parse(localStorage.getItem('utilactif_class'))
    expect(stored.name).toBe('4B')
    expect(stored.level).toBe('P4')
  })

  it('updateProfile merges with existing profile', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    act(() => {
      result.current.updateProfile({ name: '4B' })
    })
    act(() => {
      result.current.updateProfile({ level: 'P4' })
    })
    expect(result.current.profile.name).toBe('4B')
    expect(result.current.profile.level).toBe('P4')
  })

  it('isDyslexia reflects accessibility.dyslexia', () => {
    const { result } = renderHook(() => useClass(), { wrapper })
    act(() => {
      result.current.updateProfile({
        accessibility: { ...defaultProfile.accessibility, dyslexia: true },
      })
    })
    expect(result.current.isDyslexia).toBe(true)
  })

  it('loads profile from localStorage on mount', () => {
    localStorage.setItem(
      'utilactif_class',
      JSON.stringify({ ...defaultProfile, name: 'TestClass' })
    )
    const { result } = renderHook(() => useClass(), { wrapper })
    expect(result.current.profile.name).toBe('TestClass')
  })
})
