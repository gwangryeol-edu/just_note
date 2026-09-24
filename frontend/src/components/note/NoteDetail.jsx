import detailLine from '../../assets/list-detail-line.svg'
import './note-detail.css'

export function NoteDetail({ note }) {
  if (!note) return null

  return (
    <article className="note-detail">
      <div className="note-detail-heading">
        <h1 className="note-detail-title">{note.title}</h1>
        <p className="note-detail-author">by {note.author}</p>
      </div>
      <div className="note-detail-line">
        <img src={detailLine} alt="" width="400" height="1" />
      </div>
      <p className="note-detail-body">{note.content}</p>
    </article>
  )
}
