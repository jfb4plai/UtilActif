# SonoActif Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un outil Sonomètre à UtilActif avec un monstre SVG animé en 4 états, 4 préréglages de seuil, et une alerte plein écran.

**Architecture:** `useSono` hook encapsule la Web Audio API (AudioContext + AnalyserNode) et expose un niveau 0-100. `SonoMonster` est un SVG pur basé sur une prop `level` (0-3). `Sono` orchestre les deux avec les préréglages et l'overlay d'alerte.

**Tech Stack:** React 19, Vite, Vitest + @testing-library/react, Web Audio API (navigateur), SVG inline, Tailwind CSS v3

---

## File Map

| Fichier | Action | Rôle |
|---------|--------|------|
| `src/tools/Sono/SonoMonster.jsx` | Créer | SVG monstre, prop `level` 0-3 |
| `src/tools/Sono/SonoMonster.test.jsx` | Créer | Tests de rendu par état |
| `src/tools/Sono/useSono.js` | Créer | Hook Web Audio, retourne `{ level, permission }` |
| `src/tools/Sono/useSono.test.js` | Créer | Tests hook avec Web Audio mockée |
| `src/tools/Sono/sonoUtils.js` | Créer | `getMonsterLevel(level, threshold)` — pure function |
| `src/tools/Sono/sonoUtils.test.js` | Créer | Tests unitaires `getMonsterLevel` |
| `src/tools/Sono/Sono.jsx` | Créer | Composant principal |
| `src/tools/Sono/Sono.test.jsx` | Créer | Tests d'intégration |
| `src/App.jsx` | Modifier | Ajouter `sono` dans `TOOL_COMPONENTS` |
| `src/components/ToolGrid.jsx` | Modifier | Ajouter carte Sonomètre dans `TOOLS` |

---

## Task 1: SonoMonster — SVG monstre à 4 états

**Files:**
- Create: `src/tools/Sono/SonoMonster.jsx`
- Create: `src/tools/Sono/SonoMonster.test.jsx`

- [ ] **Step 1: Créer le fichier de test**

```jsx
// src/tools/Sono/SonoMonster.test.jsx
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SonoMonster } from './SonoMonster'

describe('SonoMonster', () => {
  it('rend un SVG pour chaque niveau', () => {
    for (let level = 0; level <= 3; level++) {
      const { container } = render(<SonoMonster level={level} />)
      expect(container.querySelector('svg')).not.toBeNull()
    }
  })

  it('change la couleur du corps selon le niveau', () => {
    const { container: c0 } = render(<SonoMonster level={0} />)
    const { container: c3 } = render(<SonoMonster level={3} />)
    const body0 = c0.querySelector('[data-testid="monster-body"]')
    const body3 = c3.querySelector('[data-testid="monster-body"]')
    expect(body0.getAttribute('fill')).not.toBe(body3.getAttribute('fill'))
  })

  it('affiche les mains sur les oreilles au niveau 3', () => {
    const { container } = render(<SonoMonster level={3} />)
    expect(container.querySelectorAll('[data-testid="monster-hand"]')).toHaveLength(2)
  })

  it("n'affiche pas les mains aux niveaux 0-2", () => {
    for (let level = 0; level <= 2; level++) {
      const { container } = render(<SonoMonster level={level} />)
      expect(container.querySelectorAll('[data-testid="monster-hand"]')).toHaveLength(0)
    }
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

```
cd projets/utilactif
npx vitest run src/tools/Sono/SonoMonster.test.jsx
```
Attendu : FAIL — "Cannot find module './SonoMonster'"

- [ ] **Step 3: Créer SonoMonster.jsx**

```jsx
// src/tools/Sono/SonoMonster.jsx
const BODY_COLORS = ['#4ade80', '#86efac', '#fb923c', '#ef4444']
const DARK_COLORS = ['#166534', '#166534', '#7c2d12', '#7f1d1d']

