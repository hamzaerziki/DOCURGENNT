import { useState } from 'react';
import { Plus, Plane, MapPin, Calendar, Euro, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTripModalProps {
  onAddTrip: (trip: any) => void;
  trigger?: React.ReactNode;
}

const countryToCities = {
  'Morocco': ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Agadir', 'Tangier', 'Oujda'],
  'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Tlemcen'],
  'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte']
};

export const AddTripModal = ({ onAddTrip, trigger }: AddTripModalProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [departureCity, setDepartureCity] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>();
  const [departureTime, setDepartureTime] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [price, setPrice] = useState('');
  const [spotsAvailable, setSpotsAvailable] = useState('');
  const [tripDescription, setTripDescription] = useState('');

  const availableCities = destinationCountry ? countryToCities[destinationCountry as keyof typeof countryToCities] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureCity || !departureDate || !destinationCountry || !destinationCity || !price) {
      return;
    }

    const newTrip = {
      id: Math.random().toString(36).substr(2, 9),
      departureCity,
      destinationCity,
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime: departureTime || undefined,
      airline: airline || undefined,
      flightNumber: flightNumber || undefined,
      spotsAvailable: parseInt(spotsAvailable) || 1,
      price: parseFloat(price),
      description: tripDescription || undefined,
      requests: 0,
      earnings: 0,
      status: 'active' as const
    };

    onAddTrip(newTrip);
    setOpen(false);
    
    // Reset form
    setDepartureCity('');
    setDepartureDate(undefined);
    setDepartureTime('');
    setDestinationCountry('');
    setDestinationCity('');
    setAirline('');
    setFlightNumber('');
    setPrice('');
    setSpotsAvailable('');
    setTripDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>Add New Trip</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Trip Description */}
          <div className="space-y-2">
            <Label htmlFor="tripDescription" className="text-sm sm:text-base">Trip Description (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="tripDescription"
                placeholder="Brief description of your trip..."
                value={tripDescription}
                onChange={(e) => setTripDescription(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Trip Details Section */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Trip Details</h3>
            {/* Departure City */}
            <div className="space-y-2">
              <Label htmlFor="departureCity">Departure City *</Label>
              <Input
                id="departureCity"
                placeholder="e.g. Paris, Lyon, Marseille"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                required
              />
            </div>

            {/* Departure Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time (Optional)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="departureTime"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Destination Country */}
            <div className="space-y-2">
              <Label htmlFor="destinationCountry">Destination Country *</Label>
              <Select value={destinationCountry} onValueChange={(value) => {
                setDestinationCountry(value);
                setDestinationCity(''); // Reset city when country changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morocco">Morocco</SelectItem>
                  <SelectItem value="Algeria">Algeria</SelectItem>
                  <SelectItem value="Tunisia">Tunisia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Destination City */}
            <div className="space-y-2">
              <Label htmlFor="destinationCity">Destination City *</Label>
              <Select value={destinationCity} onValueChange={setDestinationCity} disabled={!destinationCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination city" />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Pricing & Availability</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per document (EUR) *</Label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g. 25"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-10"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spotsAvailable">Available Spots</Label>
                  <Input
                    id="spotsAvailable"
                    type="number"
                    placeholder="1"
                    value={spotsAvailable}
                    onChange={(e) => setSpotsAvailable(e.target.value)}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Flight Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Flight Details (Optional)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    placeholder="e.g. Air France"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="flightNumber">Flight Number</Label>
                  <Input
                    id="flightNumber"
                    placeholder="e.g. AF1234"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 h-11">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-11">
              <Plus className="w-4 h-4 mr-2" />
              Add Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};