import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

const SIZES = [
  { label: '1–50', max: 50 },
  { label: '1–100', max: 100 },
  { label: '1–200', max: 200 },
]

const AMIS_TARGETS = [
  { id: 'amis10',  target: 10,  label: 'Amis de 10' },
  { id: 'amis20',  target: 20,  label: 'Amis de 20' },
  { id: 'amis100', target: 100, label: 'Amis de 100' },
]

const COLORS = [
  '#0a9370', '#f97316', '#3b82f6', '#a855f7',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
  '#ef4444', '#84cc16',
]

// Retourne un tableau trié des paires [a, b] avec a < b
function buildPairsList(target, max) {
  const pairs = []
  for (let a = 1; a < target; a++) {
    const b = target - a
    if (b > a && b <= max) pairs.push([a, b])
  }
  if (target % 2 === 0 && target / 2 <= max) {
    const half = target / 2
    if (!pairs.some(([a]) => a === half)) pairs.push([half, half])
  }
  return pairs
}

// Map n → { color, pairIdx } pour l'affichage auto
function buildFriendsMap(target, max) {
  const pairs = buildPairsList(target, max)
  const map = new Map()
  pairs.forEach(([a, b], i) => {
    const color = COLORS[i % COLORS.length]
    map.set(a, { color, pairIdx: i })
    if (b !== a) map.set(b, { color, pairIdx: i })
    else map.set(a, { color, pairIdx: i })
  })
  return map
}

function buildMultiples(n, max) {
  const set = new Set()
  for (let i = n; i <= max; i += n) set.add(i)
  return set
}

