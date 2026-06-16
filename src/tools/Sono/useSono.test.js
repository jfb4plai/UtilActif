import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { useSono } from './useSono'

let getUserMediaMock

beforeEach(() => {
  const mockTrack = { stop: vi.fn() }
  const mockStream = { getTracks: () => [mockTrack] }

  const mockAnalyser = {
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: vi.fn((arr) => arr.fill(128)),
    connect: vi.fn(),
  }

  const mockSource = { connect: vi.fn() }

  // Stub audio context constructor
  vi.stubGlobal('AudioContext', class {
    createAnalyser() { return mockAnalyser }
    createMediaStreamSource() { return mockSource }
    close() {}
  })

  let rafId = 0
  let rafCallCount = 0
  const MAX_RAF_CALLS = 1 // Only execute the tick function once to avoid infinite loops

  vi.stubGlobal('requestAnimationFrame', (cb) => {
    const id = ++rafId
    // Execute callback only for the first few calls to allow the level to be calculated
    // without creating an infinite loop
    if (rafCallCount < MAX_RAF_CALLS) {
      rafCallCount++
      cb()
    }
    return id
  })

  vi.stubGlobal('cancelAnimationFrame', () => {})

  // Create a mock for getUserMedia that we can control per test
  getUserMediaMock = vi.fn().mockResolvedValue(mockStream)

  // Use defineProperty to mock navigator.mediaDevices
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia: getUserMediaMock },
    configurable: true,
    writable: true,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useSono', () => {
  it('démarre avec permission idle et level 0', () => {
    const { result } = renderHook(() => useSono())
    expect(result.current.permission).toBe('idle')
    expect(result.current.level).toBe(0)
  })

  it('passe à granted après getUserMedia réussi', async () => {
    const { result } = renderHook(() => useSono())

    await waitFor(() => {
      expect(result.current.permission).toBe('granted')
    }, { timeout: 2000 })
  })

  it('passe à denied si getUserMedia échoue', async () => {
    // Reconfigure the mock to reject
    getUserMediaMock.mockRejectedValueOnce(new Error('denied'))

    const { result } = renderHook(() => useSono())

    await waitFor(() => {
      expect(result.current.permission).toBe('denied')
    }, { timeout: 1000 })
  })

  it('calcule le level à partir des données de l\'analyseur', async () => {
    const { result } = renderHook(() => useSono())

    // Wait for permission to be granted and level to be calculated
    await waitFor(() => {
      expect(result.current.permission).toBe('granted')
      expect(result.current.level).toBeGreaterThan(0)
    }, { timeout: 1000 })
  })
})
