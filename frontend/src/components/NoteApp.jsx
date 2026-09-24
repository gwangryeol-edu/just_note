import { useState } from 'react'
import { SEED_NOTES } from '../data/notes.js'
import { NoteForm } from './create-form.jsx'
import { FIND_EMPTY_MESSAGE, FindSearch } from './find-form.jsx'
import { AppShell, CenterColumn, DetailColumn } from './layout/AppShell.jsx'
import './list-default.css'
import { NoteDetail } from './note/NoteDetail.jsx'
import { OrbitList, SLOT_COUNT } from './orbit/OrbitList.jsx'
import { useOrbitWindow } from './orbit/useOrbitWindow.js'
import './find-result-detail.css'

function matchesQuery(note, query) {
  return note.author === query.author && note.password === query.password
}

function NoteApp() {
  const [notes, setNotes] = useState(SEED_NOTES)
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState(null)
  const [miss, setMiss] = useState(false)

  const isFindSession = view === 'result' || view === 'update'
  const resultNotes = query ? notes.filter((note) => matchesQuery(note, query)) : []
  const orbitNotes = isFindSession ? resultNotes : notes
  const { windowStart, centerRef, resetWindow } = useOrbitWindow(
    orbitNotes.length,
    view,
  )
  const visibleNotes = orbitNotes.slice(windowStart, windowStart + SLOT_COUNT)
  const selected = orbitNotes.find((note) => note.id === selectedId) ?? null

  const goList = () => {
    resetWindow()
    setView('list')
    setSelectedId(null)
    setQuery(null)
    setMiss(false)
  }

  const goCreate = () => {
    setView('create')
    setSelectedId(null)
    setMiss(false)
  }

  const goFind = () => {
    resetWindow()
    setView('find')
    setSelectedId(null)
    setQuery(null)
    setMiss(false)
  }

  const openNote = (id) => {
    setSelectedId(id)
    if (view === 'list' || view === 'detail') setView('detail')
  }

  const onCreated = (fields) => {
    const note = {
      id: crypto.randomUUID(),
      ...fields,
      createdAt: new Date(),
    }
    setNotes((current) => [note, ...current])
    resetWindow()
    setView('list')
    setSelectedId(null)
    setQuery(null)
    setMiss(false)
  }

  const onSearch = (author, password) => {
    const matched = notes.filter((note) => matchesQuery(note, { author, password }))
    resetWindow()
    if (matched.length === 0) {
      setQuery(null)
      setMiss(true)
      setView('find')
      setSelectedId(null)
      return
    }
    setMiss(false)
    setQuery({ author, password })
    setSelectedId(matched[0].id)
    setView('result')
  }

  const onUpdated = (fields) => {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? { ...note, ...fields, updatedAt: new Date() }
          : note,
      ),
    )
    setView('result')
  }

  const onDelete = () => {
    if (!selected) return
    const confirmed = window.confirm(
      `Are you sure you want to delete the note "${selected.title}"?`,
    )
    if (!confirmed) return
    const nextNotes = notes.filter((note) => note.id !== selected.id)
    const nextResults = query
      ? nextNotes.filter((note) => matchesQuery(note, query))
      : []
    setNotes(nextNotes)
    if (nextResults.length === 0) {
      setQuery(null)
      setSelectedId(null)
      setMiss(true)
      setView('find')
      return
    }
    setSelectedId(nextResults[0].id)
    setView('result')
  }

  const navActive = view === 'create' || view === 'update' ? (view === 'update' ? 'find' : 'create') : view === 'list' || view === 'detail' ? 'list' : 'find'

  return (
    <AppShell
      active={navActive}
      onSelect={{ list: goList, create: goCreate, find: goFind }}
    >
      <CenterColumn
        columnRef={centerRef}
        layout={view === 'find' || isFindSession ? 'stack' : 'single'}
        label={isFindSession ? 'search results' : 'note list'}
      >
        {view === 'find' && miss ? (
          <p className="find-form-empty-message">{FIND_EMPTY_MESSAGE}</p>
        ) : (
          <OrbitList
            notes={visibleNotes}
            selectedId={view === 'detail' || isFindSession ? selectedId : null}
            onSelect={view === 'list' || view === 'detail' || view === 'result' ? openNote : undefined}
          />
        )}
        {view === 'find' ? <FindSearch onSearch={onSearch} /> : null}
        {isFindSession ? (
          <p className="find-result-detail-count">
            Showing {resultNotes.length} search results for user
          </p>
        ) : null}
      </CenterColumn>

      <DetailColumn
        label={view === 'create' || view === 'update' ? 'create note' : 'note detail'}
        scroll={view === 'create' || view === 'update'}
      >
        {view === 'list' ? (
          <div className="note-list-empty">
            <span className="note-list-rule" />
          </div>
        ) : null}
        {view === 'detail' || view === 'result' ? (
          view === 'result' ? (
            <div className="find-result-detail-frame">
              <NoteDetail note={selected} />
              {selected ? (
                <div className="find-result-detail-actions">
                  <button
                    type="button"
                    className="find-result-detail-action"
                    onClick={() => setView('update')}
                  >
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
          ) : (
            <NoteDetail note={selected} />
          )
        ) : null}
        {view === 'create' ? (
          <NoteForm key="create" onSubmitNote={onCreated} />
        ) : null}
        {view === 'update' && selected ? (
          <NoteForm key={selected.id} initial={selected} onSubmitNote={onUpdated} />
        ) : null}
        {view === 'find' ? (
          <div className="find-form-waiting">
            <p className="find-form-waiting-text">awaiting query</p>
            <span className="find-form-rule" />
          </div>
        ) : null}
      </DetailColumn>
    </AppShell>
  )
}

export default NoteApp
