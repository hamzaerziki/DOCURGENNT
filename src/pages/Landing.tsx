import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';

export const Landing = () => {
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode?: 'login' | 'register' }>({
    isOpen: false
  });

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthModal({ isOpen: true, mode: type });
  };

  const handleGetStarted = (userType: 'sender' | 'traveler') => {
    setAuthModal({ isOpen: true, mode: 'register' });
  };

  const handleLoginSuccess = (userType: 'sender' | 'traveler') => {
    navigate(`/dashboard/${userType}`);
  };

  return (
    <div className="min-h-screen">
      <Header onAuthClick={handleAuthClick} />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>

      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false })}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authModal.mode}
      />
    </div>
  );
};