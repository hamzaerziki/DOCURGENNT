import { useState } from 'react';
import { Eye, Star, MapPin, Calendar, Plane, Shield, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { Traveler } from './TravelerCard';

interface TravelerDetailsModalProps {
  traveler: Traveler;
  trigger?: React.ReactNode;
  onRequestDelivery?: () => void;
}

export const TravelerDetailsModal = ({ traveler, trigger, onRequestDelivery }: TravelerDetailsModalProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleRequestDelivery = () => {
    setOpen(false);
    onRequestDelivery?.();
  };

  const mockReviews = [
    {
      id: '1',
      reviewer: 'Marie L.',
      rating: 5,
      comment: 'Très fiable, documents livrés en parfait état et à temps!',
      date: '2024-01-05'
    },
    {
      id: '2',
      reviewer: 'Ahmed K.',
      rating: 5,
      comment: 'Excellent service, très professionnel et communicatif.',
      date: '2024-01-02'
    },
    {
      id: '3',
      reviewer: 'Sophie M.',
      rating: 4,
      comment: 'Bonne expérience, je recommande.',
      date: '2023-12-28'
    }
  ];

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
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>{t('travelerDetails.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Traveler Profile Header */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                  <AvatarFallback className="text-sm sm:text-lg">
                    {traveler.firstName.charAt(0)}{traveler.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">
                      {traveler.firstName} {traveler.lastName}
                    </h3>
                    <VerificationBadge status={traveler.verification} />
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(traveler.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{traveler.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({traveler.reviewCount} {t('travelerDetails.reviews')})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {traveler.reviewCount} {t('travelerDetails.deliveriesCompleted')}
                    </Badge>
                    <Badge variant={['verified','gold','silver'].includes(traveler.verification as any) ? 'verified' : 'outline'}>
                      {t('travelerDetails.idVerified')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-primary" />
                <span>{t('travelerDetails.tripInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('travelerDetails.from')}</p>
                    <p className="font-medium">{traveler.departureCity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('travelerDetails.to')}</p>
                    <p className="font-medium">{traveler.destinationCity}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('travelerDetails.departureDate')}</p>
                    <p className="font-medium">{format(new Date(traveler.departureDate), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('travelerDetails.availableSpots')}</p>
                  <p className="font-medium">{traveler.spotsAvailable} {t('travelerDetails.spotsLeft')}</p>
                </div>
              </div>

              {traveler.airline && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('travelerDetails.flightDetails')}</p>
                  <p className="font-medium">{traveler.airline} {traveler.flightNumber}</p>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('travelerDetails.pricePerDocument')}</span>
                  <span className="text-lg font-bold text-success">
                    €{traveler.priceRange.min}
                    {traveler.priceRange.max > traveler.priceRange.min && ` - €${traveler.priceRange.max}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>{t('travelerDetails.recentReviews')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.slice(0, 3).map((review, index) => (
                  <div key={review.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-sm">
                            {review.reviewer.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.reviewer}</p>
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(review.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-10">{review.comment}</p>
                    {index < mockReviews.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Only Request Delivery */}
          <div className="flex justify-center pt-4">
            <Button 
              className="w-full max-w-md h-11"
              onClick={handleRequestDelivery}
            >
              <Send className="w-4 h-4 mr-2" />
              {t('travelerDetails.requestDelivery')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};