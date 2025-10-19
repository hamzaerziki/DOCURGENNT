# PaperRelay

**Mobile-first PWA connecting senders in France with verified travelers to North Africa**

PaperRelay is a secure document delivery platform that connects people in France who need official documents delivered to Morocco, Algeria, and Tunisia with verified travelers going to these destinations.

## 🌟 Features

- **Bilingual Support**: Full French/English interface
- **KYC Verification**: Secure identity verification for all users  
- **Real-time Matching**: Find travelers by destination and date
- **Secure Handoff**: QR codes and pickup codes for safe document transfer
- **Escrow Protection**: Secure payments with dispute resolution
- **Mobile-first**: Optimized for smartphones and tablets
- **PWA Ready**: Installable web app with offline capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd paperrelay

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Routing**: React Router v6
- **State Management**: React Query (TanStack)
- **Animations**: CSS transitions with design system tokens

### Design System
The app uses a comprehensive design system with semantic color tokens:
- `--primary`: Main brand color (travel blue)
- `--accent`: Secondary accent (trust green)  
- `--verified`: Success states
- `--pending`: Warning/pending states
- Custom gradients and shadows for visual depth

## 📱 User Flows

### Sender Flow (3-click simplicity)
1. **Register & Verify**: Upload ID, get verified
2. **Find Travelers**: Search by destination → See list/map
3. **Request Delivery**: Select traveler → Pay escrow → Done

### Traveler Flow  
1. **Register & Verify**: Upload ID, add trip details
2. **Receive Requests**: Accept delivery requests  
3. **Pickup & Deliver**: Scan QR codes → Upload proof → Get paid

## 🔌 API Contract Examples

### Authentication
```javascript
// Register new user
POST /api/auth/register
{
  "first_name": "Ahmed",
  "last_name": "Benali", 
  "email": "ahmed@example.com",
  "phone": "+33612345678",
  "password": "securepass123",
  "residence_city": "Paris",
  "user_type": "sender" | "traveler"
}

// Login
POST /api/auth/login
{
  "email": "ahmed@example.com", 
  "password": "securepass123"
}
```

### KYC Verification
```javascript
// Upload identity documents
POST /api/kyc/upload
Content-Type: multipart/form-data
{
  "user_id": "uuid",
  "national_id_front": File,
  "national_id_back": File,  
  "selfie": File,
  "metadata": {}
}

// Check verification status
GET /api/kyc/status/:user_id
Response: {
  "status": "unverified" | "pending" | "verified",
  "documents_uploaded": boolean,
  "selfie_verified": boolean
}
```

### Trip Management
```javascript
// Add new trip (travelers)
POST /api/trips
{
  "user_id": "uuid",
  "departure_city": "Paris",
  "departure_date": "2024-01-15",
  "destination_city": "Casablanca", 
  "destination_country": "Morocco",
  "airline": "Royal Air Maroc",
  "flight_number": "AT754",
  "spots_available": 2,
  "price_per_document": 20
}

// Get user trips
GET /api/trips/user/:user_id
```

### Search & Discovery
```javascript
// Search travelers (senders)
GET /api/search/travelers?destination_city=Casablanca&date_from=2024-01-15&date_to=2024-01-20&verified_only=true

Response: [
  {
    "id": "uuid",
    "first_name": "Ahmed",
    "last_name": "B.",
    "verification_status": "verified",
    "rating": 4.8,
    "review_count": 24,
    "trip": {
      "departure_city": "Paris",
      "destination_city": "Casablanca", 
      "departure_date": "2024-01-15",
      "spots_available": 2,
      "price_range": {"min": 15, "max": 25}
    }
  }
]

// Nearby scan (with geolocation)
GET /api/search/nearby?lat=48.8566&lng=2.3522&radius_km=10&destination_country=Morocco
```

### Request Management  
```javascript
// Create delivery request (senders)
POST /api/requests
{
  "sender_id": "uuid",
  "traveler_id": "uuid", 
  "trip_id": "uuid",
  "document_type": "passport_copy",
  "pickup_location": "relay" | "custom",
  "relay_point_id": "uuid", // if pickup_location = "relay"
  "custom_address": "string", // if pickup_location = "custom"
  "delivery_notes": "string",
  "offered_price": 20
}

// Accept request (travelers)
PATCH /api/requests/:id/accept
{
  "accepted_price": 20,
  "pickup_instructions": "string"
}
```

