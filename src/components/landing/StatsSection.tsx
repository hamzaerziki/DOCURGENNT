import { useLanguage } from '@/contexts/LanguageContext';

export const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { number: '10,000+', label: t('hero.stats.users') },
    { number: '25,000+', label: t('hero.stats.deliveries') },
    { number: '50+', label: t('hero.stats.cities') },
    { number: '98%', label: t('hero.stats.satisfaction') }
  ];

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};