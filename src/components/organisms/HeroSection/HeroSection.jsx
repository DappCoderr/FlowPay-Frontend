import { CreditCard, Zap, Calendar, Wallet, Play, ArrowRight } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import { Button, Badge } from '@/components/atoms';
import { IconLabel } from '@/components/molecules';
import './HeroSection.css';

export function HeroSection({ onConnect }) {
  const { openHowItWorks } = useUI();

  return (
    <section className="relative flex-1 flex items-center justify-center px-4 py-8 md:py-12 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-4xl w-full mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="animate-fade-in">
          <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-cyan-400/30 hover:border-cyan-400/60 transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Introducing FlowPay</span>
          </Badge>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 animate-fade-in animation-delay-100">
          <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight">
            Payment Streams
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
              Made Simple
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
          Create automated payment streams on Flow. Add recipient addresses, set your schedule, and let blockchain handle the execution. 
          <span className="text-white font-medium"> No manual work. No missed payments.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in animation-delay-300">
          <Button
            variant="primary"
            size="lg"
            onClick={onConnect}
            className="group"
          >
            <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Connect Wallet</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={openHowItWorks}
            className="group"
          >
            <Play className="w-5 h-5" />
            <span>See How It Works</span>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 animate-fade-in animation-delay-400">
          <div className="group p-6 rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm hover:bg-white/5 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/20 transition-colors">
              <CreditCard className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Seamless Payments</h3>
            <p className="text-sm text-white/60">Setup once, payments execute automatically</p>
          </div>

          <div className="group p-6 rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm hover:bg-white/5 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/10 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-blue-400/10 flex items-center justify-center mb-4 group-hover:bg-blue-400/20 transition-colors">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Ultra Low Fees</h3>
            <p className="text-sm text-white/60">1% platform fee + minimal blockchain costs</p>
          </div>

          <div className="group p-6 rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm hover:bg-white/5 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/10 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-lg bg-purple-400/10 flex items-center justify-center mb-4 group-hover:bg-purple-400/20 transition-colors">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Smart Scheduling</h3>
            <p className="text-sm text-white/60">One-time, weekly, or monthly frequencies</p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-sm text-white/60 animate-fade-in animation-delay-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Built on Flow Blockchain
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Fully Decentralized
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Zero Custody Risk
          </div>
        </div>
      </div>
    </section>
  );
}