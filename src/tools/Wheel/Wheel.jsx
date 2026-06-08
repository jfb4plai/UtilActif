import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

const SEGMENT_COLORS = [
  '#0a9370', '#f97316', '#3b82f6', '#a855f7',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
]

const SIZE = 380
const R = SIZE / 2
const CX = R
const CY = R

function buildSegments(students) {
  const n = students.length
  if (n === 0) return []
  return students.map((s, i) => {
    const startDeg = (i * 360) / n - 90
    const endDeg = ((i + 1) * 360) / n - 90
    const startRad = (startDeg * Math.PI) / 180
    const endRad = (endDeg * Math.PI) / 180
    const largeArc = 360 / n > 180 ? 1 : 0
    const x1 = CX + R * Math.cos(startRad)
    const y1 = CY + R * Math.sin(startRad)
    const x2 = CX + R * Math.cos(endRad)
    const y2 = CY + R * Math.sin(endRad)
    const midRad = ((startDeg + endDeg) / 2 * Math.PI) / 180
    const textR = R * 0.62
    const tx = CX + textR * Math.cos(midRad)
    const ty = CY + textR * Math.sin(midRad)
    const textRotation = (startDeg + endDeg) / 2 + 90
    const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
    const maxChars = n <= 4 ? 12 : n <= 8 ? 9 : 7
    const label = s.displayName.length > maxChars
      ? s.displayName.slice(0, maxChars - 1) + '…'
      : s.displayName
    const fontSize = n <= 4 ? 18 : n <= 8 ? 14 : 11
    return { ...s, x1, y1, x2, y2, largeArc, tx, ty, textRotation, color, label, fontSize }
  })
}

function WheelSVG({ segments, spinning }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      className={spinning ? 'animate-spin' : ''}
      style={{ animationDuration: '1s', maxWidth: '80vw', maxHeight: '80vw' }}
    >
      {segments.map((seg, i) => (
        <g key={i}>
          <path
            d={`M ${CX} ${CY} L ${seg.x1} ${seg.y1} A ${R} ${R} 0 ${seg.largeArc} 1 ${seg.x2} ${seg.y2} Z`}
            fill={seg.color}
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={seg.tx}
            y={seg.ty}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={seg.fontSize}
            fontWeight="bold"
            fontFamily="Inter, Arial, sans-serif"
            transform={`rotate(${seg.textRotation}, ${seg.tx}, ${seg.ty})`}
          >
            {seg.label}
          </text>
        </g>
      ))}
      {/* Centre blanc */}
      <circle cx={CX} cy={CY} r={R * 0.12} fill="white" />
      {/* Indicateur (triangle en haut) */}
      <polygon
        points={`${CX},${8} ${CX - 12},${-8} ${CX + 12},${-8}`}
        fill="#1f2937"
      />
    </svg>
  )
}

export function Wheel({ onBack, onEditClass }) {
  const { students } = useClass()
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [noReplacement, setNoReplacement] = useState(false)
  const [drawn, setDrawn] = useState(new Set())

  const available = noReplacement ? students.filter((s) => !drawn.has(s.id)) : students
  const allDrawn = noReplacement && students.length > 0 && available.length === 0
  const segments = buildSegments(available)

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

      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
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

        {allDrawn ? (
          <div
            className="rounded-full bg-gray-200 flex items-center justify-center"
            style={{ width: SIZE, height: SIZE, maxWidth: '80vw', maxHeight: '80vw' }}
          >
            <span className="text-2xl font-bold text-gray-400 text-center px-8">
              Tout le monde a participé !
            </span>
          </div>
        ) : (
          <WheelSVG segments={segments} spinning={spinning} />
        )}

        {selected && !spinning && !allDrawn && (
          <p className="text-4xl font-bold text-gray-800 text-center">
            {selected.displayName} !
          </p>
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
            {spinning ? '…' : 'Tourner'}
          </button>
        )}

        {history.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center">
            {history.map((s, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm ${
                  i === 0 ? 'bg-plai-teal text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s.displayName}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
