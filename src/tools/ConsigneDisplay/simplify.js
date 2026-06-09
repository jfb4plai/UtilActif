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

// Verbes d'action courants en consigne scolaire (impératif et infinitif)
const ACTION_VERBS = new Set([
  'lis','lire','écris','écrire','remplis','remplir','colorie','colorier',
  'découpe','découper','colle','coller','calcule','calculer','résous','résoudre',
  'regarde','regarder','entoure','entourer','souligne','souligner','dessine','dessiner',
  'réponds','répondre','trace','tracer','place','placer','range','ranger',
  'classe','classer','trie','trier','compte','compter','mesure','mesurer',
  'relie','relier','barre','barrer','recopie','recopier','numérote','numéroter',
  'compare','comparer','explique','expliquer','raconte','raconter','trouve','trouver',
  'cherche','chercher','utilise','utiliser','construis','construire','fais','faire',
  'prends','prendre','ouvre','ouvrir','ferme','fermer','coupe','couper','tourne','tourner',
  'relis','relire','vérifie','vérifier','corrige','corriger','observe','observer',
  'pense','penser','complète','compléter','note','noter','indique','indiquer',
  'sépare','séparer','regroupe','regrouper','associe','associer','nomme','nommer',
  'donne','donner','choisis','choisir','encadre','encadrer','écris','écrire',
])

// Vérifie si un mot est un verbe d'action
function isActionVerb(word) {
  return ACTION_VERBS.has(word.toLowerCase().replace(/[.,!?]$/, ''))
}

// Découpe sur ponctuation forte, connecteurs séquentiels ET "et [verbe]"
function splitIntoSteps(text) {
  // 1. Découpe sur ponctuation et connecteurs
  const rawSteps = text
    .split(/(?<=[.!?])\s+|(?<=;)\s*|\s+(?=(?:puis|ensuite|après|alors)[, ])/gi)
    .map((s) => s.trim())
    .filter(Boolean)

  // 2. Pour chaque étape, découpe sur "et [verbe d'action]"
  const result = []
  for (const step of rawSteps) {
    const words = step.split(/\s+/)
    let cutAt = -1
    for (let i = 1; i < words.length - 1; i++) {
      const w = words[i].toLowerCase()
      // "et [verbe]" ou "et de [verbe]"
      if (w === 'et') {
        const next = words[i + 1]?.toLowerCase()
        const afterDe = words[i + 2]?.toLowerCase()
        if (isActionVerb(next)) { cutAt = i; break }
        if (next === 'de' && afterDe && isActionVerb(afterDe)) { cutAt = i; break }
      }
    }
    if (cutAt === -1) {
      result.push(step)
    } else {
      const first = words.slice(0, cutAt).join(' ').replace(/[,.]$/, '') + '.'
      // saute "de" si présent juste après "et"
      const afterEt = words[cutAt + 1]?.toLowerCase() === 'de' ? cutAt + 2 : cutAt + 1
      const second = words.slice(afterEt).join(' ')
      result.push(first, second)
    }
  }
  return result
}

// Supprime le sujet et les connecteurs de début → commence par le verbe
function stripSubject(sentence) {
  return sentence
    .replace(/^tu dois\s+/i, '')
    .replace(/^vous devez\s+/i, '')
    .replace(/^tu peux\s+/i, '')
    .replace(/^puis\s+/i, '')
    .replace(/^ensuite\s*,?\s*/i, '')
    .replace(/^après\s*,?\s*/i, '')
    .replace(/^alors\s*,?\s*/i, '')
    .trim()
}

export function simplifyText(text) {
  if (!text.trim()) return ''

  let result = text.trim()

  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  // Nettoyage des espaces doubles introduits par les suppressions
  result = result.replace(/\s{2,}/g, ' ').trim()

  // Ajoute un point final si absent
  function withPeriod(s) {
    return /[.!?]$/.test(s) ? s : s + '.'
  }

  const steps = splitIntoSteps(result)
    .filter(Boolean)
    .map((s) => stripSubject(s.trim()))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .map(withPeriod)

  // Puces si plusieurs étapes
  if (steps.length > 1) {
    return steps.map((s) => `• ${s}`).join('\n')
  }
  return steps[0] ?? ''
}
