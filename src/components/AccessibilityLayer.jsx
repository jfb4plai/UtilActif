import { useEffect } from 'react'
import { useClass } from '../shared/useClass'

export function AccessibilityLayer({ children }) {
  const { profile } = useClass()
  const { dyslexia, font, highContrast, fontSize, reducedMotion } =
    profile.accessibility

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    body.style.fontFamily = dyslexia ? `${font}, sans-serif` : "'Inter', sans-serif"

    root.style.setProperty(
      '--base-font',
      fontSize === 'large' ? '1.25rem' : '1rem'
    )

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    root.style.setProperty(
      '--animation-duration',
      reducedMotion ? '0ms' : '300ms'
    )
  }, [dyslexia, font, highContrast, fontSize, reducedMotion])

  return <>{children}</>
}
