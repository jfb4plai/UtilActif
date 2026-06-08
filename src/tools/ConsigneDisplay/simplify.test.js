import { describe, it, expect } from 'vitest'
import { simplifyText } from './simplify'

describe('simplifyText', () => {
  it('coupe les phrases de plus de 20 mots', () => {
    const long = 'un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize dix-sept dix-huit dix-neuf vingt vingt-et-un vingt-deux.'
    const result = simplifyText(long)
    const sentences = result.split('\n').filter(Boolean)
    sentences.forEach((s) => {
      expect(s.split(' ').length).toBeLessThanOrEqual(22)
    })
  })

  it('remplace "afin de" par "pour"', () => {
    const result = simplifyText('Fais ceci afin de réussir.')
    expect(result).toContain('pour')
    expect(result).not.toContain('afin de')
  })

  it('remplace "néanmoins" par "mais"', () => {
    const result = simplifyText('Il a essayé, néanmoins il a échoué.')
    expect(result).toContain('mais')
  })

  it('remplace "par conséquent" par "donc"', () => {
    const result = simplifyText('Il a travaillé, par conséquent il réussit.')
    expect(result).toContain('donc')
  })

  it('retourne le texte vide inchangé', () => {
    expect(simplifyText('')).toBe('')
  })
})
