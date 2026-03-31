import { Footer, HowItWorksModal } from '@/components/organisms';

export function LandingTemplate({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {children}
      <Footer />
      <HowItWorksModal />
    </div>
  );
}
