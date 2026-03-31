import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const History = lazy(() => import('@/pages/History'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Landing = lazy(() => import('@/pages/Landing'));

export function AppRoutes({ isConnected, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/60">
        <div className="text-center">
          <div className="mb-4 animate-pulse text-2xl">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-white/60">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route path="/" element={isConnected ? <Home /> : <Landing />} />
        <Route
          path="/about"
          element={isConnected ? <About /> : <Navigate to="/" replace />}
        />
        <Route
          path="/history"
          element={isConnected ? <History /> : <Navigate to="/" replace />}
        />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export { Home, About, History, FAQ, Landing };
