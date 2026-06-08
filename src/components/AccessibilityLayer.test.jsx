import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ClassProvider } from '../context/ClassContext'
import { AccessibilityLayer } from './AccessibilityLayer'

function Wrapper({ children }) {
  return (
    <ClassProvider>
      <AccessibilityLayer>{children}</AccessibilityLayer>
    </ClassProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
  document.body.style.cssText = ''
  document.documentElement.style.cssText = ''
})

describe('AccessibilityLayer', () => {
  it('sets font-family Arial when dyslexia is true', () => {
    localStorage.setItem(
      'utilactif_class',
      JSON.stringify({
        name: 'X',
        level: 'P1',
        year: '2025',
        accessibility: {
          dyslexia: true,
          font: 'Arial',
          highContrast: false,
          fontSize: 'normal',
          adhd: false,
          reducedMotion: false,
        },
        students: [],
      })
    )
    render(<div />, { wrapper: Wrapper })
    expect(document.body.style.fontFamily).toContain('Arial')
  })

  it('adds high-contrast class to html when highContrast is true', () => {
    localStorage.setItem(
      'utilactif_class',
      JSON.stringify({
        name: 'X',
        level: 'P1',
        year: '2025',
        accessibility: {
          dyslexia: false,
          font: 'Arial',
          highContrast: true,
          fontSize: 'normal',
          adhd: false,
          reducedMotion: false,
        },
        students: [],
      })
    )
    render(<div />, { wrapper: Wrapper })
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
  })

  it('sets --animation-duration to 0ms when reducedMotion is true', () => {
    localStorage.setItem(
      'utilactif_class',
      JSON.stringify({
        name: 'X',
        level: 'P1',
        year: '2025',
        accessibility: {
          dyslexia: false,
          font: 'Arial',
          highContrast: false,
          fontSize: 'normal',
          adhd: false,
          reducedMotion: true,
        },
        students: [],
      })
    )
    render(<div />, { wrapper: Wrapper })
    expect(
      document.documentElement.style.getPropertyValue('--animation-duration')
    ).toBe('0ms')
  })
})
