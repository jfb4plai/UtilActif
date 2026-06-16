import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SonoMonster } from './SonoMonster'

describe('SonoMonster', () => {
  it('rend un SVG pour chaque niveau', () => {
    for (let level = 0; level <= 3; level++) {
      const { container } = render(<SonoMonster level={level} />)
      expect(container.querySelector('svg')).not.toBeNull()
    }
  })

  it('change la couleur du corps selon le niveau', () => {
    const { container: c0 } = render(<SonoMonster level={0} />)
    const { container: c3 } = render(<SonoMonster level={3} />)
    const body0 = c0.querySelector('[data-testid="monster-body"]')
    const body3 = c3.querySelector('[data-testid="monster-body"]')
    expect(body0.getAttribute('fill')).not.toBe(body3.getAttribute('fill'))
  })

  it('affiche les mains sur les oreilles au niveau 3', () => {
    const { container } = render(<SonoMonster level={3} />)
    expect(container.querySelectorAll('[data-testid="monster-hand"]')).toHaveLength(2)
  })

  it("n'affiche pas les mains aux niveaux 0-2", () => {
    for (let level = 0; level <= 2; level++) {
      const { container } = render(<SonoMonster level={level} />)
      expect(container.querySelectorAll('[data-testid="monster-hand"]')).toHaveLength(0)
    }
  })
})
