import { useState } from 'react'
import detailLine from '../assets/find-result-detail-line.svg'
import './find-result-detail.css'

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

const INITIAL_RESULTS = [
  {
    id: 'minimal',
    slot: 1,
    title: 'Minimal typography guide',
    author: 'Nese',
    content:
      'Notes on using scale, rhythm, and structural negative space instead of decorative ornamentation.',
  },
  {
    id: 'sunday',
    slot: 2,
    title: 'Sunday',
    author: 'Nese',
    content:
      'A slow walk with no errand attached. I kept the receipt from the bakery in my coat pocket.',
  },
  {
    id: 'rain',
    slot: 6,
    title: 'Rain',
    author: 'Nese',
    content:
      'It started while the kettle was on. By the time the tea was ready the glass was covered.',
  },
  {
    id: 'paper',
    slot: 7,
    title: 'Paper',
    author: 'Nese',
    content:
      'Folded once, then again. It did not need to float. It only needed to leave the desk.',
  },
]

function FindResultDetail() {
  const [results, setResults] = useState(INITIAL_RESULTS)
  const [selectedId, setSelectedId] = useState('minimal')
  const selected = results.find((note) => note.id === selectedId) ?? null

  const onDelete = () => {
    if (!selected) return
    const confirmed = window.confirm(
      `『${selected.title}』 note를 정말 삭제하시겠습니까`,
    )
    if (!confirmed) return
    const next = results.filter((note) => note.id !== selected.id)
    setResults(next)
    setSelectedId(next[0]?.id ?? null)
  }

  return (
    <div className="find-result-detail">
      <aside className="find-result-detail-nav">
        <p className="find-result-detail-brand">jn.</p>
        <nav className="find-result-detail-nav-list" aria-label="primary">
          <button type="button" className="find-result-detail-nav-item">
            list
          </button>
          <button type="button" className="find-result-detail-nav-item">
            create
          </button>
          <button
            type="button"
            className="find-result-detail-nav-item is-active"
            aria-current="page"
          >
            find
          </button>
        </nav>
      </aside>

      <section className="find-result-detail-center" aria-label="search results">
        <div className="find-result-detail-orbit">
          <p className="find-result-detail-mark">just note</p>
          {ORBIT_SLOTS.map((slot, index) => {
            const note = results.find((item) => item.slot === index)
            if (!note) return null
            const isSelected = selectedId === note.id
            return (
              <button
                key={note.id}
                type="button"
                className={
                  isSelected
                    ? 'find-result-detail-orbit-box is-selected'
                    : 'find-result-detail-orbit-box'
                }
                style={{ left: slot.left, top: slot.top }}
                aria-pressed={isSelected}
                aria-label={note.title}
                onClick={() => setSelectedId(note.id)}
              >
                {Array.from(note.title)[0]}
              </button>
            )
          })}
        </div>
        <p className="find-result-detail-count">
          Showing {results.length} search results for user
        </p>
      </section>

      <aside className="find-result-detail-panel" aria-label="note detail">
        <div className="find-result-detail-frame">
          {selected ? (
            <article className="find-result-detail-article">
              <div className="find-result-detail-heading">
                <h1 className="find-result-detail-title">{selected.title}</h1>
                <p className="find-result-detail-author">by {selected.author}</p>
              </div>
              <div className="find-result-detail-line-slot">
                <img src={detailLine} alt="" width="400" height="1" />
              </div>
              <p className="find-result-detail-body">{selected.content}</p>
            </article>
          ) : (
            <div />
          )}
          {selected ? (
            <div className="find-result-detail-actions">
              <button type="button" className="find-result-detail-action">
                update
              </button>
              <button
                type="button"
                className="find-result-detail-action"
                onClick={onDelete}
              >
                delete
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  )
}

export default FindResultDetail
