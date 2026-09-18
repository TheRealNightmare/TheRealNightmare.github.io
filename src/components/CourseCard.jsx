import { Link } from 'react-router-dom'
import { FileIcon } from './Icons.jsx'
import { countItems } from '../lib/data.js'

export default function CourseCard({ course, index = 0 }) {
  const total = countItems(course)
  return (
    <Link
      className="card card--course reveal"
      style={{ '--i': index }}
      to={`/c/${encodeURIComponent(course.code)}`}
    >
      <span className="card__code">{course.code}</span>
      <span className="card__name">{course.name}</span>
      <span className="card__meta">
        <FileIcon size={13} />
        {total === 0 ? 'No files yet' : `${total} ${total === 1 ? 'file' : 'files'}`}
      </span>
    </Link>
  )
}
