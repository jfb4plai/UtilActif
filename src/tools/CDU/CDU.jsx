import { useState } from 'react'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

// --- Constantes visuelles ---
// 1 cellule = 11px. Centaine = 10×10 = 110px. Dizaine = 11×110px. Unité = 11×11px.
const CELL = 11
const S_C = CELL * 10   // 110px — face frontale centaine
const S_D = CELL        // 11px  — largeur face dizaine
const H_D = S_C         // 110px — hauteur face dizaine
const S_U = CELL        // 11px  — face unité
const DEP_C = 12        // profondeur centaine
const DEP_D = 9         // profondeur dizaine
const DEP_U = 7         // profondeur unité — plus marqué pour visibilité

// Couleurs CDU standard
const CC = { front: '#4ade80', top: '#86efac', side: '#16a34a', grid: '#15803d' }
const DC = { front: '#f87171', top: '#fca5a5', side: '#b91c1c', grid: '#991b1b' }
// Unités : fond crème chaud + bordure grise foncée pour meilleure visibilité
const UC = { front: '#fef9ef', top: '#ffffff',  side: '#6b7280', grid: '#9ca3af' }

// --- Blocs SVG ---
function CentaineBlock() {
  const W = S_C + DEP_C
  const H = S_C + DEP_C
  const lines = []
  for (let i = 0; i <= 10; i++) {
    const v = i * CELL
    lines.push(
      <line key={`h${i}`} x1={0} y1={DEP_C + v} x2={S_C} y2={DEP_C + v} stroke={CC.grid} strokeWidth={0.7} opacity={0.55} />,
      <line key={`v${i}`} x1={v} y1={DEP_C} x2={v} y2={DEP_C + S_C} stroke={CC.grid} strokeWidth={0.7} opacity={0.55} />
    )
  }
  return (
    <svg width={W} height={H} style={{ display: 'block', flexShrink: 0 }}>
      {/* Face droite */}
      <polygon points={`${S_C},${DEP_C} ${W},0 ${W},${S_C} ${S_C},${H}`} fill={CC.side} />
      {/* Face haute */}
      <polygon points={`0,${DEP_C} ${DEP_C},0 ${W},0 ${S_C},${DEP_C}`} fill={CC.top} />
      {/* Face frontale */}
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill={CC.front} />
      {lines}
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill="none" stroke={CC.side} strokeWidth={1.5} />
    </svg>
  )
}

function DizaineBlock() {
  const W = S_D + DEP_D
  const H = H_D + DEP_D
  const lines = []
  for (let i = 0; i <= 10; i++) {
    const v = i * CELL
    lines.push(
      <line key={i} x1={0} y1={DEP_D + v} x2={S_D} y2={DEP_D + v} stroke={DC.grid} strokeWidth={0.7} opacity={0.55} />
    )
  }
  return (
    <svg width={W} height={H} style={{ display: 'block', flexShrink: 0 }}>
      {/* Face droite */}
      <polygon points={`${S_D},${DEP_D} ${W},0 ${W},${H_D} ${S_D},${H}`} fill={DC.side} />
      {/* Face haute */}
      <polygon points={`0,${DEP_D} ${DEP_D},0 ${W},0 ${S_D},${DEP_D}`} fill={DC.top} />
      {/* Face frontale */}
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill={DC.front} />
      {lines}
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill="none" stroke={DC.side} strokeWidth={1.5} />
    </svg>
  )
}

function UniteBlock() {
  const W = S_U + DEP_U
  const H = S_U + DEP_U
  return (
    <svg width={W} height={H} style={{ display: 'block', flexShrink: 0 }}>
      {/* Face droite */}
      <polygon points={`${S_U},${DEP_U} ${W},0 ${W},${S_U} ${S_U},${H}`} fill={UC.side} />
      {/* Face haute */}
      <polygon points={`0,${DEP_U} ${DEP_U},0 ${W},0 ${S_U},${DEP_U}`} fill={UC.top} />
      {/* Face frontale */}
      <rect x={0} y={DEP_U} width={S_U} height={S_U} fill={UC.front} stroke={UC.side} strokeWidth={1.5} />
    </svg>
  )
}

