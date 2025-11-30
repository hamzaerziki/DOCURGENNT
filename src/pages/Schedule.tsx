import { useState } from 'react';
import { Calendar, CalendarDays, Clock, MapPin, Plane, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, isSameDay, startOfDay } from 'date-fns';

interface FlightEvent {
  id: string;
  travelerName: string;
  departureCity: string;
  destinationCity: string;
  date: Date;
  price: number;
  spotsAvailable: number;
  type: 'flight';
}

interface RequestEvent {
  id: string;
  senderName: string;
  destinationCity: string;
  requestedDate: Date;
  documentType: string;
  type: 'request';
}

// Mock data removed - will be replaced with real API calls
const mockFlights: FlightEvent[] = [];

// Mock data removed - will be replaced with real API calls
const mockRequests: RequestEvent[] = [];


export const Schedule = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'list'>('month');
  const [filterCity, setFilterCity] = useState<string>('all');

  const getEventsForDate = (date: Date) => {
    const flights = mockFlights.filter(flight => isSameDay(flight.date, date));
    const requests = mockRequests.filter(request => isSameDay(request.requestedDate, date));
    return [...flights, ...requests];
  };

  const filteredFlights = filterCity !== 'all'
    ? mockFlights.filter(flight => flight.destinationCity.toLowerCase().includes(filterCity.toLowerCase()))
    : mockFlights;

  const filteredRequests = filterCity !== 'all'
    ? mockRequests.filter(request => request.destinationCity.toLowerCase().includes(filterCity.toLowerCase()))
    : mockRequests;

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
                <CalendarDays className="w-8 h-8 text-primary" />
                <span>Schedule</span>
              </h1>
              <p className="text-muted-foreground">View flights and delivery requests by date</p>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={view} onValueChange={(value: 'month' | 'week' | 'list') => setView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All cities</SelectItem>
                      <SelectItem value="casablanca">Casablanca</SelectItem>
                      <SelectItem value="tunis">Tunis</SelectItem>
                      <SelectItem value="algiers">Algiers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => setFilterCity('all')}>
                  Clear filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {view === 'month' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasFlights: (date) => mockFlights.some(flight => isSameDay(flight.date, date)),
                      hasRequests: (date) => mockRequests.some(request => isSameDay(request.requestedDate, date))
                    }}
                    modifiersStyles={{
                      hasFlights: { backgroundColor: 'hsl(var(--primary) / 0.2)' },
                      hasRequests: { backgroundColor: 'hsl(var(--success) / 0.2)' }
                    }}
                  />
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                      <span>Flights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-success/20"></div>
                      <span>Requests</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Events */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>
                      {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map((event) => (
                        <div key={`${event.type}-${event.id}`} className="p-4 rounded-lg border bg-card">
                          {event.type === 'flight' ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                  <Plane className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{(event as FlightEvent).travelerName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {(event as FlightEvent).departureCity} → {(event as FlightEvent).destinationCity}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-primary">€{(event as FlightEvent).price}</p>
                                <p className="text-sm text-muted-foreground">{(event as FlightEvent).spotsAvailable} spots</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-success" />
                                </div>
                                <div>
                                  <p className="font-medium">{(event as RequestEvent).senderName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Needs delivery to {(event as RequestEvent).destinationCity}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">{(event as RequestEvent).documentType}</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No events scheduled for this date
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {view === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flights List */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plane className="w-5 h-5 text-primary" />
                    <span>Available Flights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <div key={flight.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{flight.travelerName}</p>
                        <p className="text-primary font-medium">€{flight.price}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{flight.departureCity} → {flight.destinationCity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">{format(flight.date, 'MMM d, yyyy')}</p>
                        <Badge variant="outline">{flight.spotsAvailable} spots</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Requests List */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-success" />
                    <span>Delivery Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{request.senderName}</p>
                        <Badge variant="outline">{request.documentType}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>To {request.destinationCity}</span>
                      </div>
                      <p className="text-sm">{format(request.requestedDate, 'MMM d, yyyy')}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};