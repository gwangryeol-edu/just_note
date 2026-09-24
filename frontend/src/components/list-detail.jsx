import { useEffect, useRef, useState } from 'react'
import detailLine from '../assets/list-detail-line.svg'
import './list-detail.css'

const SLOT_COUNT = 10
const SCROLL_STEP = 80

/** 9시 방향부터 시계 방향. 프레임 500×500 기준 좌표. */
const ORBIT_SLOTS = [
  { left: 58, top: 228 },
  { left: 90, top: 128 },
  { left: 175, top: 66 },
  { left: 281, top: 66 },
  { left: 366, top: 128 },
  { left: 398, top: 228 },
  { left: 366, top: 328 },
  { left: 281, top: 390 },
  { left: 175, top: 390 },
  { left: 90, top: 328 },
]

const NOTES = [
  {
    id: 'harbor',
    title: 'Harbor',
    author: 'mina',
    content:
      'The pier was empty except for one green boat. I wrote the morning down before the light changed.',
  },
  {
    id: 'minimal',
    title: 'Minimal typography guide',
    author: 'Nese',
    content:
      'Notes on using scale, rhythm, and structural negative space instead of decorative ornamentation.',
  },
  {
    id: 'sunday',
    title: 'Sunday',
    author: 'hae',
    content:
      'A slow walk with no errand attached. I kept the receipt from the bakery in my coat pocket.',
  },
  {
    id: 'draft',
    title: 'Draft',
    author: 'seo',
    content:
      'Second pass. Cut the middle paragraph and left the last line where it landed.',
  },
  {
    id: 'afternoon',
    title: 'Afternoon',
    author: 'nari',
    content:
      'The room went gold for about ten minutes. I did not get up to close the curtain.',
  },
  {
    id: 'tiny',
    title: 'Tiny',
    author: 'min',
    content: 'A note small enough to fit in the margin. Keep it.',
  },
  {
    id: 'rain',
    title: 'Rain',
    author: 'yoon',
    content:
      'It started while the kettle was on. By the time the tea was ready the glass was covered.',
  },
  {
    id: 'paper',
    title: 'Paper',
    author: 'do',
    content:
      'Folded once, then again. It did not need to float. It only needed to leave the desk.',
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    author: 'ara',
    content:
      'Onions, then quiet. The window over the sink faced a wall and that was enough.',
  },
  {
    id: 'winter',
    title: 'Winter',
    author: 'leo',
    content:
      'The radiator knocked twice and stopped. I left the letter on the table overnight.',
  },
  {
    id: 'garden',
    title: 'Garden',
    author: 'sol',
    content: 'The basil bolted. I cut it back and did not mind the smell on my hands.',
  },
  {
    id: 'blue',
    title: 'Blue',
    author: 'ian',
    content: 'A shirt, a cup, a square of sky between two buildings. Nothing else today.',
  },
  {
    id: 'coast',
    title: 'Coast',
    author: 'rin',
    content:
      'We reached the water before the buses started. The sand was cold and unmarked.',
  },
]

function ListDetail() {
  const [windowStart, setWindowStart] = useState(0)
  const [selectedId, setSelectedId] = useState('minimal')
  const centerRef = useRef(null)
  const wheelAccum = useRef(0)
  const windowStartRef = useRef(0)
  const maxStart = Math.max(0, NOTES.length - SLOT_COUNT)

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
  }, [maxStart])

  const visibleNotes = NOTES.slice(windowStart, windowStart + SLOT_COUNT)
  const selected = NOTES.find((note) => note.id === selectedId) ?? null

  const resetList = () => {
    windowStartRef.current = 0
    wheelAccum.current = 0
    setWindowStart(0)
    setSelectedId(null)
  }

  return (
    <div className="list-detail">
      <aside className="list-detail-nav">
        <p className="list-detail-brand">jn.</p>
        <nav className="list-detail-nav-list" aria-label="primary">
          <button
            type="button"
            className="list-detail-nav-item is-active"
            aria-current="page"
            onClick={resetList}
          >
            list
          </button>
          <button type="button" className="list-detail-nav-item">
            create
          </button>
          <button type="button" className="list-detail-nav-item">
            find
          </button>
        </nav>
      </aside>

      <section
        ref={centerRef}
        className="list-detail-center"
        aria-label="note list"
      >
        <div className="list-detail-orbit">
          <p className="list-detail-mark">just note</p>
          {ORBIT_SLOTS.map((slot, index) => {
            const note = visibleNotes[index]
            if (!note) return null
            const letter = Array.from(note.title)[0]
            const isSelected = selectedId === note.id
            return (
              <button
                key={slot.left + '-' + slot.top}
                type="button"
                className={
                  isSelected
                    ? 'list-detail-orbit-box is-selected'
                    : 'list-detail-orbit-box'
                }
                style={{ left: slot.left, top: slot.top }}
                aria-pressed={isSelected}
                aria-label={note.title}
                onClick={() => setSelectedId(note.id)}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </section>

      <aside className="list-detail-panel" aria-label="note detail">
        {selected ? (
          <article className="list-detail-article">
            <div className="list-detail-heading">
              <h1 className="list-detail-title">{selected.title}</h1>
              <p className="list-detail-author">by {selected.author}</p>
            </div>
            <div className="list-detail-line-slot">
              <img src={detailLine} alt="" width="400" height="1" />
            </div>
            <p className="list-detail-body">{selected.content}</p>
          </article>
        ) : null}
      </aside>
    </div>
  )
}

export default ListDetail
