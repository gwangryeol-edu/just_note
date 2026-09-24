import { useState } from 'react'
import { AppShell, CenterColumn, DetailColumn } from './layout/AppShell.jsx'
import { OrbitList, SLOT_COUNT } from './orbit/OrbitList.jsx'
import { useOrbitWindow } from './orbit/useOrbitWindow.js'
import './list-default.css'

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
  const [selectedId, setSelectedId] = useState(null)
  const { windowStart, centerRef, resetWindow } = useOrbitWindow(NOTES.length)
  const visibleNotes = NOTES.slice(windowStart, windowStart + SLOT_COUNT)
  const selected = NOTES.find((note) => note.id === selectedId) ?? null

  const resetList = () => {
    resetWindow()
    setSelectedId(null)
  }

  return (
    <AppShell active="list" onSelect={{ list: resetList }}>
      <CenterColumn columnRef={centerRef}>
        <OrbitList
          notes={visibleNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </CenterColumn>

      <DetailColumn label="note detail">
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
      </DetailColumn>
    </AppShell>
  )
}

export default NoteList
