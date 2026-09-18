import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from '../lib/data.js'
import { SearchIcon, CloseIcon, BookIcon, FileIcon } from './Icons.jsx'

/** Wrap every match of `q` in the text with <mark>. */
function Highlight({ text, q }) {
  const parts = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return [text]
    const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'ig')
    return String(text).split(re)
  }, [text, q])

  return parts.map((part, i) =>
    i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
  )
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export default function SearchBar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const hits = useMemo(() => search(q), [q])
  const courses = hits.filter((h) => h.type === 'course')
  const files = hits.filter((h) => h.type === 'file')
  const ordered = [...courses, ...files]

  // Ctrl/Cmd+K focuses the field from anywhere on the page.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Clicking anywhere outside dismisses the results.
  useEffect(() => {
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  useEffect(() => setActive(0), [q])

  const go = (hit) => {
    if (!hit) return
    navigate(hit.to)
    setQ('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!ordered.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % ordered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + ordered.length) % ordered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(ordered[active])
    }
  }

  const showPanel = open && q.trim().length > 0

  const renderHit = (hit, index) => {
    const Icon = hit.type === 'course' ? BookIcon : FileIcon
    return (
      <button
        key={hit.to + index}
        type="button"
        className="search__hit"
        data-active={index === active}
        role="option"
        aria-selected={index === active}
        onMouseEnter={() => setActive(index)}
        onClick={() => go(hit)}
      >
        <span className="dot" />
        <span className="txt">
          <span className="lbl">
            <Highlight text={hit.label} q={q} />
          </span>
          <span className="sub">{hit.sub}</span>
        </span>
        <Icon size={15} />
      </button>
    )
  }

  return (
    <div className="search" ref={boxRef}>
      <div className="search__field">
        <SearchIcon className="search__icon" size={17} />
        <input
          ref={inputRef}
          type="text"
          value={q}
          placeholder="Search courses and files…"
          aria-label="Search courses and files"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="search-results"
          aria-autocomplete="list"
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {q ? (
          <button
            type="button"
            className="search__clear"
            aria-label="Clear search"
            onClick={() => {
              setQ('')
              inputRef.current?.focus()
            }}
          >
            <CloseIcon size={13} />
          </button>
        ) : (
          <kbd className="search__kbd">Ctrl K</kbd>
        )}
      </div>

      {showPanel && (
        <div className="search__panel" id="search-results" role="listbox">
          {ordered.length === 0 ? (
            <p className="search__none">
              Nothing matches “{q.trim()}”.
            </p>
          ) : (
            <>
              {courses.length > 0 && <div className="search__group">Courses</div>}
              {courses.map((hit, i) => renderHit(hit, i))}
              {files.length > 0 && <div className="search__group">Files</div>}
              {files.map((hit, i) => renderHit(hit, courses.length + i))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
