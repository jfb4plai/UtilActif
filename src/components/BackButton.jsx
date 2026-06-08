export function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-plai-teal font-semibold px-4 py-2 rounded-lg hover:bg-teal-50 active:bg-teal-100"
      style={{ minHeight: 'var(--touch-target)', minWidth: 'var(--touch-target)' }}
      aria-label="Retour à la grille"
    >
      ← Retour
    </button>
  )
}
