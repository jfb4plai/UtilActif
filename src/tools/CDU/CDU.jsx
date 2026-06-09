import { useState, useEffect } from 'react'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

// --- Constantes visuelles ---
const CELL = 11
const S_C = CELL * 10
const S_D = CELL
const H_D = S_C
const S_U = CELL
const DEP_C = 12
const DEP_D = 9
const DEP_U = 7

const CC = { front: '#4ade80', top: '#86efac', side: '#16a34a', grid: '#15803d' }
const DC = { front: '#f87171', top: '#fca5a5', side: '#b91c1c', grid: '#991b1b' }
const UC = { front: '#fef9ef', top: '#ffffff',  side: '#6b7280', grid: '#9ca3af' }

// --- Blocs SVG (variante : highlighted pour les blocs "en cours") ---
function CentaineBlock({ dim = false }) {
  const W = S_C + DEP_C, H = S_C + DEP_C
  const op = dim ? 0.35 : 1
  const lines = []
  for (let i = 0; i <= 10; i++) {
    const v = i * CELL
    lines.push(
      <line key={`h${i}`} x1={0} y1={DEP_C+v} x2={S_C} y2={DEP_C+v} stroke={CC.grid} strokeWidth={0.7} opacity={0.55}/>,
      <line key={`v${i}`} x1={v} y1={DEP_C} x2={v} y2={DEP_C+S_C} stroke={CC.grid} strokeWidth={0.7} opacity={0.55}/>
    )
  }
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0, opacity:op }}>
      <polygon points={`${S_C},${DEP_C} ${W},0 ${W},${S_C} ${S_C},${H}`} fill={CC.side}/>
      <polygon points={`0,${DEP_C} ${DEP_C},0 ${W},0 ${S_C},${DEP_C}`} fill={CC.top}/>
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill={CC.front}/>
      {lines}
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill="none" stroke={CC.side} strokeWidth={1.5}/>
    </svg>
  )
}

function DizaineBlock({ dim = false }) {
  const W = S_D + DEP_D, H = H_D + DEP_D
  const op = dim ? 0.35 : 1
  const lines = []
  for (let i = 0; i <= 10; i++) {
    lines.push(<line key={i} x1={0} y1={DEP_D+i*CELL} x2={S_D} y2={DEP_D+i*CELL} stroke={DC.grid} strokeWidth={0.7} opacity={0.55}/>)
  }
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0, opacity:op }}>
      <polygon points={`${S_D},${DEP_D} ${W},0 ${W},${H_D} ${S_D},${H}`} fill={DC.side}/>
      <polygon points={`0,${DEP_D} ${DEP_D},0 ${W},0 ${S_D},${DEP_D}`} fill={DC.top}/>
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill={DC.front}/>
      {lines}
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill="none" stroke={DC.side} strokeWidth={1.5}/>
    </svg>
  )
}

function UniteBlock({ dim = false }) {
  const W = S_U + DEP_U, H = S_U + DEP_U
  const op = dim ? 0.35 : 1
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0, opacity:op }}>
      <polygon points={`${S_U},${DEP_U} ${W},0 ${W},${S_U} ${S_U},${H}`} fill={UC.side}/>
      <polygon points={`0,${DEP_U} ${DEP_U},0 ${W},0 ${S_U},${DEP_U}`} fill={UC.top}/>
      <rect x={0} y={DEP_U} width={S_U} height={S_U} fill={UC.front} stroke={UC.side} strokeWidth={1.5}/>
    </svg>
  )
}

