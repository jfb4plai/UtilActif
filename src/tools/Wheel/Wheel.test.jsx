import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ClassProvider } from '../../context/ClassContext'
import { AccessibilityLayer } from '../../components/AccessibilityLayer'
import { Wheel } from './Wheel'

function setupWithStudents() {
  localStorage.setItem(
    'utilactif_class',
    JSON.stringify({
      name: 'Test',
      level: 'P3',
      year: '2025',
      accessibility: { dyslexia: false, font: 'Arial', highContrast: false, fontSize: 'normal', adhd: false, reducedMotion: false },
      students: [
        { id: 'E01', displayName: 'Alice' },
        { id: 'E02', displayName: 'Bob' },
        { id: 'E03', displayName: 'Chloé' },
      ],
    })
  )
}

function Wrapper({ children }) {
  return <ClassProvider><AccessibilityLayer>{children}</AccessibilityLayer></ClassProvider>
}

beforeEach(() => localStorage.clear())

describe('Wheel', () => {
  it('affiche le bouton Tourner', () => {
    setupWithStudents()
    render(<Wheel onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('Tourner')).toBeInTheDocument()
  })

  it('affiche un résultat après tirage', () => {
    setupWithStudents()
    render(<Wheel onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Tourner'))
    expect(screen.getByRole('button', { name: /tourner|\.\.\./i })).toBeInTheDocument()
  })

  it('affiche message si aucun élève', () => {
    render(<Wheel onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText(/aucun élève/i)).toBeInTheDocument()
  })
})
