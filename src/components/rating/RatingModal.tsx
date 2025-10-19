import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerName: string;
  travelerPhoto?: string;
  deliveryId: string;
  userType: 'sender' | 'recipient';
  onSubmitRating: (rating: RatingData) => void;
}

interface RatingData {
  rating: number;
  review: string;
  categories: {
    communication: number;
    reliability: number;
    speed: number;
    care: number;
  };
  wouldRecommend: boolean;
}

export const RatingModal = ({
  isOpen,
  onClose,
  travelerName,
  travelerPhoto,
  deliveryId,
  userType,
  onSubmitRating
}: RatingModalProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [categories, setCategories] = useState({
    communication: 0,
    reliability: 0,
    speed: 0,
    care: 0
  });
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleCategoryRating = (category: keyof typeof categories, value: number) => {
    setCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Évaluation requise",
        description: "Veuillez donner une note globale.",
        variant: "destructive"
      });
      return;
    }

    if (wouldRecommend === null) {
      toast({
        title: "Recommandation requise",
        description: "Veuillez indiquer si vous recommanderiez ce voyageur.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const ratingData: RatingData = {
        rating,
        review,
        categories,
        wouldRecommend
      };

      await onSubmitRating(ratingData);

      toast({
        title: "Évaluation envoyée",
        description: "Merci pour votre retour ! Cela aide à améliorer notre service.",
      });

      // Reset form
      setRating(0);
      setReview('');
      setCategories({
        communication: 0,
        reliability: 0,
        speed: 0,
        care: 0
      });
      setWouldRecommend(null);
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'évaluation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    value, 
    onChange, 
    onHover, 
    size = "w-6 h-6" 
  }: { 
    value: number; 
    onChange: (value: number) => void;
    onHover?: (value: number) => void;
    size?: string;
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          className={`${size} transition-colors`}
        >
          <Star
            className={`w-full h-full ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      ))}
    </div>
  );

  const categoryLabels = {
    communication: 'Communication',
    reliability: 'Fiabilité',
    speed: 'Rapidité',
    care: 'Soin des documents'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Évaluer {travelerName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Traveler Info */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              {travelerPhoto ? (
                <img src={travelerPhoto} alt={travelerName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-primary">
                  {travelerName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{travelerName}</h3>
              <p className="text-sm text-muted-foreground">
                {userType === 'sender' ? 'A transporté votre document' : 'Vous a livré le document'}
              </p>
              <Badge variant="verified" className="mt-1">
                Voyageur vérifié
              </Badge>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Note globale *</label>
            <div className="flex items-center space-x-4">
              <StarRating
                value={hoveredRating || rating}
                onChange={handleStarClick}
                onHover={setHoveredRating}
                size="w-8 h-8"
              />
              <span className="text-sm text-muted-foreground">
                {rating > 0 && (
                  rating === 5 ? 'Excellent' :
                  rating === 4 ? 'Très bien' :
                  rating === 3 ? 'Bien' :
                  rating === 2 ? 'Moyen' : 'Décevant'
                )}
              </span>
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Évaluation détaillée</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{label}</span>
                    <span className="text-xs text-muted-foreground">
                      {categories[key as keyof typeof categories]}/5
                    </span>
                  </div>
                  <StarRating
                    value={categories[key as keyof typeof categories]}
                    onChange={(value) => handleCategoryRating(key as keyof typeof categories, value)}
                    size="w-5 h-5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Recommanderiez-vous ce voyageur ? *</label>
            <div className="flex space-x-4">
              <Button
                variant={wouldRecommend === true ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                className="flex-1"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Oui, je recommande
              </Button>
              <Button
                variant={wouldRecommend === false ? "destructive" : "outline"}
                onClick={() => setWouldRecommend(false)}
                className="flex-1"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Non, je ne recommande pas
              </Button>
            </div>
          </div>

          {/* Written Review */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Commentaire (optionnel)</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Partagez votre expérience avec ce voyageur..."
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {review.length}/500 caractères
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>Confidentialité:</strong> Votre évaluation sera visible publiquement pour aider d'autres utilisateurs. 
              Vos informations personnelles restent privées.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || rating === 0 || wouldRecommend === null}
            >
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer l'évaluation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
