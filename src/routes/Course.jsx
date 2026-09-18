import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { BookIcon, ChevronLeftIcon } from '../components/Icons.jsx'
import { TERMS, findCourse, getTerm } from '../lib/data.js'

export default function Course() {
  const { code } = useParams()
  const course = findCourse(code)

  if (!course) return <Navigate to="/" replace />

  return (
    <div className="shell">
      <Breadcrumbs items={[{ label: 'Courses', to: '/' }, { label: course.code }]} />

      <Link className="btn btn--ghost page-back" to="/" aria-label="Back to all courses">
        <ChevronLeftIcon size={16} />
        Back
      </Link>

      <header className="page-head">
        <span className="eyebrow">Course</span>
        <h1>{course.code}</h1>
        <p>{course.name}</p>
      </header>

      <div className="grid grid--two">
        {Object.values(TERMS).map((term, i) => {
          const { notes, solves } = getTerm(course, term.key)
          const total = notes.length + solves.length
          return (
            <Link
              key={term.key}
              className="card card--term reveal"
              style={{ '--i': i }}
              to={`/c/${encodeURIComponent(course.code)}/${term.key}`}
            >
              <span className="term-icon">
                <BookIcon size={22} />
              </span>
              <span>
                <span className="card__code">{term.label}</span>
                <span className="card__name">
                  {total === 0 ? 'No files yet' : `${total} ${total === 1 ? 'file' : 'files'}`}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
