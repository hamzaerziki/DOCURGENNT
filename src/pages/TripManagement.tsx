import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, MessageCircle, Euro, Calendar, MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';

interface TripDetails {
  id: string;
  departureCity: string;
  destinationCity: string;
  destinationCountry: string;
  departureDate: string;
  airline?: string;
  flightNumber?: string;
  spotsAvailable: number;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  requests: DeliveryRequest[];
}

interface DeliveryRequest {
  id: string;
  senderName: string;
  documentType: string;
  pickupLocation: string;
  deliveryLocation: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  amount: number;
  requestDate: string;
}

const mockTripDetails: TripDetails = {
  id: '1',
  departureCity: 'Paris',
  destinationCity: 'Casablanca',
  destinationCountry: 'Morocco',
  departureDate: '2024-01-15',
  airline: 'Royal Air Maroc',
  flightNumber: 'AT754',
  spotsAvailable: 2,
  price: 20,
  status: 'active',
  requests: [
    {
      id: '1',
      senderName: 'Marie Dubois',
      documentType: 'Passport Copy',
      pickupLocation: 'Relay Point - Gare du Nord',
      deliveryLocation: 'Direct handoff',
      status: 'pending',
      amount: 20,
      requestDate: '2024-01-10'
    },
    {
      id: '2',
      senderName: 'Jean Martin',
      documentType: 'Birth Certificate',
      pickupLocation: 'Relay Point - République',
      deliveryLocation: 'Casablanca Office',
      status: 'accepted',
      amount: 20,
      requestDate: '2024-01-09'
    }
  ]
};

export const TripManagement = () => {
  const { t } = useLanguage();
  const { tripId } = useParams();
  const [trip, setTrip] = useState<TripDetails>(mockTripDetails);
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(trip.price.toString());

  const handleAcceptRequest = (requestId: string) => {
    setTrip(prev => ({
      ...prev,
      requests: prev.requests.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    }));
  };

  const handleRejectRequest = (requestId: string) => {
    setTrip(prev => ({
      ...prev,
      requests: prev.requests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    }));
  };

  const handlePriceUpdate = () => {
    const priceValue = parseFloat(newPrice);
    if (!isNaN(priceValue) && priceValue >= 0) {
      setTrip(prev => ({ ...prev, price: priceValue }));
    }
    setEditingPrice(false);
  };

  const handleCancelTrip = () => {
    setTrip(prev => ({ ...prev, status: 'cancelled' }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'verified';
      case 'rejected': return 'destructive';
      case 'completed': return 'verified';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/traveler">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Trip Management</h1>
              <p className="text-muted-foreground">Manage your trip details and delivery requests</p>
            </div>
          </div>

          {/* Trip Details Card */}
          <Card className="mb-8 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-primary" />
                  <span>Trip Details</span>
                </div>
                <Badge variant={trip.status === 'active' ? 'verified' : 'outline'} className="capitalize">
                  {trip.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
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
                      <p className="text-sm text-muted-foreground">{trip.destinationCountry}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{format(new Date(trip.departureDate), 'MMM d, yyyy')}</span>
                    </div>
                    {trip.flightNumber && (
                      <div className="flex items-center space-x-2">
                        <Plane className="w-4 h-4 text-muted-foreground" />
                        <span>{trip.airline} {trip.flightNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{trip.spotsAvailable} spots available</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Price per document</Label>
                    {editingPrice ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <Input 
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          type="number"
                          className="w-20"
                        />
                        <span>€</span>
                        <Button size="sm" onClick={handlePriceUpdate}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingPrice(false)}>Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-2xl font-bold text-success">€{trip.price}</span>
                        <Button size="sm" variant="outline" onClick={() => setEditingPrice(true)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="destructive" className="w-full" onClick={handleCancelTrip}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Trip
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Requests */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Delivery Requests ({trip.requests.length})</span>
                <Badge variant="outline">
                  {trip.requests.filter(r => r.status === 'pending').length} pending
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trip.requests.map((request) => (
                  <Card key={request.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{request.senderName}</h3>
                            <Badge variant={getStatusColor(request.status)} className="capitalize">
                              {request.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p><strong>Document:</strong> {request.documentType}</p>
                              <p><strong>Pickup:</strong> {request.pickupLocation}</p>
                            </div>
                            <div>
                              <p><strong>Delivery:</strong> {request.deliveryLocation}</p>
                              <p><strong>Amount:</strong> €{request.amount}</p>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Requested on {format(new Date(request.requestDate), 'MMM d, yyyy')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectRequest(request.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {trip.requests.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No delivery requests yet</p>
                    <p className="text-sm mt-2">Requests will appear here when senders find your trip</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};