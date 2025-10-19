import { useState } from 'react';
import { Eye, Star, MapPin, Calendar, Plane, Shield, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface TripDetailsModalProps {
  trip: {
    id: string;
    departureCity: string;
    destinationCity: string;
    departureDate: string;
    airline?: string;
    flightNumber?: string;
    spotsAvailable: number;
    requests: number;
    earnings: number;
  };
  trigger?: React.ReactNode;
}

export const TripDetailsModal = ({ trip, trigger }: TripDetailsModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>Trip Details</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Trip Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Trip Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{trip.departureCity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{trip.destinationCity}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Departure Date</p>
                    <p className="font-medium">{format(new Date(trip.departureDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Spots</p>
                  <p className="font-medium">{trip.spotsAvailable} spots</p>
                </div>
              </div>

              {trip.airline && (
                <div>
                  <p className="text-sm text-muted-foreground">Flight Details</p>
                  <p className="font-medium">{trip.airline} {trip.flightNumber}</p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Earnings</span>
                  <span className="text-lg font-bold text-success">€{trip.earnings}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Trip Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{trip.requests}</div>
                  <div className="text-sm text-muted-foreground">Delivery Requests</div>
                </div>
                <div className="bg-success/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-success">€{trip.earnings}</div>
                  <div className="text-sm text-muted-foreground">Total Earnings</div>
                </div>
              </div>
              
              <div className="bg-warning/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-warning">{trip.spotsAvailable}</div>
                <div className="text-sm text-muted-foreground">Spots Still Available</div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📋 Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All delivery requests are managed through the platform</li>
              <li>• Documents are collected at designated relay points</li>
              <li>• Payment is processed automatically after delivery confirmation</li>
              <li>• Identity verification is required at relay points</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