// --- Zone blocs — affiche count blocs avec les dimLast derniers estompés ---
function BlockZone({ count, BlockComp, label, color, dimLast = 0, addCount = 0 }) {
  const solid = count - dimLast
  return (
    <div className="flex flex-col items-center gap-2 min-w-[60px]">
      <div className="flex flex-wrap gap-1 items-end justify-center"
        style={{ minHeight: (BlockComp === CentaineBlock ? S_C + DEP_C : H_D + DEP_D) + 10 }}>
        {Array.from({ length: solid }, (_, i) => <BlockComp key={i}/>)}
        {Array.from({ length: dimLast }, (_, i) => <BlockComp key={`dim-${i}`} dim/>)}
        {/* Blocs à ajouter (contour pointillé) */}
        {addCount > 0 && Array.from({ length: addCount }, (_, i) => (
          <div key={`add-${i}`} style={{
            width: BlockComp === CentaineBlock ? S_C+DEP_C : BlockComp === DizaineBlock ? S_D+DEP_D : S_U+DEP_U,
            height: BlockComp === CentaineBlock ? S_C+DEP_C : BlockComp === DizaineBlock ? H_D+DEP_D : S_U+DEP_U,
            border: `2px dashed ${color}`, borderRadius: 4, opacity: 0.6,
            flexShrink: 0,
          }}/>
        ))}
        {count + addCount === 0 && <div style={{ width:36, height:36, opacity:0.15, border:`2px dashed ${color}`, borderRadius:8 }}/>}
      </div>
      <span className="text-base font-bold" style={{ color }}>{label}</span>
      <span className="text-2xl font-black text-gray-700">{count}</span>
    </div>
  )
}

// --- Compteur +/- ---
function Counter({ value, onChange, max, label, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(0, value-1))}
          className="w-12 h-12 rounded-xl text-2xl font-bold text-white flex items-center justify-center"
          style={{ background: value > 0 ? color : '#d1d5db' }}>−</button>
        <span className="text-3xl font-black w-10 text-center" style={{ color }}>{value}</span>
        <button onClick={() => onChange(max == null || value < max ? value+1 : value)}
          className="w-12 h-12 rounded-xl text-2xl font-bold text-white flex items-center justify-center"
          style={{ background: (max == null || value < max) ? color : '#d1d5db' }}>+</button>
      </div>
    </div>
  )
}

// --- Décompose un entier en C/D/U ---
function decompose(n) {
  return { c: Math.floor(n/100), d: Math.floor((n%100)/10), u: n%10 }
}

