import { useLanguage } from '@/contexts/LanguageContext';

export const TranslationTest = () => {
  const { t, language } = useLanguage();
  
  const testKeys = [
    'hero.title',
    'hero.cta.sender',
    'auth.login',
    'auth.email',
    'sender.dashboard.find_travelers',
    'footer.about'
  ];

  return (
    <div className="fixed top-4 right-4 bg-white border rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Translation Debug ({language})</h3>
      <div className="space-y-1 text-xs">
        {testKeys.map(key => (
          <div key={key} className="border-b pb-1">
            <div className="text-gray-600">{key}:</div>
            <div className="font-mono">{t(key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
