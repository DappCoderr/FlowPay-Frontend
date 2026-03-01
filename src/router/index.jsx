import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Landing from '@/pages/Landing'

/**
 * App routes. Landing is public; Home and About are protected (wallet connected).
 * Route guards are applied in App.jsx via element composition.
 */
export function AppRoutes({ isConnected }) {
  return (
    <Routes>
      <Route
        path="/"
        element={isConnected ? <Home /> : <Landing />}
      />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export { default as Home } from '../pages/Home'
export { default as About } from '../pages/About'
export { default as Landing } from '../pages/Landing'
