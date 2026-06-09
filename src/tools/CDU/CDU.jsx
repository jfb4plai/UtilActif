import { useState } from 'react'
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

// --- Blocs SVG ---
function CentaineBlock() {
  const W = S_C + DEP_C, H = S_C + DEP_C
  const lines = []
  for (let i = 0; i <= 10; i++) {
    const v = i * CELL
    lines.push(
      <line key={`h${i}`} x1={0} y1={DEP_C+v} x2={S_C} y2={DEP_C+v} stroke={CC.grid} strokeWidth={0.7} opacity={0.55}/>,
      <line key={`v${i}`} x1={v} y1={DEP_C} x2={v} y2={DEP_C+S_C} stroke={CC.grid} strokeWidth={0.7} opacity={0.55}/>
    )
  }
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0 }}>
      <polygon points={`${S_C},${DEP_C} ${W},0 ${W},${S_C} ${S_C},${H}`} fill={CC.side}/>
      <polygon points={`0,${DEP_C} ${DEP_C},0 ${W},0 ${S_C},${DEP_C}`} fill={CC.top}/>
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill={CC.front}/>
      {lines}
      <rect x={0} y={DEP_C} width={S_C} height={S_C} fill="none" stroke={CC.side} strokeWidth={1.5}/>
    </svg>
  )
}

function DizaineBlock() {
  const W = S_D + DEP_D, H = H_D + DEP_D
  const lines = []
  for (let i = 0; i <= 10; i++) {
    lines.push(<line key={i} x1={0} y1={DEP_D+i*CELL} x2={S_D} y2={DEP_D+i*CELL} stroke={DC.grid} strokeWidth={0.7} opacity={0.55}/>)
  }
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0 }}>
      <polygon points={`${S_D},${DEP_D} ${W},0 ${W},${H_D} ${S_D},${H}`} fill={DC.side}/>
      <polygon points={`0,${DEP_D} ${DEP_D},0 ${W},0 ${S_D},${DEP_D}`} fill={DC.top}/>
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill={DC.front}/>
      {lines}
      <rect x={0} y={DEP_D} width={S_D} height={H_D} fill="none" stroke={DC.side} strokeWidth={1.5}/>
    </svg>
  )
}

function UniteBlock() {
  const W = S_U + DEP_U, H = S_U + DEP_U
  return (
    <svg width={W} height={H} style={{ display:'block', flexShrink:0 }}>
      <polygon points={`${S_U},${DEP_U} ${W},0 ${W},${S_U} ${S_U},${H}`} fill={UC.side}/>
      <polygon points={`0,${DEP_U} ${DEP_U},0 ${W},0 ${S_U},${DEP_U}`} fill={UC.top}/>
      <rect x={0} y={DEP_U} width={S_U} height={S_U} fill={UC.front} stroke={UC.side} strokeWidth={1.5}/>
    </svg>
  )
}

