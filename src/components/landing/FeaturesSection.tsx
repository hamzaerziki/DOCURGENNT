import { Shield, Zap, MapPin, Banknote, Headphones, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('features.secure.title'),
      description: t('features.secure.desc'),
      color: 'text-verified'
    },
    {
      icon: Zap,
      title: t('features.fast.title'),
      description: t('features.fast.desc'),
      color: 'text-warning'
    },
    {
      icon: MapPin,
      title: t('features.tracking.title'),
      description: t('features.tracking.desc'),
      color: 'text-travel'
    },
    {
      icon: Shield,
      title: t('features.insurance.title'),
      description: t('features.insurance.desc'),
      color: 'text-success'
    },
    {
      icon: Headphones,
      title: t('features.support.title'),
      description: t('features.support.desc'),
      color: 'text-primary'
    },
    {
      icon: Banknote,
      title: t('features.affordable.title'),
      description: t('features.affordable.desc'),
      color: 'text-accent'
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden bg-gradient-card shadow-card hover:shadow-floating transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};