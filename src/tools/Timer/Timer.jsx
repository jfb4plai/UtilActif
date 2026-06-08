import { useState, useEffect, useRef } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function getBarColor(ratio) {
  if (ratio > 0.5) return 'bg-green-500'
  if (ratio > 0.2) return 'bg-orange-400'
  return 'bg-red-500'
}

const PRESETS = [1, 2, 5, 10, 15, 20]

export function Timer({ onBack, onEditClass }) {
  const { isADHD } = useClass()
  const [duration, setDuration] = useState(5 * 60)
  const [remaining, setRemaining] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setFinished(true)
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  useEffect(() => {
    if (finished && isADHD) {
      const timeout = setTimeout(() => setFinished(false), 3000)
      return () => clearTimeout(timeout)
    }
  }, [finished, isADHD])

  function handleStart() {
    setFinished(false)
    setRunning(true)
  }

  function handlePause() {
    setRunning(false)
  }

  function handleReset() {
    setRunning(false)
    setFinished(false)
    setRemaining(duration)
  }

  function handlePreset(minutes) {
    const secs = minutes * 60
    setDuration(secs)
    setRemaining(secs)
    setRunning(false)
    setFinished(false)
  }

  const ratio = remaining / duration
  const barColor = isADHD ? getBarColor(ratio) : 'bg-plai-teal'

  return (
    <div
      className={`min-h-screen flex flex-col bg-white ${finished && isADHD ? 'animate-pulse bg-red-50' : ''}`}
    >
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Minuteur</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <div
          className="text-8xl font-mono font-bold text-gray-800 tabular-nums"
          aria-live="polite"
          aria-label={`Temps restant : ${formatTime(remaining)}`}
        >
          {formatTime(remaining)}
        </div>

        {isADHD && (
          <div className="w-full max-w-md h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
              style={{ width: `${ratio * 100}%` }}
            />
          </div>
        )}

        <div className="flex gap-4">
          {!running ? (
            <button
              onClick={handleStart}
              disabled={remaining === 0}
              className="bg-plai-teal text-white px-10 py-5 rounded-2xl text-2xl font-bold disabled:opacity-40"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              Démarrer
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="bg-orange-400 text-white px-10 py-5 rounded-2xl text-2xl font-bold"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="border-2 border-gray-300 text-gray-600 px-8 py-5 rounded-2xl text-2xl font-bold"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            ↺
          </button>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => handlePreset(m)}
              className="border border-gray-200 rounded-xl px-5 py-3 text-lg text-gray-600 hover:border-plai-teal hover:text-plai-teal"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              {m} min
            </button>
          ))}
        </div>

        {finished && (
          <p className="text-2xl font-bold text-red-500 animate-bounce">
            Temps écoulé !
          </p>
        )}
      </main>
    </div>
  )
}
