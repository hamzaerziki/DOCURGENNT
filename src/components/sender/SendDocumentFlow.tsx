import React, { useState, useEffect } from 'react';
import { Upload, Phone, MapPin, CreditCard, Package2, Clock, CheckCircle, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface DocumentDetails {
  type: string;
  description: string;
  urgency: 'normal' | 'urgent' | 'express';

}

interface LocationDetails {
  currentCity: string;
  destinationCountry: string;
  destinationCity: string;
  deliveryTime: string;
  specialInstructions: string;
  deliverySpeed: 'normal' | 'urgent' | 'express';
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
}

interface ContactDetails {
  phoneNumber: string;
  isVerified: boolean;
}

interface SelectedTraveler {
  id: string;
  name: string;
  rating: number;
  price: number;
  arrivalTime: string;
  flightNumber: string;
}

type FlowStep = 'step1-document' | 'step2-phone' | 'step3-location' | 'step4-destination' | 'step4b-id-verification' | 'step5-recipient' | 'step6-travelers' | 'step7-payment' | 'step8-dropoff' | 'complete';

export const SendDocumentFlow = ({ 
  onClose, 
  isQuickSend = false, 
  isLoggedIn = false 
}: { 
  onClose: () => void;
  isQuickSend?: boolean;
  isLoggedIn?: boolean;
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FlowStep>('step1-document');
  const [documentDetails, setDocumentDetails] = useState<DocumentDetails>({
    type: '',
    description: '',
    urgency: 'normal'
  } as DocumentDetails);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    phoneNumber: '',
    isVerified: false
  });
  const [locationDetails, setLocationDetails] = useState<LocationDetails>({
    currentCity: '',
    destinationCountry: '',
    destinationCity: '',
    deliveryTime: '',
    specialInstructions: '',
    deliverySpeed: 'normal',
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: ''
  });
  const [selectedTraveler, setSelectedTraveler] = useState<SelectedTraveler | null>(null);
  const [dropOffCode, setDropOffCode] = useState<string>('');
  const [deliveryCode, setDeliveryCode] = useState<string>('');
  const [insuranceSelected, setInsuranceSelected] = useState<boolean>(false);
  const [idFile, setIdFile] = useState<File | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const documentTypes = {
    "administrative": [
      "Birth certificate",
      "Marriage certificate",
      "Divorce certificate",
      "Death certificate",
      "Residency certificate",
      "Criminal record extract",
      "Voting registration papers"
    ],
    "identity_travel": [
      "Passport copy",
      "National ID copy",
      "Driving license copy",
      "Residence permit",
      "Student card copy"
    ],
    "legal_notarial": [
      "Contracts",
      "Court documents",
      "Notarial deeds",
      "Powers of attorney"
    ],
    "academic_professional": [
      "Diplomas",
      "Transcripts",
      "Enrollment confirmations",
      "Employment contracts",
      "Work attestations",
      "Internship attestations"
    ],
    "financial_banking": [
      "Bank statements",
      "Tax declarations",
      "Proof of income",
      "Pay slips",
      "Invoices",
      "Receipts"
    ]
  };

  const countries = ['Morocco', 'Algeria', 'Tunisia'];
  const citiesByCountry = {
    'Morocco': ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Agadir', 'Tangier'],
    'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Tlemcen'],
    'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Gabès', 'Bizerte']
  };

  // French cities for current location
  const frenchCities = [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg',
    'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre',
    'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Aix-en-Provence', 'Brest'
  ];

  const mockTravelers = [
    {
      id: '1',
      name: 'Ahmed Benali',
      rating: 4.8,
      price: 25,
      arrivalTime: '2024-01-15 14:30',
      flightNumber: 'AT754',
      verification: 'verified'
    },
    {
      id: '2',
      name: 'Leila Mansouri',
      rating: 4.9,
      price: 30,
      arrivalTime: '2024-01-15 16:45',
      flightNumber: 'TU721',
      verification: 'verified'
    }
  ];

  const handlePhoneVerification = async (method: 'sms' | 'call' = 'sms') => {
    // Mock sending OTP via SMS/Call
    setOtpError(null);
    setOtpSubmitting(true);
    setTimeout(() => {
      setOtpSubmitting(false);
      setOtpSent(true);
      toast({
        title: 'Code sent',
        description: `Enter the 6-digit code sent via ${method.toUpperCase()}.`,
      });
    }, 800);
  };

  const handleOtpSubmit = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }
    setOtpError(null);
    setOtpSubmitting(true);
    setTimeout(() => {
      setOtpSubmitting(false);
      setContactDetails(prev => ({ ...prev, isVerified: true }));
      toast({
        title: 'Phone Verified',
        description: 'Your phone number has been successfully verified.',
      });
    }, 1000);
  };

  const handleTravelerSelection = (traveler: any) => {
    setSelectedTraveler(traveler);
    setCurrentStep('step7-payment');
  };

  const handlePayment = async () => {
    // Mock payment processing
    const basePrice = selectedTraveler?.price || 25;
    const urgencyFee = locationDetails.deliverySpeed === 'urgent' ? 5 : 
                      locationDetails.deliverySpeed === 'express' ? 15 : 0;
    const insuranceFee = insuranceSelected ? 3 : 0;
    const totalAmount = basePrice + 3 + urgencyFee + insuranceFee; // base + service fee + urgency fee + insurance
    
    setTimeout(() => {
      const dropCode = `DR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const delivCode = Math.random().toString().substring(2, 8);
      setDropOffCode(dropCode);
      setDeliveryCode(delivCode);
      setCurrentStep('step8-dropoff');
      toast({
        title: "Payment Successful",
        description: `€${totalAmount} charged successfully. Drop-off code: ${dropCode}`,
      });
    }, 2000);
  };

  const handleDropOffComplete = () => {
    setCurrentStep('complete');
    toast({
      title: "Document Sent Successfully!",
      description: "Your document has been accepted and will be delivered soon.",
    });
  };

  // Update initial step for quick send
  React.useEffect(() => {
    if (isQuickSend && isLoggedIn && currentStep === 'step1-document') {
      setCurrentStep('step3-location');
    }
  }, [isQuickSend, isLoggedIn, currentStep]);

  // Reset verification status if phone number changes
  useEffect(() => {
    if (contactDetails.isVerified) {
      setContactDetails(prev => ({ ...prev, isVerified: false }));
    }
    // Reset OTP flow when phone changes
    setOtpSent(false);
    setOtpValue('');
    setOtpError(null);
  }, [contactDetails.phoneNumber]);

  const stepTitles = {
    'step1-document': 'Étape 1: Document Details',
    'step2-phone': 'Étape 2: Phone Verification',
    'step3-location': 'Étape 3: Your Current Location',
    'step4-destination': 'Étape 4: Destination Selection',
    'step4b-id-verification': 'Étape 5: ID Verification',
    'step5-recipient': 'Étape 6: Recipient Information',
    'step6-travelers': 'Étape 7: Available Travelers',
    'step7-payment': 'Étape 8: Payment & Confirmation',
    'step8-dropoff': 'Étape 9: Drop-off Instructions',
    'complete': 'Envoi Terminé'
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-x-auto px-2">
      <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
        {Object.keys(stepTitles).map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              currentStep === step ? 'bg-primary text-primary-foreground' :
              Object.keys(stepTitles).indexOf(currentStep) > index ? 'bg-success text-success-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {Object.keys(stepTitles).indexOf(currentStep) > index ? 
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : index + 1
              }
            </div>
            {index < Object.keys(stepTitles).length - 1 && (
              <div className={`w-3 sm:w-6 h-0.5 ${
                Object.keys(stepTitles).indexOf(currentStep) > index ? 'bg-success' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Étape 1 sur 9</h3>
        <p className="text-sm sm:text-base text-muted-foreground">Décrivez votre document à envoyer</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Document Type</label>
          <Select value={documentDetails.type} onValueChange={(value) =>
            setDocumentDetails(prev => ({ ...prev, type: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(documentTypes).map(([category, docs]) => (
                <SelectGroup key={category}>
                  <SelectLabel className="capitalize">{category.replace('_', ' ')}</SelectLabel>
                  {docs.map(doc => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            value={documentDetails.description}
            onChange={(e) => setDocumentDetails(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of your document..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">Only flat documents (envelopes) up to 500g are allowed. No packages.</p>
        </div>

      </div>

      <Button 
        onClick={() => setCurrentStep(isLoggedIn ? 'step3-location' : 'step2-phone')} 
        className="w-full"
        disabled={!documentDetails.type || !documentDetails.description}
      >
        Continuer vers l'étape 2
      </Button>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 2 sur 9</h3>
        <p className="text-muted-foreground">Vérification de votre numéro de téléphone</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Phone Number (Required)</label>
          <div className="flex space-x-2">
            <Input
              type="tel"
              value={contactDetails.phoneNumber}
              onChange={(e) => setContactDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="+33 6 12 34 56 78"
              className="flex-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="outline"
              onClick={() => handlePhoneVerification('sms')}
              disabled={!contactDetails.phoneNumber || contactDetails.isVerified || otpSubmitting}
              className="w-full"
            >
              {contactDetails.isVerified ? <CheckCircle className="w-4 h-4 mr-1" /> : <Phone className="w-4 h-4 mr-1" />}
              {contactDetails.isVerified ? 'Verified' : otpSubmitting ? 'Sending…' : 'SMS'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => handlePhoneVerification('call')}
              disabled={!contactDetails.phoneNumber || contactDetails.isVerified || otpSubmitting}
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-1" />
              {otpSubmitting ? 'Calling…' : 'Call'}
            </Button>
          </div>
          {otpSent && !contactDetails.isVerified && (
            <div className="mt-4 space-y-3">
              <label className="text-sm font-medium mb-1 block">Enter verification code</label>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(val) => setOtpValue(val)}
                containerClassName="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {otpError && <p className="text-sm text-destructive">{otpError}</p>}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handlePhoneVerification('sms')} disabled={otpSubmitting}>
                  Resend Code
                </Button>
                <Button className="flex-1" onClick={handleOtpSubmit} disabled={otpSubmitting || otpValue.length !== 6}>
                  Verify Code
                </Button>
              </div>
            </div>
          )}
          {contactDetails.isVerified && (
            <div className="flex items-center mt-2 text-sm">
              <Badge variant="verified" className="mr-2">Phone Verified</Badge>
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" onClick={() => setCurrentStep('step1-document')} className="flex-1 h-11">
          Retour
        </Button>
        <Button 
          onClick={() => setCurrentStep('step3-location')} 
          className="flex-1 h-11"
          disabled={!contactDetails.isVerified}
        >
          Continuer vers l'étape 3
        </Button>
      </div>
    </div>
  );

  const renderCurrentLocationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 3 sur 9</h3>
        <p className="text-muted-foreground">Où êtes-vous actuellement?</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Your Current City</label>
          <Select value={locationDetails.currentCity} onValueChange={(value) => 
            setLocationDetails(prev => ({ ...prev, currentCity: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Where are you now?" />
            </SelectTrigger>
            <SelectContent>
              {frenchCities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" onClick={() => setCurrentStep(isLoggedIn ? 'step1-document' : 'step2-phone')} className="flex-1 h-11">
          Retour
        </Button>
        <Button 
          onClick={() => setCurrentStep('step4-destination')} 
          className="flex-1 h-11"
          disabled={!locationDetails.currentCity}
        >
          Continuer vers l'étape 4
        </Button>
      </div>
    </div>
  );

  const renderDestinationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 4 sur 9</h3>
        <p className="text-muted-foreground">Sélectionnez votre destination</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Destination Country</label>
          <Select value={locationDetails.destinationCountry} onValueChange={(value) => 
            setLocationDetails(prev => ({ ...prev, destinationCountry: value, destinationCity: '' }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Destination City</label>
          <Select 
            value={locationDetails.destinationCity} 
            onValueChange={(value) => setLocationDetails(prev => ({ ...prev, destinationCity: value }))}
            disabled={!locationDetails.destinationCountry}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {locationDetails.destinationCountry && citiesByCountry[locationDetails.destinationCountry as keyof typeof citiesByCountry]?.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Type d'Envoi</label>
          <Select value={locationDetails.deliverySpeed} onValueChange={(value: any) => 
            setLocationDetails(prev => ({ ...prev, deliverySpeed: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">
                <div className="flex flex-col">
                  <span className="font-medium">Normal (5-7 jours)</span>
                  <span className="text-sm text-muted-foreground">Gratuit - Livraison standard</span>
                </div>
              </SelectItem>
              <SelectItem value="urgent">
                <div className="flex flex-col">
                  <span className="font-medium">Urgent (2-3 jours) - +€5</span>
                  <span className="text-sm text-muted-foreground">Livraison prioritaire</span>
                </div>
              </SelectItem>
              <SelectItem value="express">
                <div className="flex flex-col">
                  <span className="font-medium">Express (24-48h) - +€15</span>
                  <span className="text-sm text-muted-foreground">Livraison ultra-rapide</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Preferred Delivery Time</label>
          <Input
            type="datetime-local"
            value={locationDetails.deliveryTime}
            onChange={(e) => setLocationDetails(prev => ({ ...prev, deliveryTime: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Special Instructions</label>
        <Textarea
          value={locationDetails.specialInstructions}
          onChange={(e) => setLocationDetails(prev => ({ ...prev, specialInstructions: e.target.value }))}
          placeholder="Any special delivery instructions..."
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('step3-location')} 
          className="flex-1 h-11"
        >
          Retour
        </Button>
        <Button 
          onClick={() => {
            if (locationDetails.deliverySpeed === 'urgent' || locationDetails.deliverySpeed === 'express') {
              setCurrentStep('step4b-id-verification');
            } else {
              setCurrentStep('step5-recipient');
            }
          }} 
          className="flex-1 h-11"
          disabled={!locationDetails.destinationCountry || !locationDetails.destinationCity}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderIdVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 5 sur 9</h3>
        <p className="text-muted-foreground">Advanced Verification for Express/Urgent Service</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Upload ID (CIN, Passport, or Residence Permit)</label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setIdFile(e.target.files ? e.target.files[0] : null)}
            className="cursor-pointer"
          />
          {idFile && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center">
              <Package2 className="w-4 h-4 mr-2" />
              {idFile.name} ({(idFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <p>Uploading an ID is required for Express and Urgent services to ensure security and trust. Your ID will be verified and a "Verified" badge will be added to your profile.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button variant="outline" onClick={() => setCurrentStep('step4-destination')} className="flex-1 h-11">
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep('step5-recipient')} 
          className="flex-1 h-11"
          disabled={!idFile}
        >
          Continue to Recipient Information
        </Button>
      </div>
    </div>
  );

  const renderRecipientStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 6 sur 9</h3>
        <p className="text-muted-foreground">Informations du destinataire</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Nom complet du destinataire *</label>
          <Input
            value={locationDetails.recipientName}
            onChange={(e) => setLocationDetails(prev => ({ ...prev, recipientName: e.target.value }))}
            placeholder="Nom et prénom du destinataire"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Numéro de téléphone du destinataire *</label>
          <Input
            type="tel"
            value={locationDetails.recipientPhone}
            onChange={(e) => setLocationDetails(prev => ({ ...prev, recipientPhone: e.target.value }))}
            placeholder="+212 6 12 34 56 78"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Le destinataire recevra un code unique par SMS pour confirmer la livraison
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Email du destinataire (optionnel)</label>
          <Input
            type="email"
            value={locationDetails.recipientEmail}
            onChange={(e) => setLocationDetails(prev => ({ ...prev, recipientEmail: e.target.value }))}
            placeholder="email@exemple.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Adresse de livraison complète *</label>
          <Textarea
            value={locationDetails.recipientAddress}
            onChange={(e) => setLocationDetails(prev => ({ ...prev, recipientAddress: e.target.value }))}
            placeholder="Adresse complète (rue, ville, code postal)"
            rows={3}
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">🔒 Sécurité de la livraison</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Le destinataire recevra un code unique à 6 chiffres par SMS</li>
          <li>• Ce code doit être donné au voyageur pour confirmer la livraison</li>
          <li>• Sans ce code, aucune livraison ne sera effectuée</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          onClick={() => {
            if (locationDetails.deliverySpeed === 'urgent' || locationDetails.deliverySpeed === 'express') {
              setCurrentStep('step4b-id-verification');
            } else {
              setCurrentStep('step4-destination');
            }
          }} 
          className="flex-1 h-11"
        >
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep('step6-travelers')} 
          className="flex-1 h-11"
          disabled={!locationDetails.recipientName || !locationDetails.recipientPhone || !locationDetails.recipientAddress}
        >
          Chercher des voyageurs
        </Button>
      </div>
    </div>
  );

  const renderTravelersStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 7 sur 9</h3>
        <p className="text-muted-foreground">Voyageurs disponibles pour votre destination</p>
      </div>

      <div className="space-y-4">
        {mockTravelers.map(traveler => (
          <Card key={traveler.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">{traveler.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{traveler.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>★ {traveler.rating}</span>
                      <span>•</span>
                      <span>{traveler.flightNumber}</span>
                      <Badge variant="verified" className="ml-2">Verified</Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Arrives: {new Date(traveler.arrivalTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">€{traveler.price}</div>
                  <Button onClick={() => handleTravelerSelection(traveler)} size="sm">
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={() => setCurrentStep('step5-recipient')} className="w-full">
        Retour aux informations destinataire
      </Button>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-primary">Étape 8 sur 9</h3>
        <p className="text-muted-foreground">Confirmation et paiement</p>
      </div>

      {selectedTraveler && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Voyageur: {selectedTraveler.name}</span>
                <span>€{selectedTraveler.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service</span>
                <span>€3</span>
              </div>
              {locationDetails.deliverySpeed !== 'normal' && (
                <div className="flex justify-between">
                  <span>Frais {locationDetails.deliverySpeed}</span>
                  <span>€{locationDetails.deliverySpeed === 'urgent' ? 5 : 15}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={insuranceSelected}
                    onChange={(e) => setInsuranceSelected(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="insurance" className="text-sm">Assurance (optionnelle)</label>
                </div>
                <span>€3</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>€{selectedTraveler.price + 3 + (locationDetails.deliverySpeed === 'urgent' ? 5 : locationDetails.deliverySpeed === 'express' ? 15 : 0) + (insuranceSelected ? 3 : 0)}</span>
              </div>
              <div className="mt-3 bg-muted p-3 rounded-md flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Protection Escrow</p>
                  <p className="text-muted-foreground">Nous sécurisons votre paiement jusqu'à confirmation de livraison.</p>
                  <Badge variant="pending" className="mt-2">Escrow: sécurisé</Badge>
                </div>
              </div>
              <div className="mt-3 bg-muted p-3 rounded-md flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-muted-foreground">Your payment is secured with 3D Secure (Visa/Mastercard).</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">📱 Notification au destinataire</h4>
        <p className="text-sm text-green-800">
          {locationDetails.recipientName} recevra un SMS avec le code de livraison unique: <strong>{deliveryCode || '123456'}</strong>
        </p>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => setCurrentStep('step6-travelers')} className="flex-1">
          Retour
        </Button>
        <Button onClick={handlePayment} className="flex-1">
          <CreditCard className="w-4 h-4 mr-2" />
          Payer maintenant
        </Button>
      </div>
    </div>
  );

  // Get nearest relay point based on user's location
  const getNearestRelayPoint = () => {
    const relayPoints = {
      'paris': { name: 'Relay Point Châtelet', address: '1 Place du Châtelet, 75001 Paris', hours: 'Lun-Sam 9:00-19:00' },
      'lyon': { name: 'Relay Point Bellecour', address: '2 Place Bellecour, 69002 Lyon', hours: 'Lun-Sam 9:00-18:30' },
      'marseille': { name: 'Relay Point Vieux-Port', address: '3 Quai du Port, 13002 Marseille', hours: 'Lun-Sam 8:30-19:00' },
      'toulouse': { name: 'Relay Point Capitole', address: '1 Place du Capitole, 31000 Toulouse', hours: 'Lun-Sam 9:00-18:00' },
      'nice': { name: 'Relay Point Masséna', address: '5 Place Masséna, 06000 Nice', hours: 'Lun-Sam 9:00-19:00' },
      'bordeaux': { name: 'Relay Point Quinconces', address: '12 Place des Quinconces, 33000 Bordeaux', hours: 'Lun-Sam 9:00-18:30' },
    };
    
    const userCity = locationDetails.currentCity.toLowerCase();
    return relayPoints[userCity] || relayPoints['paris']; // Default to Paris if city not found
  };

  const renderDropOffStep = () => {
    const nearestPoint = getNearestRelayPoint();
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-primary">{t('send.step7.title')}</h3>
          <p className="text-muted-foreground">{t('send.step7.subtitle')}</p>
        </div>
        
        <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-success mb-2">{t('send.step7.paymentConfirmed')}</h3>
          <p className="text-muted-foreground">{t('send.step7.dropOffMessage')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>{t('send.step7.instructionsTitle')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold mb-2">{dropOffCode}</div>
                <p className="text-sm text-muted-foreground">{t('send.step7.dropOffCode')}</p>
              </div>
            </div>
            
            <div className="text-left space-y-2">
              <h4 className="font-semibold">{t('send.step7.nearestPoint')}</h4>
              <div className="bg-muted/30 p-3 rounded">
                <p className="font-medium">{nearestPoint.name}</p>
                <p className="text-sm text-muted-foreground">{nearestPoint.address}</p>
                <p className="text-sm text-muted-foreground">{t('send.step7.hours')}: {nearestPoint.hours}</p>
              </div>
            </div>

            <div className="text-left space-y-2 text-sm">
              <h4 className="font-semibold">{t('send.step7.instructions')}</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>{t('send.step7.step1')}</li>
                <li>{t('send.step7.step2')}</li>
                <li>{t('send.step7.step3')}</li>
                <li>{t('send.step7.step4')}</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleDropOffComplete} className="w-full">
          {t('send.step7.completed')}
        </Button>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="bg-success/10 border border-success/20 rounded-lg p-8">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-success mb-2">All Done!</h3>
        <p className="text-muted-foreground mb-4">
          Your document has been successfully sent and is now with the traveler.
        </p>
        <Badge variant="verified" className="text-sm">
          Tracking ID: {dropOffCode}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-3">{t('send.complete.whatNext')}</h4>
          <div className="space-y-2 text-sm text-left">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>{t('send.complete.step1')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span>{t('send.complete.step2').replace('{name}', selectedTraveler?.name || 'voyageur')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span>{t('send.complete.step3')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span>{t('send.complete.step4')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-2">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button onClick={() => setCurrentStep('step1-document')} className="flex-1">
          Envoyer un autre document
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg sm:text-xl">
            {stepTitles[currentStep]}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2 sm:py-4">
          {renderStepIndicator()}
          
          {/* Error boundary for step rendering */}
          {(() => {
            try {
              switch (currentStep) {
                case 'step1-document':
                  return renderDocumentStep();
                case 'step2-phone':
                  return renderContactStep();
                case 'step3-location':
                  return renderCurrentLocationStep();
                case 'step4-destination':
                  return renderDestinationStep();
                case 'step4b-id-verification':
                  return renderIdVerificationStep();
                case 'step5-recipient':
                  return renderRecipientStep();
                case 'step6-travelers':
                  return renderTravelersStep();
                case 'step7-payment':
                  return renderPaymentStep();
                case 'step8-dropoff':
                  return renderDropOffStep();
                case 'complete':
                  return renderCompleteStep();
                default:
                  return (
                    <div className="text-center py-8">
                      <p className="text-destructive">Error: Unknown step {currentStep}</p>
                      <Button onClick={() => setCurrentStep('step1-document')} className="mt-4">
                        Reset to Step 1
                      </Button>
                    </div>
                  );
              }
            } catch (error) {
              console.error('Error rendering step:', error);
              return (
                <div className="text-center py-8">
                  <p className="text-destructive">An error occurred while loading this step.</p>
                  <p className="text-sm text-muted-foreground mt-2">Please try again or contact support.</p>
                  <Button onClick={() => setCurrentStep('step1-document')} className="mt-4">
                    Reset to Step 1
                  </Button>
                </div>
              );
            }
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};