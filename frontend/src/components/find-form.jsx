import { useState } from 'react'
import './find-form.css'

export const FIND_EMPTY_MESSAGE =
  'No matching notes. Please check the author or password again.'

export function FindSearch({ onSearch }) {
  const [author, setAuthor] = useState('')
  const [password, setPassword] = useState('')

  const submit = (event) => {
    event.preventDefault()
    onSearch(author, password)
  }

  return (
    <form className="find-form-search" onSubmit={submit}>
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
  )
}
