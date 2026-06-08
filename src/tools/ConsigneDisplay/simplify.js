const REPLACEMENTS = [
  [/afin de/gi, 'pour'],
  [/néanmoins/gi, 'mais'],
  [/par conséquent/gi, 'donc'],
  [/cependant/gi, 'mais'],
  [/en effet/gi, 'car'],
  [/toutefois/gi, 'mais'],
  [/ainsi/gi, 'donc'],
  [/de surcroît/gi, 'aussi'],
  [/en outre/gi, 'aussi'],
  [/par ailleurs/gi, 'aussi'],
  [/il convient de/gi, 'il faut'],
  [/il est nécessaire de/gi, 'il faut'],
  [/vous devez/gi, 'fais'],
  [/vous pouvez/gi, 'tu peux'],
]

const MAX_WORDS = 20

function splitLongSentence(sentence) {
  const words = sentence.trim().split(/\s+/)
  if (words.length <= MAX_WORDS) return [sentence]
  const chunks = []
  for (let i = 0; i < words.length; i += MAX_WORDS) {
    chunks.push(words.slice(i, i + MAX_WORDS).join(' '))
  }
  return chunks
}

export function simplifyText(text) {
  if (!text.trim()) return ''

  let result = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  const sentences = result
    .split(/(?<=[.!?])\s+/)
    .flatMap(splitLongSentence)
    .filter(Boolean)

  return sentences.join('\n')
}
