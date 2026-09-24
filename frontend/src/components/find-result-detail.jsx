import { useState } from 'react'
import { AppShell, CenterColumn, DetailColumn } from './layout/AppShell.jsx'
import { NoteDetail } from './note/NoteDetail.jsx'
import { OrbitList } from './orbit/OrbitList.jsx'
import './find-result-detail.css'

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
      `Are you sure you want to delete the note "${selected.title}"?`,
    )
    if (!confirmed) return
    const next = results.filter((note) => note.id !== selected.id)
    setResults(next)
    setSelectedId(next[0]?.id ?? null)
  }

  return (
    <AppShell active="find">
      <CenterColumn layout="stack" label="search results">
        <OrbitList
          notes={results}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <p className="find-result-detail-count">
          Showing {results.length} search results for user
        </p>
      </CenterColumn>
      <DetailColumn label="note detail">
        <div className="find-result-detail-frame">
          <NoteDetail note={selected} />
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
      </DetailColumn>
    </AppShell>
  )
}

export default FindResultDetail
