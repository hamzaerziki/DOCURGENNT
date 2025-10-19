
import { useState } from 'react';
import { Settings, Plane, MapPin, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

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

interface ManageTripsModalProps {
  trips: Trip[];
  onEditTrip?: (tripId: string) => void;
  onDeleteTrip?: (tripId: string) => void;
  trigger?: React.ReactNode;
}

export const ManageTripsModal = ({ trips, onEditTrip, onDeleteTrip, trigger }: ManageTripsModalProps) => {
  const [open, setOpen] = useState(false);

  const handleEdit = (tripId: string) => {
    onEditTrip?.(tripId);
    console.log('Edit trip:', tripId);
  };

  const handleDelete = (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      onDeleteTrip?.(tripId);
      console.log('Delete trip:', tripId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Manage All
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Manage All Trips</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            {trips.map((trip) => (
              <Card key={trip.id} className="bg-gradient-card shadow-card">
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
                      <span>{format(new Date(trip.departureDate), 'MMM d, yyyy')}</span>
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

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(trip.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDelete(trip.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {trips.length === 0 && (
              <div className="text-center py-8">
                <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No trips found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first trip to start managing
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
