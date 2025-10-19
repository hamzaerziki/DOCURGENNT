import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Scan, Home, Send, Bell, Shield, User, Package2, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TravelerCard, type Traveler } from './TravelerCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { FiltersModal } from './FiltersModal';
import { SendDocumentFlow } from '@/components/sender/SendDocumentFlow';
import { RewardsSystem } from '@/components/loyalty/RewardsSystem';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import documentWorkflowService, { DocumentRequest, DeliveryStep } from '@/services/documentWorkflowService';

// Mock data for travelers
const mockTravelers: Traveler[] = [
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Benali',
    verification: 'gold',
    rating: 4.8,
    reviewCount: 24,
    departureCity: 'Paris',
    destinationCity: 'Casablanca',
    departureDate: '2024-01-15',
    airline: 'Royal Air Maroc',
    flightNumber: 'AT754',
    spotsAvailable: 2,
    priceRange: { min: 15, max: 25 }
  },
  {
    id: '2',
    firstName: 'Leila',
    lastName: 'Mansouri',
    verification: 'silver',
    rating: 4.9,
    reviewCount: 31,
    departureCity: 'Lyon',
    destinationCity: 'Tunis',
    departureDate: '2024-01-18',
    airline: 'Tunisair',
    flightNumber: 'TU721',
    spotsAvailable: 1,
    priceRange: { min: 20, max: 30 }
  },
  {
    id: '3',
    firstName: 'Karim',
    lastName: 'Bouchama',
    verification: 'bronze',
    rating: 4.6,
    reviewCount: 12,
    departureCity: 'Marseille',
    destinationCity: 'Algiers',
    departureDate: '2024-01-20',
    spotsAvailable: 3,
    priceRange: { min: 10, max: 20 }
  }
];

// Mock data for sender's documents
const mockDocuments: DocumentRequest[] = [
  documentWorkflowService.createDocumentRequest(
    { name: 'You', phone: '+33 6 12 34 56 78', sourceAddress: '123 Rue de Paris, 75001 Paris' },
    { name: 'Ahmed Benali', phone: '+212 6 87 65 43 21', destinationAddress: '456 Avenue Mohammed V, Casablanca' },
    { type: 'Passport', description: 'French passport for visa application' }
  ),
  documentWorkflowService.createDocumentRequest(
    { name: 'You', phone: '+33 6 98 76 54 32', sourceAddress: '789 Boulevard de Lyon, 69002 Lyon' },
    { name: 'Fatima El Mansouri', phone: '+216 5 43 21 09 87', destinationAddress: '789 Rue de Tunis, Tunis' },
    { type: 'Birth Certificate', description: 'Birth certificate for university enrollment' }
  )
];

const countryToCities = {
  'Morocco': ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Agadir', 'Tangier', 'Oujda'],
  'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Tlemcen'],
  'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte']
};

const frenchCities = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg',
  'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble',
  'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Saint-Denis', 'Clermont-Ferrand', 'Aix-en-Provence',
  'Brest', 'Limoges', 'Tours', 'Amiens', 'Perpignan', 'Metz', 'Besançon', 'Orléans', 'Rouen',
  'Caen', 'Nancy', 'Argenteuil', 'Mulhouse', 'Montreuil', 'Roubaix', 'Tourcoing'
];