// --- Zone d'affichage d'un type de bloc ---
function BlockZone({ count, BlockComp, label, color, depH }) {
  // Les blocs sont alignés horizontalement, en-dessous le label
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex flex-wrap gap-1 items-end justify-center"
        style={{ minWidth: 60, minHeight: depH + S_C + 10 }}
      >
        {Array.from({ length: count }, (_, i) => (
          <BlockComp key={i} />
        ))}
        {count === 0 && (
          <div style={{ width: 40, height: 40, opacity: 0.2, border: `2px dashed ${color}`, borderRadius: 8 }} />
        )}
      </div>
      <span className="text-lg font-bold" style={{ color }}>{label}</span>
      <span className="text-3xl font-black text-gray-700">{count}</span>
    </div>
  )
}

// --- Boutons +/- pour régler ---
function Counter({ value, onChange, max = 9, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-12 h-12 rounded-xl text-2xl font-bold text-white flex items-center justify-center"
          style={{ background: value > 0 ? color : '#d1d5db' }}
        >−</button>
        <span className="text-3xl font-black w-10 text-center" style={{ color }}>{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-12 h-12 rounded-xl text-2xl font-bold text-white flex items-center justify-center"
          style={{ background: value < max ? color : '#d1d5db' }}
        >+</button>
      </div>
    </div>
  )
}

// --- Composant principal ---
export function CDU({ onBack, onEditClass }) {
  // 'blocs-to-nombre' : blocs donnés → élève trouve le nombre
  // 'nombre-to-blocs' : nombre donné → élève place les blocs
  const [mode, setMode] = useState('blocs-to-nombre')

  // Valeurs enseignant (blocs affichés / nombre cible)
  const [teacherC, setTeacherC] = useState(0)
  const [teacherD, setTeacherD] = useState(0)
  const [teacherU, setTeacherU] = useState(0)
  const [targetNumber, setTargetNumber] = useState('')  // mode nombre→blocs

  // Réponses élève
  const [studentAnswer, setStudentAnswer] = useState('')    // mode blocs→nombre
  const [studentC, setStudentC] = useState(0)              // mode nombre→blocs
  const [studentD, setStudentD] = useState(0)
  const [studentU, setStudentU] = useState(0)

  // État
  const [revealed, setRevealed] = useState(false)
  const [feedback, setFeedback] = useState(null)  // null | 'correct' | 'wrong'

  const teacherNumber = teacherC * 100 + teacherD * 10 + teacherU
  const studentNumber = studentC * 100 + studentD * 10 + studentU

  function resetFeedback() {
    setFeedback(null)
    setRevealed(false)
  }

  function handleModeChange(m) {
    setMode(m)
    resetFeedback()
    setStudentAnswer('')
    setStudentC(0); setStudentD(0); setStudentU(0)
  }

  function handleTeacherReset() {
    setTeacherC(0); setTeacherD(0); setTeacherU(0)
    setTargetNumber('')
    resetFeedback()
    setStudentAnswer('')
    setStudentC(0); setStudentD(0); setStudentU(0)
  }

  // Validation mode blocs→nombre
  function handleValidateAnswer() {
    const ans = parseInt(studentAnswer, 10)
    if (isNaN(ans)) { setFeedback('wrong'); return }
    setFeedback(ans === teacherNumber ? 'correct' : 'wrong')
    setRevealed(true)
  }

  // Validation mode nombre→blocs
  function handleValidateBlocs() {
    const target = parseInt(targetNumber, 10)
    if (isNaN(target)) return
    const tC = Math.floor(target / 100)
    const tD = Math.floor((target % 100) / 10)
    const tU = target % 10
    setFeedback(studentC === tC && studentD === tD && studentU === tU ? 'correct' : 'wrong')
    setRevealed(true)
  }

  // Décompose le nombre cible pour l'afficher
  function parseTarget() {
    const n = parseInt(targetNumber, 10)
    if (isNaN(n) || n < 0 || n > 999) return null
    return { c: Math.floor(n / 100), d: Math.floor((n % 100) / 10), u: n % 10 }
  }
  const target = parseTarget()

  // Hauteur minimale zone blocs (pour que les centaines soient toujours visibles)
  const zoneH = S_C + DEP_C + 20

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Centaines · Dizaines · Unités</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center gap-5 p-5 overflow-auto">

        {/* Mode toggle */}
        <div className="flex rounded-xl overflow-hidden border-2 border-gray-300 w-full max-w-lg">
          <button
            onClick={() => handleModeChange('blocs-to-nombre')}
            className={`flex-1 py-3 font-semibold text-base transition-colors ${
              mode === 'blocs-to-nombre' ? 'bg-plai-teal text-white' : 'bg-white text-gray-500'
            }`}
          >
            Blocs → Nombre
          </button>
          <button
            onClick={() => handleModeChange('nombre-to-blocs')}
            className={`flex-1 py-3 font-semibold text-base transition-colors ${
              mode === 'nombre-to-blocs' ? 'bg-plai-teal text-white' : 'bg-white text-gray-500'
            }`}
          >
            Nombre → Blocs
          </button>
        </div>

        {/* ---- MODE 1 : BLOCS → NOMBRE ---- */}
        {mode === 'blocs-to-nombre' && (
          <>
            {/* Contrôles enseignant */}
            <div className="flex gap-6 flex-wrap justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Counter value={teacherC} onChange={c => { setTeacherC(c); resetFeedback() }} label="Centaines" color={CC.side} />
              <Counter value={teacherD} onChange={d => { setTeacherD(d); resetFeedback() }} label="Dizaines"  color={DC.side} />
              <Counter value={teacherU} onChange={u => { setTeacherU(u); resetFeedback() }} label="Unités"    color={UC.side} />
              <div className="flex items-end">
                <button onClick={handleTeacherReset}
                  className="px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-500 font-semibold text-sm"
                  style={{ minHeight: 48 }}>
                  Effacer
                </button>
              </div>
            </div>

            {/* Affichage des blocs */}
            <div
              className="flex gap-8 justify-center items-end flex-wrap bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-3xl"
              style={{ minHeight: zoneH + 80 }}
            >
              <BlockZone count={teacherC} BlockComp={CentaineBlock} label="C" color={CC.side} depH={DEP_C} />
              <div className="w-px bg-gray-200 self-stretch" />
              <BlockZone count={teacherD} BlockComp={DizaineBlock} label="D" color={DC.side} depH={DEP_D} />
              <div className="w-px bg-gray-200 self-stretch" />
              <BlockZone count={teacherU} BlockComp={UniteBlock}   label="U" color={UC.side} depH={DEP_U} />
            </div>

            {/* Réponse élève */}
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <p className="text-gray-600 font-semibold text-lg">Quel est ce nombre ?</p>
              <input
                type="number"
                min="0" max="999"
                value={studentAnswer}
                onChange={e => { setStudentAnswer(e.target.value); setFeedback(null) }}
                className="w-40 text-center text-4xl font-black border-4 rounded-2xl py-3 outline-none focus:border-plai-teal"
                style={{ borderColor: feedback === 'correct' ? '#16a34a' : feedback === 'wrong' ? '#dc2626' : '#e5e7eb' }}
                placeholder="?"
              />
              {!revealed && (
                <button onClick={handleValidateAnswer}
                  disabled={!studentAnswer}
                  className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold disabled:opacity-40"
                  style={{ minHeight: 'var(--touch-target)' }}>
                  Valider
                </button>
              )}
              {feedback === 'correct' && (
                <p className="text-2xl font-bold text-green-600">Bravo ! {teacherNumber}</p>
              )}
              {feedback === 'wrong' && !revealed && (
                <div className="flex gap-3">
                  <p className="text-2xl font-bold text-red-500">Essaie encore…</p>
                  <button onClick={() => setRevealed(true)}
                    className="text-gray-400 text-sm underline self-center">voir</button>
                </div>
              )}
              {feedback === 'wrong' && revealed && (
                <p className="text-2xl font-bold text-gray-600">La réponse : <span className="text-plai-teal">{teacherNumber}</span></p>
              )}
            </div>
          </>
        )}

        {/* ---- MODE 2 : NOMBRE → BLOCS ---- */}
        {mode === 'nombre-to-blocs' && (
          <>
            {/* Saisie enseignant */}
            <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-sm">
              <p className="text-gray-500 font-semibold">Nombre à représenter (0–999)</p>
              <input
                type="number"
                min="0" max="999"
                value={targetNumber}
                onChange={e => { setTargetNumber(e.target.value); resetFeedback(); setStudentC(0); setStudentD(0); setStudentU(0) }}
                className="w-36 text-center text-3xl font-black border-4 border-plai-teal rounded-2xl py-3 outline-none focus:ring-2"
                placeholder="?"
              />
            </div>

            {/* Zone blocs de l'élève */}
            {target !== null && (
              <>
                <div className="flex gap-6 flex-wrap justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <Counter value={studentC} onChange={c => { setStudentC(c); setFeedback(null) }} label="Centaines" color={CC.side} />
                  <Counter value={studentD} onChange={d => { setStudentD(d); setFeedback(null) }} label="Dizaines"  color={DC.side} />
                  <Counter value={studentU} onChange={u => { setStudentU(u); setFeedback(null) }} label="Unités"    color={UC.side} />
                </div>

                {/* Affichage des blocs élève */}
                <div
                  className="flex gap-8 justify-center items-end flex-wrap bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-3xl"
                  style={{ minHeight: zoneH + 80 }}
                >
                  <BlockZone count={studentC} BlockComp={CentaineBlock} label="C" color={CC.side} depH={DEP_C} />
                  <div className="w-px bg-gray-200 self-stretch" />
                  <BlockZone count={studentD} BlockComp={DizaineBlock} label="D" color={DC.side} depH={DEP_D} />
                  <div className="w-px bg-gray-200 self-stretch" />
                  <BlockZone count={studentU} BlockComp={UniteBlock}   label="U" color={UC.side} depH={DEP_U} />
                </div>

                {/* Nombre construit par l'élève */}
                <p className="text-3xl font-black text-gray-600">
                  = <span className={studentNumber === parseInt(targetNumber, 10) ? 'text-green-600' : 'text-gray-400'}>{studentNumber || '?'}</span>
                </p>

                {!revealed && (
                  <button onClick={handleValidateBlocs}
                    className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold"
                    style={{ minHeight: 'var(--touch-target)' }}>
                    Valider
                  </button>
                )}

                {feedback === 'correct' && (
                  <p className="text-2xl font-bold text-green-600">Bravo ! C'est {targetNumber}.</p>
                )}
                {feedback === 'wrong' && !revealed && (
                  <div className="flex gap-4 items-center">
                    <p className="text-2xl font-bold text-red-500">Pas tout à fait…</p>
                    <button onClick={() => setRevealed(true)} className="text-gray-400 text-sm underline">voir</button>
                  </div>
                )}
                {feedback === 'wrong' && revealed && (
                  <p className="text-xl font-semibold text-gray-600">
                    Il fallait : <span className="text-plai-teal font-black">{target.c} C</span> + <span className="text-plai-teal font-black">{target.d} D</span> + <span className="text-plai-teal font-black">{target.u} U</span>
                  </p>
                )}
              </>
            )}
          </>
        )}

      </main>
    </div>
  )
}
