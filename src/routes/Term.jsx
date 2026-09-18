import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import SectionList from '../components/SectionList.jsx'
import { ChevronLeftIcon, NotesIcon, SolvesIcon } from '../components/Icons.jsx'
import { TERMS, findCourse, getTerm } from '../lib/data.js'

export default function Term() {
  const { code, term: termKey } = useParams()
  const course = findCourse(code)
  const term = TERMS[String(termKey || '').toLowerCase()]

  if (!course) return <Navigate to="/" replace />
  if (!term) return <Navigate to={`/c/${encodeURIComponent(code)}`} replace />

  const { notes, solves } = getTerm(course, term.key)
  const coursePath = `/c/${encodeURIComponent(course.code)}`

  return (
    <div className="shell">
      <Breadcrumbs
        items={[
          { label: 'Courses', to: '/' },
          { label: course.code, to: coursePath },
          { label: term.label },
        ]}
      />

      <Link
        className="btn btn--ghost page-back"
        to={coursePath}
        aria-label={`Back to ${course.code}`}
      >
        <ChevronLeftIcon size={16} />
        Back
      </Link>

      <header className="page-head">
        <span className="eyebrow">{term.label} term</span>
        <h1>{course.code}</h1>
        <p>{course.name}</p>
      </header>

      <div className="sections">
        <SectionList
          course={course}
          termKey={term.key}
          kind="notes"
          icon={<NotesIcon size={17} />}
          title="Class Notes"
          entries={notes}
          emptyText="No class notes added for this term yet."
        />
        <SectionList
          course={course}
          termKey={term.key}
          kind="solves"
          icon={<SolvesIcon size={17} />}
          title={term.solvesLabel}
          entries={solves}
          emptyText={`No ${term.solvesLabel.toLowerCase()} added yet.`}
        />
      </div>
    </div>
  )
}
