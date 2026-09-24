import { useEffect, useRef, useState } from 'react'
import './create-form.css'

const SLOT_COUNT = 10
const SCROLL_STEP = 80
const ERROR_MESSAGE = '형식에 맞게 다시 입력해주세요.'

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

const INITIAL_NOTES = [
  { id: 'harbor', title: 'Harbor' },
  { id: 'morning', title: 'Morning' },
  { id: 'sunday', title: 'Sunday' },
  { id: 'draft', title: 'Draft' },
  { id: 'afternoon', title: 'Afternoon' },
  { id: 'tiny', title: 'Tiny' },
  { id: 'rain', title: 'Rain' },
  { id: 'paper', title: 'Paper' },
  { id: 'kitchen', title: 'Kitchen' },
  { id: 'winter', title: 'Winter' },
  { id: 'garden', title: 'Garden' },
  { id: 'blue', title: 'Blue' },
  { id: 'coast', title: 'Coast' },
]

function utf8Bytes(value) {
  return new TextEncoder().encode(value).length
}

function isValidAuthor(value) {
  if (!value || value !== value.trim()) return false
  if (!/^[A-Za-z가-힣 ]+$/.test(value)) return false
  return utf8Bytes(value) <= 50
}

function isValidPassword(value) {
  return /^[A-Za-z0-9]{1,25}$/.test(value)
}

function isValidTitle(value) {
  return value.trim().length > 0 && value.length <= 50
}

function isValidContent(value) {
  return value.trim().length > 0 && value.length <= 1000
}

