import { useRef, useState } from 'react'
import './create-form.css'

const ERROR_MESSAGE = 'Please enter it in the correct format.'

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

export function NoteForm({ initial, onSubmitNote }) {
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [password, setPassword] = useState(initial?.password ?? '')
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [mode, setMode] = useState('write')
  const [errors, setErrors] = useState({})
  const authorRef = useRef(null)
  const passwordRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)

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

    onSubmitNote({
      author: author.trim(),
      password,
      title: title.trim(),
      content,
    })
  }

  return (
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
  )
}
