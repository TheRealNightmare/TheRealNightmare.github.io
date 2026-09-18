// Google Drive file IDs are 25+ chars of [A-Za-z0-9_-].
const ID_RE = /[A-Za-z0-9_-]{25,}/

/**
 * Accepts any of the shapes Drive hands you and returns the bare file ID:
 *   https://drive.google.com/file/d/<id>/view?usp=sharing
 *   https://drive.google.com/open?id=<id>
 *   https://drive.google.com/uc?export=download&id=<id>
 *   <id>
 * Returns null when nothing usable is found, so callers can show an error
 * instead of embedding a blank iframe.
 */
export function driveId(input) {
  if (typeof input !== 'string') return null
  const raw = input.trim()
  if (!raw) return null

  const fromPath = raw.match(/\/d\/([A-Za-z0-9_-]{25,})/)
  if (fromPath) return fromPath[1]

  const fromQuery = raw.match(/[?&]id=([A-Za-z0-9_-]{25,})/)
  if (fromQuery) return fromQuery[1]

  // A bare ID pasted on its own.
  if (!raw.includes('/') && ID_RE.test(raw)) return raw.match(ID_RE)[0]

  return null
}

/** Embeddable viewer URL for an <iframe>. */
export const previewUrl = (id) => `https://drive.google.com/file/d/${id}/preview`

/** Full Drive page, for the "Open in Drive" button. */
export const viewUrl = (id) => `https://drive.google.com/file/d/${id}/view`

/**
 * Direct download. Navigating here saves the file — no CORS involved, because
 * it is a plain navigation rather than a fetch from our own origin.
 */
export const downloadUrl = (id) =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download`

/**
 * Print target. A page cannot call print() on a cross-origin iframe, so the
 * button opens Drive's own full viewer in a new tab, where the browser's
 * print dialog (and Drive's print button) reach the whole document.
 */
export const printUrl = (id) => `https://drive.google.com/file/d/${id}/view`
