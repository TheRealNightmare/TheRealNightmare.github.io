import { Link } from 'react-router-dom'
import { FileIcon, ChevronIcon } from './Icons.jsx'

/** One PDF in a list — a link through to its own viewer page. */
export default function EntryRow({ entry, to, index = 0 }) {
  return (
    <Link className="row reveal" style={{ '--i': index }} to={to}>
      <span className="row__icon">
        <FileIcon size={18} />
      </span>
      <span className="row__text">
        <span className="row__title">{entry.title}</span>
        {entry.credit ? <span className="row__credit">by {entry.credit}</span> : null}
      </span>
      <ChevronIcon className="row__go" size={17} />
    </Link>
  )
}
