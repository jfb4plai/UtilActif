import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { ClassProvider } from '../../context/ClassContext'
import { AccessibilityLayer } from '../../components/AccessibilityLayer'
import { NumberGrid } from './NumberGrid'

function Wrapper({ children }) {
  return <ClassProvider><AccessibilityLayer>{children}</AccessibilityLayer></ClassProvider>
}

beforeEach(() => localStorage.clear())

describe('NumberGrid', () => {
  it('affiche les nombres de 1 à 100', () => {
    render(<NumberGrid onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('surligne une cellule au clic', () => {
    render(<NumberGrid onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    const cell = screen.getByText('42')
    fireEvent.click(cell)
    expect(cell.closest('button')).toHaveClass('bg-plai-teal')
  })

  it('désactive le surlignage au second clic', () => {
    render(<NumberGrid onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    const cell = screen.getByText('42')
    fireEvent.click(cell)
    fireEvent.click(cell)
    expect(cell.closest('button')).not.toHaveClass('bg-plai-teal')
  })

  it('bouton Effacer remet à zéro', () => {
    render(<NumberGrid onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('42'))
    fireEvent.click(screen.getByText('Effacer'))
    expect(screen.getByText('42').closest('button')).not.toHaveClass('bg-plai-teal')
  })
})
