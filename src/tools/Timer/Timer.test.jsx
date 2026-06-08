import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ClassProvider } from '../../context/ClassContext'
import { AccessibilityLayer } from '../../components/AccessibilityLayer'
import { Timer } from './Timer'

function Wrapper({ children }) {
  return (
    <ClassProvider>
      <AccessibilityLayer>{children}</AccessibilityLayer>
    </ClassProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Timer', () => {
  it('affiche le bouton Démarrer', () => {
    render(<Timer onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('Démarrer')).toBeInTheDocument()
  })

  it('affiche la durée initiale 5 minutes', () => {
    render(<Timer onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('décremente le temps après démarrage', () => {
    render(<Timer onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Démarrer'))
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('04:59')).toBeInTheDocument()
  })

  it('affiche Pause quand le minuteur tourne', () => {
    render(<Timer onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Démarrer'))
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('affiche 00:00 quand le temps est écoulé', () => {
    render(<Timer onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Démarrer'))
    act(() => vi.advanceTimersByTime(5 * 60 * 1000))
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })
})
