import express from 'express';
import crypto from 'crypto';

const router = express.Router();

function generateApiKey(): string {
  return `dmn_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
}

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { shapeName, exportType, price } = req.body;

    if (!shapeName || !exportType || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: price.toFixed(2)
        },
        description: `${shapeName} - ${exportType} Export`
      }],
      application_context: {
        return_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/paypal/success`,
        cancel_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/paypal/cancel`,
        brand_name: 'UUON Foundation Mathematical Universe',
        user_action: 'PAY_NOW'
      }
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const order = await response.json();
    const approvalUrl = order.links.find((link: any) => link.rel === 'approve')?.href;

    res.json({
      orderId: order.id,
      approvalUrl
    });

  } catch (error) {
    console.error('PayPal create order error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check order status
router.get('/check-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check order status');
    }

    const order = await response.json();
    res.json({ status: order.status });

  } catch (error) {
    console.error('PayPal check order error:', error);
    res.status(500).json({ error: 'Failed to check order status' });
  }
});

// Capture payment (called after approval)
router.post('/capture-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to capture payment');
    }

    const captureData = await response.json();
    res.json(captureData);

  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// SDK Subscription Payment
router.post('/sdk-subscription', async (req, res) => {
  try {
    const { tier, customerEmail } = req.body;
    
    const pricingTiers = {
      'DEVELOPER': 0,
      'PROFESSIONAL': 99,
      'ENTERPRISE': 499,
      'REGULATED': 2500
    };

    const price = pricingTiers[tier as keyof typeof pricingTiers];
    if (price === undefined) {
      return res.status(400).json({ error: 'Invalid pricing tier' });
    }

    if (price === 0) {
      const apiKey = generateApiKey();
      return res.json({
        success: true,
        message: 'Free tier activated',
        apiKey,
        tier: 'DEVELOPER',
        limits: { requests: 100, monthly: true }
      });
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: price.toFixed(2)
        },
        description: `Δmension SDK ${tier} Subscription - Monthly`
      }],
      application_context: {
        return_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/paypal/sdk-success`,
        cancel_url: `${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/paypal/cancel`,
        brand_name: 'UUON Foundation Mathematical Universe SDK',
        user_action: 'PAY_NOW'
      }
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const order = await response.json();
    const approvalUrl = order.links.find((link: any) => link.rel === 'approve')?.href;

    res.json({
      orderId: order.id,
      approvalUrl,
      tier,
      monthlyPrice: price
    });

  } catch (error) {
    console.error('SDK subscription error:', error);
    res.status(500).json({ error: 'Failed to create SDK subscription' });
  }
});

// SDK Success redirect handler — captures and verifies the PayPal order before issuing key
router.get('/sdk-success', async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('<h2>Invalid payment token</h2>');
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    const capture = await captureRes.json();
    if (!captureRes.ok || capture.status !== 'COMPLETED') {
      return res.status(402).send('<h2>Payment not completed. Please try again.</h2>');
    }
  } catch {
    return res.status(500).send('<h2>Payment verification failed.</h2>');
  }

  const apiKey = generateApiKey();
  
  res.send(`
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
        <h2>🎉 SDK Subscription Activated!</h2>
        <p><strong>Your API Key:</strong></p>
        <code style="background: #f0f0f0; padding: 10px; display: block; margin: 20px 0;">${apiKey}</code>
        <p>Save this key - you'll need it for SDK access!</p>
        <p>Documentation: <a href="/api/sdk-info">SDK Documentation</a></p>
        <script>
          window.opener?.postMessage({ 
            type: 'SDK_SUBSCRIPTION_SUCCESS', 
            apiKey: '${apiKey}' 
          }, '*');
          setTimeout(() => window.close(), 5000);
        </script>
      </body>
    </html>
  `);
});

// Success redirect handler
router.get('/success', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Payment Successful!</h2>
        <p>You can close this window.</p>
        <script>
          window.opener?.postMessage({ type: 'PAYPAL_SUCCESS' }, '*');
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
    </html>
  `);
});

// Cancel redirect handler
router.get('/cancel', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Payment Cancelled</h2>
        <p>You can close this window.</p>
        <script>
          window.opener?.postMessage({ type: 'PAYPAL_CANCEL' }, '*');
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
    </html>
  `);
});

export default router;