export function NumberGrid({ onBack, onEditClass }) {
  const { isDyslexia } = useClass()
  const [max, setMax]               = useState(100)
  const [highlighted, setHighlighted] = useState(new Set())   // mode manuel
  const [autoMode, setAutoMode]     = useState(null)          // null | 'amis10' | 'amis20' | 'amis100'
  const [multiple, setMultiple]     = useState('')
  const [hoveredRow, setHoveredRow] = useState(null)

  // Mode amis interactif
  const [interactif, setInteractif] = useState(false)         // false = afficher tout, true = mode élève
  const [showPartner, setShowPartner] = useState(true)        // option enseignant : montrer l'ami au clic
  const [revealedAmis, setRevealedAmis] = useState(new Set()) // nombres révélés en mode interactif
  // Feedback erreur : numéro en rouge temporaire
  const [wrongNum, setWrongNum]     = useState(null)
  // Premier clic d'une paire (mode !showPartner)
  const [firstClick, setFirstClick] = useState(null)

  const cols = 10
  const numbers = Array.from({ length: max }, (_, i) => i + 1)
  const rows = []
  for (let i = 0; i < numbers.length; i += cols) rows.push(numbers.slice(i, i + cols))

  // Cible amis courante
  const amiEntry = AMIS_TARGETS.find(a => a.id === autoMode)
  const friendsTarget = amiEntry?.target ?? null
  const friendsMap    = friendsTarget ? buildFriendsMap(friendsTarget, max) : null
  const multiplesSet  = multiple && !isNaN(multiple) && Number(multiple) > 0
    ? buildMultiples(Number(multiple), max)
    : null

  // --- Handlers ---
  function handleAutoMode(id) {
    setAutoMode(id)
    setMultiple('')
    setHighlighted(new Set())
    setRevealedAmis(new Set())
    setFirstClick(null)
    setWrongNum(null)
  }

  function handleMultipleInput(val) {
    setMultiple(val)
    setAutoMode(null)
    setHighlighted(new Set())
    setRevealedAmis(new Set())
    setFirstClick(null)
  }

  function handleClear() {
    setHighlighted(new Set())
    setAutoMode(null)
    setMultiple('')
    setRevealedAmis(new Set())
    setFirstClick(null)
    setWrongNum(null)
  }

  function handleSizeChange(newMax) {
    setMax(newMax)
    setHighlighted(new Set())
    setAutoMode(null)
    setMultiple('')
    setRevealedAmis(new Set())
    setFirstClick(null)
  }

  function toggleInteractif() {
    setInteractif(v => !v)
    setRevealedAmis(new Set())
    setFirstClick(null)
    setWrongNum(null)
  }

  // Clic sur une cellule
  function handleCellClick(n) {
    // Mode amis interactif
    if (autoMode && friendsMap && interactif) {
      if (!friendsMap.has(n)) return  // pas dans la grille amis
      const partner = friendsTarget - n

      if (showPartner) {
        // Option activée : révèle les deux d'un coup
        setRevealedAmis(prev => {
          const next = new Set(prev)
          if (next.has(n) && (partner === n || next.has(partner))) {
            next.delete(n)
            if (partner !== n) next.delete(partner)
          } else {
            next.add(n)
            if (partner >= 1 && partner <= max && partner !== n) next.add(partner)
          }
          return next
        })
      } else {
        // Mode découverte : l'élève doit cliquer les deux
        if (firstClick === null) {
          setFirstClick(n)
          setRevealedAmis(prev => new Set([...prev, n]))
        } else if (firstClick === n) {
          // Dé-sélectionne
          setFirstClick(null)
          setRevealedAmis(prev => { const s = new Set(prev); s.delete(n); return s })
        } else if (firstClick + n === friendsTarget || (partner === firstClick)) {
          // Bonne réponse !
          setRevealedAmis(prev => new Set([...prev, n]))
          setFirstClick(null)
        } else {
          // Mauvaise réponse
          setWrongNum(n)
          setTimeout(() => setWrongNum(null), 600)
        }
      }
      return
    }

    // Mode auto (afficher tout) ou multiples → pas de clic
    if (autoMode || multiplesSet) return

    // Mode manuel
    setHighlighted(prev => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  function getCellStyle(n) {
    // Mode amis interactif
    if (autoMode && friendsMap && interactif) {
      if (wrongNum === n) return { background: '#ef4444', color: 'white', borderColor: 'transparent' }
      if (firstClick === n) return { background: '#fbbf24', color: 'white', borderColor: 'transparent' }
      if (revealedAmis.has(n)) {
        const info = friendsMap.get(n)
        return { background: info?.color ?? '#0a9370', color: 'white', borderColor: 'transparent' }
      }
      return {}
    }
    // Mode amis auto (afficher tout)
    if (friendsMap && !interactif && friendsMap.has(n)) {
      return { background: friendsMap.get(n).color, color: 'white', borderColor: 'transparent' }
    }
    // Multiples
    if (multiplesSet && multiplesSet.has(n)) {
      return { background: '#f97316', color: 'white', borderColor: 'transparent' }
    }
    // Manuel
    if (highlighted.has(n)) {
      return { background: '#0a9370', color: 'white', borderColor: 'transparent' }
    }
    return {}
  }

  const isActive = (n) => !!(
    (friendsMap && !interactif && friendsMap.has(n)) ||
    (friendsMap && interactif && revealedAmis.has(n)) ||
    (multiplesSet && multiplesSet.has(n)) ||
    highlighted.has(n)
  )

  const cellPx = max <= 50 ? 56 : max <= 100 ? 48 : 36
  const fontPx = max <= 50 ? 18 : max <= 100 ? 15 : 12
  const isAmiMode = !!autoMode && !!friendsMap

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Grille de nombres</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center gap-4 p-4 overflow-auto">

        {/* Taille + Effacer */}
        <div className="flex gap-2 flex-wrap justify-center">
          {SIZES.map((s) => (
            <button key={s.max} onClick={() => handleSizeChange(s.max)}
              className={`px-4 py-2 rounded-lg border-2 font-semibold text-base ${
                max === s.max ? 'bg-plai-teal text-white border-plai-teal' : 'bg-white border-gray-300 text-gray-600'
              }`} style={{ minHeight: '48px' }}>
              {s.label}
            </button>
          ))}
          <button onClick={handleClear}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-600 font-semibold text-base"
            style={{ minHeight: '48px' }}>
            Effacer
          </button>
        </div>

        {/* Modes amis + multiples */}
        <div className="flex gap-2 flex-wrap justify-center">
          {AMIS_TARGETS.map((m) => (
            <button key={m.id} onClick={() => handleAutoMode(m.id)}
              className={`px-4 py-2 rounded-lg border-2 font-semibold text-base ${
                autoMode === m.id ? 'bg-plai-orange text-white border-plai-orange' : 'bg-white border-gray-300 text-gray-600'
              }`} style={{ minHeight: '48px' }}>
              {m.label}
            </button>
          ))}
          <div className="flex items-center gap-1">
            <span className="text-gray-600 font-semibold text-base">Multiples de</span>
            <input type="number" min="2" max="20" value={multiple}
              onChange={(e) => handleMultipleInput(e.target.value)}
              className={`w-16 border-2 rounded-lg text-center text-base font-bold py-1 ${
                multiplesSet ? 'border-plai-orange bg-orange-50' : 'border-gray-300'
              }`} style={{ minHeight: '48px' }} placeholder="?" />
          </div>
        </div>

        {/* Options mode amis */}
        {isAmiMode && (
          <div className="flex gap-3 flex-wrap justify-center items-center bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
            {/* Toggle interactif / afficher tout */}
            <button onClick={toggleInteractif}
              className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm ${
                interactif ? 'bg-plai-teal text-white border-plai-teal' : 'bg-white border-gray-300 text-gray-600'
              }`} style={{ minHeight: '44px' }}>
              {interactif ? 'Mode élève actif' : 'Afficher tout'}
            </button>

            {/* Toggle montrer l'ami (visible seulement en mode interactif) */}
            {interactif && (
              <button onClick={() => setShowPartner(v => !v)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm ${
                  showPartner ? 'bg-plai-orange text-white border-plai-orange' : 'bg-white border-gray-300 text-gray-600'
                }`} style={{ minHeight: '44px' }}>
                {showPartner ? 'Montrer l\'ami ✓' : 'Trouver l\'ami'}
              </button>
            )}

            {/* Indication du mode actif */}
            {interactif && (
              <span className="text-sm text-gray-500 italic">
                {showPartner
                  ? 'Clic → les deux amis s\'allument'
                  : firstClick ? `${firstClick} sélectionné — clique l'ami !` : 'Clique un nombre pour commencer'}
              </span>
            )}
          </div>
        )}

        {/* Grille */}
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}
                  onMouseEnter={() => isDyslexia && setHoveredRow(ri)}
                  onMouseLeave={() => isDyslexia && setHoveredRow(null)}>
                  {row.map((n) => {
                    const style = getCellStyle(n)
                    const isClickable = isAmiMode && interactif && friendsMap.has(n)
                    return (
                      <td key={n} style={{ padding: 3 }}>
                        <button onClick={() => handleCellClick(n)}
                          style={{
                            width: cellPx, height: cellPx, fontSize: fontPx,
                            fontWeight: 700, borderRadius: 8, border: '2px solid',
                            borderColor: '#d1d5db',
                            background: isDyslexia && hoveredRow === ri && !isActive(n)
                              ? '#fef9c3'
                              : isActive(n) ? undefined : '#ffffff',
                            cursor: isClickable ? 'pointer' : (autoMode || multiplesSet) ? 'default' : 'pointer',
                            transition: 'background 0.15s',
                            outline: firstClick === n ? '3px solid #fbbf24' : 'none',
                            ...style,
                          }}>
                          {n}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende amis (mode auto) */}
        {friendsMap && !interactif && (
          <div className="flex gap-3 flex-wrap justify-center max-w-lg">
            {(() => {
              const pairs = buildPairsList(friendsTarget, max)
              return pairs.map(([a, b], i) => (
                <span key={a} className="px-3 py-1 rounded-full text-white text-sm font-bold"
                  style={{ background: COLORS[i % COLORS.length] }}>
                  {a} + {b} = {friendsTarget}
                </span>
              ))
            })()}
          </div>
        )}

      </main>
    </div>
  )
}
