import { ClassButton } from './ClassButton'

const TOOLS = [
  { id: 'timer', label: 'Minuteur', icon: '⏱️', description: 'Adapté TDAH' },
  { id: 'dice', label: 'Dés', icon: '🎲', description: 'Multiformat' },
  { id: 'wheel', label: 'Roue', icon: '🎡', description: 'Tirage au sort' },
  { id: 'consigne', label: 'Consigne', icon: '📋', description: 'Simplificateur' },
  { id: 'numgrid', label: 'Grille', icon: '🔢', description: 'Nombres 1-100' },
  { id: 'turns', label: 'Tours', icon: '🙋', description: 'Parole en classe' },
  { id: 'cdu',   label: 'C·D·U', icon: '🧱', description: 'Centaines · Dizaines · Unités' },
  { id: 'sono', label: 'Sonomètre', icon: '🎙️', description: 'Niveau sonore' },
]

export function ToolGrid({ onSelectTool, onEditClass }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/plai-logo.jpg" alt="PLAI" className="h-10 w-10 object-contain" />
          <h1 className="text-2xl font-bold text-plai-teal">UtilActif</h1>
        </div>
        <ClassButton onClick={onEditClass} />
      </header>

      <main className="flex-1 grid grid-cols-2 gap-4 p-6" style={{ gridTemplateRows: 'repeat(4, 1fr)' }}>
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="flex flex-col items-center justify-center gap-3 bg-white rounded-2xl shadow hover:shadow-md active:scale-95 transition-transform border-2 border-transparent hover:border-plai-teal"
            style={{ minHeight: 'var(--touch-target)' }}
          >
            <span className="text-5xl">{tool.icon}</span>
            <span className="text-xl font-bold text-gray-800">{tool.label}</span>
            <span className="text-sm text-gray-500">{tool.description}</span>
          </button>
        ))}
      </main>
    </div>
  )
}
