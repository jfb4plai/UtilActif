import { useState, useEffect, useRef, useCallback } from 'react'

export function useSono() {
  const [level, setLevel] = useState(0)
  const [permission, setPermission] = useState('idle')
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const rafRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (!isMounted) return
        streamRef.current = stream
        const ctx = new AudioContext()
        audioCtxRef.current = ctx
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyserRef.current = analyser
        ctx.createMediaStreamSource(stream).connect(analyser)
        if (isMounted) setPermission('granted')

        const data = new Uint8Array(analyser.frequencyBinCount)
        function tick() {
          analyser.getByteFrequencyData(data)
          const avg = data.reduce((s, v) => s + v, 0) / data.length
          setLevel(Math.round((avg / 255) * 100))
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      } catch {
        if (isMounted) setPermission('denied')
      }
    }

    const stop = () => {
      isMounted = false
      cancelAnimationFrame(rafRef.current)
      audioCtxRef.current?.close()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      setLevel(0)
    }

    start()
    return stop
  }, [])

  return { level, permission }
}
