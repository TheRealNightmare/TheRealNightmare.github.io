import { useEffect, useId, useState } from 'react'
import EntryRow from './EntryRow.jsx'
import { InboxIcon, ChevronIcon } from './Icons.jsx'
import { entryPath } from '../lib/data.js'

/** Per-browser memory of which sections the reader left open. */
const storageKey = (course, termKey, kind) => `section:${course.code}:${termKey}:${kind}`

function readOpen(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    // Private mode or blocked storage — fall back to the collapsed default.
    return false
  }
}

export default function SectionList({ course, termKey, kind, icon, title, entries, emptyText }) {
  const key = storageKey(course, termKey, kind)
  // Collapsed by default; a remembered choice overrides that.
  const [open, setOpen] = useState(() => readOpen(key))
  const regionId = useId()

  // Re-read when the reader moves to a different course or term, since the
  // component is reused across those navigations.
  useEffect(() => {
    setOpen(readOpen(key))
  }, [key])

  useEffect(() => {
    try {
      localStorage.setItem(key, open ? '1' : '0')
    } catch {
      /* nothing to persist to — the toggle still works for this visit */
    }
  }, [key, open])

  return (
    <section className={open ? 'section section--open' : 'section'}>
      <h2 className="section__head">
        <button
          type="button"
          className="section__title"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronIcon className="section__chev" size={16} />
          <span className="section__icon">{icon}</span>
          <span className="section__label">{title}</span>
          <span className="section__count">
            {entries.length} {entries.length === 1 ? 'file' : 'files'}
          </span>
        </button>
      </h2>

      {/* Rows are only mounted while open, so each expand replays the stagger. */}
      {open &&
        (entries.length === 0 ? (
          <p className="empty" id={regionId}>
            <InboxIcon size={24} />
            {emptyText}
          </p>
        ) : (
          <div className="list" id={regionId}>
            {entries.map((entry, i) => (
              <EntryRow
                key={entry.slug}
                index={i}
                entry={entry}
                to={entryPath(course, termKey, kind, entry.slug)}
              />
            ))}
          </div>
        ))}
    </section>
  )
}
