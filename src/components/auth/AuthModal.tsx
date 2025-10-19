import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, EyeOff, User, Plane, Info, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userType: 'sender' | 'traveler') => void;
  initialMode?: 'login' | 'register';
}

// Test credentials for demo
const TEST_CREDENTIALS = {
  sender: {
    email: 'sender@test.com',
    password: 'test123',
    userType: 'sender' as const
  },
  traveler: {
    email: 'traveler@test.com', 
    password: 'test123',
    userType: 'traveler' as const
  }
};

export const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [userType, setUserType] = useState<'sender' | 'traveler'>('sender');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: ''
  });

  const { t } = useLanguage();

  // Fix mode when initialMode changes
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (mode === 'login') {
        const senderMatch = formData.email === TEST_CREDENTIALS.sender.email && 
                            formData.password === TEST_CREDENTIALS.sender.password;
        const travelerMatch = formData.email === TEST_CREDENTIALS.traveler.email && 
                             formData.password === TEST_CREDENTIALS.traveler.password;
        
        if (senderMatch) {
          onLoginSuccess?.('sender');
          onClose();
        } else if (travelerMatch) {
          onLoginSuccess?.('traveler');
          onClose();
        } else {
          setError('Invalid email or password. Please check your credentials and try again.');
        }
      } else {
        // Handle registration (demo)
        console.log('Registration:', { mode, userType, formData });
        onLoginSuccess?.(userType);
        onClose();
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      city: ''
    });
    setError(null);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md max-w-[95vw] sm:mx-auto mx-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl">
            {mode === 'login' ? t('auth.login') : t('auth.register')}
          </DialogTitle>
        </DialogHeader>

        {mode === 'login' && (
          <Alert className="mb-6 bg-verified/10 border-verified/30">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Test Credentials:</p>
                <div className="space-y-1 font-mono">
                  <p><strong>Sender:</strong> sender@test.com / test123</p>
                  <p><strong>Traveler:</strong> traveler@test.com / test123</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Failed</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Button
              type="button"
              variant={userType === 'sender' ? 'default' : 'outline'}
              className="flex flex-col p-3 sm:p-6 h-auto"
              onClick={() => setUserType('sender')}
            >
              <User className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Sender</span>
            </Button>
            <Button
              type="button"
              variant={userType === 'traveler' ? 'default' : 'outline'}
              className="flex flex-col p-3 sm:p-6 h-auto"
              onClick={() => setUserType('traveler')}
            >
              <Plane className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm">Traveler</span>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t('auth.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              mode === 'login' ? t('auth.login') : t('auth.register')
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' 
                ? t('auth.noAccount')
                : t('auth.hasAccount')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};