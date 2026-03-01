import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Landing = lazy(() => import('@/pages/Landing'))

/**
 * App routes. Landing is public; Home and About are protected (wallet connected).
 * Route guards are applied in App.jsx via element composition.
 * Routes are lazy-loaded for smaller initial bundle.
 */
export function AppRoutes({ isConnected }) {
  return (
    <Suspense fallback={
      <div className="flex min-h-[40vh] items-center justify-center text-white/60">Loading…</div>
    }>
      <Routes>
        <Route
          path="/"
          element={isConnected ? <Home /> : <Landing />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export { Home, About, Landing }
