import { useState } from 'react';
import { Filter, Euro, Star, MapPin, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface FiltersModalProps {
  trigger?: React.ReactNode;
  onFiltersChange: (filters: any) => void;
}

const countryToCities = {
  'Morocco': ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Agadir', 'Tangier', 'Oujda'],
  'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Tlemcen'],
  'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte']
};

export const FiltersModal = ({ trigger, onFiltersChange }: FiltersModalProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const activeFilters = [
    ...(priceRange[0] > 0 || priceRange[1] < 100 ? [`Price: €${priceRange[0]}-€${priceRange[1]}`] : []),
    ...(selectedCountry ? [selectedCountry] : []),
    ...(selectedCity ? [selectedCity] : []),
    ...(minRating ? [`Rating: ${minRating}+`] : []),
    ...(verificationStatus ? [`Status: ${verificationStatus}`] : []),
    ...(dateFrom ? [`From: ${dateFrom}`] : []),
    ...(dateTo ? [`To: ${dateTo}`] : [])
  ];

  const availableCities = selectedCountry ? countryToCities[selectedCountry as keyof typeof countryToCities] || [] : [];

  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      country: selectedCountry,
      city: selectedCity,
      minRating: minRating ? parseFloat(minRating) : null,
      verificationStatus,
      dateFrom,
      dateTo
    };
    onFiltersChange(filters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 100]);
    setSelectedCountry('');
    setSelectedCity('');
    setMinRating('');
    setVerificationStatus('');
    setDateFrom('');
    setDateTo('');
    onFiltersChange({});
  };

  const handleRemoveFilter = (filterText: string) => {
    if (filterText.startsWith('Price:')) {
      setPriceRange([0, 100]);
    } else if (filterText.startsWith('Rating:')) {
      setMinRating('');
    } else if (filterText.startsWith('Status:')) {
      setVerificationStatus('');
    } else if (filterText.startsWith('From:')) {
      setDateFrom('');
    } else if (filterText.startsWith('To:')) {
      setDateTo('');
    } else if (countryToCities[filterText as keyof typeof countryToCities]) {
      setSelectedCountry('');
      setSelectedCity('');
    } else {
      setSelectedCity('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilters.length}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary" />
            <span>Advanced Filters</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Euro className="w-4 h-4" />
              <span>Price Range (EUR)</span>
            </Label>
            <div className="px-3">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>€{priceRange[0]}</span>
                <span>€{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Destination Country</span>
              </Label>
              <Select value={selectedCountry} onValueChange={(value) => {
                setSelectedCountry(value === 'any' ? '' : value);
                setSelectedCity(''); // Reset city when country changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Any country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any country</SelectItem>
                  <SelectItem value="Morocco">🇲🇦 Morocco</SelectItem>
                  <SelectItem value="Tunisia">🇹🇳 Tunisia</SelectItem>
                  <SelectItem value="Algeria">🇩🇿 Algeria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destination City</Label>
              <Select value={selectedCity} onValueChange={(value) => setSelectedCity(value === 'any' ? '' : value)} disabled={!selectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Any city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any city</SelectItem>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating and Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Minimum Rating</span>
              </Label>
              <Select value={minRating} onValueChange={(value) => setMinRating(value === 'any' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any rating</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                  <SelectItem value="4.0">4.0+ stars</SelectItem>
                  <SelectItem value="3.5">3.5+ stars</SelectItem>
                  <SelectItem value="3.0">3.0+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Verification Status</Label>
              <Select value={verificationStatus} onValueChange={(value) => setVerificationStatus(value === 'any' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="gold">Gold (Full KYC)</SelectItem>
                  <SelectItem value="silver">Silver (ID + Selfie)</SelectItem>
                  <SelectItem value="bronze">Bronze (Phone/Email)</SelectItem>
                  <SelectItem value="verified">Verified (legacy)</SelectItem>
                  <SelectItem value="pending">Pending verification</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Travel Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Travel From</span>
              </Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Travel To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              Clear All
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};