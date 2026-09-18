import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SearchBar from './components/SearchBar.jsx'
import { BookIcon } from './components/Icons.jsx'
import Home from './routes/Home.jsx'
import Course from './routes/Course.jsx'
import Term from './routes/Term.jsx'
import Viewer from './routes/Viewer.jsx'

/** Hash routing keeps the scroll position between pages; reset it on navigation. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />

      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="brand" to="/">
            <span className="brand__mark">
              <BookIcon size={18} />
            </span>
            <span>Course Archive</span>
          </Link>
          <SearchBar />
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/c/:code" element={<Course />} />
          <Route path="/c/:code/:term" element={<Term />} />
          <Route path="/c/:code/:term/:kind/:slug" element={<Viewer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="shell">Notes and solves archive · built for studying.</div>
      </footer>
    </div>
  )
}
