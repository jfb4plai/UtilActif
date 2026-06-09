import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { rollDice, valueToWord, getDotPattern } from './diceUtils'

// Taille du dé selon le nombre affiché
function dieSize(count) {
  if (count === 1) return { face: 180, grid: 122, dot: 28, num: '5xl', word: '2xl', gap: 16 }
  if (count === 2) return { face: 148, grid: 100, dot: 22, num: '4xl', word: 'xl',  gap: 13 }
  if (count === 3) return { face: 128, grid:  86, dot: 18, num: '3xl', word: 'lg',  gap: 11 }
  return                    { face: 110, grid:  74, dot: 15, num: '2xl', word: 'base', gap: 9  }
}

function DiceFace({ value, count = 1 }) {
  const pattern = getDotPattern(value)
  const sz = dieSize(count)
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Face du dé — bord visible, coins peu arrondis, ombre latérale 3D */}
      <div
        style={{
          width: sz.face,
          height: sz.face,
          background: 'linear-gradient(145deg, #fffef8 0%, #f5f0e0 100%)',
          borderRadius: 14,
          border: '3px solid #374151',
          boxShadow: [
            '4px 4px 0px #1f2937',            // ombre portée forte → effet cube
            '0 10px 28px rgba(0,0,0,0.22)',    // ombre diffuse
            'inset 0 1px 0 rgba(255,255,255,0.9)',
          ].join(', '),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          className="grid grid-cols-3"
          style={{ width: sz.grid, height: sz.grid, gap: sz.gap / 3 }}
        >
          {pattern.map((filled, i) => (
            <div key={i} className="flex items-center justify-center">
              {filled && (
                <div
                  className="rounded-full"
                  style={{
                    width: sz.dot,
                    height: sz.dot,
                    background: '#1f2937',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Chiffre + mot */}
      <div className={`text-${sz.num} font-bold text-plai-teal leading-none`}>{value}</div>
      <div className={`text-${sz.word} text-gray-500 font-medium`}>{valueToWord(value)}</div>
    </div>
  )
}

export function Dice({ onBack, onEditClass }) {
  const { isDyslexia } = useClass()
  const [count, setCount] = useState(1)
  const [values, setValues] = useState([1])
  const [rolling, setRolling] = useState(false)

  function handleRoll() {
    setRolling(true)
    setTimeout(() => {
      setValues(Array.from({ length: count }, rollDice))
      setRolling(false)
    }, 400)
  }

  function handleCountChange(n) {
    setCount(n)
    setValues(Array.from({ length: n }, () => 1))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Dés</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6">
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => handleCountChange(n)}
              className={`w-16 h-16 rounded-xl text-xl font-bold border-2 ${
                count === n
                  ? 'bg-plai-teal text-white border-plai-teal'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div
          className={`flex flex-wrap justify-center transition-opacity duration-300 ${
            rolling ? 'opacity-30' : 'opacity-100'
          } ${isDyslexia ? 'gap-8' : 'gap-6'}`}
        >
          {values.map((v, i) => (
            <DiceFace key={i} value={v} count={count} />
          ))}
        </div>

        <button
          onClick={handleRoll}
          className="bg-plai-teal text-white px-16 py-5 rounded-2xl text-3xl font-bold shadow-lg active:scale-95 transition-transform"
          style={{ minHeight: 'var(--touch-target)' }}
        >
          Lancer
        </button>
      </main>
    </div>
  )
}
