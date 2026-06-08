import { useState } from 'react'
import { useClass } from '../../shared/useClass'
import { BackButton } from '../../components/BackButton'
import { ClassButton } from '../../components/ClassButton'
import { simplifyText } from './simplify'

export function ConsigneDisplay({ onBack, onEditClass }) {
  const { isDyslexia } = useClass()
  const [input, setInput] = useState('')
  const [display, setDisplay] = useState('')
  const [simplified, setSimplified] = useState(false)
  const [editing, setEditing] = useState(true)

  function handleSimplify() {
    const result = simplifyText(input)
    setDisplay(result)
    setSimplified(true)
    setEditing(false)
  }

  function handleDisplay() {
    setDisplay(input)
    setEditing(false)
  }

  function handleEdit() {
    setEditing(true)
    setSimplified(false)
  }

  const displayStyle = isDyslexia
    ? { fontFamily: 'Arial, sans-serif', lineHeight: '1.8', fontSize: '2rem' }
    : { lineHeight: '1.6', fontSize: '2rem' }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <BackButton onClick={onBack} />
        <h2 className="text-xl font-bold text-plai-teal">Consigne</h2>
        <ClassButton onClick={onEditClass} />
      </header>

      {editing ? (
        <main className="flex-1 flex flex-col gap-4 p-6">
          <textarea
            className="flex-1 border-2 rounded-xl p-4 text-xl resize-none focus:border-plai-teal outline-none"
            placeholder="Colle ou tape la consigne ici…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <div className="flex gap-4">
            <button
              onClick={handleDisplay}
              disabled={!input.trim()}
              className="flex-1 bg-plai-teal text-white py-4 rounded-xl text-xl font-bold disabled:opacity-40"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              Afficher
            </button>
            <button
              onClick={handleSimplify}
              disabled={!input.trim()}
              className="flex-1 border-2 border-plai-teal text-plai-teal py-4 rounded-xl text-xl font-bold disabled:opacity-40"
              style={{ minHeight: 'var(--touch-target)' }}
            >
              Simplifier
            </button>
          </div>
          {simplified && (
            <p className="text-sm text-gray-400 text-center">
              Simplification par règles — vérifie avant d'afficher.
            </p>
          )}
        </main>
      ) : (
        <main className="flex-1 flex flex-col p-8 gap-6">
          <div
            className="flex-1 whitespace-pre-wrap text-gray-800"
            style={displayStyle}
          >
            {display}
          </div>
          <button
            onClick={handleEdit}
            className="border-2 border-gray-300 text-gray-600 py-4 rounded-xl text-xl font-bold"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            Modifier
          </button>
        </main>
      )}
    </div>
  )
}
