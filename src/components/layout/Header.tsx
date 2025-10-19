import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onAuthClick?: (type: 'login' | 'register') => void;
}

export const Header = ({ onAuthClick }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            DocUrgent
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#home" className="transition-colors hover:text-primary">
            {t('nav.home')}
          </a>
          <a href="#features" className="transition-colors hover:text-primary">
            {t('nav.features')}
          </a>
          <a href="#how" className="transition-colors hover:text-primary">
            {t('nav.how')}
          </a>
          <a href="#about" className="transition-colors hover:text-primary">
            {t('nav.about')}
          </a>
          <Button 
            variant="ghost" 
            onClick={() => onAuthClick?.('login')}
          >
            {t('nav.login')}
          </Button>
          <Button 
            variant="hero" 
            onClick={() => onAuthClick?.('register')}
          >
            {t('nav.register')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          >
            <Globe className="w-4 h-4 mr-1" />
            {language.toUpperCase()}
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 md:hidden bg-background border-b shadow-lg">
            <nav className="container py-4 flex flex-col space-y-4">
              <a href="#home" className="text-foreground hover:text-primary">
                {t('nav.home')}
              </a>
              <a href="#features" className="text-foreground hover:text-primary">
                {t('nav.features')}
              </a>
              <a href="#how" className="text-foreground hover:text-primary">
                {t('nav.how')}
              </a>
              <a href="#about" className="text-foreground hover:text-primary">
                {t('nav.about')}
              </a>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => onAuthClick?.('login')}
              >
                {t('nav.login')}
              </Button>
              <Button 
                variant="hero" 
                className="justify-start"
                onClick={() => onAuthClick?.('register')}
              >
                {t('nav.register')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {language.toUpperCase()}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};