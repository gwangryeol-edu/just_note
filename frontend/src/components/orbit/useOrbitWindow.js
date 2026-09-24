import { useEffect, useRef, useState } from 'react'
import { SLOT_COUNT } from './OrbitList.jsx'

const SCROLL_STEP = 80

export function useOrbitWindow(itemCount, resetKey = '') {
  const [windowStart, setWindowStart] = useState(0)
  const centerRef = useRef(null)
  const wheelAccum = useRef(0)
  const windowStartRef = useRef(0)
  const maxStart = Math.max(0, itemCount - SLOT_COUNT)

  useEffect(() => {
    const center = centerRef.current
    if (!center) return undefined

    const onWheel = (event) => {
      event.preventDefault()
      wheelAccum.current += event.deltaY

      let next = windowStartRef.current
      while (wheelAccum.current >= SCROLL_STEP && next < maxStart) {
        wheelAccum.current -= SCROLL_STEP
        next += 1
      }
      while (wheelAccum.current <= -SCROLL_STEP && next > 0) {
        wheelAccum.current += SCROLL_STEP
        next -= 1
      }
      if (next === windowStartRef.current) {
        wheelAccum.current = Math.max(
          -SCROLL_STEP,
          Math.min(SCROLL_STEP, wheelAccum.current),
        )
        return
      }
      windowStartRef.current = next
      setWindowStart(next)
    }

    center.addEventListener('wheel', onWheel, { passive: false })
    return () => center.removeEventListener('wheel', onWheel)
  }, [maxStart, resetKey])

  const resetWindow = () => {
    windowStartRef.current = 0
    wheelAccum.current = 0
    setWindowStart(0)
  }

  return { windowStart, centerRef, resetWindow }
}
