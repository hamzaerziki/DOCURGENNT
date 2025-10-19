import { useState } from 'react';
import { Globe, Menu, X, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const RelayPointHeader = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Navigate back to main site
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            DocUrgent Relay
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <span className="text-muted-foreground">
            {t('relay.header.welcome')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          >
            <Globe className="w-4 h-4 mr-1" />
            {language.toUpperCase()}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('relay.header.logout')}
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
              <span className="text-muted-foreground text-sm">
                {t('relay.header.welcome')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              >
                <Globe className="w-4 h-4 mr-2" />
                {language.toUpperCase()}
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('relay.header.logout')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};