### Payments & Escrow
```javascript
// Initialize payment (senders)
POST /api/payments/initialize  
{
  "request_id": "uuid",
  "amount_cents": 2000, // €20.00
  "payment_method": "stripe" | "paypal"
}

// Release escrow (after delivery confirmation)
POST /api/payments/:payment_id/release
{
  "delivery_confirmed": true,
  "qr_code_scanned": true,
  "photo_evidence_uploaded": true
}
```

### Handoff & Confirmation
```javascript
// Generate pickup codes (after request accepted)
POST /api/handoff/generate-codes
{
  "request_id": "uuid"
}

Response: {
  "pickup_code": "123456", 
  "qr_code_data": "paperrelay://pickup/abc123",
  "expires_at": "2024-01-15T10:00:00Z"
}

// Confirm pickup (travelers)
POST /api/handoff/pickup
{
  "request_id": "uuid",
  "pickup_code": "123456",
  "location": {"lat": 48.8566, "lng": 2.3522},
  "photo_evidence": File
}

// Confirm delivery (travelers) 
POST /api/handoff/delivery
{
  "request_id": "uuid", 
  "delivery_location": {"lat": 33.5731, "lng": -7.5898},
  "photo_evidence": File
}

// Final confirmation (senders)
POST /api/handoff/confirm-received
{
  "request_id": "uuid",
  "rating": 5,
  "review": "Great service!"
}
```

## 🛡️ Security & Compliance

### Data Protection
- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **GDPR Compliant**: Explicit consent, right to deletion
- **PII Masking**: ID numbers masked in UI, full docs encrypted
- **Rate Limiting**: API abuse protection

### Trust & Safety
- **KYC Required**: All users must verify identity
- **Document Restrictions**: Only official papers allowed (no cash/prohibited items)
- **Escrow Protection**: Payments held until delivery confirmed
- **Dispute Resolution**: Photo evidence + admin review

## 🎨 Component Library

### Core Components
- `<VerificationBadge />` - User verification status
- `<TravelerCard />` - Traveler profile with trip details  
- `<AuthModal />` - Login/register forms
- `<Header />` - Navigation with language switcher

### Layout Components  
- `<HeroSection />` - Landing page hero with CTA
- `<HowItWorksSection />` - 3-step process explanation
- `<SenderDashboard />` - Search travelers interface
- `<TravelerDashboard />` - Manage trips and requests

## 🌍 Internationalization

The app supports French and English with the `useLanguage` hook:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => setLanguage('fr')}>Français</button>
    </div>
  );
};
```

## 📋 Development Roadmap

### Phase 1 (Current) ✅
- [x] Landing page with hero section
- [x] User authentication & registration  
- [x] KYC verification flow
- [x] Basic search & discovery
- [x] Traveler profiles & trip management
- [x] Bilingual support (FR/EN)

### Phase 2 (Next)
- [ ] Real-time chat system
- [ ] Payment integration (Stripe/PayPal)
- [ ] QR code generation & scanning
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Relay point management

### Phase 3 (Future)
- [ ] Native mobile apps (React Native/Capacitor)
- [ ] Advanced analytics
- [ ] Insurance integration
- [ ] Multi-country expansion
- [ ] API for partner integrations

## 🚀 Deployment

### Staging
The app is automatically deployed to staging on every commit.

### Production  
```bash
# Build optimized bundle
npm run build

# Deploy (example with Netlify)
npm run deploy
```

### Environment Variables
```bash
# Authentication
VITE_AUTH_ENDPOINT=https://api.paperrelay.com
VITE_KYC_PROVIDER=onfido

# Payments  
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_PAYPAL_CLIENT_ID=xxx

# Maps & Geolocation
VITE_MAPBOX_TOKEN=pk.xxx

# Analytics
VITE_ANALYTICS_ID=xxx
```

## 📞 Support

- **Documentation**: [docs.paperrelay.com](https://docs.paperrelay.com)
- **API Reference**: [api.paperrelay.com/docs](https://api.paperrelay.com/docs)  
- **Support Email**: support@paperrelay.com
- **Discord Community**: [discord.gg/paperrelay](https://discord.gg/paperrelay)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ for the French-North African diaspora community**