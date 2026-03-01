import { Header } from '@/components/organisms'

/**
 * Template: App shell with header and main content area.
 */
export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  )
}
