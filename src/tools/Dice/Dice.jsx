import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { rollDice, valueToWord, getDotPattern } from './diceUtils'

function DiceFace({ value }) {
  const pattern = getDotPattern(value)
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Face du dé */}
      <div
        className="bg-white rounded-3xl shadow-2xl flex items-center justify-center"
        style={{
          width: 160,
          height: 160,
          border: '3px solid #e5e7eb',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <div className="grid grid-cols-3 gap-3" style={{ width: 108, height: 108 }}>
          {pattern.map((filled, i) => (
            <div
              key={i}
              className="flex items-center justify-center"
            >
              {filled && (
                <div
                  className="rounded-full bg-gray-800"
                  style={{ width: 26, height: 26 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Chiffre */}
      <div className="text-5xl font-bold text-plai-teal leading-none">{value}</div>
      {/* Mot */}
      <div className="text-2xl text-gray-500 font-medium">{valueToWord(value)}</div>
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
            <DiceFace key={i} value={v} />
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
