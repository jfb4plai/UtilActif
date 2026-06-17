// src/tools/Sono/Sono.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ClassProvider } from '../../context/ClassContext'
import { AccessibilityLayer } from '../../components/AccessibilityLayer'
import { Sono } from './Sono'

function makeMockWebAudio(granted = true) {
  const mockTrack = { stop: vi.fn() }
  const mockStream = { getTracks: () => [mockTrack] }
  const mockAnalyser = {
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: vi.fn((arr) => arr.fill(0)),
    connect: vi.fn(),
  }
  const mockSource = { connect: vi.fn() }
  const mockCtx = {
    createAnalyser: vi.fn(() => mockAnalyser),
    createMediaStreamSource: vi.fn(() => mockSource),
    close: vi.fn(),
  }
  vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  if (granted) {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockResolvedValue(mockStream) },
      configurable: true,
    })
  } else {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    })
  }
}

afterEach(() => vi.unstubAllGlobals())

function Wrapper({ children }) {
  return (
    <ClassProvider>
      <AccessibilityLayer>{children}</AccessibilityLayer>
    </ClassProvider>
  )
}

describe('Sono', () => {
  it('affiche le titre Sonomètre', async () => {
    makeMockWebAudio(true)
    await act(async () => {
      render(<Sono onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    expect(screen.getByText('Sonomètre')).toBeInTheDocument()
  })

  it('affiche les 4 préréglages', async () => {
    makeMockWebAudio(true)
    await act(async () => {
      render(<Sono onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    expect(screen.getByText('Silence')).toBeInTheDocument()
    expect(screen.getByText('Chuchotement')).toBeInTheDocument()
    expect(screen.getByText('Travail de groupe')).toBeInTheDocument()
    expect(screen.getByText('Libre')).toBeInTheDocument()
  })

  it('affiche le message d\'erreur si microphone refusé', async () => {
    makeMockWebAudio(false)
    await act(async () => {
      render(<Sono onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    expect(screen.getByText(/Microphone non autorisé/)).toBeInTheDocument()
  })

  it('met en évidence le préréglage actif', async () => {
    makeMockWebAudio(true)
    await act(async () => {
      render(<Sono onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    // "Travail de groupe" est actif par défaut
    const btn = screen.getByText('Travail de groupe')
    expect(btn.closest('button').style.background).toBe('rgb(10, 147, 112)')
  })

  it('change le préréglage actif au clic', async () => {
    makeMockWebAudio(true)
    await act(async () => {
      render(<Sono onBack={() => {}} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    fireEvent.click(screen.getByText('Silence'))
    expect(screen.getByText('Silence').closest('button').style.background).toBe('rgb(10, 147, 112)')
  })

  it('appelle onBack au clic sur le bouton retour', async () => {
    makeMockWebAudio(true)
    const onBack = vi.fn()
    await act(async () => {
      render(<Sono onBack={onBack} onEditClass={() => {}} />, { wrapper: Wrapper })
    })
    fireEvent.click(screen.getByRole('button', { name: /retour/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
