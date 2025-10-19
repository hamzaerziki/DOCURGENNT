import { useState } from 'react';
import { Gift, Star, Trophy, Zap, Crown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface UserStats {
  totalSends: number;
  totalDeliveries: number;
  totalEarnings: number;
  currentStreak: number;
  loyaltyPoints: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  nextLevelPoints: number;
  currentLevelPoints: number;
  badges: string[];
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_send' | 'premium' | 'exclusive';
  available: boolean;
  icon: any;
}

const mockUserStats: UserStats = {
  totalSends: 12,
  totalDeliveries: 8,
  totalEarnings: 240,
  currentStreak: 5,
  loyaltyPoints: 1250,
  level: 'Silver',
  nextLevelPoints: 2000,
  currentLevelPoints: 1000,
  badges: ['First Send', 'Verified User', 'Speed Demon', 'Trusted Traveler']
};

const rewards: Reward[] = [
  {
    id: '1',
    title: '50% Off Next Send',
    description: 'Get 50% discount on your next document send',
    pointsCost: 500,
    type: 'discount',
    available: true,
    icon: Gift
  },
  {
    id: '2',
    title: 'Free Document Send',
    description: 'Send one document completely free',
    pointsCost: 800,
    type: 'free_send',
    available: true,
    icon: Star
  },
  {
    id: '3',
    title: 'Premium Matching',
    description: '7 days of premium traveler matching',
    pointsCost: 1200,
    type: 'premium',
    available: true,
    icon: Zap
  },
  {
    id: '4',
    title: 'VIP Status Upgrade',
    description: 'Skip to Gold level instantly',
    pointsCost: 2000,
    type: 'exclusive',
    available: false,
    icon: Crown
  }
];

const levelColors = {
  Bronze: 'bg-amber-600',
  Silver: 'bg-slate-400',
  Gold: 'bg-yellow-500',
  Platinum: 'bg-gray-300',
  Diamond: 'bg-blue-400'
};

const levelBenefits = {
  Bronze: ['Basic matching', '1 point per €1 spent'],
  Silver: ['Better visibility', '1.2 points per €1 spent', '5% fee discount'],
  Gold: ['Priority matching', '1.5 points per €1 spent', '10% fee discount'],
  Platinum: ['Premium support', '2 points per €1 spent', '15% fee discount'],
  Diamond: ['Exclusive features', '2.5 points per €1 spent', '20% fee discount']
};

export const RewardsSystem = ({ userType = 'sender' }: { userType: 'sender' | 'traveler' }) => {
  const { toast } = useToast();
  const [stats, setStats] = useState(mockUserStats);

  const handleRedeemReward = (rewardId: string, pointsCost: number) => {
    if (stats.loyaltyPoints >= pointsCost) {
      setStats(prev => ({
        ...prev,
        loyaltyPoints: prev.loyaltyPoints - pointsCost
      }));
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been applied to your account.",
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: "You need more loyalty points to redeem this reward.",
        variant: "destructive"
      });
    }
  };

  const progressToNextLevel = ((stats.loyaltyPoints - stats.currentLevelPoints) / (stats.nextLevelPoints - stats.currentLevelPoints)) * 100;

  return (
    <div className="space-y-6">
      {/* Level & Progress */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-warning" />
            <span>Your Level: {stats.level}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress to {
              stats.level === 'Bronze' ? 'Silver' :
              stats.level === 'Silver' ? 'Gold' :
              stats.level === 'Gold' ? 'Platinum' :
              stats.level === 'Platinum' ? 'Diamond' : 'Max Level'
            }</span>
            <span className="text-sm text-muted-foreground">
              {stats.loyaltyPoints} / {stats.nextLevelPoints} points
            </span>
          </div>
          <Progress value={progressToNextLevel} className="h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-background/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{stats.loyaltyPoints}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-success">€{stats.totalEarnings}</div>
              <div className="text-sm text-muted-foreground">Earned</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-warning">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="bg-background/50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-destructive">{userType === 'sender' ? stats.totalSends : stats.totalDeliveries}</div>
              <div className="text-sm text-muted-foreground">{userType === 'sender' ? 'Sends' : 'Deliveries'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-warning" />
            <span>{stats.level} Level Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {levelBenefits[stats.level].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Gift className="w-5 h-5 text-primary" />
          <span>Available Rewards</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map(reward => {
            const Icon = reward.icon;
            const canAfford = stats.loyaltyPoints >= reward.pointsCost;
            
            return (
              <Card key={reward.id} className={`${!reward.available || !canAfford ? 'opacity-60' : 'hover:shadow-md'} transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        reward.type === 'discount' ? 'bg-blue-100 text-blue-600' :
                        reward.type === 'free_send' ? 'bg-green-100 text-green-600' :
                        reward.type === 'premium' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{reward.title}</h4>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <Badge variant={canAfford ? 'default' : 'secondary'}>
                      {reward.pointsCost} pts
                    </Badge>
                  </div>
                  
                  <Button 
                    onClick={() => handleRedeemReward(reward.id, reward.pointsCost)}
                    disabled={!reward.available || !canAfford}
                    size="sm"
                    className="w-full"
                  >
                    {!reward.available ? 'Not Available' :
                     !canAfford ? 'Insufficient Points' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span>Your Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge, index) => (
              <Badge key={index} variant="verified" className="flex items-center space-x-1">
                <Trophy className="w-3 h-3" />
                <span>{badge}</span>
              </Badge>
            ))}
          </div>
          {stats.badges.length === 0 && (
            <p className="text-muted-foreground text-sm">Complete actions to earn badges!</p>
          )}
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userType === 'sender' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Send a document</span>
                  <Badge variant="outline">+50 points</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Successful delivery</span>
                  <Badge variant="outline">+25 points</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Leave a review</span>
                  <Badge variant="outline">+10 points</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Refer a friend</span>
                  <Badge variant="outline">+100 points</Badge>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complete a delivery</span>
                  <Badge variant="outline">+75 points</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perfect delivery rating</span>
                  <Badge variant="outline">+25 points</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintain delivery streak</span>
                  <Badge variant="outline">+15 points/day</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Refer a traveler</span>
                  <Badge variant="outline">+150 points</Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};