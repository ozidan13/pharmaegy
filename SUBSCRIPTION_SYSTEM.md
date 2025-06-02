# Subscription System Documentation

## Overview

The subscription system has been implemented for both Pharmacists and Pharmacy Owners with three tiers:

### Subscription Plans

1. **FREE** - 0 EGP (Default for all new users)
2. **STANDARD** - 20 EGP/month
3. **PREMIUM** - 40 EGP/month (Only available for Pharmacy Owners)

## Database Schema Changes

### New Enums
```prisma
enum SubscriptionPlan {
  FREE
  STANDARD
  PREMIUM
}

enum SubscriptionStatus {
  ACTIVE
  EXPIRED
  CANCELLED
}
```

### Updated Models

#### PharmacistProfile
- Added `subscriptionPlan` (defaults to FREE)
- Added `subscriptionStatus` (defaults to ACTIVE)
- Added `subscriptionExpiresAt` (nullable)

#### PharmacyOwnerProfile
- Added `subscriptionPlan` (defaults to FREE)
- Added `subscriptionStatus` (defaults to ACTIVE)
- Added `subscriptionExpiresAt` (nullable)

#### New SubscriptionPricing Model
- Stores pricing information for each plan
- Includes features as JSON
- Allows easy price updates

## API Endpoints

### 1. Get Subscription Pricing
```
GET /api/v1/subscriptions/pricing
```
Returns all available subscription plans with pricing and features.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "plan": "FREE",
      "price": 0,
      "currency": "EGP",
      "features": {...}
    },
    ...
  ]
}
```

### 2. Update Subscription Pricing (Admin)
```
PUT /api/v1/subscriptions/pricing
```
Allows updating pricing for subscription plans.

**Request Body:**
```json
{
  "plan": "STANDARD",
  "price": 25,
  "features": {...}
}
```

### 3. Get Current User's Subscription
```
GET /api/v1/subscriptions/me
```
Returns the current user's subscription status.

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": "STANDARD",
    "status": "ACTIVE",
    "expiresAt": "2024-07-02T22:28:42.000Z",
    "pricing": {...},
    "isExpired": false,
    "daysRemaining": 30
  }
}
```

### 4. Upgrade Subscription
```
POST /api/v1/subscriptions/upgrade
```
Upgrades user's subscription to a new plan.

**Request Body:**
```json
{
  "plan": "STANDARD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully upgraded to STANDARD plan",
  "data": {
    "subscriptionPlan": "STANDARD",
    "subscriptionStatus": "ACTIVE",
    "subscriptionExpiresAt": "2024-07-02T22:28:42.000Z",
    "pricing": {...}
  }
}
```

## Subscription Features

### FREE Plan
**Pharmacists:**
- Basic profile creation
- CV upload
- Basic search visibility
- Limited job applications (5)

**Pharmacy Owners:**
- Basic pharmacy profile
- Limited product listings (10)
- Basic search visibility
- Standard support

### STANDARD Plan (20 EGP)
**Pharmacists:**
- Enhanced profile features
- Priority in search results
- Unlimited job applications
- Advanced analytics
- Email notifications

**Pharmacy Owners:**
- Enhanced pharmacy profile
- Unlimited product listings
- Priority in search results
- Advanced analytics
- Email notifications
- Priority support

### PREMIUM Plan (40 EGP) - Pharmacy Owners Only
- Premium pharmacy profile
- Unlimited product listings
- Top priority in search results
- Advanced analytics & insights
- Real-time notifications
- Premium support
- Featured pharmacy badge
- Custom branding options
- API access

## Subscription Utilities

The `subscriptionUtils.ts` file provides helper functions:

### `getSubscriptionLimits(plan, userRole)`
Returns the limits and features for a given plan and user role.

### `checkSubscriptionStatus(userId, userRole)`
Checks the current subscription status and handles expiration.

### `canPerformAction(userId, userRole, action)`
Checks if a user can perform a specific action based on their subscription.

**Supported Actions:**
- `CREATE_PRODUCT` - Check product listing limits
- `APPLY_JOB` - Check job application limits
- `ACCESS_ANALYTICS` - Check analytics access
- `CUSTOM_BRANDING` - Check branding features

## Default Behavior

1. **New Registrations**: All new users (both pharmacists and pharmacy owners) are automatically assigned the FREE plan with ACTIVE status.

2. **Subscription Expiry**: Paid subscriptions expire after 30 days and automatically revert to FREE plan functionality.

3. **Graceful Degradation**: When subscriptions expire, users retain access to FREE plan features.

## Usage Examples

### Check if user can create a product
```typescript
import { canPerformAction } from '@/lib/subscriptionUtils';

const result = await canPerformAction(userId, UserRole.PHARMACY_OWNER, 'CREATE_PRODUCT');
if (!result.allowed) {
  return NextResponse.json(
    { success: false, message: result.reason },
    { status: 403 }
  );
}
```

### Get subscription limits
```typescript
import { checkSubscriptionStatus } from '@/lib/subscriptionUtils';

const subscription = await checkSubscriptionStatus(userId, userRole);
const limits = subscription?.limits;
```

## Testing the System

1. **Register a new user** - Should default to FREE plan
2. **Check subscription status** - GET `/api/v1/subscriptions/me`
3. **View pricing plans** - GET `/api/v1/subscriptions/pricing`
4. **Upgrade subscription** - POST `/api/v1/subscriptions/upgrade`
5. **Test limits** - Try creating products beyond FREE plan limits

## Future Enhancements

1. **Payment Integration**: Add payment gateway integration
2. **Subscription Analytics**: Track subscription metrics
3. **Automated Billing**: Implement recurring billing
4. **Promo Codes**: Add discount and promo code system
5. **Usage Tracking**: Monitor feature usage per plan
6. **Notification System**: Email reminders for expiring subscriptions