export const SenderDashboard = () => {
  const { t } = useLanguage();
  const [searchDestination, setSearchDestination] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [travelers, setTravelers] = useState(mockTravelers);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [sendDocumentOpen, setSendDocumentOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentRequest[]>(mockDocuments);

  const availableCities = selectedCountry ? countryToCities[selectedCountry as keyof typeof countryToCities] || [] : [];

  // Simulate real-time updates by polling
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would fetch updated document status from the backend
      // For demo purposes, we'll just refresh the document data
      setDocuments(prev => [...prev]);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    // Filter travelers based on country and city
    const filtered = mockTravelers.filter(traveler => {
      if (!selectedCountry && !selectedCity) return true;
      
      const matchesCountry = !selectedCountry ||
        (selectedCountry === 'Morocco' && (traveler.destinationCity.includes('Casablanca') || traveler.destinationCity.includes('Rabat') || traveler.destinationCity.includes('Marrakech'))) ||
        (selectedCountry === 'Tunisia' && (traveler.destinationCity.includes('Tunis') || traveler.destinationCity.includes('Sfax'))) ||
        (selectedCountry === 'Algeria' && (traveler.destinationCity.includes('Algiers') || traveler.destinationCity.includes('Oran')));
      
      const matchesCity = !selectedCity || traveler.destinationCity.toLowerCase().includes(selectedCity.toLowerCase());
      
      return matchesCountry && matchesCity;
    });
    setTravelers(filtered);
  };

  const handleFiltersChange = (filters: any) => {
    setAppliedFilters(filters);
    // Apply advanced filters to travelers
    let filtered = [...mockTravelers];
    
    // Apply basic country/city filters first
    if (selectedCountry || selectedCity) {
      filtered = filtered.filter(traveler => {
        const matchesCountry = !selectedCountry ||
          (selectedCountry === 'Morocco' && (traveler.destinationCity.includes('Casablanca') || traveler.destinationCity.includes('Rabat') || traveler.destinationCity.includes('Marrakech'))) ||
          (selectedCountry === 'Tunisia' && (traveler.destinationCity.includes('Tunis') || traveler.destinationCity.includes('Sfax'))) ||
          (selectedCountry === 'Algeria' && (traveler.destinationCity.includes('Algiers') || traveler.destinationCity.includes('Oran')));
        
        const matchesCity = !selectedCity || traveler.destinationCity.toLowerCase().includes(selectedCity.toLowerCase());
        return matchesCountry && matchesCity;
      });
    }

    // Apply advanced filters
    if (filters.country) {
      filtered = filtered.filter(traveler => {
        return (filters.country === 'Morocco' && (traveler.destinationCity.includes('Casablanca') || traveler.destinationCity.includes('Rabat') || traveler.destinationCity.includes('Marrakech'))) ||
          (filters.country === 'Tunisia' && (traveler.destinationCity.includes('Tunis') || traveler.destinationCity.includes('Sfax'))) ||
          (filters.country === 'Algeria' && (traveler.destinationCity.includes('Algiers') || traveler.destinationCity.includes('Oran')));
      });
    }

    if (filters.city) {
      filtered = filtered.filter(traveler => traveler.destinationCity.toLowerCase().includes(filters.city.toLowerCase()));
    }

    if (filters.minRating) {
      filtered = filtered.filter(traveler => traveler.rating >= filters.minRating);
    }

    if (filters.verificationStatus) {
      filtered = filtered.filter(traveler => {
        if (filters.verificationStatus === 'verified') {
          // Legacy "verified" includes gold & silver levels
          return ['verified', 'gold', 'silver'].includes( traveler.verification as any);
        }
        return traveler.verification === filters.verificationStatus;
      });
    }

    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100)) {
      filtered = filtered.filter(traveler => {
        const maxPrice = traveler.priceRange?.max || 50;
        return maxPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
      });
    }

    setTravelers(filtered);
  };

  const handleScanNearby = () => {
    // Mock implementation for scanning nearby travelers
    console.log('Scanning for nearby travelers...');
  };

  // Get delivery steps for a document
  const getDeliverySteps = (documentId: string): DeliveryStep[] => {
    return documentWorkflowService.getDeliverySteps(documentId);
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('sender.dashboard.title')}</h1>
              <p className="text-muted-foreground">{t('sender.dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2">
              <NotificationSystem userType="sender" />
              <Button asChild variant="outline" size="sm">
                <Link to="/sender-profile">
                  <User className="w-4 h-4 mr-2" />
                  {t('profile')}
                </Link>
              </Button>
              <Dialog open={sendDocumentOpen} onOpenChange={setSendDocumentOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" size="lg" className="px-8 py-6 text-lg">
                    <Send className="w-6 h-6 mr-3" />
                    {t('sender.dashboard.send_document')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <SendDocumentFlow 
                    onClose={() => setSendDocumentOpen(false)} 
                    isQuickSend={false}
                    isLoggedIn={true}
                  />
                </DialogContent>
              </Dialog>
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  {t('home')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <Card className="mb-8 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-primary" />
                <span>{t('sender.dashboard.find_travelers')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sender.dashboard.current_city')}</label>
                  <Select value={currentCity} onValueChange={(value) => setCurrentCity(value === 'all' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('sender.dashboard.select_current_city')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('sender.dashboard.all_cities')}</SelectItem>
                      {frenchCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sender.dashboard.destination_country')}</label>
                  <Select value={selectedCountry} onValueChange={(value) => {
                    setSelectedCountry(value === 'all' ? '' : value);
                    setSelectedCity(''); // Reset city when country changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('sender.dashboard.select_destination_country')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('sender.dashboard.all_countries')}</SelectItem>
                      <SelectItem value="Morocco">🇲🇦 Morocco</SelectItem>
                      <SelectItem value="Tunisia">🇹🇳 Tunisia</SelectItem>
                      <SelectItem value="Algeria">🇩🇿 Algeria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sender.dashboard.destination_city')}</label>
                  <Select value={selectedCity} onValueChange={(value) => setSelectedCity(value === 'all' ? '' : value)} disabled={!selectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedCountry ? t('sender.dashboard.select_city') : t('sender.dashboard.select_country_first')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('sender.dashboard.all_cities')}</SelectItem>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end space-x-2">
                  <Button onClick={handleSearch} className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    {t('sender.dashboard.search')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleScanNearby}
                    className="px-3"
                  >
                    <Scan className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Tracking Section */}
          <Card className="mb-8 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package2 className="w-5 h-5 text-primary" />
                <span>Document Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((document) => (
                    <Card key={document.id} className="bg-background">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package2 className="w-4 h-4" />
                            {document.document.type}
                          </CardTitle>
                          <Badge variant={
                            document.status === 'completed' ? 'default' :
                            document.status === 'delivered' ? 'secondary' :
                            document.status === 'with_traveler' ? 'verified' :
                            'outline'
                          }>
                            {document.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          To {document.recipient.name}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Unique Code Display */}
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Your Unique Code</p>
                            <p className="text-lg font-mono font-bold">{document.uniqueCode}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Provide this code to the traveler for delivery confirmation
                            </p>
                          </div>
                          
                          {/* Delivery Steps */}
                          <div>
                            <h4 className="font-medium mb-2">Delivery Progress</h4>
                            <div className="space-y-2">
                              {getDeliverySteps(document.id).map((step) => (
                                <div 
                                  key={step.id} 
                                  className={`flex items-center p-3 rounded-lg border ${
                                    step.completed 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-muted/50 border-muted'
                                  }`}
                                >
                                  <div className="mr-3">
                                    {step.completed ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border border-muted flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-muted" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`font-medium ${
                                      step.completed ? 'text-green-800' : 'text-muted-foreground'
                                    }`}>
                                      {step.name}
                                    </p>
                                    {step.completed && step.completedAt && (
                                      <p className="text-xs text-muted-foreground">
                                        Completed on {new Date(step.completedAt).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                  {step.completed && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Completion Status */}
                          {document.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-green-800">Delivery Completed</span>
                              </div>
                              {document.completedAt && (
                                <p className="text-sm text-green-700 mt-1">
                  Completed on {new Date(document.completedAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents being tracked</p>
                  <p className="text-sm mt-2">Send a document to start tracking its delivery</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {t('sender.dashboard.available_travelers', { count: travelers.length })}
              </h2>
              <div className="flex items-center space-x-2">
                <FiltersModal onFiltersChange={handleFiltersChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelers.map((traveler) => (
                <TravelerCard
                  key={traveler.id}
                  traveler={traveler}
                  onRequestDelivery={() => setSendDocumentOpen(true)}
                />
              ))}
            </div>

            {travelers.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t('sender.dashboard.no_travelers')}</p>
                  <p className="text-sm mt-2">{t('sender.dashboard.adjust_filters')}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};