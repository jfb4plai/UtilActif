// Substitutions lexicales — du plus long au plus court pour éviter les conflits
const REPLACEMENTS = [
  // Tournures impersonnelles → impératif direct
  [/il est nécessaire de/gi, 'tu dois'],
  [/il est important de/gi, 'tu dois'],
  [/il faut que tu/gi, 'tu dois'],
  [/il faut que vous/gi, 'vous devez'],
  [/il convient de/gi, 'tu dois'],
  [/vous êtes invité[·e]?s? à/gi, 'vous devez'],
  [/n'oublie pas de/gi, 'pense à'],
  [/n'oubliez pas de/gi, 'pensez à'],

  // Moyens / outils
  [/en vous aidant de/gi, 'avec'],
  [/en t['']aidant de/gi, 'avec'],
  [/à l['']aide de/gi, 'avec'],
  [/en utilisant/gi, 'avec'],
  [/en te basant sur/gi, 'avec'],
  [/en vous référant à/gi, 'en regardant'],
  [/à partir de/gi, 'avec'],
  [/de manière à/gi, 'pour'],
  [/de façon à/gi, 'pour'],
  [/afin de/gi, 'pour'],

  // Connecteurs temporels → mots simples
  [/dans un premier temps[,]?/gi, 'D\'abord,'],
  [/dans un second temps[,]?/gi, 'Ensuite,'],
  [/dans un deuxième temps[,]?/gi, 'Ensuite,'],
  [/dans un troisième temps[,]?/gi, 'Puis,'],
  [/avant de commencer[,]?/gi, 'D\'abord,'],
  [/pour commencer[,]?/gi, 'D\'abord,'],
  [/pour terminer[,]?/gi, 'Pour finir,'],
  [/en conclusion[,]?/gi, 'Pour finir,'],

  // Connecteurs logiques
  [/par conséquent/gi, 'donc'],
  [/néanmoins/gi, 'mais'],
  [/cependant/gi, 'mais'],
  [/toutefois/gi, 'mais'],
  [/en revanche/gi, 'mais'],
  [/de surcroît/gi, 'aussi'],
  [/en outre/gi, 'aussi'],
  [/par ailleurs/gi, 'aussi'],
  [/en effet/gi, 'car'],
  [/ainsi/gi, 'donc'],

  // Verbes scolaires complexes → verbes simples
  [/rédige/gi, 'écris'],
  [/rédigez/gi, 'écrivez'],
  [/effectue/gi, 'fais'],
  [/effectuez/gi, 'faites'],
  [/réalise/gi, 'fais'],
  [/réalisez/gi, 'faites'],
  [/complète/gi, 'remplis'],
  [/complétez/gi, 'remplissez'],
  [/observe attentivement/gi, 'regarde bien'],
  [/observez attentivement/gi, 'regardez bien'],
  [/observe/gi, 'regarde'],
  [/observez/gi, 'regardez'],

  // Formules de politesse / scolaires inutiles
  [/je vous demande de/gi, ''],
  [/je te demande de/gi, ''],
  [/vous allez devoir/gi, 'vous devez'],
  [/tu vas devoir/gi, 'tu dois'],
]

// Découpe sur ponctuation forte ET connecteurs séquentiels
function splitIntoSteps(text) {
  return text
    .split(/(?<=[.!?])\s+|(?<=;)\s*|\s+(?=(?:puis|ensuite|après|alors)[, ])/gi)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Découpe une phrase trop longue (>15 mots) sur "et" ou ","
const MAX_WORDS = 15

function breakLongSentence(sentence) {
  const words = sentence.trim().split(/\s+/)
  if (words.length <= MAX_WORDS) return [sentence]

  // Cherche un "et" ou "," au-delà du mot 8
  for (let i = 8; i < words.length - 2; i++) {
    if (words[i].toLowerCase() === 'et' || words[i].endsWith(',')) {
      const first = words.slice(0, i + (words[i].endsWith(',') ? 0 : 1)).join(' ').replace(/,$/, '') + '.'
      const rest = words.slice(i + 1).join(' ')
      const cap = rest.charAt(0).toUpperCase() + rest.slice(1)
      return [first, cap]
    }
  }

  // Pas de coupure naturelle → découpe mécanique
  return [
    words.slice(0, MAX_WORDS).join(' ') + '…',
    words.slice(MAX_WORDS).join(' '),
  ]
}

export function simplifyText(text) {
  if (!text.trim()) return ''

  let result = text.trim()

  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  // Nettoyage des espaces doubles introduits par les suppressions
  result = result.replace(/\s{2,}/g, ' ').trim()

  const steps = splitIntoSteps(result)
    .flatMap(breakLongSentence)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))

  return steps.join('\n')
}
