import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header onAuthClick={() => {}} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{t('pages.about.title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('pages.about.subtitle')}</p>
          
          <div className="prose max-w-none dark:prose-invert">
            <p>{t('pages.about.intro')}</p>
            
            <h2>{t('pages.about.mission.title')}</h2>
            <p>{t('pages.about.mission.text')}</p>
            
            <h2>{t('pages.about.why.title')}</h2>
            <ul>
              <li>{t('pages.about.why.item1')}</li>
              <li>{t('pages.about.why.item2')}</li>
              <li>{t('pages.about.why.item3')}</li>
              <li>{t('pages.about.why.item4')}</li>
              <li>{t('pages.about.why.item5')}</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};