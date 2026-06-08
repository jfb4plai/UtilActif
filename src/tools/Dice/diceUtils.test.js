import { describe, it, expect } from 'vitest'
import { rollDice, valueToWord, valueToDots } from './diceUtils'

describe('rollDice', () => {
  it('returns a number between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const r = rollDice()
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
    }
  })
})

describe('valueToWord', () => {
  it('returns "un" for 1', () => expect(valueToWord(1)).toBe('un'))
  it('returns "deux" for 2', () => expect(valueToWord(2)).toBe('deux'))
  it('returns "trois" for 3', () => expect(valueToWord(3)).toBe('trois'))
  it('returns "quatre" for 4', () => expect(valueToWord(4)).toBe('quatre'))
  it('returns "cinq" for 5', () => expect(valueToWord(5)).toBe('cinq'))
  it('returns "six" for 6', () => expect(valueToWord(6)).toBe('six'))
})

describe('valueToDots', () => {
  it('returns 1 dot for value 1', () => expect(valueToDots(1)).toHaveLength(1))
  it('returns 6 dots for value 6', () => expect(valueToDots(6)).toHaveLength(6))
})
