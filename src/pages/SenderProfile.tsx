import { useState, useEffect } from 'react';
import { User, Upload, Camera, Shield, Home, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  country: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  documents: {
    idFront?: string;
    idBack?: string;
    passport?: string;
    selfie?: string;
  };
}

const mockProfile: ProfileData = {
  firstName: 'Ahmed',
  lastName: 'Benali',
  email: 'ahmed.benali@email.com',
  phone: '+33612345678',
  dateOfBirth: '1990-05-15',
  address: '123 Rue de la République, Paris',
  country: 'France',
  verificationStatus: 'pending',
  documents: {
    idFront: '/placeholder.svg',
    selfie: '/placeholder.svg'
  }
};

export const SenderProfile = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [editing, setEditing] = useState(false);

  const handleFileUpload = (type: keyof ProfileData['documents'], file: File) => {
    // Mock file upload
    const url = URL.createObjectURL(file);
    setProfile(prev => ({
      ...prev,
      documents: { ...prev.documents, [type]: url }
    }));
  };

  const handleSubmit = () => {
    setEditing(false);
    // Mock verification update
    setProfile(prev => ({ ...prev, verificationStatus: 'pending' }));
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    const docUrls = Object.values(profile.documents);
    return () => {
      docUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [profile.documents]);

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Sender Profile & Verification</h1>
                <p className="text-muted-foreground">Manage your profile and complete KYC verification</p>
              </div>
              <VerificationBadge status={profile.verificationStatus} />
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard/sender">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Verification Status Card */}
          <Card className="mb-8 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Verification Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.verificationStatus === 'verified' && (
                  <div className="flex items-center space-x-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span>Your account is fully verified</span>
                  </div>
                )}
                {profile.verificationStatus === 'pending' && (
                  <div className="flex items-center space-x-2 text-warning">
                    <Shield className="w-5 h-5" />
                    <span>Verification in progress - Documents under review</span>
                  </div>
                )}
                {profile.verificationStatus === 'unverified' && (
                  <div className="flex items-center space-x-2 text-destructive">
                    <Shield className="w-5 h-5" />
                    <span>Account not verified - Please upload required documents</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Personal Information</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? 'Cancel' : 'Edit'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={profile.firstName}
                    disabled={!editing}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={profile.lastName}
                    disabled={!editing}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={profile.email}
                  disabled={!editing}
                  type="email"
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={profile.phone}
                  disabled={!editing}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input 
                  value={profile.dateOfBirth}
                  disabled={!editing}
                  type="date"
                  onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input 
                  value={profile.address}
                  disabled={!editing}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              {editing && (
                <Button onClick={handleSubmit} className="w-full">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* KYC Documents */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>KYC Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Front */}
              <div className="space-y-3">
                <Label>National ID - Front</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  {profile.documents.idFront ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.documents.idFront} 
                        alt="ID Front" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-success">✓ Uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">Upload front side of your National ID</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('id-front-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload National ID - Front
                  </Button>
                  <input
                    id="id-front-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('idFront', e.target.files[0])}
                  />
                </div>
              </div>

              {/* ID Back */}
              <div className="space-y-3">
                <Label>National ID - Back</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  {profile.documents.idBack ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.documents.idBack} 
                        alt="ID Back" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-success">✓ Uploaded</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">Upload back side of your National ID</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('id-back-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload National ID - Back
                  </Button>
                  <input
                    id="id-back-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('idBack', e.target.files[0])}
                  />
                </div>
              </div>

              {/* Selfie Verification */}
              <div className="space-y-3">
                <Label>Live Selfie Verification</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  {profile.documents.selfie ? (
                    <div className="space-y-2">
                      <img 
                        src={profile.documents.selfie} 
                        alt="Selfie" 
                        className="w-24 h-24 object-cover rounded-full mx-auto"
                      />
                      <p className="text-sm text-success">✓ Verified</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-3">Take a live selfie for verification</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('selfie-upload')?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Live Selfie Verification
                  </Button>
                  <input
                    id="selfie-upload"
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Requirements:</strong> Clear, well-lit photos. ID must be valid and match your personal information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};