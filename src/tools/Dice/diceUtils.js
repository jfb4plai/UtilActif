const WORDS = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six']

// Grille 3×3 : true = point, false = vide
// positions : [TL, TM, TR, ML, MM, MR, BL, BM, BR]
const DOT_PATTERNS = {
  1: [false, false, false, false, true,  false, false, false, false],
  2: [false, false, true,  false, false, false, true,  false, false],
  3: [false, false, true,  false, true,  false, true,  false, false],
  4: [true,  false, true,  false, false, false, true,  false, true ],
  5: [true,  false, true,  false, true,  false, true,  false, true ],
  6: [true,  false, true,  true,  false, true,  true,  false, true ],
}

export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

export function valueToWord(n) {
  return WORDS[n] ?? ''
}

export function getDotPattern(n) {
  return DOT_PATTERNS[n] ?? DOT_PATTERNS[1]
}