// ============================================================
// ONGLET ADDITION avec blocs
// ============================================================
function AddTab() {
  const [numA, setNumA] = useState('')
  const [numB, setNumB] = useState('')

  // État de travail : blocs courants du résultat en construction
  const [wk, setWk]   = useState({ c:0, d:0, u:0 })
  // Étape : 'init'|'u-add'|'u-group'|'d-add'|'d-group'|'c-add'|'done'
  const [phase, setPhase] = useState('init')

  const av = parseInt(numA, 10), bv = parseInt(numB, 10)
  const valid = !isNaN(av) && !isNaN(bv) && av >= 0 && av <= 999 && bv >= 0 && bv <= 999
  const A = valid ? decompose(av) : null
  const B = valid ? decompose(bv) : null

  // Reset si les nombres changent
  useEffect(() => { setPhase('init'); setWk({c:0,d:0,u:0}) }, [numA, numB])

  function start() {
    setWk({ c: A.c, d: A.d, u: A.u })
    setPhase('u-add')
  }

  function addU() {
    const nu = wk.u + B.u
    const next = { ...wk, u: nu }
    setWk(next)
    setPhase(nu >= 10 ? 'u-group' : 'd-add')
  }

  function groupU() {
    setWk(w => ({ ...w, u: w.u - 10, d: w.d + 1 }))
    setPhase('d-add')
  }

  function addD() {
    const nd = wk.d + B.d
    const next = { ...wk, d: nd }
    setWk(next)
    setPhase(nd >= 10 ? 'd-group' : 'c-add')
  }

  function groupD() {
    setWk(w => ({ ...w, d: w.d - 10, c: w.c + 1 }))
    setPhase('c-add')
  }

  function addC() {
    setWk(w => ({ ...w, c: w.c + B.c }))
    setPhase('done')
  }

  const phaseLabel = {
    'init':    null,
    'u-add':   `Ajouter les ${B?.u} unité${B?.u > 1 ? 's' : ''}`,
    'u-group': `10 unités = 1 dizaine — Regrouper`,
    'd-add':   `Ajouter les ${B?.d} dizaine${B?.d > 1 ? 's' : ''}`,
    'd-group': `10 dizaines = 1 centaine — Regrouper`,
    'c-add':   `Ajouter les ${B?.c} centaine${B?.c > 1 ? 's' : ''}`,
    'done':    null,
  }

  const phaseAction = {
    'u-add':   addU,
    'u-group': groupU,
    'd-add':   addD,
    'd-group': groupD,
    'c-add':   addC,
  }

  // Blocs "à ajouter" (contour pointillé) selon la phase
  const addBlocs = {
    u: phase === 'u-add' ? B?.u ?? 0 : 0,
    d: phase === 'd-add' ? B?.d ?? 0 : 0,
    c: phase === 'c-add' ? B?.c ?? 0 : 0,
  }

  // Blocs excédentaires (>= 10, à regrouper)
  const dimU = phase === 'u-group' ? 10 : 0
  const dimD = phase === 'd-group' ? 10 : 0

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Saisie */}
      <div className="flex gap-4 items-end flex-wrap justify-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-gray-500">Premier nombre</span>
          <input type="number" min="0" max="999" value={numA} onChange={e => setNumA(e.target.value)}
            className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
        </div>
        <span className="text-4xl font-black text-gray-400 pb-2">+</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-gray-500">Deuxième nombre</span>
          <input type="number" min="0" max="999" value={numB} onChange={e => setNumB(e.target.value)}
            className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
        </div>
      </div>

      {valid && (
        <>
          {/* Zone de travail — blocs courants */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-3xl">
            <div className="text-center text-sm font-semibold text-gray-400 mb-3">
              {phase === 'init' ? `${av} + ${bv}` : `Résultat en construction : ${wk.c*100 + wk.d*10 + wk.u}`}
            </div>
            <div className="flex gap-8 justify-center items-end flex-wrap">
              <BlockZone count={phase === 'init' ? A.c : wk.c} BlockComp={CentaineBlock} label="C" color={CC.side}
                dimLast={0} addCount={phase === 'init' ? B.c : addBlocs.c}/>
              <div className="w-px bg-gray-200 self-stretch"/>
              <BlockZone count={phase === 'init' ? A.d : wk.d} BlockComp={DizaineBlock} label="D" color={DC.side}
                dimLast={dimD} addCount={phase === 'init' ? B.d : addBlocs.d}/>
              <div className="w-px bg-gray-200 self-stretch"/>
              <BlockZone count={phase === 'init' ? A.u : wk.u} BlockComp={UniteBlock} label="U" color={UC.side}
                dimLast={dimU} addCount={phase === 'init' ? B.u : addBlocs.u}/>
            </div>
          </div>

          {/* Explication de la phase */}
          {phase !== 'init' && phase !== 'done' && (
            <div className={`w-full max-w-md rounded-xl px-5 py-3 text-center font-bold text-lg border-2 ${
              phase.includes('group')
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}>
              {phaseLabel[phase]}
              {phase === 'u-group' && ` (tu as ${wk.u} unités)`}
              {phase === 'd-group' && ` (tu as ${wk.d} dizaines)`}
            </div>
          )}

          {phase === 'done' && (
            <div className="w-full max-w-md rounded-xl px-5 py-4 text-center bg-green-50 border-2 border-green-300">
              <span className="text-2xl font-black text-green-700">{av} + {bv} = {wk.c*100 + wk.d*10 + wk.u}</span>
            </div>
          )}

          {/* Bouton d'action */}
          <div className="flex gap-3 flex-wrap justify-center">
            {phase === 'init' && (
              <button onClick={start}
                className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold" style={{ minHeight:'var(--touch-target)' }}>
                Commencer par les Unités
              </button>
            )}
            {phase !== 'init' && phase !== 'done' && (
              <button onClick={phaseAction[phase]}
                className={`text-white px-10 py-4 rounded-2xl text-xl font-bold ${phase.includes('group') ? 'bg-amber-500' : 'bg-plai-teal'}`}
                style={{ minHeight:'var(--touch-target)' }}>
                {phase.includes('group') ? 'Regrouper →' : 'Ajouter →'}
              </button>
            )}
            {phase !== 'init' && (
              <button onClick={() => { setPhase('init'); setWk({c:0,d:0,u:0}) }}
                className="border-2 border-gray-300 text-gray-500 px-6 py-4 rounded-2xl text-lg font-semibold" style={{ minHeight:'var(--touch-target)' }}>
                ↺
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// ONGLET SOUSTRACTION avec blocs
// ============================================================
function SubTab() {
  const [numA, setNumA] = useState('')
  const [numB, setNumB] = useState('')

  const [wk, setWk]     = useState({ c:0, d:0, u:0 })
  // Étapes : 'init'|'u-check'|'u-convert'|'u-sub'|'d-check'|'d-convert'|'d-sub'|'c-sub'|'done'
  const [phase, setPhase] = useState('init')

  const av = parseInt(numA, 10), bv = parseInt(numB, 10)
  const valid = !isNaN(av) && !isNaN(bv) && av >= 0 && av <= 999 && bv >= 0 && bv <= 999 && av >= bv
  const A = valid ? decompose(av) : null
  const B = valid ? decompose(bv) : null

  useEffect(() => { setPhase('init'); setWk({c:0,d:0,u:0}) }, [numA, numB])

  function start() {
    const init = { c: A.c, d: A.d, u: A.u }
    setWk(init)
    // Vérifie si conversion nécessaire aux unités
    setPhase(init.u >= B.u ? 'u-sub' : 'u-convert')
  }

  function convertDtoU() {
    setWk(w => ({ ...w, d: w.d - 1, u: w.u + 10 }))
    setPhase('u-sub')
  }

  function subU() {
    const next = { ...wk, u: wk.u - B.u }
    setWk(next)
    setPhase(next.d >= B.d ? 'd-sub' : 'd-convert')
  }

  function convertCtoD() {
    setWk(w => ({ ...w, c: w.c - 1, d: w.d + 10 }))
    setPhase('d-sub')
  }

  function subD() {
    const next = { ...wk, d: wk.d - B.d }
    setWk(next)
    setPhase('c-sub')
  }

  function subC() {
    setWk(w => ({ ...w, c: w.c - B.c }))
    setPhase('done')
  }

  // Blocs estompés = blocs "à retirer" selon la phase
  const dimU = phase === 'u-sub' ? B.u : 0
  const dimD = phase === 'd-sub' ? B.d : 0
  const dimC = phase === 'c-sub' ? B.c : 0

  // Blocs "convertis" mis en évidence
  const isConvertU = phase === 'u-convert'
  const isConvertD = phase === 'd-convert'

  const phaseInfo = {
    'u-convert': { label: `Pas assez d'unités (${wk.u} < ${B?.u}) — convertir 1 dizaine en 10 unités`, color:'amber', action: convertDtoU, btn:'Convertir 1D → 10U' },
    'u-sub':     { label: `Retirer ${B?.u} unité${B?.u > 1?'s':''}`, color:'teal', action: subU, btn:`Enlever ${B?.u} unité${B?.u > 1?'s':''}` },
    'd-convert': { label: `Pas assez de dizaines (${wk.d} < ${B?.d}) — convertir 1 centaine en 10 dizaines`, color:'amber', action: convertCtoD, btn:'Convertir 1C → 10D' },
    'd-sub':     { label: `Retirer ${B?.d} dizaine${B?.d > 1?'s':''}`, color:'teal', action: subD, btn:`Enlever ${B?.d} dizaine${B?.d > 1?'s':''}` },
    'c-sub':     { label: `Retirer ${B?.c} centaine${B?.c > 1?'s':''}`, color:'teal', action: subC, btn:`Enlever ${B?.c} centaine${B?.c > 1?'s':''}` },
  }
  const info = phaseInfo[phase]

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Saisie */}
      <div className="flex gap-4 items-end flex-wrap justify-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-gray-500">Premier nombre</span>
          <input type="number" min="0" max="999" value={numA} onChange={e => setNumA(e.target.value)}
            className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
        </div>
        <span className="text-4xl font-black text-gray-400 pb-2">−</span>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold text-gray-500">Deuxième nombre</span>
          <input type="number" min="0" max="999" value={numB} onChange={e => setNumB(e.target.value)}
            className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
        </div>
      </div>

      {!isNaN(av) && !isNaN(bv) && av < bv && (
        <p className="text-red-500 font-semibold">Le premier nombre doit être ≥ au second.</p>
      )}

      {valid && (
        <>
          {/* Zone blocs */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-3xl">
            <div className="text-center text-sm font-semibold text-gray-400 mb-3">
              {phase === 'init' ? `${av} − ${bv}` : `Reste : ${wk.c*100 + wk.d*10 + wk.u}`}
            </div>
            <div className="flex gap-8 justify-center items-end flex-wrap">
              <BlockZone count={phase === 'init' ? A.c : wk.c} BlockComp={CentaineBlock} label="C" color={CC.side}
                dimLast={phase === 'init' ? 0 : dimC}/>
              <div className="w-px bg-gray-200 self-stretch"/>
              <BlockZone count={phase === 'init' ? A.d : wk.d} BlockComp={DizaineBlock}  label="D" color={DC.side}
                dimLast={phase === 'init' ? 0 : (isConvertU ? 1 : dimD)}/>
              <div className="w-px bg-gray-200 self-stretch"/>
              <BlockZone count={phase === 'init' ? A.u : wk.u} BlockComp={UniteBlock}    label="U" color={UC.side}
                dimLast={phase === 'init' ? 0 : dimU}/>
            </div>
          </div>

          {/* Message phase */}
          {info && (
            <div className={`w-full max-w-lg rounded-xl px-5 py-3 text-center font-bold text-lg border-2 ${
              info.color === 'amber'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}>
              {info.label}
            </div>
          )}

          {phase === 'done' && (
            <div className="w-full max-w-md rounded-xl px-5 py-4 text-center bg-green-50 border-2 border-green-300">
              <span className="text-2xl font-black text-green-700">{av} − {bv} = {wk.c*100 + wk.d*10 + wk.u}</span>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 flex-wrap justify-center">
            {phase === 'init' && (
              <button onClick={start}
                className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold" style={{ minHeight:'var(--touch-target)' }}>
                Commencer par les Unités
              </button>
            )}
            {info && (
              <button onClick={info.action}
                className={`text-white px-10 py-4 rounded-2xl text-xl font-bold ${info.color === 'amber' ? 'bg-amber-500' : 'bg-plai-teal'}`}
                style={{ minHeight:'var(--touch-target)' }}>
                {info.btn}
              </button>
            )}
            {phase !== 'init' && (
              <button onClick={() => { setPhase('init'); setWk({c:0,d:0,u:0}) }}
                className="border-2 border-gray-300 text-gray-500 px-6 py-4 rounded-2xl text-lg font-semibold" style={{ minHeight:'var(--touch-target)' }}>
                ↺
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// ONGLET REPRÉSENTATION (inchangé)
// ============================================================
function ReprTab() {
  const [reprMode, setReprMode] = useState('blocs-to-nombre')
  const [libre, setLibre] = useState(false)
  const [tC, setTC] = useState(0), [tD, setTD] = useState(0), [tU, setTU] = useState(0)
  const [targetNum, setTargetNum] = useState('')
  const [sC, setSC] = useState(0), [sD, setSD] = useState(0), [sU, setSU] = useState(0)
  const [studentAns, setStudentAns] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const maxBlocs = libre ? 19 : 9
  const teacherNum = tC*100 + tD*10 + tU
  const studentNum = sC*100 + sD*10 + sU
  const targetParsed = parseInt(targetNum, 10)
  const targetValid = !isNaN(targetParsed) && targetParsed >= 0 && targetParsed <= 999

  function resetRepr() { setFeedback(null); setRevealed(false); setStudentAns(''); setSC(0); setSD(0); setSU(0) }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-3 flex-wrap justify-center items-center">
        <div className="flex rounded-xl overflow-hidden border-2 border-gray-300">
          <button onClick={() => { setReprMode('blocs-to-nombre'); resetRepr() }}
            className={`px-5 py-3 font-semibold text-base ${reprMode==='blocs-to-nombre' ? 'bg-plai-teal text-white' : 'bg-white text-gray-500'}`}>
            Blocs → Nombre
          </button>
          <button onClick={() => { setReprMode('nombre-to-blocs'); resetRepr() }}
            className={`px-5 py-3 font-semibold text-base ${reprMode==='nombre-to-blocs' ? 'bg-plai-teal text-white' : 'bg-white text-gray-500'}`}>
            Nombre → Blocs
          </button>
        </div>
        <button onClick={() => setLibre(v => !v)}
          className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm ${libre ? 'bg-amber-100 border-amber-400 text-amber-800' : 'bg-white border-gray-300 text-gray-500'}`}>
          {libre ? 'Libre (max 19)' : 'Standard (max 9)'}
        </button>
      </div>

      {reprMode === 'blocs-to-nombre' && (
        <>
          <div className="flex gap-6 flex-wrap justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Counter value={tC} onChange={v => { setTC(v); resetRepr() }} max={maxBlocs} label="Centaines" color={CC.side}/>
            <Counter value={tD} onChange={v => { setTD(v); resetRepr() }} max={maxBlocs} label="Dizaines"  color={DC.side}/>
            <Counter value={tU} onChange={v => { setTU(v); resetRepr() }} max={maxBlocs} label="Unités"    color={UC.side}/>
            <div className="flex items-end">
              <button onClick={() => { setTC(0); setTD(0); setTU(0); resetRepr() }}
                className="px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-500 font-semibold text-sm" style={{ minHeight:48 }}>
                Effacer
              </button>
            </div>
          </div>
          <div className="flex gap-8 justify-center items-end flex-wrap bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-3xl">
            <BlockZone count={tC} BlockComp={CentaineBlock} label="C" color={CC.side}/>
            <div className="w-px bg-gray-200 self-stretch"/>
            <BlockZone count={tD} BlockComp={DizaineBlock}  label="D" color={DC.side}/>
            <div className="w-px bg-gray-200 self-stretch"/>
            <BlockZone count={tU} BlockComp={UniteBlock}    label="U" color={UC.side}/>
          </div>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <p className="text-gray-600 font-semibold text-lg">Quel est ce nombre ?</p>
            <input type="number" min="0" max="9999" value={studentAns}
              onChange={e => { setStudentAns(e.target.value); setFeedback(null) }}
              className="w-40 text-center text-4xl font-black border-4 rounded-2xl py-3 outline-none"
              style={{ borderColor: feedback==='correct' ? '#16a34a' : feedback==='wrong' ? '#dc2626' : '#e5e7eb' }}
              placeholder="?"/>
            {!revealed && (
              <button onClick={() => { const a=parseInt(studentAns,10); setFeedback(!isNaN(a)&&a===teacherNum?'correct':'wrong'); if(!isNaN(a)&&a===teacherNum) setRevealed(true) }}
                disabled={!studentAns}
                className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold disabled:opacity-40" style={{ minHeight:'var(--touch-target)' }}>
                Valider
              </button>
            )}
            {feedback==='correct' && <p className="text-2xl font-bold text-green-600">Bravo ! {teacherNum}</p>}
            {feedback==='wrong' && !revealed && (
              <div className="flex gap-3">
                <p className="text-xl font-bold text-red-500">Essaie encore…</p>
                <button onClick={() => setRevealed(true)} className="text-gray-400 text-sm underline self-center">voir</button>
              </div>
            )}
            {feedback==='wrong' && revealed && <p className="text-xl font-bold text-gray-600">Réponse : <span className="text-plai-teal">{teacherNum}</span></p>}
          </div>
        </>
      )}

      {reprMode === 'nombre-to-blocs' && (
        <>
          <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 font-semibold text-sm">Nombre à représenter (0–999)</p>
            <input type="number" min="0" max="999" value={targetNum} onChange={e => { setTargetNum(e.target.value); resetRepr() }}
              className="w-36 text-center text-3xl font-black border-4 border-plai-teal rounded-2xl py-3 outline-none" placeholder="?"/>
          </div>
          {targetValid && (
            <>
              <div className="flex gap-6 flex-wrap justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <Counter value={sC} onChange={v => { setSC(v); setFeedback(null) }} max={maxBlocs} label="Centaines" color={CC.side}/>
                <Counter value={sD} onChange={v => { setSD(v); setFeedback(null) }} max={maxBlocs} label="Dizaines"  color={DC.side}/>
                <Counter value={sU} onChange={v => { setSU(v); setFeedback(null) }} max={maxBlocs} label="Unités"    color={UC.side}/>
              </div>
              <div className="flex gap-8 justify-center items-end flex-wrap bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-3xl">
                <BlockZone count={sC} BlockComp={CentaineBlock} label="C" color={CC.side}/>
                <div className="w-px bg-gray-200 self-stretch"/>
                <BlockZone count={sD} BlockComp={DizaineBlock}  label="D" color={DC.side}/>
                <div className="w-px bg-gray-200 self-stretch"/>
                <BlockZone count={sU} BlockComp={UniteBlock}    label="U" color={UC.side}/>
              </div>
              <p className="text-3xl font-black text-gray-600">
                = <span className={studentNum===targetParsed ? 'text-green-600' : 'text-gray-400'}>{studentNum}</span>
              </p>
              {!revealed && (
                <button onClick={() => {
                  const t = decompose(targetParsed)
                  const ok = sC===t.c && sD===t.d && sU===t.u
                  setFeedback(ok?'correct':'wrong'); if(ok) setRevealed(true)
                }} className="bg-plai-teal text-white px-10 py-4 rounded-2xl text-xl font-bold" style={{ minHeight:'var(--touch-target)' }}>
                  Valider
                </button>
              )}
              {feedback==='correct' && <p className="text-2xl font-bold text-green-600">Bravo !</p>}
              {feedback==='wrong' && !revealed && (
                <div className="flex gap-4 items-center">
                  <p className="text-xl font-bold text-red-500">Pas tout à fait…</p>
                  <button onClick={() => setRevealed(true)} className="text-gray-400 text-sm underline">voir</button>
                </div>
              )}
              {feedback==='wrong' && revealed && (() => { const t=decompose(targetParsed); return (
                <p className="text-lg font-semibold text-gray-600">
                  Il fallait : <span style={{color:CC.side}} className="font-black">{t.c} C</span> + <span style={{color:DC.side}} className="font-black">{t.d} D</span> + <span style={{color:UC.side}} className="font-black">{t.u} U</span>
                </p>
              )})()}
            </>
          )}
        </>
      )}
    </div>
  )
}

// ============================================================
// COMPOSANT RACINE
// ============================================================
export function CDU({ onBack, onEditClass }) {
  const [tab, setTab] = useState('repr')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack}/>
        <h2 className="text-xl font-bold text-plai-teal">Centaines · Dizaines · Unités</h2>
        <ClassButton onClick={onEditClass}/>
      </header>

      <div className="flex border-b bg-white">
        {[{ id:'repr', label:'Représentation' }, { id:'add', label:'Addition' }, { id:'sub', label:'Soustraction' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 font-semibold text-base border-b-4 transition-colors ${tab===t.id ? 'border-plai-teal text-plai-teal' : 'border-transparent text-gray-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center gap-5 p-5 overflow-auto">
        {tab === 'repr' && <ReprTab/>}
        {tab === 'add'  && <AddTab/>}
        {tab === 'sub'  && <SubTab/>}
      </main>
    </div>
  )
}
