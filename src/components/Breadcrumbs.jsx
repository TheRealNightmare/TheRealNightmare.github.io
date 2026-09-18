import { Link } from 'react-router-dom'

/**
 * items: [{ label, to }] — the last entry is rendered as plain current-page text.
 */
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`}>
            {i > 0 && <span className="crumbs__sep"> / </span>}
            {last || !item.to ? (
              <span className="crumbs__current" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
