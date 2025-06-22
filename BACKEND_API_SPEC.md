# Backend API Specification for Stripe Payment Integration

This document outlines the required backend API endpoints for integrating Stripe payments with your React Native app.

## Base URL
```
https://your-backend-api.com
```

## Authentication
All endpoints should include proper authentication (JWT tokens, API keys, etc.) as needed for your application.

## Required Endpoints

### 1. Get Stripe Configuration
**GET** `/api/stripe/config`

Returns the Stripe publishable key for the client.

**Response:**
```json
{
  "publishableKey": "pk_test_...",
  "merchantIdentifier": "merchant.com.auragen.app"
}
```

**Implementation:**
```javascript
// Node.js/Express example
app.get('/api/stripe/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: 'merchant.com.auragen.app'
  });
});
```

### 2. Get Payment Plans
**GET** `/api/stripe/plans`

Returns available subscription plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "basic_monthly",
      "name": "Basic Plan",
      "price": 499,
      "currency": "usd",
      "interval": "month",
      "features": ["Unlimited AI sessions", "Standard support"]
    },
    {
      "id": "premium_monthly",
      "name": "Premium Plan",
      "price": 999,
      "currency": "usd",
      "interval": "month",
      "features": ["Everything in Basic", "Priority support", "Early access to new features"]
    }
  ]
}
```

**Implementation:**
```javascript
app.get('/api/stripe/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'basic_monthly',
        name: 'Basic Plan',
        price: 499,
        currency: 'usd',
        interval: 'month',
        features: ['Unlimited AI sessions', 'Standard support']
      },
      {
        id: 'premium_monthly',
        name: 'Premium Plan',
        price: 999,
        currency: 'usd',
        interval: 'month',
        features: ['Everything in Basic', 'Priority support', 'Early access to new features']
      }
    ];
    
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});
```

### 3. Create Payment Intent
**POST** `/api/stripe/create-payment-intent`

Creates a Stripe Payment Intent for processing payments.

**Request Body:**
```json
{
  "planId": "basic_monthly",
  "customerId": "cus_...",
  "metadata": {
    "source": "mobile_app",
    "plan_type": "basic_monthly"
  }
}
```

**Response:**
```json
{
  "paymentIntent": {
    "id": "pi_...",
    "client_secret": "pi_..._secret_...",
    "amount": 499,
    "currency": "usd"
  }
}
```

**Implementation:**
```javascript
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { planId, customerId, metadata } = req.body;
    
    // Get plan details
    const plan = await getPlanDetails(planId);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price,
      currency: plan.currency,
      customer: customerId,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. Verify Payment
**POST** `/api/stripe/verify-payment`

Verifies that a payment was successful.

**Request Body:**
```json
{
  "paymentIntentId": "pi_..."
}
```

**Response:**
```json
{
  "verified": true,
  "status": "succeeded"
}
```

**Implementation:**
```javascript
app.post('/api/stripe/verify-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      verified: paymentIntent.status === 'succeeded',
      status: paymentIntent.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Create Customer
**POST** `/api/stripe/create-customer`

Creates a Stripe customer for subscription management.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "customerId": "cus_..."
}
```

**Implementation:**
```javascript
app.post('/api/stripe/create-customer', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'mobile_app'
      }
    });
    
    res.json({ customerId: customer.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 6. Get Subscription Status
**GET** `/api/stripe/subscription-status/:customerId`

Returns the subscription status for a customer.

**Response:**
```json
{
  "hasActiveSubscription": true,
  "planId": "basic_monthly",
  "expiresAt": "2024-12-31T23:59:59Z",
  "subscriptionId": "sub_..."
}
```

**Implementation:**
```javascript
app.get('/api/stripe/subscription-status/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });
    
    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      res.json({
        hasActiveSubscription: true,
        planId: subscription.items.data[0].price.id,
        expiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
        subscriptionId: subscription.id
      });
    } else {
      res.json({ hasActiveSubscription: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 7. Cancel Subscription
**POST** `/api/stripe/cancel-subscription`

Cancels an active subscription.

**Request Body:**
```json
{
  "subscriptionId": "sub_..."
}
```

**Response:**
```json
{
  "success": true,
  "cancelledAt": "2024-01-01T00:00:00Z"
}
```

**Implementation:**
```javascript
app.post('/api/stripe/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({
      success: true,
      cancelledAt: new Date(subscription.canceled_at * 1000).toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Environment Variables Required

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Webhook Endpoints (Optional but Recommended)

### 8. Stripe Webhook Handler
**POST** `/api/stripe/webhook`

Handles Stripe webhooks for real-time payment updates.

**Implementation:**
```javascript
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

## Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Security Considerations

1. **API Authentication**: Implement proper authentication for all endpoints
2. **Input Validation**: Validate all input data
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS**: Use HTTPS for all API communications
5. **Webhook Verification**: Always verify Stripe webhook signatures
6. **Environment Variables**: Keep Stripe keys secure in environment variables

## Testing

Use Stripe's test keys for development:
- Test Publishable Key: `pk_test_...`
- Test Secret Key: `sk_test_...`
- Test Card Numbers: `4242424242424242` (Visa), `4000056655665556` (Visa Debit)

## Next Steps

1. Set up your backend server (Node.js/Express, Python/Django, etc.)
2. Install Stripe SDK for your backend language
3. Implement the endpoints above
4. Set up environment variables
5. Test with Stripe's test mode
6. Deploy and switch to live keys for production 