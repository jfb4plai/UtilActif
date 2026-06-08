import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

export function TurnManager({ onBack, onEditClass }) {
  const { students, isADHD } = useClass()
  const [queue, setQueue] = useState([...students])
  const [current, setCurrent] = useState(null)
  const [done, setDone] = useState([])
  const [mode, setMode] = useState('random')

  function handleNext() {
    if (queue.length === 0) return
    let next
    if (mode === 'random') {
      const idx = Math.floor(Math.random() * queue.length)
      next = queue[idx]
      setQueue((q) => q.filter((_, i) => i !== idx))
    } else {
      next = queue[0]
      setQueue((q) => q.slice(1))
    }
    if (current) setDone((d) => [current, ...d])
    setCurrent(next)
  }

  function handleSkip() {
    if (!current) return
    setQueue((q) => [...q, current])
    setCurrent(null)
  }

  function handleReset() {
    setQueue([...students])
    setCurrent(null)
    setDone([])
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <BackButton onClick={onBack} />
          <h2 className="text-xl font-bold text-plai-teal">Tours de parole</h2>
          <ClassButton onClick={onEditClass} />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-2xl text-gray-500">Aucun élève dans la classe.</p>
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
        <h2 className="text-xl font-bold text-plai-teal">Tours de parole</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col gap-6 p-6">
        <div className="flex gap-3 justify-center">
          {['random', 'manual'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-3 rounded-xl font-semibold border-2 ${
                mode === m ? 'bg-plai-teal text-white border-plai-teal' : 'border-gray-300 text-gray-600'
              }`}
              style={{ minHeight: '48px' }}
            >
              {m === 'random' ? 'Aléatoire' : "Dans l'ordre"}
            </button>
          ))}
        </div>

        {current && (
          <div className={`bg-plai-teal text-white rounded-2xl p-6 text-center ${isADHD ? 'shadow-2xl' : ''}`}>
            <p className="text-sm uppercase tracking-widest mb-2 opacity-75">Parle maintenant</p>
            <p className={`font-bold ${isADHD ? 'text-6xl' : 'text-4xl'}`}>{current.displayName}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-semibold">En attente ({queue.length})</p>
          {queue.map((s) => (
            <div key={s.id} className="bg-white rounded-xl px-5 py-3 text-lg text-gray-700 border border-gray-100">
              {s.displayName}
            </div>
          ))}
          {queue.length === 0 && done.length > 0 && (
            <p className="text-gray-400 text-center py-4">Tous les élèves sont passés.</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleNext}
            disabled={queue.length === 0}
            className="flex-1 bg-plai-teal text-white py-5 rounded-2xl text-2xl font-bold disabled:opacity-40"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Suivant
          </button>
          <button
            onClick={handleSkip}
            disabled={!current}
            className="flex-1 border-2 border-gray-300 text-gray-600 py-5 rounded-2xl text-2xl font-bold disabled:opacity-40"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Passer
          </button>
        </div>

        <button
          onClick={handleReset}
          className="text-gray-400 text-sm underline text-center"
        >
          Recommencer
        </button>

        {done.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-2">Déjà passés</p>
            <div className="flex gap-2 flex-wrap">
              {done.map((s, i) => (
                <span key={i} className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {s.displayName}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
