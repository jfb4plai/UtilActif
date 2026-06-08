const WORDS = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six']

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

export function valueToWord(n) {
  return WORDS[n] ?? ''
}

export function valueToDots(n) {
  return Array.from({ length: n }, (_, i) => i)
}
