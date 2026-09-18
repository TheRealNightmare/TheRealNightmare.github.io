import CourseCard from '../components/CourseCard.jsx'
import { InboxIcon, BookIcon, FileIcon } from '../components/Icons.jsx'
import { countItems, courses } from '../lib/data.js'

export default function Home() {
  const totalFiles = courses.reduce((n, c) => n + countItems(c), 0)

  return (
    <>
      <section className="hero">
        <div className="shell">
          <h1 className="reveal" style={{ '--i': 0 }}>
            Everything you need,
            <br />
            <span className="accent">one course away.</span>
          </h1>
          <p className="reveal" style={{ '--i': 1 }}>
            Class notes and past exam solves for every course — organised by Mid and Final,
            readable right here.
          </p>
          <div className="hero__stats reveal" style={{ '--i': 2 }}>
            <span className="chip">
              <BookIcon size={15} />
              <b>{courses.length}</b> {courses.length === 1 ? 'course' : 'courses'}
            </span>
            <span className="chip">
              <FileIcon size={15} />
              <b>{totalFiles}</b> {totalFiles === 1 ? 'file' : 'files'}
            </span>
          </div>
        </div>
      </section>

      <div className="shell">
        {courses.length === 0 ? (
          <p className="empty">
            <InboxIcon size={26} />
            No courses yet — add one in <code>src/data/courses.json</code>.
          </p>
        ) : (
          <div className="grid">
            {courses.map((course, i) => (
              <CourseCard key={course.code} index={i} course={course} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
