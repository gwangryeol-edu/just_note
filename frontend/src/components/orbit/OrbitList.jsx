import './orbit.css'

/** 9시 방향부터 시계 방향. 프레임 500×500 기준 좌표. */
export const ORBIT_SLOTS = [
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

export const SLOT_COUNT = ORBIT_SLOTS.length

function noteAtSlot(notes, index) {
  if (notes.some((note) => note.slot != null)) {
    return notes.find((note) => note.slot === index) ?? null
  }
  return notes[index] ?? null
}

export function OrbitList({ notes, selectedId, onSelect }) {
  return (
    <div className="orbit">
      <p className="orbit-mark">just note</p>
      {ORBIT_SLOTS.map((slot, index) => {
        const note = noteAtSlot(notes, index)
        if (!note) return null
        const isSelected = selectedId === note.id
        return (
          <button
            key={index}
            type="button"
            className={isSelected ? 'orbit-box is-selected' : 'orbit-box'}
            style={{ left: slot.left, top: slot.top }}
            aria-pressed={onSelect ? isSelected : undefined}
            aria-label={note.title}
            onClick={onSelect ? () => onSelect(note.id) : undefined}
          >
            {Array.from(note.title)[0]}
          </button>
        )
      })}
    </div>
  )
}