// --- Zone blocs ---
function BlockZone({ count, BlockComp, label, color, depH }) {
  const zoneH = (BlockComp === CentaineBlock ? S_C + DEP_C : H_D + DEP_D) + 10
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap gap-1 items-end justify-center" style={{ minWidth:50, minHeight:zoneH }}>
        {Array.from({ length: count }, (_, i) => <BlockComp key={i}/>)}
        {count === 0 && <div style={{ width:36, height:36, opacity:0.2, border:`2px dashed ${color}`, borderRadius:8 }}/>}
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

// --- Calcul des étapes addition ---
function computeAdditionSteps(a, b) {
  const aU = a % 10, aD = Math.floor(a/10) % 10, aC = Math.floor(a/100)
  const bU = b % 10, bD = Math.floor(b/10) % 10, bC = Math.floor(b/100)
  const steps = []

  // Unités
  const sumU = aU + bU
  const carryD = Math.floor(sumU / 10)
  const poseU = sumU % 10
  steps.push({ col:'U', a:aU, b:bU, carry:0, sum:sumU, pose:poseU, nextCarry:carryD })

  // Dizaines
  const sumD = aD + bD + carryD
  const carryC = Math.floor(sumD / 10)
  const poseD = sumD % 10
  steps.push({ col:'D', a:aD, b:bD, carry:carryD, sum:sumD, pose:poseD, nextCarry:carryC })

  // Centaines
  const sumC = aC + bC + carryC
  const carryM = Math.floor(sumC / 10)
  const poseC = sumC % 10
  steps.push({ col:'C', a:aC, b:bC, carry:carryC, sum:sumC, pose:poseC, nextCarry:carryM })

  const result = a + b
  return { steps, result, overflow: carryM > 0, millier: carryM }
}

// --- Calcul des étapes soustraction ---
function computeSubtractionSteps(a, b) {
  // a >= b (vérifié avant appel)
  const aU = a % 10, aD = Math.floor(a/10) % 10, aC = Math.floor(a/100)
  const bU = b % 10, bD = Math.floor(b/10) % 10, bC = Math.floor(b/100)
  const steps = []
  let empD = 0, empC = 0  // emprunts

  // Unités
  const needEmpD = aU < bU ? 1 : 0
  const realAU = aU + needEmpD * 10
  steps.push({ col:'U', a:aU, b:bU, emprunt:needEmpD, realA:realAU, pose:realAU-bU })

  // Dizaines
  const realAD = aD - needEmpD  // on a prêté 1 à U
  const needEmpC = realAD < bD ? 1 : 0
  const realAD2 = realAD + needEmpC * 10
  steps.push({ col:'D', a:aD, b:bD, empruntDonne:needEmpD, emprunt:needEmpC, realA:realAD2, pose:realAD2-bD })

  // Centaines
  const realAC = aC - needEmpC
  steps.push({ col:'C', a:aC, b:bC, empruntDonne:needEmpC, emprunt:0, realA:realAC, pose:realAC-bC })

  return { steps, result: a - b }
}

// --- Affichage d'une étape addition ---
function AddStep({ step, colColor, show }) {
  if (!show) return null
  const { col, a, b, carry, sum, pose, nextCarry } = step
  return (
    <div className="flex flex-col gap-1 rounded-xl p-3 border-2" style={{ borderColor: colColor, background: colColor+'18', minWidth: 220 }}>
      <span className="font-bold text-base" style={{ color: colColor }}>Colonne des {col === 'C' ? 'centaines' : col === 'D' ? 'dizaines' : 'unités'}</span>
      <span className="text-sm text-gray-600">
        {a} + {b}{carry > 0 ? ` + ${carry} (retenu)` : ''} = <strong>{sum}</strong>
      </span>
      {nextCarry > 0
        ? <span className="text-sm font-semibold text-amber-700">On pose <strong>{pose}</strong>, on retient <strong>{nextCarry}</strong></span>
        : <span className="text-sm font-semibold text-green-700">On pose <strong>{pose}</strong></span>
      }
    </div>
  )
}

// --- Affichage d'une étape soustraction ---
function SubStep({ step, colColor, show }) {
  if (!show) return null
  const { col, a, b, empruntDonne, emprunt, realA, pose } = step
  return (
    <div className="flex flex-col gap-1 rounded-xl p-3 border-2" style={{ borderColor: colColor, background: colColor+'18', minWidth: 220 }}>
      <span className="font-bold text-base" style={{ color: colColor }}>Colonne des {col === 'C' ? 'centaines' : col === 'D' ? 'dizaines' : 'unités'}</span>
      {emprunt > 0 && <span className="text-sm text-amber-700 font-semibold">Emprunt : {a} devient {a}+10 = {realA}</span>}
      {empruntDonne > 0 && !emprunt && <span className="text-sm text-gray-500">({a} avait prêté 1 → on travaille avec {realA})</span>}
      {empruntDonne > 0 && emprunt > 0 && <span className="text-sm text-gray-500">({a} avait prêté 1 → réel {a-empruntDonne}, + emprunt → {realA})</span>}
      <span className="text-sm text-gray-600">
        {realA} − {b} = <strong>{pose}</strong>
      </span>
    </div>
  )
}

// ========== COMPOSANT PRINCIPAL ==========
export function CDU({ onBack, onEditClass }) {
  const [tab, setTab] = useState('repr')  // 'repr' | 'add' | 'sub'

  // --- Onglet Représentation ---
  const [reprMode, setReprMode] = useState('blocs-to-nombre')
  const [libre, setLibre] = useState(false)  // false = max 9, true = libre (jusqu'à 19)
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

  // --- Onglet Addition ---
  const [addA, setAddA] = useState('')
  const [addB, setAddB] = useState('')
  const [addStepShown, setAddStepShown] = useState(0)  // 0=rien, 1=U, 2=D, 3=C, 4=résultat
  const addAv = parseInt(addA, 10), addBv = parseInt(addB, 10)
  const addValid = !isNaN(addAv) && !isNaN(addBv) && addAv >= 0 && addAv <= 999 && addBv >= 0 && addBv <= 999
  const addCalc = addValid ? computeAdditionSteps(addAv, addBv) : null

  // --- Onglet Soustraction ---
  const [subA, setSubA] = useState('')
  const [subB, setSubB] = useState('')
  const [subStepShown, setSubStepShown] = useState(0)
  const subAv = parseInt(subA, 10), subBv = parseInt(subB, 10)
  const subValid = !isNaN(subAv) && !isNaN(subBv) && subAv >= 0 && subAv <= 999 && subBv >= 0 && subBv <= 999 && subAv >= subBv
  const subCalc = subValid ? computeSubtractionSteps(subAv, subBv) : null

  const COL_COLOR = { C: CC.side, D: DC.side, U: UC.side }

  // --- Rendu colonnes résultat (addition/soustraction) ---
  function ResultRow({ label, val, highlight }) {
    const digits = [Math.floor(val/100), Math.floor((val%100)/10), val%10]
    return (
      <div className="flex items-center gap-2">
        <span className="w-24 text-right font-semibold text-gray-500 text-sm">{label}</span>
        {digits.map((d, i) => (
          <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black border-2"
            style={{ borderColor: [CC.side, DC.side, UC.side][i], background: highlight ? [CC.side+'22', DC.side+'22', UC.side+'22'][i] : '#f9fafb', color: '#1f2937' }}>
            {d}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack}/>
        <h2 className="text-xl font-bold text-plai-teal">Centaines · Dizaines · Unités</h2>
        <ClassButton onClick={onEditClass}/>
      </header>

      {/* Onglets */}
      <div className="flex border-b bg-white">
        {[
          { id: 'repr', label: 'Représentation' },
          { id: 'add',  label: 'Addition' },
          { id: 'sub',  label: 'Soustraction' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 font-semibold text-base border-b-4 transition-colors ${
              tab === t.id ? 'border-plai-teal text-plai-teal' : 'border-transparent text-gray-400'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center gap-5 p-5 overflow-auto">

        {/* ===== ONGLET REPRÉSENTATION ===== */}
        {tab === 'repr' && (
          <>
            {/* Mode + option libre */}
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
              {/* Option libre/max 9 */}
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
                    <button onClick={() => { const ans=parseInt(studentAns,10); setFeedback(isNaN(ans)?'wrong':ans===teacherNum?'correct':'wrong'); setRevealed(ans===teacherNum) }}
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
                  {feedback==='wrong' && revealed && (
                    <p className="text-xl font-bold text-gray-600">Réponse : <span className="text-plai-teal">{teacherNum}</span></p>
                  )}
                </div>
              </>
            )}

            {reprMode === 'nombre-to-blocs' && (
              <>
                <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <p className="text-gray-500 font-semibold text-sm">Nombre à représenter (0–999)</p>
                  <input type="number" min="0" max="999" value={targetNum}
                    onChange={e => { setTargetNum(e.target.value); resetRepr() }}
                    className="w-36 text-center text-3xl font-black border-4 border-plai-teal rounded-2xl py-3 outline-none"
                    placeholder="?"/>
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
                        const tCt=Math.floor(targetParsed/100), tDt=Math.floor((targetParsed%100)/10), tUt=targetParsed%10
                        setFeedback(sC===tCt&&sD===tDt&&sU===tUt?'correct':'wrong')
                        setRevealed(sC===tCt&&sD===tDt&&sU===tUt)
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
                    {feedback==='wrong' && revealed && (
                      <p className="text-lg font-semibold text-gray-600">
                        Il fallait : <span style={{color:CC.side}} className="font-black">{Math.floor(targetParsed/100)} C</span> + <span style={{color:DC.side}} className="font-black">{Math.floor((targetParsed%100)/10)} D</span> + <span style={{color:UC.side}} className="font-black">{targetParsed%10} U</span>
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ===== ONGLET ADDITION ===== */}
        {tab === 'add' && (
          <>
            <div className="flex gap-4 items-end flex-wrap justify-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold text-gray-500">Premier nombre</span>
                <input type="number" min="0" max="999" value={addA} onChange={e => { setAddA(e.target.value); setAddStepShown(0) }}
                  className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
              </div>
              <span className="text-4xl font-black text-gray-400 pb-2">+</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold text-gray-500">Deuxième nombre</span>
                <input type="number" min="0" max="999" value={addB} onChange={e => { setAddB(e.target.value); setAddStepShown(0) }}
                  className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
              </div>
            </div>

            {addValid && (
              <>
                {/* Tableau colonnes C/D/U */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-24"/>
                    {['C','D','U'].map((l,i) => (
                      <div key={l} className="w-12 h-8 rounded flex items-center justify-center font-black text-base"
                        style={{ background:[CC.side+'22',DC.side+'22',UC.side+'22'][i], color:[CC.side,DC.side,UC.side][i] }}>{l}</div>
                    ))}
                  </div>
                  <ResultRow label={String(addAv)} val={addAv}/>
                  <div className="flex items-center gap-2 my-1">
                    <span className="w-24 text-right text-gray-400 font-semibold text-sm">+ {addBv}</span>
                    {[Math.floor(addBv/100),Math.floor((addBv%100)/10),addBv%10].map((d,i) => (
                      <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black border-2"
                        style={{ borderColor:[CC.side,DC.side,UC.side][i], background:[CC.side+'22',DC.side+'22',UC.side+'22'][i] }}>{d}</div>
                    ))}
                  </div>
                  <div className="border-t-2 border-gray-300 my-2"/>
                  {addStepShown >= 4 && <ResultRow label={`= ${addCalc.result}`} val={addCalc.result} highlight/>}
                  {addCalc.overflow && addStepShown >= 4 && (
                    <p className="text-sm font-semibold text-amber-700 mt-2">+ {addCalc.millier} millier(s) !</p>
                  )}
                </div>

                {/* Étapes */}
                <div className="flex flex-col gap-3 w-full max-w-md">
                  {addCalc.steps.map((s, i) => (
                    <AddStep key={s.col} step={s} colColor={COL_COLOR[s.col]} show={addStepShown > i}/>
                  ))}
                </div>

                {/* Boutons navigation */}
                <div className="flex gap-3 flex-wrap justify-center">
                  {addStepShown === 0 && (
                    <button onClick={() => setAddStepShown(1)}
                      className="bg-plai-teal text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Commencer — Unités
                    </button>
                  )}
                  {addStepShown >= 1 && addStepShown < 3 && (
                    <button onClick={() => setAddStepShown(v => v+1)}
                      className="bg-plai-orange text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Étape suivante →
                    </button>
                  )}
                  {addStepShown === 3 && (
                    <button onClick={() => setAddStepShown(4)}
                      className="bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Voir le résultat
                    </button>
                  )}
                  {addStepShown > 0 && (
                    <button onClick={() => setAddStepShown(0)}
                      className="border-2 border-gray-300 text-gray-500 px-6 py-4 rounded-2xl text-lg font-semibold" style={{ minHeight:'var(--touch-target)' }}>
                      Recommencer
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* ===== ONGLET SOUSTRACTION ===== */}
        {tab === 'sub' && (
          <>
            <div className="flex gap-4 items-end flex-wrap justify-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold text-gray-500">Premier nombre</span>
                <input type="number" min="0" max="999" value={subA} onChange={e => { setSubA(e.target.value); setSubStepShown(0) }}
                  className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
              </div>
              <span className="text-4xl font-black text-gray-400 pb-2">−</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-semibold text-gray-500">Deuxième nombre</span>
                <input type="number" min="0" max="999" value={subB} onChange={e => { setSubB(e.target.value); setSubStepShown(0) }}
                  className="w-28 text-center text-3xl font-black border-4 border-plai-teal rounded-xl py-2 outline-none" placeholder="?"/>
              </div>
            </div>

            {!subValid && subA && subB && !isNaN(subAv) && !isNaN(subBv) && subAv < subBv && (
              <p className="text-red-500 font-semibold">Le premier nombre doit être ≥ au second.</p>
            )}

            {subValid && (
              <>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-24"/>
                    {['C','D','U'].map((l,i) => (
                      <div key={l} className="w-12 h-8 rounded flex items-center justify-center font-black text-base"
                        style={{ background:[CC.side+'22',DC.side+'22',UC.side+'22'][i], color:[CC.side,DC.side,UC.side][i] }}>{l}</div>
                    ))}
                  </div>
                  <ResultRow label={String(subAv)} val={subAv}/>
                  <div className="flex items-center gap-2 my-1">
                    <span className="w-24 text-right text-gray-400 font-semibold text-sm">− {subBv}</span>
                    {[Math.floor(subBv/100),Math.floor((subBv%100)/10),subBv%10].map((d,i) => (
                      <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-black border-2"
                        style={{ borderColor:[CC.side,DC.side,UC.side][i], background:[CC.side+'22',DC.side+'22',UC.side+'22'][i] }}>{d}</div>
                    ))}
                  </div>
                  <div className="border-t-2 border-gray-300 my-2"/>
                  {subStepShown >= 4 && <ResultRow label={`= ${subCalc.result}`} val={subCalc.result} highlight/>}
                </div>

                <div className="flex flex-col gap-3 w-full max-w-md">
                  {subCalc.steps.map((s, i) => (
                    <SubStep key={s.col} step={s} colColor={COL_COLOR[s.col]} show={subStepShown > i}/>
                  ))}
                </div>

                <div className="flex gap-3 flex-wrap justify-center">
                  {subStepShown === 0 && (
                    <button onClick={() => setSubStepShown(1)}
                      className="bg-plai-teal text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Commencer — Unités
                    </button>
                  )}
                  {subStepShown >= 1 && subStepShown < 3 && (
                    <button onClick={() => setSubStepShown(v => v+1)}
                      className="bg-plai-orange text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Étape suivante →
                    </button>
                  )}
                  {subStepShown === 3 && (
                    <button onClick={() => setSubStepShown(4)}
                      className="bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold" style={{ minHeight:'var(--touch-target)' }}>
                      Voir le résultat
                    </button>
                  )}
                  {subStepShown > 0 && (
                    <button onClick={() => setSubStepShown(0)}
                      className="border-2 border-gray-300 text-gray-500 px-6 py-4 rounded-2xl text-lg font-semibold" style={{ minHeight:'var(--touch-target)' }}>
                      Recommencer
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

      </main>
    </div>
  )
}
