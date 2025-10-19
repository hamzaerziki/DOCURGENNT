import { useState } from 'react';
import { Plane, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SendDocumentFlow } from '@/components/sender/SendDocumentFlow';
import { useLanguage } from '@/contexts/LanguageContext';
import heroMapImage from '@/assets/hero-map.jpg';

interface HeroSectionProps {
  onGetStarted?: (type: 'sender' | 'traveler') => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const { t } = useLanguage();
  const [sendDocumentOpen, setSendDocumentOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroMapImage} 
          alt="Map showing routes from France to North Africa" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 max-w-2xl mx-auto">
            <Button 
              size="lg" 
              variant="hero"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform flex-1 sm:flex-none"
              onClick={() => setSendDocumentOpen(true)}
            >
              <Send className="mr-2 w-5 h-5" />
              {t('hero.cta.sender')}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform bg-background/80 backdrop-blur flex-1 sm:flex-none"
              onClick={() => onGetStarted?.('traveler')}
            >
              <Plane className="mr-2 w-5 h-5" />
              {t('hero.cta.traveler')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-lg text-muted-foreground">
            {t('hero.trusted')}
          </div>
        </div>
      </div>

      {/* Send Document Modal */}
      <Dialog open={sendDocumentOpen} onOpenChange={setSendDocumentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <SendDocumentFlow onClose={() => setSendDocumentOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};