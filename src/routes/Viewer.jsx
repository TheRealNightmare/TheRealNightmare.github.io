import { Link, Navigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { ChevronIcon, ChevronLeftIcon, DownloadIcon, ExternalIcon, PrintIcon } from '../components/Icons.jsx'
import { KINDS, TERMS, entriesOf, entryPath, findCourse } from '../lib/data.js'
import { driveId, downloadUrl, previewUrl, printUrl, viewUrl } from '../lib/drive.js'

export default function Viewer() {
  const { code, term: termParam, kind: kindParam, slug } = useParams()
  const course = findCourse(code)
  const term = TERMS[String(termParam || '').toLowerCase()]
  const kind = KINDS[String(kindParam || '').toLowerCase()]

  if (!course) return <Navigate to="/" replace />
  if (!term || !kind) return <Navigate to={`/c/${encodeURIComponent(code)}`} replace />

  const list = entriesOf(course, term.key, kind.key)
  const index = list.findIndex((e) => e.slug === String(slug || '').toLowerCase())
  const termPath = `/c/${encodeURIComponent(course.code)}/${term.key}`

  if (index === -1) return <Navigate to={termPath} replace />

  const entry = list[index]
  const prev = list[index - 1]
  const next = list[index + 1]
  const fileId = driveId(entry.drive)
  const sectionLabel = kind.key === 'solves' ? term.solvesLabel : 'Class Notes'

  return (
    <div className="shell">
      <Breadcrumbs
        items={[
          { label: 'Courses', to: '/' },
          { label: course.code, to: `/c/${encodeURIComponent(course.code)}` },
          { label: term.label, to: termPath },
          { label: entry.title },
        ]}
      />

      <div className="viewer-page">
        <div className="viewer-bar">
          <Link className="btn btn--ghost" to={termPath}>
            <ChevronLeftIcon size={16} />
            Back
          </Link>

          <div className="viewer-bar__text">
            <h1>{entry.title}</h1>
            <p className="viewer-bar__sub">
              {course.code} · {sectionLabel}
              {entry.credit ? ` · by ${entry.credit}` : ''}
              {list.length > 1 ? ` · ${index + 1} of ${list.length}` : ''}
            </p>
          </div>

          {fileId && (
            <div className="actions">
              <a className="btn btn--primary" href={downloadUrl(fileId)} download>
                <DownloadIcon size={16} />
                Download
              </a>
              {/* A page cannot print a cross-origin iframe, so printing happens
                  in Drive's own full viewer, opened in a new tab. */}
              <a
                className="btn"
                href={printUrl(fileId)}
                target="_blank"
                rel="noreferrer noopener"
                title="Opens the file in a new tab, where Ctrl+P prints every page"
              >
                <PrintIcon size={16} />
                Print
              </a>
              <a className="btn" href={viewUrl(fileId)} target="_blank" rel="noreferrer noopener">
                <ExternalIcon size={15} />
                Drive
              </a>
            </div>
          )}
        </div>

        {fileId ? (
          <>
            <div className="viewer-frame reveal-pop">
              <iframe src={previewUrl(fileId)} title={entry.title} allow="autoplay" />
            </div>
            <p className="viewer-note">
              Scroll inside the document to move through all pages. If it does not load, the
              file may not be shared publicly — open it in Drive to check.
            </p>
          </>
        ) : (
          <p className="bad-link reveal-pop">
            This entry has no usable Google Drive link. Check the <code>drive</code> value for
            “{entry.title}” in <code>src/data/courses.json</code>.
          </p>
        )}

        {(prev || next) && (
          <nav className="viewer-nav" aria-label="Other files in this section">
            {prev ? (
              <Link to={entryPath(course, term.key, kind.key, prev.slug)}>
                <ChevronLeftIcon size={15} />
                <span>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={entryPath(course, term.key, kind.key, next.slug)}>
                <span>{next.title}</span>
                <ChevronIcon size={15} />
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
