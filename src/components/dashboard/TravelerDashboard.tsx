import { useState, useEffect } from 'react';
import { Plus, Plane, MapPin, Calendar, Settings, Home, User, Filter, Package2, Bell, CheckCircle, Clock, Send, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { AddTripModal } from './AddTripModal';
import { RequestsModal } from './RequestsModal';
import { FiltersModal } from './FiltersModal';
import { TripDetailsModal } from './TripDetailsModal';
import { ManageTripsModal } from './ManageTripsModal';
import { CommandsDashboard } from '@/components/traveler/CommandsDashboard';
import { RewardsSystem } from '@/components/loyalty/RewardsSystem';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import documentWorkflowService, { DocumentRequest, DeliveryStep } from '@/services/documentWorkflowService';

interface Trip {
  id: string;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  airline?: string;
  flightNumber?: string;
  spotsAvailable: number;
  requests: number;
  earnings: number;
  status: 'active' | 'completed' | 'cancelled';
}

const mockTrips: Trip[] = [
  {
    id: '1',
    departureCity: 'Paris',
    destinationCity: 'Casablanca',
    departureDate: '2024-01-15',
    airline: 'Royal Air Maroc',
    flightNumber: 'AT754',
    spotsAvailable: 2,
    requests: 3,
    earnings: 45,
    status: 'active'
  },
  {
    id: '2',
    departureCity: 'Lyon',
    destinationCity: 'Tunis',
    departureDate: '2024-01-18',
    airline: 'Tunisair',
    flightNumber: 'TU721',
    spotsAvailable: 1,
    requests: 1,
    earnings: 25,
    status: 'active'
  }
];

// Mock data for delivery requests
const mockDeliveryRequests: DocumentRequest[] = [
  (() => {
    const request = documentWorkflowService.createDocumentRequest(
      { name: 'Marie Dubois', phone: '+33 6 12 34 56 78', sourceAddress: '123 Rue de Paris, 75001 Paris' },
      { name: 'Ahmed Benali', phone: '+212 6 87 65 43 21', destinationAddress: '456 Avenue Mohammed V, Casablanca' },
      { type: 'Passport', description: 'French passport for visa application' }
    );
    // Set status to 'with_traveler' to show the code entry field
    request.status = 'with_traveler';
    return request;
  })(),
  (() => {
    const request = documentWorkflowService.createDocumentRequest(
      { name: 'Pierre Martin', phone: '+33 6 98 76 54 32', sourceAddress: '789 Boulevard de Lyon, 69002 Lyon' },
      { name: 'Fatima El Mansouri', phone: '+216 5 43 21 09 87', destinationAddress: '789 Rue de Tunis, Tunis' },
      { type: 'Birth Certificate', description: 'Birth certificate for university enrollment' }
    );
    // Set status to 'with_traveler' to show the code entry field
    request.status = 'with_traveler';
    return request;
  })()
];

export const TravelerDashboard = () => {
  const { t } = useLanguage();
  const [trips, setTrips] = useState(mockTrips);
  const [deliveryRequests, setDeliveryRequests] = useState<DocumentRequest[]>(mockDeliveryRequests);
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null);
  const [recipientCode, setRecipientCode] = useState<{[key: string]: string}>({});
  const travelerId = "TRAVELER_001"; // In a real app, this would come from auth context

  const totalEarnings = trips.reduce((sum, trip) => sum + trip.earnings, 0);
  const activeTrips = trips.filter(trip => trip.status === 'active').length;
  const totalRequests = trips.reduce((sum, trip) => sum + trip.requests, 0);

  const handleFiltersChange = (filters: any) => {
    console.log('Filters applied:', filters);
    // Implement filter logic here
  };

  const handleEditTrip = (tripId: string) => {
    console.log('Edit trip:', tripId);
    // Implement edit logic here
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
  };

  // Handle delivery step completion
  const handleStepCompletion = (requestId: string, stepId: string, completed: boolean) => {
    const updatedRequest = documentWorkflowService.updateDeliveryStep(requestId, stepId, completed, 'traveler');
    if (updatedRequest) {
      setDeliveryRequests(prev => 
        prev.map(req => req.id === requestId ? updatedRequest : req)
      );
      
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(updatedRequest);
      }
    }
  };

  // Handle delivery completion with recipient's code
  const handleCompleteDelivery = (requestId: string) => {
    const code = recipientCode[requestId];
    if (!code) {
      // Show error or prompt for code
      return;
    }

    const request = deliveryRequests.find(req => req.id === requestId);
    if (!request) return;

    const result = documentWorkflowService.completeDelivery(requestId, code, travelerId);
    if (result) {
      setDeliveryRequests(prev => 
        prev.map(req => req.id === requestId ? result : req)
      );
      
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(result);
      }
      
      // Clear the code input for this request
      setRecipientCode(prev => {
        const newCodes = {...prev};
        delete newCodes[requestId];
        return newCodes;
      });
    }
  };

  // Get delivery steps for a request
  const getDeliverySteps = (requestId: string): DeliveryStep[] => {
    return documentWorkflowService.getDeliverySteps(requestId);
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('dashboard.welcome')}</h1>
                <p className="text-muted-foreground">Manage your trips and delivery requests</p>
              </div>
              <VerificationBadge status="verified" />
            </div>
            <div className="flex flex-wrap gap-2">
              <NotificationSystem userType="traveler" />
              <Button asChild variant="outline" size="sm">
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  {t('common.profile')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Earnings</p>
                    <p className="text-2xl font-bold text-success">€{totalEarnings}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <span className="text-success font-bold">€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Trips</p>
                    <p className="text-2xl font-bold text-primary">{activeTrips}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending Requests</p>
                    <p className="text-2xl font-bold text-warning">{totalRequests}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                    <span className="text-warning font-bold">{totalRequests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trips" className="flex items-center space-x-2">
              <Plane className="w-4 h-4" />
              <span className="hidden sm:inline">My Trips</span>
            </TabsTrigger>
            <TabsTrigger value="commands" className="flex items-center space-x-2">
              <Package2 className="w-4 h-4" />
              <span className="hidden sm:inline">Commands</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Badge className="w-4 h-4" />
              <span className="hidden sm:inline">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="add-trip" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Trip</span>
            </TabsTrigger>
          </TabsList>

          {/* My Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-semibold">{t('dashboard.myTrips')}</h2>
              <ManageTripsModal 
                trips={trips}
                onEditTrip={handleEditTrip}
                onDeleteTrip={handleDeleteTrip}
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage All
                  </Button>
                }
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {trips.map((trip) => (
                <Card key={trip.id} className="bg-gradient-card shadow-card hover:shadow-floating transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-primary rotate-45" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium">{trip.departureCity}</span>
                            <div className="flex-1 border-t border-dashed border-muted mx-2 w-8" />
                            <span className="font-medium">{trip.destinationCity}</span>
                          </div>
                          {trip.flightNumber && (
                            <p className="text-sm text-muted-foreground">
                              {trip.airline} {trip.flightNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={trip.status === 'active' ? 'verified' : 'outline'}
                        className="capitalize"
                      >
                        {trip.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(trip.departureDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{trip.spotsAvailable} spots available</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Requests: </span>
                        <span className="font-medium text-warning">{trip.requests}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Earnings: </span>
                        <span className="font-medium text-success">€{trip.earnings}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <RequestsModal 
                        trigger={
                          <Button variant="outline" size="sm" className="flex-1">
                            View Requests
                            {trip.requests > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {trip.requests}
                              </Badge>
                            )}
                          </Button>
                        }
                      />
                      <TripDetailsModal
                        trip={trip}
                        trigger={
                          <Button variant="default" size="sm" className="flex-1">
                            View Details & Contact
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {trips.length === 0 && (
              <Card className="p-8 sm:p-12 text-center">
                <div className="text-muted-foreground">
                  <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No trips yet</p>
                  <p className="text-sm mt-2">Add your first trip to start earning</p>
                  <AddTripModal 
                    onAddTrip={(trip) => setTrips(prev => [...prev, trip])}
                    trigger={
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Trip
                      </Button>
                    }
                  />
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Commands Tab */}
          <TabsContent value="commands">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Delivery Requests</h2>
                <p className="text-muted-foreground">Manage your document deliveries</p>
              </div>
              
              {deliveryRequests.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {deliveryRequests.map((request) => (
                    <Card key={request.id} className="bg-gradient-card shadow-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Package2 className="w-5 h-5" />
                              {request.document.type}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              From {request.sender.name} to {request.recipient.name}
                            </p>
                          </div>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'delivered' ? 'secondary' :
                            request.status === 'with_traveler' ? 'verified' :
                            'outline'
                          }>
                            {request.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Unique Code Display */}
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Unique Code for Relay Point</p>
                            <p className="text-lg font-mono font-bold">{request.uniqueCode}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Show this code to the relay point when collecting the envelope
                            </p>
                          </div>
                          
                          {/* Delivery Steps */}
                          <div>
                            <h4 className="font-medium mb-2">Delivery Progress</h4>
                            <div className="space-y-2">
                              {getDeliverySteps(request.id).map((step) => (
                                <div 
                                  key={step.id} 
                                  className={`flex items-center p-3 rounded-lg border ${
                                    step.completed 
                                      ? 'bg-green-50 border-green-200' 
                                      : 'bg-muted/50 border-muted'
                                  }`}
                                >
                                  <Button
                                    size="sm"
                                    variant={step.completed ? "default" : "outline"}
                                    className="mr-3"
                                    onClick={() => handleStepCompletion(request.id, step.id, !step.completed)}
                                    disabled={request.status === 'completed'}
                                  >
                                    {step.completed ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <div className="w-4 h-4" />
                                    )}
                                  </Button>
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
                          
                          {/* Recipient Code Entry for Completion */}
                          {request.status === 'with_traveler' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Complete Delivery
                              </h4>
                              <p className="text-sm text-blue-800 mb-3">
                                Enter the code provided by the recipient to complete this delivery.
                              </p>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  placeholder="Enter recipient's code"
                                  value={recipientCode[request.id] || ''}
                                  onChange={(e) => setRecipientCode(prev => ({
                                    ...prev,
                                    [request.id]: e.target.value
                                  }))}
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => handleCompleteDelivery(request.id)}
                                  disabled={!recipientCode[request.id]}
                                >
                                  Complete
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Completion Status */}
                          {request.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-green-800">Delivery Completed</span>
                              </div>
                              {request.completedAt && (
                                <p className="text-sm text-green-700 mt-1">
                  Completed on {new Date(request.completedAt).toLocaleString()}
                                </p>
                              )}
                              {request.completedBy && (
                                <p className="text-xs text-green-600 mt-1">
                                  Completed by traveler {request.completedBy}
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
                <Card className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <Package2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No delivery requests</p>
                    <p className="text-sm mt-2">You don't have any active delivery requests at the moment</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <RewardsSystem userType="traveler" />
          </TabsContent>

          {/* Add Trip Tab */}
          <TabsContent value="add-trip">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span>{t('dashboard.addTrip')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <AddTripModal 
                  onAddTrip={(trip) => setTrips(prev => [...prev, trip])}
                  trigger={
                    <Button size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Trip
                    </Button>
                  }
                />
                <p className="text-muted-foreground mt-4">
                  Create a new trip to start accepting delivery requests
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
