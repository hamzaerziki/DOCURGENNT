import { MapPin, Plane, Calendar, Star, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerificationBadge, VerificationStatus } from '@/components/ui/verification-badge';
import { TravelerDetailsModal } from './TravelerDetailsModal';

export interface Traveler {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  verification: VerificationStatus;
  rating: number;
  reviewCount: number;
  departureCity: string;
  destinationCity: string;
  departureDate: string;
  airline?: string;
  flightNumber?: string;
  spotsAvailable: number;
  priceRange: {
    min: number;
    max: number;
  };
}

interface TravelerCardProps {
  traveler: Traveler;
  onRequestDelivery: () => void;
}

export const TravelerCard = ({ traveler, onRequestDelivery }: TravelerCardProps) => {
  const departureDate = new Date(traveler.departureDate).toLocaleDateString();
  const initials = `${traveler.firstName[0]}${traveler.lastName[0]}`;

  return (
    <Card className="overflow-hidden hover:shadow-floating transition-all duration-300 bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={traveler.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                {traveler.firstName} {traveler.lastName[0]}.
              </h3>
              <div className="flex items-center space-x-2">
                <VerificationBadge status={traveler.verification} />
                {traveler.rating > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current text-warning" />
                    {traveler.rating.toFixed(1)} ({traveler.reviewCount})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">{traveler.departureCity}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-muted mx-4" />
          <div className="flex items-center space-x-2 text-sm">
            <Plane className="w-4 h-4 text-accent rotate-45" />
            <span className="font-medium">{traveler.destinationCity}</span>
          </div>
        </div>

        {/* Flight Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{departureDate}</span>
          </div>
          {traveler.flightNumber && (
            <Badge variant="outline" className="text-xs">
              {traveler.airline} {traveler.flightNumber}
            </Badge>
          )}
        </div>

        {/* Availability & Price */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Available spots: </span>
            <span className="font-medium text-accent">{traveler.spotsAvailable}</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-primary">
              €{traveler.priceRange.min}-{traveler.priceRange.max}
            </div>
          </div>
        </div>

        {/* Action Button - Only View Details */}
        <div className="pt-2">
          <TravelerDetailsModal
            traveler={traveler}
            onRequestDelivery={onRequestDelivery}
            trigger={
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                disabled={traveler.verification === 'unverified'}
              >
                <Info className="w-4 h-4 mr-2" />
                View Details & Request Delivery
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};