// src/tools/Sono/Sono.jsx
import { useState, useEffect, useRef } from 'react'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { SonoMonster } from './SonoMonster'
import { useSono } from './useSono'
import { getMonsterLevel } from './sonoUtils'

const PRESETS = [
  { id: 'silence',       label: 'Silence',          threshold: 15 },
  { id: 'chuchotement',  label: 'Chuchotement',      threshold: 25 },
  { id: 'groupe',        label: 'Travail de groupe', threshold: 40 },
  { id: 'libre',         label: 'Libre',             threshold: null },
]

export function Sono({ onBack, onEditClass }) {
  const { level, permission } = useSono()
  const [presetId, setPresetId] = useState('groupe')
  const [alertVisible, setAlertVisible] = useState(false)
  const alertTimerRef = useRef(null)
  const alertCooldownRef = useRef(false)

  const preset = PRESETS.find((p) => p.id === presetId)
  const monsterLevel = getMonsterLevel(level, preset.threshold)
  const overThreshold = preset.threshold !== null && level >= preset.threshold

  useEffect(() => {
    if (overThreshold && !alertCooldownRef.current) {
      alertCooldownRef.current = true
      setAlertVisible(true)
      clearTimeout(alertTimerRef.current)
      alertTimerRef.current = setTimeout(() => setAlertVisible(false), 3000)
    }
    if (!overThreshold) {
      alertCooldownRef.current = false
    }
  }, [overThreshold])

  useEffect(() => () => clearTimeout(alertTimerRef.current), [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a0e3d' }}>
      <header className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-white">Sonomètre</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        {permission === 'denied' ? (
          <p className="text-white text-xl text-center">
            Microphone non autorisé. Active l'accès dans les réglages du navigateur.
          </p>
        ) : (
          <div className={monsterLevel === 3 ? 'animate-bounce' : ''}>
            <SonoMonster level={monsterLevel} />
          </div>
        )}

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
