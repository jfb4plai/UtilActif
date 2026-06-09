import { useState, useEffect, useRef, useCallback } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

// --- Constantes SVG ---
const SIZE = 320
const CX = SIZE / 2
const CY = SIZE / 2
const R_ARC = 126        // rayon de l'arc coloré
const R_TICK_OUT = 146   // extrémité extérieure des traits
const R_LABEL = 158      // position des chiffres
const MAX_MINUTES = 60

const PRESETS = [1, 2, 5, 10, 15, 20, 25, 30]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Angle (degrés, 0 = haut, sens horaire) → coordonnée SVG
function angleToXY(angleDeg, r) {
  const rad = (angleDeg - 90) * Math.PI / 180
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  }
}

// Point SVG → angle (0-360, 0 = haut, sens horaire)
function xyToAngle(x, y) {
  const dx = x - CX
  const dy = y - CY
  let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
  if (angle < 0) angle += 360
  if (angle >= 360) angle -= 360
  return angle
}

// Chemin SVG pour un secteur de l'arc (de 0 jusqu'à angleDeg degrés)
function sectorPath(angleDeg) {
  if (angleDeg <= 0) return ''
  if (angleDeg >= 359.9) {
    // Cercle complet
    return `M ${CX} ${CY - R_ARC} A ${R_ARC} ${R_ARC} 0 1 1 ${CX - 0.001} ${CY - R_ARC} Z`
  }
  const start = angleToXY(0, R_ARC)
  const end = angleToXY(angleDeg, R_ARC)
  const large = angleDeg > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${start.x} ${start.y} A ${R_ARC} ${R_ARC} 0 ${large} 1 ${end.x} ${end.y} Z`
}

// Couleur de l'arc selon le temps restant
function arcColor(ratio) {
  if (ratio > 0.5) return '#4ade80'   // vert
  if (ratio > 0.2) return '#fb923c'   // orange
  return '#ef4444'                     // rouge
}

export function Timer({ onBack, onEditClass }) {
  const { isADHD } = useClass()
  const [duration, setDuration] = useState(5 * 60)     // secondes
  const [remaining, setRemaining] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)
  const svgRef = useRef(null)
  const dragging = useRef(false)

  // --- Tick ---
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
      const t = setTimeout(() => setFinished(false), 4000)
      return () => clearTimeout(t)
    }
  }, [finished, isADHD])

  // --- Contrôles ---
  function handleStart() { setFinished(false); setRunning(true) }
  function handlePause() { setRunning(false) }
  function handleReset() { setRunning(false); setFinished(false); setRemaining(duration) }

  function handlePreset(minutes) {
    const secs = minutes * 60
    setDuration(secs)
    setRemaining(secs)
    setRunning(false)
    setFinished(false)
  }

  // --- Drag pour régler le temps ---
  const applyAngle = useCallback((angleDeg) => {
    // Angle → minutes (0°=0min, 360°=60min)
    const minutes = Math.round(angleDeg / 360 * MAX_MINUTES)
    const clamped = Math.max(1, Math.min(MAX_MINUTES, minutes))
    const secs = clamped * 60
    setDuration(secs)
    setRemaining(secs)
    setFinished(false)
  }, [])

  function getSVGPoint(e) {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (SIZE / rect.width),
      y: (clientY - rect.top) * (SIZE / rect.height),
    }
  }

  function handlePointerDown(e) {
    if (running) return
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const pt = getSVGPoint(e)
    if (pt) applyAngle(xyToAngle(pt.x, pt.y))
  }

  function handlePointerMove(e) {
    if (!dragging.current || running) return
    const pt = getSVGPoint(e)
    if (pt) applyAngle(xyToAngle(pt.x, pt.y))
  }

  function handlePointerUp() {
    dragging.current = false
  }

  // --- Calculs visuels ---
  const ratio = duration > 0 ? remaining / duration : 0
  const sweepAngle = ratio * 360
  const color = arcColor(ratio)

  // Position de l'aiguille (extrémité de l'arc = temps restant)
  const handAngle = sweepAngle
  const handTip = angleToXY(handAngle, R_ARC)

  // Traits de graduation
  const ticks = []
  for (let i = 0; i < 60; i++) {
    const isMajor = i % 5 === 0
    const angle = i * 6  // 360/60
    const outer = angleToXY(angle, R_TICK_OUT)
    const inner = angleToXY(angle, isMajor ? R_TICK_OUT - 14 : R_TICK_OUT - 7)
    ticks.push({ outer, inner, isMajor, angle, label: i })
  }

  const flashBg = finished && isADHD

  return (
    <div className={`min-h-screen flex flex-col ${flashBg ? 'animate-pulse' : ''}`}
      style={{ background: flashBg ? '#fee2e2' : '#2d1b5e' }}>

      <header className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-white">Minuteur</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">

        {/* Cadran SVG */}
        <svg
          ref={svgRef}
          width={SIZE}
          height={SIZE}
          style={{ maxWidth: '85vw', maxHeight: '85vw', cursor: running ? 'default' : 'pointer', touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Fond du cadran */}
          <circle cx={CX} cy={CY} r={R_TICK_OUT + 6} fill="rgba(255,255,255,0.07)" />

          {/* Arc restant */}
          <path d={sectorPath(sweepAngle)} fill={color} opacity="0.9" />

          {/* Traits de graduation */}
          {ticks.map((t) => (
            <line
              key={t.label}
              x1={t.inner.x} y1={t.inner.y}
              x2={t.outer.x} y2={t.outer.y}
              stroke="white"
              strokeWidth={t.isMajor ? 3 : 1.5}
              strokeLinecap="round"
              opacity={t.isMajor ? 0.9 : 0.4}
            />
          ))}

          {/* Chiffres toutes les 5 minutes */}
          {ticks.filter((t) => t.isMajor).map((t) => {
            const pos = angleToXY(t.angle, R_LABEL)
            return (
              <text
                key={t.label}
                x={pos.x} y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={t.label === 0 ? 16 : 13}
                fontWeight={t.label === 0 ? 'bold' : 'normal'}
                fontFamily="Inter, Arial, sans-serif"
                opacity={0.85}
              >
                {t.label}
              </text>
            )
          })}

          {/* Aiguille (extrémité de l'arc = temps restant) */}
          {ratio > 0 && (
            <>
              <line
                x1={CX} y1={CY}
                x2={handTip.x} y2={handTip.y}
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.9}
              />
              <circle cx={handTip.x} cy={handTip.y} r={6} fill="white" opacity={0.95} />
            </>
          )}

          {/* Temps restant au centre */}
          <text
            x={CX} y={CY - 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={36}
            fontWeight="bold"
            fontFamily="Inter, Arial, sans-serif"
          >
            {formatTime(remaining)}
          </text>

          {/* Indication drag quand pas en cours */}
          {!running && !finished && (
            <text
              x={CX} y={CY + 22}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255,255,255,0.45)"
              fontSize={11}
              fontFamily="Inter, Arial, sans-serif"
            >
              glisser pour régler
            </text>
          )}
        </svg>

        {/* Boutons principaux */}
        <div className="flex gap-4">
          {!running ? (
            <button
              onClick={handleStart}
              disabled={remaining === 0}
              className="text-white px-10 py-4 rounded-2xl text-2xl font-bold disabled:opacity-40"
              style={{ background: '#0a9370', minHeight: 'var(--touch-target)' }}
            >
              Démarrer
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="text-white px-10 py-4 rounded-2xl text-2xl font-bold"
              style={{ background: '#f97316', minHeight: 'var(--touch-target)' }}
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="text-white px-8 py-4 rounded-2xl text-2xl font-bold"
            style={{ background: 'rgba(255,255,255,0.15)', minHeight: 'var(--touch-target)' }}
          >
            ↺
          </button>
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap justify-center">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => handlePreset(m)}
              className="rounded-xl px-4 py-2 text-base font-semibold transition-colors"
              style={{
                background: duration === m * 60 ? '#0a9370' : 'rgba(255,255,255,0.12)',
                color: 'white',
                minHeight: '48px',
              }}
            >
              {m} min
            </button>
          ))}
        </div>

        {/* Fin du temps */}
        {finished && (
          <p className="text-3xl font-bold text-green-300 animate-bounce">
            Temps écoulé !
          </p>
        )}
      </main>
    </div>
  )
}
