const BODY_COLORS = ['#4ade80', '#86efac', '#fb923c', '#ef4444']
const DARK_COLORS = ['#166534', '#166534', '#7c2d12', '#7f1d1d']

export function SonoMonster({ level }) {
  const bodyColor = BODY_COLORS[level]
  const dark = DARK_COLORS[level]

  return (
    <svg viewBox="0 0 200 220" width="200" height="220" xmlns="http://www.w3.org/2000/svg">
      {/* Piques pour agité/explosé */}
      {level >= 2 && (
        <>
          <polygon points="100,28 108,52 92,52" fill={bodyColor} />
          <polygon points="132,38 138,62 122,58" fill={bodyColor} />
          <polygon points="68,38 78,62 62,58" fill={bodyColor} />
        </>
      )}

      {/* Corps */}
      <ellipse cx="100" cy="130" rx="75" ry="70" fill={bodyColor} data-testid="monster-body" />

      {/* Mains sur les oreilles — niveau 3 */}
      {level === 3 && (
        <>
          <ellipse cx="20" cy="112" rx="22" ry="16" fill={bodyColor} data-testid="monster-hand" />
          <ellipse cx="180" cy="112" rx="22" ry="16" fill={bodyColor} data-testid="monster-hand" />
        </>
      )}

      {/* Cornes */}
      <ellipse cx="68" cy="68" rx="12" ry="22" fill={bodyColor} transform="rotate(-15 68 68)" />
      <ellipse cx="132" cy="68" rx="12" ry="22" fill={bodyColor} transform="rotate(15 132 68)" />

      {/* Yeux — niveau 0 : fermés heureux */}
      {level === 0 && (
        <>
          <path d="M 72 108 Q 82 100 92 108" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 108 108 Q 118 100 128 108" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Yeux — niveau 1 : ouverts calmes */}
      {level === 1 && (
        <>
          <circle cx="82" cy="110" r="11" fill="white" />
          <circle cx="118" cy="110" r="11" fill="white" />
          <circle cx="82" cy="112" r="5" fill={dark} />
          <circle cx="118" cy="112" r="5" fill={dark} />
        </>
      )}

      {/* Yeux — niveau 2 : inquiets avec sourcils froncés */}
      {level === 2 && (
        <>
          <circle cx="82" cy="112" r="11" fill="white" />
          <circle cx="118" cy="112" r="11" fill="white" />
          <circle cx="84" cy="114" r="5" fill={dark} />
          <circle cx="120" cy="114" r="5" fill={dark} />
          <path d="M 72 98 Q 82 93 92 98" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 108 98 Q 118 93 128 98" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Yeux — niveau 3 : X abasourdis */}
      {level === 3 && (
        <>
          <line x1="74" y1="103" x2="90" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="90" y1="103" x2="74" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="110" y1="103" x2="126" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="126" y1="103" x2="110" y2="119" stroke={dark} strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {/* Bouche — niveau 0 : grand sourire */}
      {level === 0 && (
        <path d="M 76 138 Q 100 158 124 138" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 1 : légèrement satisfait */}
      {level === 1 && (
        <path d="M 82 142 Q 100 150 118 142" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 2 : grimace */}
      {level === 2 && (
        <path d="M 78 150 Q 100 140 122 150" stroke={dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {/* Bouche — niveau 3 : O ouvert */}
      {level === 3 && (
        <ellipse cx="100" cy="150" rx="18" ry="14" fill={dark} />
      )}
    </svg>
  )
}
