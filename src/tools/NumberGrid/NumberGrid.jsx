import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'

const SIZES = [
  { label: '1-50', max: 50 },
  { label: '1-100', max: 100 },
  { label: '1-200', max: 200 },
]

export function NumberGrid({ onBack, onEditClass }) {
  const { isDyslexia } = useClass()
  const [max, setMax] = useState(100)
  const [highlighted, setHighlighted] = useState(new Set())
  const [hoveredRow, setHoveredRow] = useState(null)

  const cols = 10
  const numbers = Array.from({ length: max }, (_, i) => i + 1)
  const rows = []
  for (let i = 0; i < numbers.length; i += cols) {
    rows.push(numbers.slice(i, i + cols))
  }

  function toggleCell(n) {
    setHighlighted((prev) => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  const cellSize = max <= 100 ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Grille de nombres</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center gap-4 p-4 overflow-auto">
        <div className="flex gap-3 items-center flex-wrap justify-center">
          {SIZES.map((s) => (
            <button
              key={s.max}
              onClick={() => { setMax(s.max); setHighlighted(new Set()) }}
              className={`px-4 py-2 rounded-lg border-2 font-semibold ${
                max === s.max ? 'bg-plai-teal text-white border-plai-teal' : 'border-gray-300 text-gray-600'
              }`}
              style={{ minHeight: '48px' }}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setHighlighted(new Set())}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold"
            style={{ minHeight: '48px' }}
          >
            Effacer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse">
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  onMouseEnter={() => isDyslexia && setHoveredRow(ri)}
                  onMouseLeave={() => isDyslexia && setHoveredRow(null)}
                  className={isDyslexia && hoveredRow === ri ? 'bg-yellow-100' : ''}
                >
                  {row.map((n) => (
                    <td key={n} className="p-0.5">
                      <button
                        onClick={() => toggleCell(n)}
                        className={`${cellSize} rounded font-mono font-semibold border transition-colors ${
                          highlighted.has(n)
                            ? 'bg-plai-teal text-white border-plai-teal'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-plai-teal'
                        }`}
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
      </main>
    </div>
  )
}
