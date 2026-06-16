import { describe, it, expect } from 'vitest'
import { getMonsterLevel } from './sonoUtils'

describe('getMonsterLevel', () => {
  describe('avec threshold (preset actif)', () => {
    it('retourne 0 si level < 50% du threshold', () => {
      expect(getMonsterLevel(10, 40)).toBe(0)
    })

    it('retourne 1 si level entre 50% et 75% du threshold', () => {
      expect(getMonsterLevel(25, 40)).toBe(1)
    })

    it('retourne 2 si level entre 75% et 100% du threshold', () => {
      expect(getMonsterLevel(35, 40)).toBe(2)
    })

    it('retourne 3 si level >= threshold', () => {
      expect(getMonsterLevel(40, 40)).toBe(3)
      expect(getMonsterLevel(80, 40)).toBe(3)
    })
  })

  describe('sans threshold (preset Libre)', () => {
    it('retourne 0 si level < 25', () => {
      expect(getMonsterLevel(10, null)).toBe(0)
    })

    it('retourne 1 si level entre 25 et 49', () => {
      expect(getMonsterLevel(30, null)).toBe(1)
    })

    it('retourne 2 si level entre 50 et 74', () => {
      expect(getMonsterLevel(60, null)).toBe(2)
    })

    it('retourne 3 si level >= 75', () => {
      expect(getMonsterLevel(80, null)).toBe(3)
    })
  })
})
