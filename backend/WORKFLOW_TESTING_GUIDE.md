# DocUrgent Workflow Testing Guide

## ⚠️ IMPORTANT: Known Issues Fixed

### Critical Bug Fixed ✅
- **Authentication**: Fixed `get_current_user` to use UUID strings (was using int)
- **Dependencies**: Removed tenant-related code
- **User Types**: Added proper user_type checking

## 🧪 Complete Workflow Test

### Prerequisites
1. ✅ Backend server running: http://localhost:8000
2. ✅ Database migrated (traveler_code column added)
3. ✅ At least 2 users registered (sender + traveler)

---

## Step-by-Step Testing

### 1️⃣ Register Users

**Visit:** http://localhost:8000/docs

#### Register Sender
```json
POST /api/v1/auth/register
{
  "phone": "+33612345678",
  "password": "sender123",
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@example.com",
  "user_type": "sender"
}
```

**Save the response** - you'll need the user ID and codes.

#### Register Traveler
```json
POST /api/v1/auth/register
{
  "phone": "+33698765432",
  "password": "traveler123",
  "first_name": "Marie",
  "last_name": "Martin",
  "email": "marie@example.com",
  "user_type": "traveler"
}
```

#### Register Relay Point (Optional)
```json
POST /api/v1/auth/register
{
  "phone": "+33687654321",
  "password": "relay123",
  "first_name": "Relay",
  "last_name": "Point Paris",
  "email": "relay@example.com",
  "user_type": "relay_point"
}
```

---

### 2️⃣ Login as Sender

```json
POST /api/v1/auth/login
{
  "identifier": "+33612345678",
  "password": "sender123"
}
```

**Copy the `access_token`** from response.

**Click "Authorize" button** at top of /docs page:
- Enter: `Bearer YOUR_ACCESS_TOKEN`
- Click "Authorize"

---

### 3️⃣ Create Shipment

```json
POST /api/v1/shipments
{
  "sender_name": "Jean Dupont",
  "sender_phone": "+33612345678",
  "source_address": "123 Rue de Paris, 75001 Paris, France",
  "recipient_name": "Ahmed Benali",
  "recipient_phone": "+212612345678",
  "destination_address": "456 Avenue Mohammed V, Casablanca, Morocco",
  "document_type": "passport_copy",
  "document_description": "Passport copy for visa application",
  "offered_price": "25"
}
```

**Expected Response (201 Created):**
```json
{
  "id": "uuid-here",
  "unique_code": "DOCA2B3C",     // 8-char for Sender → Relay
  "delivery_code": "RCVX4Y5Z",   // 8-char for Receiver → Traveler
  "traveler_code": "TRVM6N7P",   // 8-char for Traveler → Relay
  "status": "created",
  ...
}
```

**✅ SAVE THESE CODES!** You'll need them for next steps.

---

### 4️⃣ Verify Database

```powershell
cd backend
.venv\Scripts\python.exe check_database.py
```

**Expected:** You should see the shipment in `document_requests` table with all 3 codes.

---

### 5️⃣ Assign Shipment to Traveler

```json
POST /api/v1/shipments/{shipment_id}/assign-traveler
{
  "traveler_id": "traveler-uuid-from-step-1",
  "trip_id": "any-uuid-or-create-trip-first"
}
```

**Note:** For testing, you can use any UUID for trip_id. In production, create a trip first.

---

### 6️⃣ Relay Point Check-In

**Login as Relay Point** (or use sender token for testing):

```json
POST /api/v1/relay-points/check-in
{
  "shipment_id": "uuid-from-step-3",
  "unique_code": "DOCA2B3C",  // Use actual code from step 3
  "relay_point_id": "relay-uuid-from-step-1",
  "notes": "Envelope received in good condition"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sender checked in successfully...",
  "shipment_id": "...",
  "new_status": "at_relay_point"
}
```

---

### 7️⃣ Traveler Pickup

**Login as Traveler:**

```json
POST /api/v1/auth/login
{
  "identifier": "+33698765432",
  "password": "traveler123"
}
```

**Authorize with traveler token**, then:

```json
POST /api/v1/relay-points/handoff
{
  "shipment_id": "uuid-from-step-3",
  "traveler_code": "TRVM6N7P",  // Use actual code from step 3
  "relay_point_id": "relay-uuid",
  "notes": "Handed to traveler, ID verified"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Envelope handed to traveler successfully",
  "new_status": "with_traveler",
  "traveler_name": "Marie Martin"
}
```

---

### 8️⃣ Delivery to Receiver

**Still logged in as Traveler:**

```json
POST /api/v1/travelers/deliver
{
  "shipment_id": "uuid-from-step-3",
  "delivery_code": "RCVX4Y5Z",  // Use actual code from step 3
  "notes": "Delivered to recipient in person"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Delivery confirmed! Shipment completed successfully.",
  "new_status": "delivered",
  "recipient_name": "Ahmed Benali"
}
```

---

### 9️⃣ View Timeline

```json
GET /api/v1/shipments/{shipment_id}/timeline
```

**Expected:** Complete history of all steps:
1. Shipment Created
2. Status changed to at_relay_point
3. Status changed to with_traveler
4. Status changed to delivered

---

## ✅ Success Criteria

- [ ] All 3 codes generated (8-char alphanumeric)
- [ ] Shipment saved to database
- [ ] Status transitions work correctly
- [ ] Code verification works at each step
- [ ] Timeline shows all steps
- [ ] Wrong codes are rejected

---

## 🐛 Troubleshooting

### "Could not validate credentials"
- Make sure you clicked "Authorize" with Bearer token
- Token format: `Bearer YOUR_ACCESS_TOKEN`

### "Invalid code"
- Double-check you're using the exact code from shipment creation
- Codes are case-sensitive
- Make sure you're using the right code for each step:
  - `unique_code` (DOCXXXXX) → Relay check-in
  - `traveler_code` (TRVXXXXX) → Traveler pickup
  - `delivery_code` (RCVXXXXX) → Final delivery

### "User not found"
- The authentication bug has been fixed
- Restart the backend server to load the fix

### "Shipment not found"
- Use the exact shipment ID from creation response
- Check database with `check_database.py`

---

## 🔍 Verify Everything Works

```powershell
# Check database
.venv\Scripts\python.exe check_database.py

# Should show:
# - Users with correct user_types
# - Shipment with all 3 codes
# - Multiple delivery_steps
# - Final status: delivered
```

---

## 📊 What's Working

✅ User registration (phone-based)
✅ Authentication (JWT tokens)
✅ Shipment creation with 3 codes
✅ Code generation (8-char alphanumeric)
✅ Relay point check-in
✅ Traveler pickup/handoff
✅ Delivery to receiver
✅ Status tracking
✅ Timeline history
✅ Database persistence

---

**Last Updated:** 2025-11-30
**Status:** Ready for Testing