export function SonoMonster({ level }) {
  const bodyColor = BODY_COLORS[level]
  const dark = DARK_COLORS[level]

  return (
    <svg viewBox="0 0 200 220" width="200" height="220" xmlns="http://www.w3.org/2000/svg">
      {/* Piques pour agité/explosé */}
      {level >= 2 && (
        <>
          <polygon points="100,28 108,52 92,52" fill={bodyColor} />
          <polygon points="132,38 138,62 122,58" fill={bodyColor} />
          <polygon points="68,38 78,62 62,58" fill={bodyColor} />
        </>
      )}

      {/* Corps */}
      <ellipse cx="100" cy="130" rx="75" ry="70" fill={bodyColor} data-testid="monster-body" />

      {/* Mains sur les oreilles — niveau 3 */}
      {level === 3 && (
        <>
          <ellipse cx="20" cy="112" rx="22" ry="16" fill={bodyColor} data-testid="monster-hand" />
          <ellipse cx="180" cy="112" rx="22" ry="16" fill={bodyColor} data-testid="monster-hand" />
        </>
      )}

      {/* Cornes */}
      <ellipse cx="68" cy="68" rx="12" ry="22" fill={bodyColor} transform="rotate(-15 68 68)" />
      <ellipse cx="132" cy="68" rx="12" ry="22" fill={bodyColor} transform="rotate(15 132 68)" />

      {/* Yeux — niveau 0 : fermés heureux */}
      {level === 0 && (
        <>
          <path d="M 72 108 Q 82 100 92 108" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 108 108 Q 118 100 128 108" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Yeux — niveau 1 : ouverts calmes */}
      {level === 1 && (
        <>
          <circle cx="82" cy="110" r="11" fill="white" />
          <circle cx="118" cy="110" r="11" fill="white" />
          <circle cx="82" cy="112" r="5" fill={dark} />
          <circle cx="118" cy="112" r="5" fill={dark} />
        </>
      )}

      {/* Yeux — niveau 2 : inquiets avec sourcils froncés */}
      {level === 2 && (
        <>
          <circle cx="82" cy="112" r="11" fill="white" />
          <circle cx="118" cy="112" r="11" fill="white" />
          <circle cx="84" cy="114" r="5" fill={dark} />
          <circle cx="120" cy="114" r="5" fill={dark} />
          <path d="M 72 98 Q 82 93 92 98" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 108 98 Q 118 93 128 98" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Yeux — niveau 3 : X abasourdis */}
      {level === 3 && (
        <>
          <line x1="74" y1="103" x2="90" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="90" y1="103" x2="74" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="110" y1="103" x2="126" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="126" y1="103" x2="110" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {/* Bouche — niveau 0 : grand sourire */}
      {level === 0 && (
        <path d="M 76 138 Q 100 158 124 138" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 1 : légèrement satisfait */}
      {level === 1 && (
        <path d="M 82 142 Q 100 150 118 142" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 2 : grimace */}
      {level === 2 && (
        <path d="M 78 150 Q 100 140 122 150" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 3 : O ouvert */}
      {level === 3 && (
        <ellipse cx="100" cy="150" rx="18" ry="14" fill={dark} />
      )}
    </svg>
  )
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

```
npx vitest run src/tools/Sono/SonoMonster.test.jsx
```
Attendu : PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/tools/Sono/SonoMonster.jsx src/tools/Sono/SonoMonster.test.jsx
git commit -m "feat(sono): SonoMonster SVG — 4 états animés"
```

---

## Task 2: sonoUtils — fonction pure getMonsterLevel

**Files:**
- Create: `src/tools/Sono/sonoUtils.js`
- Create: `src/tools/Sono/sonoUtils.test.js`

- [ ] **Step 1: Créer le fichier de test**

```js
// src/tools/Sono/sonoUtils.test.js
import { describe, it, expect } from 'vitest'
import { getMonsterLevel } from './sonoUtils'

describe('getMonsterLevel', () => {
  describe('avec threshold (preset actif)', () => {
    it('retourne 0 si level < 50% du threshold', () => {
      expect(getMonsterLevel(10, 40)).toBe(0)
    })

    it('retourne 1 si level entre 50% et 75% du threshold', () => {
      expect(getMonsterLevel(25, 40)).toBe(1)
    })

    it('retourne 2 si level entre 75% et 100% du threshold', () => {
      expect(getMonsterLevel(35, 40)).toBe(2)
    })

    it('retourne 3 si level >= threshold', () => {
      expect(getMonsterLevel(40, 40)).toBe(3)
      expect(getMonsterLevel(80, 40)).toBe(3)
    })
  })

  describe('sans threshold (preset Libre)', () => {
    it('retourne 0 si level < 25', () => {
      expect(getMonsterLevel(10, null)).toBe(0)
    })

    it('retourne 1 si level entre 25 et 49', () => {
      expect(getMonsterLevel(30, null)).toBe(1)
    })

    it('retourne 2 si level entre 50 et 74', () => {
      expect(getMonsterLevel(60, null)).toBe(2)
    })

    it('retourne 3 si level >= 75', () => {
      expect(getMonsterLevel(80, null)).toBe(3)
    })
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

```
npx vitest run src/tools/Sono/sonoUtils.test.js
```
Attendu : FAIL — "Cannot find module './sonoUtils'"

- [ ] **Step 3: Implémenter sonoUtils.js**

```js
// src/tools/Sono/sonoUtils.js
export function getMonsterLevel(level, threshold) {
  if (threshold === null) {
    if (level < 25) return 0
    if (level < 50) return 1
    if (level < 75) return 2
    return 3
  }
  const ratio = level / threshold
  if (ratio < 0.5) return 0
  if (ratio < 0.75) return 1
  if (ratio < 1) return 2
  return 3
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

```
npx vitest run src/tools/Sono/sonoUtils.test.js
```
Attendu : PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/tools/Sono/sonoUtils.js src/tools/Sono/sonoUtils.test.js
git commit -m "feat(sono): getMonsterLevel — logique de seuil"
```

---

## Task 3: useSono — hook Web Audio

**Files:**
- Create: `src/tools/Sono/useSono.js`
- Create: `src/tools/Sono/useSono.test.js`

- [ ] **Step 1: Créer le fichier de test**

```js
// src/tools/Sono/useSono.test.js
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useSono } from './useSono'

function makeMockWebAudio(granted = true) {
  const mockTrack = { stop: vi.fn() }
  const mockStream = { getTracks: () => [mockTrack] }

  const mockAnalyser = {
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: vi.fn((arr) => arr.fill(128)), // niveau moyen = 128/255*100 ≈ 50
    connect: vi.fn(),
  }

  const mockSource = { connect: vi.fn() }

  const mockCtx = {
    createAnalyser: vi.fn(() => mockAnalyser),
    createMediaStreamSource: vi.fn(() => mockSource),
    close: vi.fn(),
  }

  vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))
  vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => { cb(); return 1 }))
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

  return { mockCtx, mockAnalyser, mockTrack }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useSono', () => {
  it('démarre avec permission idle et level 0', () => {
    makeMockWebAudio(true)
    const { result } = renderHook(() => useSono())
    expect(result.current.permission).toBe('idle')
    expect(result.current.level).toBe(0)
  })

  it('passe à granted après getUserMedia réussi', async () => {
    makeMockWebAudio(true)
    const { result } = renderHook(() => useSono())
    await act(async () => {})
    expect(result.current.permission).toBe('granted')
  })

  it('passe à denied si getUserMedia échoue', async () => {
    makeMockWebAudio(false)
    const { result } = renderHook(() => useSono())
    await act(async () => {})
    expect(result.current.permission).toBe('denied')
  })

  it('calcule le level à partir des données de l\'analyseur', async () => {
    makeMockWebAudio(true) // fill 128 → ~50%
    const { result } = renderHook(() => useSono())
    await act(async () => {})
    // 128 / 255 * 100 ≈ 50
    expect(result.current.level).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

```
npx vitest run src/tools/Sono/useSono.test.js
```
Attendu : FAIL — "Cannot find module './useSono'"

- [ ] **Step 3: Implémenter useSono.js**

```js
// src/tools/Sono/useSono.js
import { useState, useEffect, useRef, useCallback } from 'react'

export function useSono() {
  const [level, setLevel] = useState(0)
  const [permission, setPermission] = useState('idle')
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const streamRef = useRef(null)

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    audioCtxRef.current?.close()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setLevel(0)
  }, [])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      ctx.createMediaStreamSource(stream).connect(analyser)
      setPermission('granted')

      const data = new Uint8Array(analyser.frequencyBinCount)
      function tick() {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((s, v) => s + v, 0) / data.length
        setLevel(Math.round((avg / 255) * 100))
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setPermission('denied')
    }
  }, [])

  useEffect(() => {
    start()
    return stop
  }, [start, stop])

  return { level, permission }
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

```
npx vitest run src/tools/Sono/useSono.test.js
```
Attendu : PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/tools/Sono/useSono.js src/tools/Sono/useSono.test.js
git commit -m "feat(sono): useSono hook — Web Audio API"
```

---

## Task 4: Sono — composant principal

**Files:**
- Create: `src/tools/Sono/Sono.jsx`
- Create: `src/tools/Sono/Sono.test.jsx`

- [ ] **Step 1: Créer le fichier de test**

```jsx
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
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

```
npx vitest run src/tools/Sono/Sono.test.jsx
```
Attendu : FAIL — "Cannot find module './Sono'"

- [ ] **Step 3: Implémenter Sono.jsx**

```jsx
// src/tools/Sono/Sono.jsx
import { useState, useEffect, useRef } from 'react'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { SonoMonster } from './SonoMonster'
import { useSono } from './useSono'
import { getMonsterLevel } from './sonoUtils'

const PRESETS = [
  { id: 'silence',       label: 'Silence',          threshold: 20 },
  { id: 'chuchotement',  label: 'Chuchotement',      threshold: 40 },
  { id: 'groupe',        label: 'Travail de groupe', threshold: 65 },
  { id: 'libre',         label: 'Libre',             threshold: null },
]

export function Sono({ onBack, onEditClass }) {
  const { level, permission } = useSono()
  const [presetId, setPresetId] = useState('groupe')
  const [alertVisible, setAlertVisible] = useState(false)
  const alertTimerRef = useRef(null)

  const preset = PRESETS.find((p) => p.id === presetId)
  const monsterLevel = getMonsterLevel(level, preset.threshold)
  const overThreshold = preset.threshold !== null && level >= preset.threshold

  useEffect(() => {
    if (overThreshold && !alertVisible) {
      setAlertVisible(true)
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = setTimeout(() => setAlertVisible(false), 3000)
    }
  }, [overThreshold, alertVisible])

  useEffect(() => () => clearTimeout(alertTimerRef.current), [])

  if (permission === 'denied') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#1a0e3d' }}>
        <header className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <BackButton onClick={onBack} />
          <h2 className="text-xl font-bold text-white">Sonomètre</h2>
          <ClassButton onClick={onEditClass} />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-white text-xl text-center">
            Microphone non autorisé. Active l'accès dans les réglages du navigateur.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a0e3d' }}>
      <header className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-white">Sonomètre</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <div className={monsterLevel === 3 ? 'animate-bounce' : ''}>
          <SonoMonster level={monsterLevel} />
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPresetId(p.id)}
              className="rounded-xl px-4 py-2 text-base font-semibold transition-colors"
              style={{
                background: presetId === p.id ? '#0a9370' : 'rgba(255,255,255,0.12)',
                color: 'white',
                minHeight: '48px',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </main>

      {alertVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(220,38,38,0.85)', zIndex: 50 }}
          onClick={() => setAlertVisible(false)}
        >
          <p className="text-white text-6xl font-black tracking-widest select-none">
            TROP FORT !
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

```
npx vitest run src/tools/Sono/Sono.test.jsx
```
Attendu : PASS (6 tests)

- [ ] **Step 5: Lancer tous les tests pour vérifier l'absence de régression**

```
npx vitest run
```
Attendu : tous les tests passent

- [ ] **Step 6: Commit**

```bash
git add src/tools/Sono/Sono.jsx src/tools/Sono/Sono.test.jsx
git commit -m "feat(sono): composant Sono — sonomètre complet"
```

---

## Task 5: Enregistrement dans App + ToolGrid

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/ToolGrid.jsx`

- [ ] **Step 1: Modifier App.jsx**

Ouvrir `src/App.jsx`. Ajouter l'import et l'entrée dans `TOOL_COMPONENTS` :

```jsx
// Après la ligne : import { CDU } from './tools/CDU/CDU'
import { Sono } from './tools/Sono/Sono'
```

```jsx
// Dans TOOL_COMPONENTS, après cdu:
const TOOL_COMPONENTS = {
  timer: Timer,
  dice: Dice,
  wheel: Wheel,
  consigne: ConsigneDisplay,
  numgrid: NumberGrid,
  turns: TurnManager,
  cdu: CDU,
  sono: Sono,   // ← ajouter cette ligne
}
```

- [ ] **Step 2: Modifier ToolGrid.jsx**

Ouvrir `src/components/ToolGrid.jsx`. Ajouter la carte dans le tableau `TOOLS` :

```jsx
// Dans le tableau TOOLS, après la ligne cdu :
const TOOLS = [
  { id: 'timer',   label: 'Minuteur',    icon: '⏱️',  description: 'Adapté TDAH' },
  { id: 'dice',    label: 'Dés',         icon: '🎲',  description: 'Multiformat' },
  { id: 'wheel',   label: 'Roue',        icon: '🎡',  description: 'Tirage au sort' },
  { id: 'consigne',label: 'Consigne',    icon: '📋',  description: 'Simplificateur' },
  { id: 'numgrid', label: 'Grille',      icon: '🔢',  description: 'Nombres 1-100' },
  { id: 'turns',   label: 'Tours',       icon: '🙋',  description: 'Parole en classe' },
  { id: 'cdu',     label: 'C·D·U',       icon: '🧱',  description: 'Centaines · Dizaines · Unités' },
  { id: 'sono',    label: 'Sonomètre',   icon: '🎙️',  description: 'Niveau sonore classe' },  // ← ajouter
]
```

- [ ] **Step 3: Lancer tous les tests**

```
npx vitest run
```
Attendu : tous les tests passent

- [ ] **Step 4: Vérifier le build**

```
npm run build
```
Attendu : build sans erreur

- [ ] **Step 5: Commit final**

```bash
git add src/App.jsx src/components/ToolGrid.jsx
git commit -m "feat(sono): enregistrement Sonomètre dans UtilActif"
```

- [ ] **Step 6: Push**

```bash
git push origin main
```
