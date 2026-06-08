import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ClassProvider } from '../../context/ClassContext'
import { AccessibilityLayer } from '../../components/AccessibilityLayer'
import { TurnManager } from './TurnManager'

function setupWithStudents() {
  localStorage.setItem('utilactif_class', JSON.stringify({
    name: 'Test', level: 'P3', year: '2025',
    accessibility: { dyslexia: false, font: 'Arial', highContrast: false, fontSize: 'normal', adhd: false, reducedMotion: false },
    students: [
      { id: 'E01', displayName: 'Alice' },
      { id: 'E02', displayName: 'Bob' },
    ],
  }))
}

function Wrapper({ children }) {
  return <ClassProvider><AccessibilityLayer>{children}</AccessibilityLayer></ClassProvider>
}

beforeEach(() => localStorage.clear())

describe('TurnManager', () => {
  it('affiche les élèves', () => {
    setupWithStudents()
    render(<TurnManager onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('affiche message si aucun élève', () => {
    render(<TurnManager onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText(/aucun élève/i)).toBeInTheDocument()
  })

  it('sélectionne un élève au clic Suivant', () => {
    setupWithStudents()
    render(<TurnManager onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Suivant'))
    const activeItems = document.querySelectorAll('.bg-plai-teal')
    expect(activeItems.length).toBeGreaterThan(0)
  })

  it('bouton Passer ne plante pas quand aucun élève actif', () => {
    setupWithStudents()
    render(<TurnManager onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(() => fireEvent.click(screen.getByText('Passer'))).not.toThrow()
  })
})
