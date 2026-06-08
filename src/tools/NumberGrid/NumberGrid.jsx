import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

const SIZES = [
  { label: '1–50', max: 50 },
  { label: '1–100', max: 100 },
  { label: '1–200', max: 200 },
]

// Modes de mise en évidence automatique
const AUTO_MODES = [
  { id: null,       label: 'Manuel' },
  { id: 'amis10',  label: 'Amis de 10' },
  { id: 'amis20',  label: 'Amis de 20' },
  { id: 'amis100', label: 'Amis de 100' },
]

// Retourne les paires d'amis sous forme de Map n → couleur-groupe
function buildFriendsPairs(target, max) {
  const colors = [
    '#0a9370', '#f97316', '#3b82f6', '#a855f7',
    '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
    '#ef4444', '#84cc16',
  ]
  const map = new Map()
  let colorIdx = 0
  for (let a = 1; a < target; a++) {
    const b = target - a
    if (b > a && b <= max) {
      const color = colors[colorIdx % colors.length]
      map.set(a, color)
      map.set(b, color)
      colorIdx++
    }
  }
  // Cas spécial : target lui-même (ex. 10 + 0 n'existe pas, mais 20 → 10+10)
  if (target / 2 === Math.floor(target / 2) && target / 2 <= max) {
    const half = target / 2
    if (!map.has(half)) {
      map.set(half, colors[colorIdx % colors.length])
    }
  }
  return map
}

function buildMultiples(n, max) {
  const set = new Set()
  for (let i = n; i <= max; i += n) set.add(i)
  return set
}

export function NumberGrid({ onBack, onEditClass }) {
  const { isDyslexia } = useClass()
  const [max, setMax]           = useState(100)
  const [highlighted, setHighlighted] = useState(new Set())
  const [autoMode, setAutoMode] = useState(null)      // null | 'amis10' | 'amis20' | 'amis100'
  const [multiple, setMultiple] = useState('')        // chiffre saisi pour multiples
  const [hoveredRow, setHoveredRow] = useState(null)

  const cols = 10
  const numbers = Array.from({ length: max }, (_, i) => i + 1)
  const rows = []
  for (let i = 0; i < numbers.length; i += cols) {
    rows.push(numbers.slice(i, i + cols))
  }

  // Calcul des highlights automatiques
  const friendsTarget = autoMode === 'amis10' ? 10 : autoMode === 'amis20' ? 20 : autoMode === 'amis100' ? 100 : null
  const friendsMap    = friendsTarget ? buildFriendsPairs(friendsTarget, max) : null
  const multiplesSet  = multiple && !isNaN(multiple) && Number(multiple) > 0
    ? buildMultiples(Number(multiple), max)
    : null

  function toggleCell(n) {
    if (autoMode || multiplesSet) return   // en mode auto, pas de toggle manuel
    setHighlighted((prev) => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  function handleAutoMode(id) {
    setAutoMode(id)
    setMultiple('')
    setHighlighted(new Set())
  }

  function handleMultipleInput(val) {
    setMultiple(val)
    setAutoMode(null)
    setHighlighted(new Set())
  }

  function handleClear() {
    setHighlighted(new Set())
    setAutoMode(null)
    setMultiple('')
  }

  function handleSizeChange(newMax) {
    setMax(newMax)
    setHighlighted(new Set())
    setAutoMode(null)
    setMultiple('')
  }

  // Taille des cellules : plus grande pour 50/100, petite pour 200
  const cellPx = max <= 50 ? 56 : max <= 100 ? 48 : 36
  const fontPx = max <= 50 ? 18 : max <= 100 ? 15 : 12

  function getCellStyle(n) {
    // Amis de X
    if (friendsMap && friendsMap.has(n)) {
      return { background: friendsMap.get(n), color: 'white', borderColor: 'transparent' }
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
    (friendsMap && friendsMap.has(n)) ||
    (multiplesSet && multiplesSet.has(n)) ||
    highlighted.has(n)
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Grille de nombres</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center gap-4 p-4 overflow-auto">

        {/* Taille */}
        <div className="flex gap-2 flex-wrap justify-center">
          {SIZES.map((s) => (
            <button
              key={s.max}
              onClick={() => handleSizeChange(s.max)}
              className={`px-4 py-2 rounded-lg border-2 font-semibold text-base ${
                max === s.max
                  ? 'bg-plai-teal text-white border-plai-teal'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
              style={{ minHeight: '48px' }}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-600 font-semibold text-base"
            style={{ minHeight: '48px' }}
          >
            Effacer
          </button>
        </div>

        {/* Modes automatiques */}
        <div className="flex gap-2 flex-wrap justify-center">
          {AUTO_MODES.map((m) => (
            <button
              key={String(m.id)}
              onClick={() => handleAutoMode(m.id)}
              className={`px-4 py-2 rounded-lg border-2 font-semibold text-base ${
                autoMode === m.id && m.id !== null
                  ? 'bg-plai-orange text-white border-plai-orange'
                  : m.id === null && !autoMode && !multiplesSet
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}
              style={{ minHeight: '48px' }}
            >
              {m.label}
            </button>
          ))}

          {/* Multiples */}
          <div className="flex items-center gap-1">
            <span className="text-gray-600 font-semibold text-base">Multiples de</span>
            <input
              type="number"
              min="2"
              max="20"
              value={multiple}
              onChange={(e) => handleMultipleInput(e.target.value)}
              className={`w-16 border-2 rounded-lg text-center text-base font-bold py-1 ${
                multiplesSet ? 'border-plai-orange bg-orange-50' : 'border-gray-300'
              }`}
              style={{ minHeight: '48px' }}
              placeholder="?"
            />
          </div>
        </div>

        {/* Grille */}
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  onMouseEnter={() => isDyslexia && setHoveredRow(ri)}
                  onMouseLeave={() => isDyslexia && setHoveredRow(null)}
                >
                  {row.map((n) => (
                    <td key={n} style={{ padding: 3 }}>
                      <button
                        onClick={() => toggleCell(n)}
                        style={{
                          width: cellPx,
                          height: cellPx,
                          fontSize: fontPx,
                          fontWeight: 700,
                          borderRadius: 8,
                          border: '2px solid',
                          borderColor: '#d1d5db',
                          background: isDyslexia && hoveredRow === ri && !isActive(n)
                            ? '#fef9c3'
                            : isActive(n) ? undefined : '#ffffff',
                          cursor: autoMode || multiplesSet ? 'default' : 'pointer',
                          transition: 'background 0.15s',
                          ...getCellStyle(n),
                        }}
                      >
                        {n}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende amis */}
        {friendsMap && (
          <div className="flex gap-3 flex-wrap justify-center max-w-lg">
            {(() => {
              const seen = new Set()
              const pairs = []
              for (const [n, color] of friendsMap) {
                const partner = friendsTarget - n
                if (!seen.has(n) && !seen.has(partner)) {
                  pairs.push({ a: Math.min(n, partner), b: Math.max(n, partner), color })
                  seen.add(n)
                  seen.add(partner)
                }
              }
              return pairs.sort((x, y) => x.a - y.a).map(({ a, b, color }) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full text-white text-sm font-bold"
                  style={{ background: color }}
                >
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
