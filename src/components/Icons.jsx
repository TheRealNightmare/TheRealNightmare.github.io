/* Shared inline icons — stroked, 24-grid, inherit currentColor. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4, /* heavier stroke to sit alongside the brutalist borders */
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

const make = (path, sw) => (props) => (
  <svg width={props?.size ?? 18} height={props?.size ?? 18} {...base} strokeWidth={sw ?? base.strokeWidth} className={props?.className}>
    {path}
  </svg>
)

export const BookIcon = make(
  <>
    <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H9a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5h-5A1.5 1.5 0 0 1 3 15Z" />
    <path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H15a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5h5A1.5 1.5 0 0 0 21 15Z" />
  </>
)

export const NotesIcon = make(
  <>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h7L19 8.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5Z" />
    <path d="M13 3v6h6M8.5 13h7M8.5 17h4.5" />
  </>
)

export const SolvesIcon = make(
  <>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5Z" />
    <path d="m8.5 11.5 2 2 4.5-4.5M8.5 17h7" />
  </>
)

export const FileIcon = make(
  <>
    <path d="M6 3.8A1.3 1.3 0 0 1 7.3 2.5h6.2L18.5 7.5v12.7a1.3 1.3 0 0 1-1.3 1.3H7.3A1.3 1.3 0 0 1 6 20.2Z" />
    <path d="M13.5 2.5v5.5h5" />
  </>
)

export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </>
)

export const ChevronIcon = make(<path d="m9 6 6 6-6 6" />, 2.8)
export const ChevronLeftIcon = make(<path d="m15 6-6 6 6 6" />, 2.8)
export const CloseIcon = make(<path d="m7 7 10 10M17 7 7 17" />, 2.8)

export const DownloadIcon = make(
  <>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4.5 17v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
  </>
)

export const PrintIcon = make(
  <>
    <path d="M7 8.5V4.5A1 1 0 0 1 8 3.5h8a1 1 0 0 1 1 1v4" />
    <path d="M5 8.5h14a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-2M7 16.5H5A1.5 1.5 0 0 1 3.5 15v-5A1.5 1.5 0 0 1 5 8.5" />
    <path d="M7 14.5h10v5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" />
  </>
)

export const ExternalIcon = make(
  <>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </>
)

export const InboxIcon = make(
  <>
    <path d="M3.5 13.5h4l1.5 3h6l1.5-3h4" />
    <path d="M6 4.5h12l2.5 9v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Z" />
  </>
)
