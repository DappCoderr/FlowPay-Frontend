import { Footer, HowItWorksModal } from '@/components/organisms'

/**
 * Template: Full-height landing layout (hero + footer). Modal is global so it can be opened from anywhere.
 */
export function LandingTemplate({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {children}
      <Footer />
      <HowItWorksModal />
    </div>
  )
}
