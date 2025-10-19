import { UserCheck, Search, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: UserCheck,
      title: t('howit.step1.title'),
      description: t('howit.step1.desc'),
      color: 'text-verified'
    },
    {
      icon: Search,
      title: t('howit.step2.title'),
      description: t('howit.step2.desc'),
      color: 'text-primary'
    },
    {
      icon: QrCode,
      title: t('howit.step3.title'),
      description: t('howit.step3.desc'),
      color: 'text-accent'
    }
  ];

  return (
    <section id="how" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('howit.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden bg-gradient-card shadow-card hover:shadow-floating transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <step.icon className={`w-16 h-16 mx-auto mb-6 ${step.color}`} />
                
                <h3 className="text-xl font-semibold mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};