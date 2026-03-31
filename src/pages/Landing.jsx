import { useAuth } from '@/hooks';
import { LandingTemplate } from '@/components/templates';
import { HeroSection } from '@/components/organisms';

export default function Landing() {
  const { connectWallet } = useAuth();

  return (
    <LandingTemplate>
      <HeroSection onConnect={connectWallet} />
    </LandingTemplate>
  );
}
