import { useEffect, useRef, useState } from 'react'
import './find-form.css'

const SLOT_COUNT = 10
const SCROLL_STEP = 80
const EMPTY_MESSAGE =
  '일치하는 note가 없습니다. 작성자 혹은 비밀번호를 다시 확인해주세요'

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
  { id: 'harbor', title: 'Harbor', author: 'mina', password: 'abcd12' },
  { id: 'morning', title: 'Morning', author: 'jun', password: 'note01' },
  { id: 'sunday', title: 'Sunday', author: 'mina', password: 'abcd12' },
  { id: 'draft', title: 'Draft', author: 'seo', password: 'draft9' },
  { id: 'afternoon', title: 'Afternoon', author: 'nari', password: 'walk22' },
  { id: 'tiny', title: 'Tiny', author: 'min', password: 'keep1' },
  { id: 'rain', title: 'Rain', author: 'mina', password: 'abcd12' },
  { id: 'paper', title: 'Paper', author: 'do', password: 'fold3' },
  { id: 'kitchen', title: 'Kitchen', author: 'ara', password: 'onion7' },
  { id: 'winter', title: 'Winter', author: 'leo', password: 'letter' },
  { id: 'garden', title: 'Garden', author: 'sol', password: 'basil2' },
  { id: 'blue', title: 'Blue', author: 'ian', password: 'sky88' },
  { id: 'coast', title: 'Coast', author: 'rin', password: 'sand04' },
]

function FindForm() {
  const [windowStart, setWindowStart] = useState(0)
  const [author, setAuthor] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)
  const centerRef = useRef(null)
  const wheelAccum = useRef(0)
  const windowStartRef = useRef(0)

  const source = result ?? NOTES
  const maxStart = Math.max(0, source.length - SLOT_COUNT)

  useEffect(() => {
    const center = centerRef.current
    if (!center) return undefined

    const onWheel = (event) => {
      if (result && result.length === 0) return
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
  }, [maxStart, result])

  const visibleNotes = source.slice(windowStart, windowStart + SLOT_COUNT)

  const resetWindow = () => {
    windowStartRef.current = 0
    wheelAccum.current = 0
    setWindowStart(0)
  }

  const resetList = () => {
    resetWindow()
    setAuthor('')
    setPassword('')
    setResult(null)
  }

  const onSearch = (event) => {
    event.preventDefault()
    const matched = NOTES.filter(
      (note) => note.author === author && note.password === password,
    )
    resetWindow()
    setResult(matched)
  }

  return (
    <div className="find-form">
      <aside className="find-form-nav">
        <p className="find-form-brand">jn.</p>
        <nav className="find-form-nav-list" aria-label="primary">
          <button type="button" className="find-form-nav-item" onClick={resetList}>
            list
          </button>
          <button type="button" className="find-form-nav-item">
            create
          </button>
          <button
            type="button"
            className="find-form-nav-item is-active"
            aria-current="page"
          >
            find
          </button>
        </nav>
      </aside>

      <section ref={centerRef} className="find-form-center" aria-label="note list">
        {result && result.length === 0 ? (
          <p className="find-form-empty-message">{EMPTY_MESSAGE}</p>
        ) : (
          <div className="find-form-orbit">
            <p className="find-form-mark">just note</p>
            {ORBIT_SLOTS.map((slot, index) => {
              const note = visibleNotes[index]
              if (!note) return null
              return (
                <button
                  key={slot.left + '-' + slot.top}
                  type="button"
                  className="find-form-orbit-box"
                  style={{ left: slot.left, top: slot.top }}
                  aria-label={note.title}
                >
                  {Array.from(note.title)[0]}
                </button>
              )
            })}
          </div>
        )}

        <form className="find-form-search" onSubmit={onSearch}>
          <p className="find-form-search-title">Find Note</p>
          <label className="find-form-field">
            <span className="find-form-label">Author</span>
            <input
              className="find-form-input"
              type="text"
              name="author"
              value={author}
              placeholder="Author name"
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
          <label className="find-form-field">
            <span className="find-form-label">Password</span>
            <input
              className="find-form-input"
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <div className="find-form-search-action">
            <button type="submit" className="find-form-search-button">
              search
            </button>
          </div>
        </form>
      </section>

      <aside className="find-form-panel" aria-label="note detail">
        <div className="find-form-waiting">
          <p className="find-form-waiting-text">awaiting query</p>
          <span className="find-form-rule" />
        </div>
      </aside>
    </div>
  )
}

export default FindForm
