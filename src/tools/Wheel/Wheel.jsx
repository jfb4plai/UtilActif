import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

const SEGMENT_COLORS = [
  '#0a9370', '#f97316', '#3b82f6', '#a855f7',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
]

export function Wheel({ onBack, onEditClass }) {
  const { students } = useClass()
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [noReplacement, setNoReplacement] = useState(false)
  const [drawn, setDrawn] = useState(new Set())

  const available = noReplacement ? students.filter((s) => !drawn.has(s.id)) : students
  const allDrawn = noReplacement && students.length > 0 && available.length === 0

  function handleSpin() {
    if (spinning || available.length === 0) return
    setSpinning(true)
    setSelected(null)
    setTimeout(() => {
      const winner = available[Math.floor(Math.random() * available.length)]
      setSelected(winner)
      setHistory((h) => [winner, ...h].slice(0, 5))
      if (noReplacement) setDrawn((d) => new Set([...d, winner.id]))
      setSpinning(false)
    }, 1200)
  }

  function handleReset() {
    setDrawn(new Set())
    setSelected(null)
  }

  function handleToggleMode() {
    setNoReplacement((v) => !v)
    setDrawn(new Set())
    setSelected(null)
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <BackButton onClick={onBack} />
          <h2 className="text-xl font-bold text-plai-teal">Roue</h2>
          <ClassButton onClick={onEditClass} />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-2xl text-gray-500">Aucun élève dans la classe.</p>
          <p className="text-gray-400">Ajoutez des élèves dans la configuration de la classe.</p>
          <button
            onClick={onEditClass}
            className="mt-4 bg-plai-teal text-white px-8 py-4 rounded-xl text-xl font-bold"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Configurer la classe
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Roue</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <button
          onClick={handleToggleMode}
          className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
            noReplacement
              ? 'bg-plai-teal text-white border-plai-teal'
              : 'bg-white text-gray-500 border-gray-300'
          }`}
          style={{ minHeight: 'var(--touch-target)' }}
        >
          {noReplacement ? 'Sans remise — chacun une fois' : 'Avec remise — groupe constant'}
        </button>
        <div
          className={`w-64 h-64 rounded-full border-8 border-plai-teal flex items-center justify-center shadow-xl ${
            spinning ? 'animate-spin' : ''
          }`}
          style={{
            background: allDrawn
              ? '#e5e7eb'
              : `conic-gradient(${available
                  .map((s, i) => `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]} ${(i * 100) / available.length}% ${((i + 1) * 100) / available.length}%`)
                  .join(', ')})`,
            animationDuration: spinning ? '1s' : '0s',
          }}
        >
          {!spinning && selected && !allDrawn && (
            <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center text-center shadow">
              <span className="font-bold text-xl text-plai-teal leading-tight px-2">
                {selected.displayName}
              </span>
            </div>
          )}
        </div>

        {allDrawn ? (
          <p className="text-2xl font-bold text-gray-500 text-center">
            Tout le monde a participé !
          </p>
        ) : (
          selected && !spinning && (
            <p className="text-4xl font-bold text-gray-800 text-center">
              {selected.displayName} !
            </p>
          )
        )}

        {allDrawn ? (
          <button
            onClick={handleReset}
            className="bg-plai-orange text-white px-16 py-5 rounded-2xl text-3xl font-bold shadow-lg active:scale-95 transition-transform"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Recommencer
          </button>
        ) : (
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="bg-plai-teal text-white px-16 py-5 rounded-2xl text-3xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            style={{ minHeight: 'var(--touch-target)' }}
            aria-label="Tourner"
          >
            {spinning ? '...' : 'Tourner'}
          </button>
        )}

        {history.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {history.map((s, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-sm ${i === 0 ? 'bg-plai-teal text-white' : 'bg-gray-200 text-gray-600'}`}>
                {s.displayName}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
