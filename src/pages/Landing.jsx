import { useWallet } from '@/contexts/WalletContext'
import { LandingTemplate } from '@/components/templates'
import { HeroSection } from '@/components/organisms'

export default function Landing() {
  const { login } = useWallet()

  return (
    <LandingTemplate>
      <HeroSection onConnect={login} />
    </LandingTemplate>
  )
}
