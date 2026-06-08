import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { rollDice, valueToWord, valueToDots } from './diceUtils'

function DiceFace({ value }) {
  const dots = valueToDots(value)
  return (
    <div className="bg-white border-4 border-gray-200 rounded-3xl p-4 flex flex-col items-center gap-3 shadow-lg min-w-[140px]">
      <div className="grid grid-cols-3 gap-2 h-20 w-20 items-center justify-items-center">
        {dots.map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-800 rounded-full" />
        ))}
      </div>
      <div className="text-5xl font-bold text-plai-teal">{value}</div>
      <div className="text-2xl text-gray-600 capitalize">{valueToWord(value)}</div>
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
