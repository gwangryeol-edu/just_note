import { useEffect, useRef, useState } from 'react'
import './list-default.css'

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
    createdAt: new Date(2026, 8, 23, 9, 12),
    content:
      'The pier was empty except for one green boat. I wrote the morning down before the light changed.',
  },
  {
    id: 'morning',
    title: 'Morning',
    author: 'jun',
    createdAt: new Date(2026, 8, 22, 7, 40),
    content:
      'Coffee first, then the window. The street was still wet and nobody had turned the sign yet.',
  },
  {
    id: 'sunday',
    title: 'Sunday',
    author: 'hae',
    createdAt: new Date(2026, 8, 21, 15, 5),
    content:
      'A slow walk with no errand attached. I kept the receipt from the bakery in my coat pocket.',
  },
  {
    id: 'draft',
    title: 'Draft',
    author: 'seo',
    createdAt: new Date(2026, 8, 20, 11, 4),
    updatedAt: new Date(2026, 8, 22, 16, 40),
    content:
      'Second pass. Cut the middle paragraph and left the last line where it landed.',
  },
  {
    id: 'afternoon',
    title: 'Afternoon',
    author: 'nari',
    createdAt: new Date(2026, 8, 19, 14, 18),
    content:
      'The room went gold for about ten minutes. I did not get up to close the curtain.',
  },
  {
    id: 'tiny',
    title: 'Tiny',
    author: 'min',
    createdAt: new Date(2026, 8, 18, 21, 2),
    content: 'A note small enough to fit in the margin. Keep it.',
  },
  {
    id: 'rain',
    title: 'Rain',
    author: 'yoon',
    createdAt: new Date(2026, 8, 17, 18, 33),
    content:
      'It started while the kettle was on. By the time the tea was ready the glass was covered.',
  },
  {
    id: 'paper',
    title: 'Paper',
    author: 'do',
    createdAt: new Date(2026, 8, 16, 10, 11),
    content:
      'Folded once, then again. It did not need to float. It only needed to leave the desk.',
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    author: 'ara',
    createdAt: new Date(2026, 8, 15, 19, 47),
    content:
      'Onions, then quiet. The window over the sink faced a wall and that was enough.',
  },
  {
    id: 'winter',
    title: 'Winter',
    author: 'leo',
    createdAt: new Date(2026, 8, 14, 8, 20),
    content:
      'The radiator knocked twice and stopped. I left the letter on the table overnight.',
  },
  {
    id: 'garden',
    title: 'Garden',
    author: 'sol',
    createdAt: new Date(2026, 8, 12, 16, 9),
    content: 'The basil bolted. I cut it back and did not mind the smell on my hands.',
  },
  {
    id: 'blue',
    title: 'Blue',
    author: 'ian',
    createdAt: new Date(2026, 8, 10, 13, 55),
    content: 'A shirt, a cup, a square of sky between two buildings. Nothing else today.',
  },
  {
    id: 'coast',
    title: 'Coast',
    author: 'rin',
    createdAt: new Date(2026, 8, 8, 6, 28),
    content:
      'We reached the water before the buses started. The sand was cold and unmarked.',
  },
]

function formatAbsolute(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${hours}:${minutes}`
}

function NoteList() {
  const [windowStart, setWindowStart] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
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
    <div className="note-list">
      <aside className="note-list-nav">
        <p className="note-list-brand">jn.</p>
        <nav className="note-list-nav-list" aria-label="primary">
          <button
            type="button"
            className="note-list-nav-item is-active"
            aria-current="page"
            onClick={resetList}
          >
            list
          </button>
          <button type="button" className="note-list-nav-item">
            create
          </button>
          <button type="button" className="note-list-nav-item">
            find
          </button>
        </nav>
      </aside>

      <section
        ref={centerRef}
        className="note-list-center"
        aria-label="note list"
      >
        <div className="note-list-orbit">
          <p className="note-list-mark">just note</p>
          {ORBIT_SLOTS.map((slot, index) => {
            const note = visibleNotes[index]
            if (!note) return null
            const letter = Array.from(note.title)[0]
            return (
              <button
                key={slot.left + '-' + slot.top}
                type="button"
                className="note-list-orbit-box"
                style={{ left: slot.left, top: slot.top }}
                aria-pressed={selectedId === note.id}
                aria-label={note.title}
                onClick={() => setSelectedId(note.id)}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </section>

      <aside className="note-list-detail" aria-label="note detail">
        {selected ? (
          <article className="note-list-article">
            <h1 className="note-list-title">{selected.title}</h1>
            <p className="note-list-author">{selected.author}</p>
            <p className="note-list-time">
              written {formatAbsolute(selected.createdAt)}
            </p>
            {selected.updatedAt ? (
              <p className="note-list-time">
                edited {formatAbsolute(selected.updatedAt)}
              </p>
            ) : null}
            <p className="note-list-body">{selected.content}</p>
          </article>
        ) : (
          <div className="note-list-empty">
            <span className="note-list-rule" />
          </div>
        )}
      </aside>
    </div>
  )
}

export default NoteList
