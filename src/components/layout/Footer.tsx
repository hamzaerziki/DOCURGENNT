import { Globe, Facebook, Twitter, Instagram, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t, language, setLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '#' },
        { name: t('footer.careers'), href: '#' },
        { name: t('footer.press'), href: '#' },
        { name: t('footer.blog'), href: '#' }
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.help'), href: '#' },
        { name: t('footer.contact'), href: '#' },
        { name: t('footer.faq'), href: '#' }
      ]
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.privacy'), href: '#' },
        { name: t('footer.terms'), href: '#' },
        { name: t('footer.cookies'), href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              DocUrgent
            </div>
            <p className="text-muted-foreground mb-6">
              {t('hero.subtitle')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <a href={social.href} aria-label={social.name}>
                    <social.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} DocUrgent. {t('footer.rights')}.
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="flex items-center"
            >
              <Globe className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Français' : 'English'}
            </Button>
            
            {/* Relay Point Access Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs"
            >
              <a href="/relay-point" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t('footer.relayAccess')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};