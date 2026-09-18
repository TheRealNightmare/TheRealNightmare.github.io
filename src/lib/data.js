import data from '../data/courses.json'

export const TERMS = {
  mid: { key: 'mid', label: 'Mid', solvesLabel: 'Mid Solves' },
  final: { key: 'final', label: 'Final', solvesLabel: 'Final Solves' },
}

export const KINDS = {
  notes: { key: 'notes', label: 'Class Notes' },
  solves: { key: 'solves', label: 'Solves' },
}

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '')

/** URL-safe slug for an entry title: "Spring 2023" -> "spring-2023". */
export function slugify(s) {
  return (
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'file'
  )
}

export const courses = Array.isArray(data.courses) ? data.courses : []

/** Course codes match case- and space-insensitively, so /c/cse220 works. */
export function findCourse(code) {
  return courses.find((c) => norm(c.code) === norm(code)) || null
}

/**
 * Entries for one course/term/kind, each given a slug that is unique within
 * its list — duplicate titles get -2, -3 suffixes so every PDF has its own URL.
 */
export function entriesOf(course, termKey, kind) {
  const raw = course?.terms?.[termKey]?.[kind]
  if (!Array.isArray(raw)) return []
  const seen = new Map()
  return raw.map((entry) => {
    const base = slugify(entry.title)
    const n = (seen.get(base) || 0) + 1
    seen.set(base, n)
    return { ...entry, kind, slug: n === 1 ? base : `${base}-${n}` }
  })
}

/** Both lists for a term. */
export function getTerm(course, termKey) {
  return {
    notes: entriesOf(course, termKey, 'notes'),
    solves: entriesOf(course, termKey, 'solves'),
  }
}

export function findEntry(course, termKey, kind, slug) {
  const want = String(slug || '').toLowerCase()
  return entriesOf(course, termKey, kind).find((e) => e.slug === want) || null
}

/** Total PDFs across both terms — shown on the course cards. */
export function countItems(course) {
  return Object.keys(TERMS).reduce((n, key) => {
    const { notes, solves } = getTerm(course, key)
    return n + notes.length + solves.length
  }, 0)
}

/** Link to a single PDF page. */
export function entryPath(course, termKey, kind, slug) {
  return `/c/${encodeURIComponent(course.code)}/${termKey}/${kind}/${slug}`
}

/**
 * Flat index of everything searchable: each course, and each PDF inside it.
 * Built once at module load — the dataset is small and fully static.
 */
export const searchIndex = courses.flatMap((course) => {
  const rows = [
    {
      type: 'course',
      course,
      label: course.code,
      sub: course.name,
      haystack: `${course.code} ${course.name}`.toLowerCase(),
      to: `/c/${encodeURIComponent(course.code)}`,
    },
  ]
  for (const term of Object.values(TERMS)) {
    for (const kind of Object.keys(KINDS)) {
      for (const entry of entriesOf(course, term.key, kind)) {
        const where = kind === 'solves' ? term.solvesLabel : `${term.label} · Class Notes`
        rows.push({
          type: 'file',
          course,
          label: entry.title,
          sub: `${course.code} · ${where}`,
          haystack: `${entry.title} ${course.code} ${course.name} ${where}`.toLowerCase(),
          to: entryPath(course, term.key, kind, entry.slug),
        })
      }
    }
  }
  return rows
})

/** Every whitespace-separated term must appear somewhere in the row. */
export function search(query, limit = 12) {
  const terms = String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return searchIndex
    .filter((row) => terms.every((t) => row.haystack.includes(t)))
    .slice(0, limit)
}
