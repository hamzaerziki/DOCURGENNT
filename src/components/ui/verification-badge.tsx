import { Shield, Clock, AlertCircle } from 'lucide-react';
import { Badge } from './badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'bronze' | 'silver' | 'gold';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const VerificationBadge = ({ status, className }: VerificationBadgeProps) => {
  const { t } = useLanguage();

  const config = {
    bronze: {
      icon: Shield,
      variant: 'bronze' as const,
      text: 'Bronze',
    },
    silver: {
      icon: Shield,
      variant: 'silver' as const,
      text: 'Silver',
    },
    gold: {
      icon: Shield,
      variant: 'gold' as const,
      text: 'Gold',
    },
    verified: {
      icon: Shield,
      variant: 'verified' as const,
      text: t('verification.verified')
    },
    pending: {
      icon: Clock,
      variant: 'pending' as const,
      text: t('verification.pending')
    },
    unverified: {
      icon: AlertCircle,
      variant: 'destructive' as const,
      text: t('verification.unverified')
    }
  } as const;

  const descriptions: Record<VerificationStatus, string> = {
    bronze: 'Email + phone verified',
    silver: 'ID + selfie verified',
    gold: 'Full KYC (ID + liveness)',
    verified: t('verification.verified'),
    pending: t('verification.pending'),
    unverified: t('verification.unverified'),
  };

  const { icon: Icon, variant, text } = config[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={variant} className={className}>
          <Icon className="w-3 h-3 mr-1" />
          {text}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{descriptions[status]}</TooltipContent>
    </Tooltip>
  );
};