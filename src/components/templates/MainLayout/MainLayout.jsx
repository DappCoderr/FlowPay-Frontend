import { Header, Footer } from '@/components/organisms';

/**
 * Template: App shell with header and main content area.
 * Uses 12-column grid layout for consistent spacing.
 */
export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          {children}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