function CreateForm() {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [windowStart, setWindowStart] = useState(0)
  const [author, setAuthor] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mode, setMode] = useState('write')
  const [errors, setErrors] = useState({})
  const centerRef = useRef(null)
  const wheelAccum = useRef(0)
  const windowStartRef = useRef(0)
  const authorRef = useRef(null)
  const passwordRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const maxStart = Math.max(0, notes.length - SLOT_COUNT)

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

  const visibleNotes = notes.slice(windowStart, windowStart + SLOT_COUNT)

  const resetForm = () => {
    setAuthor('')
    setPassword('')
    setTitle('')
    setContent('')
    setMode('write')
    setErrors({})
  }

  const resetList = () => {
    windowStartRef.current = 0
    wheelAccum.current = 0
    setWindowStart(0)
    resetForm()
  }

  const collectErrors = () => {
    const next = {}
    if (!isValidAuthor(author)) next.author = true
    if (!isValidPassword(password)) next.password = true
    if (!isValidTitle(title)) next.title = true
    if (!isValidContent(content)) next.content = true
    return next
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const nextErrors = collectErrors()
    setErrors(nextErrors)
    const firstInvalid = [
      ['author', authorRef],
      ['password', passwordRef],
      ['title', titleRef],
      ['content', contentRef],
    ].find(([key]) => nextErrors[key])
    if (firstInvalid) {
      const field = firstInvalid[1].current
      field?.scrollIntoView({ block: 'nearest' })
      if (firstInvalid[0] === 'content' && mode === 'preview') setMode('write')
      field?.focus()
      return
    }

    const note = {
      id: crypto.randomUUID(),
      title: title.trim(),
    }
    windowStartRef.current = 0
    wheelAccum.current = 0
    setWindowStart(0)
    setNotes((current) => [note, ...current])
    resetForm()
  }

  return (
    <div className="create-form">
      <aside className="create-form-nav">
        <p className="create-form-brand">jn.</p>
        <nav className="create-form-nav-list" aria-label="primary">
          <button type="button" className="create-form-nav-item" onClick={resetList}>
            list
          </button>
          <button
            type="button"
            className="create-form-nav-item is-active"
            aria-current="page"
            onClick={resetForm}
          >
            create
          </button>
          <button type="button" className="create-form-nav-item">
            find
          </button>
        </nav>
      </aside>

      <section
        ref={centerRef}
        className="create-form-center"
        aria-label="note list"
      >
        <div className="create-form-orbit">
          <p className="create-form-mark">just note</p>
          {ORBIT_SLOTS.map((slot, index) => {
            const note = visibleNotes[index]
            if (!note) return null
            const letter = Array.from(note.title)[0]
            return (
              <button
                key={slot.left + '-' + slot.top}
                type="button"
                className="create-form-orbit-box"
                style={{ left: slot.left, top: slot.top }}
                aria-label={note.title}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </section>

      <aside className="create-form-panel" aria-label="create note">
        <form className="create-form-form" onSubmit={onSubmit} noValidate>
          <h1 className="create-form-heading">New Note</h1>

          <div className="create-form-row">
            <label className="create-form-field">
              <span className="create-form-label">Author</span>
              <input
                ref={authorRef}
                className={
                  errors.author
                    ? 'create-form-input is-invalid'
                    : 'create-form-input'
                }
                type="text"
                name="author"
                value={author}
                placeholder="Enter author name"
                aria-invalid={errors.author || undefined}
                onChange={(event) => {
                  setAuthor(event.target.value)
                  if (errors.author && isValidAuthor(event.target.value)) {
                    setErrors((current) => ({ ...current, author: false }))
                  }
                }}
              />
              {errors.author ? (
                <p className="create-form-error">{ERROR_MESSAGE}</p>
              ) : null}
            </label>

            <label className="create-form-field">
              <span className="create-form-label">Password</span>
              <input
                ref={passwordRef}
                className={
                  errors.password
                    ? 'create-form-input is-invalid'
                    : 'create-form-input'
                }
                type="password"
                name="password"
                value={password}
                placeholder="4-digit pin"
                maxLength={25}
                aria-invalid={errors.password || undefined}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password && isValidPassword(event.target.value)) {
                    setErrors((current) => ({ ...current, password: false }))
                  }
                }}
              />
              {errors.password ? (
                <p className="create-form-error">{ERROR_MESSAGE}</p>
              ) : null}
            </label>
          </div>

          <label className="create-form-field is-block">
            <span className="create-form-label">Title</span>
            <input
              ref={titleRef}
              className={
                errors.title ? 'create-form-input is-invalid' : 'create-form-input'
              }
              type="text"
              name="title"
              value={title}
              placeholder="Note title"
              maxLength={50}
              aria-invalid={errors.title || undefined}
              onChange={(event) => {
                setTitle(event.target.value)
                if (errors.title && isValidTitle(event.target.value)) {
                  setErrors((current) => ({ ...current, title: false }))
                }
              }}
            />
            {errors.title ? (
              <p className="create-form-error">{ERROR_MESSAGE}</p>
            ) : null}
          </label>

          <div className="create-form-field is-block">
            <div className="create-form-content-head">
              <span className="create-form-label" id="create-form-content-label">
                Content
              </span>
              <div className="create-form-tabs">
                <button
                  type="button"
                  className={
                    mode === 'write'
                      ? 'create-form-tab is-active'
                      : 'create-form-tab'
                  }
                  onClick={() => setMode('write')}
                >
                  Write
                </button>
                <button
                  type="button"
                  className={
                    mode === 'preview'
                      ? 'create-form-tab is-active'
                      : 'create-form-tab'
                  }
                  onClick={() => setMode('preview')}
                >
                  Preview
                </button>
              </div>
            </div>
            {mode === 'write' ? (
              <textarea
                ref={contentRef}
                className={
                  errors.content
                    ? 'create-form-editor is-invalid'
                    : 'create-form-editor'
                }
                name="content"
                value={content}
                placeholder="Type note content here..."
                maxLength={1000}
                aria-labelledby="create-form-content-label"
                aria-invalid={errors.content || undefined}
                onChange={(event) => {
                  setContent(event.target.value)
                  if (errors.content && isValidContent(event.target.value)) {
                    setErrors((current) => ({ ...current, content: false }))
                  }
                }}
              />
            ) : (
              <div
                className={
                  errors.content
                    ? 'create-form-editor create-form-preview is-invalid'
                    : 'create-form-editor create-form-preview'
                }
                aria-labelledby="create-form-content-label"
              >
                {content ? (
                  content
                ) : (
                  <span className="create-form-placeholder">
                    Type note content here...
                  </span>
                )}
              </div>
            )}
            {errors.content ? (
              <p className="create-form-error">{ERROR_MESSAGE}</p>
            ) : null}
          </div>

          <div className="create-form-actions">
            <button type="submit" className="create-form-submit">
              submit
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}

export default CreateForm
