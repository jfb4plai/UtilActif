import { useClass } from '../shared/useClass'

export function ClassButton({ onClick }) {
  const { profile } = useClass()
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-plai-teal text-white px-4 py-2 rounded-lg font-semibold text-sm"
      style={{ minHeight: 'var(--touch-target)' }}
      aria-label="Modifier le profil de classe"
      title="Modifier le profil de classe"
    >
      🏫 {profile.name || 'Classe'}
    </button>
  )
}
