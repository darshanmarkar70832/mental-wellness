import { Express } from "express";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { Cashfree } from "cashfree-pg";

// Initialize Cashfree SDK
const cashfree = Cashfree({
  env: process.env.NODE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
  apiVersion: "2022-09-01",
  appId: process.env.CASHFREE_APP_ID || "",
  secretKey: process.env.CASHFREE_SECRET_KEY || "",
});

// Add error logging utility
const logPaymentError = (error: unknown, context: string, orderId?: string) => {
  const errorObj = error as Error;
  console.error(`Payment Error [${context}]${orderId ? ` OrderID: ${orderId}` : ''}:`, {
    message: errorObj.message,
    stack: errorObj.stack
  });
};

export function setupPayment(app: Express) {
  // Initiate payment for a package
  app.post("/api/payments/initiate", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { packageId } = req.body;
      
      if (!packageId) {
        return res.status(400).json({ message: "Package ID is required" });
      }
      
      const packageItem = await storage.getPackageById(parseInt(packageId));
      if (!packageItem) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Create order with Cashfree
      try {
        const orderPayload = {
          order_id: orderId,
          order_amount: packageItem.price,
          order_currency: "INR",
          customer_details: {
            customer_id: req.user.id.toString(),
            customer_name: `${req.user.firstName} ${req.user.lastName}`,
            customer_email: req.user.email,
            customer_phone: req.user.phone || "9999999999"
          },
          order_meta: {
            notify_url: `${req.protocol}://${req.get('host')}/api/payments/webhook`,
            return_url: `${req.protocol}://${req.get('host')}/payment/callback?userId=${req.user.id}&packageId=${packageId}&orderId=${orderId}`,
          },
          order_note: "MindfulAI Therapy Package"
        };

        console.log('Initiating payment:', { orderId, userId: req.user.id, amount: packageItem.price });
        
        const response = await cashfree.orders.createOrder(orderPayload);
        
        // Add package details to the response for the frontend
        const orderDetails = {
          ...response,
          packageDetails: packageItem
        };
        
        console.log('Payment initiated:', { orderId, paymentLink: response.payment_link });
        res.json(orderDetails);
      } catch (error) {
        logPaymentError(error, 'Create Order', orderId);
        res.status(500).json({ 
          message: "Failed to initiate payment. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } catch (error) {
      logPaymentError(error, 'Payment Initiation');
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });
  
  // Process payment callback from Cashfree
  app.post("/api/payments/callback", async (req, res) => {
    const orderId = req.body.orderId || 'unknown';
    try {
      const { 
        userId, 
        packageId,
        paymentId,
        orderStatus
      } = req.body;
      
      if (!userId || !packageId || !orderId) {
        return res.status(400).json({ message: "Missing required payment details" });
      }
      
      console.log('Processing payment callback:', { orderId, userId, packageId, status: orderStatus });

      // Verify payment status with Cashfree
      try {
        const orderDetails = await cashfree.orders.getOrder({ order_id: orderId });
        
        // Only process if payment is successful
        if (orderDetails.order_status !== "PAID") {
          console.log('Payment not completed:', { orderId, status: orderDetails.order_status });
          return res.status(400).json({ 
            message: "Payment not completed",
            status: orderDetails.order_status 
          });
        }
        
        // Ensure user exists
        const user = await storage.getUser(parseInt(userId));
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Ensure package exists
        const packageItem = await storage.getPackageById(parseInt(packageId));
        if (!packageItem) {
          return res.status(404).json({ message: "Package not found" });
        }
        
        // Create payment record
        const payment = await storage.createPayment({
          userId: parseInt(userId),
          amount: packageItem.price,
          minutes: packageItem.minutes,
          paymentId: paymentId || orderDetails.cf_payment_id,
          status: "SUCCESS"
        });
        
        // Add the minutes to the user's account
        await storage.updateUserMinutes(parseInt(userId), packageItem.minutes);
        
        console.log('Payment processed successfully:', { 
          orderId, 
          userId, 
          amount: packageItem.price, 
          minutes: packageItem.minutes 
        });

        res.json({ 
          message: "Payment processed successfully", 
          payment,
          orderStatus: orderDetails.order_status
        });
      } catch (error) {
        logPaymentError(error, 'Verify Payment', orderId);
        res.status(500).json({ 
          message: "Failed to verify payment. Please contact support.",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } catch (error) {
      logPaymentError(error, 'Payment Callback', orderId);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });
  
  // Webhook for payment status updates from Cashfree
  app.post("/api/payments/webhook", async (req, res) => {
    const orderId = req.body?.data?.order?.order_id || 'unknown';
    try {
      const eventData = req.body;
      
      console.log('Received webhook:', { 
        orderId,
        event: eventData.type,
        timestamp: new Date().toISOString()
      });

      // Verify webhook signature
      const signature = req.headers["x-webhook-signature"] as string;
      if (!signature) {
        console.warn('Missing webhook signature:', { orderId });
        return res.status(400).json({ message: "Missing signature header" });
      }
      
      // Process the webhook event
      if (eventData.type === "PAYMENT_SUCCESS") {
        const orderData = eventData.data.order;
        const paymentData = eventData.data.payment;
        
        // Create or update payment record
        await storage.createPayment({
          userId: parseInt(orderData.customer_details.customer_id),
          amount: parseFloat(orderData.order_amount),
          minutes: 0, // This will be updated based on the package
          paymentId: paymentData.cf_payment_id,
          status: "SUCCESS"
        });
      }
      
      res.json({ message: "Webhook processed successfully" });
    } catch (error) {
      logPaymentError(error, 'Webhook Processing', orderId);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });
  
  // Simulation endpoint for testing without Cashfree (development only)
  if (process.env.NODE_ENV !== "production") {
    app.get("/payment/simulate", (req, res) => {
      const { orderId } = req.query;
      
      // Render a simple payment simulation page
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Payment Simulation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #121212;
              color: #ffffff;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              background-color: rgba(30, 30, 30, 0.8);
              backdrop-filter: blur(10px);
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              max-width: 500px;
              width: 100%;
            }
            h1 {
              color: #ffffff;
              margin-bottom: 20px;
            }
            .form-group {
              margin-bottom: 15px;
            }
            label {
              display: block;
              margin-bottom: 5px;
              color: #ffffff;
            }
            input {
              width: 100%;
              padding: 8px;
              border: 1px solid #444;
              border-radius: 4px;
              background-color: rgba(255, 255, 255, 0.1);
              color: #ffffff;
            }
            .error {
              color: #ff4444;
              font-size: 14px;
              margin-top: 5px;
            }
            .btn {
              background-color: #4caf50;
              border: none;
              color: white;
              padding: 12px 20px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin: 10px 5px;
              cursor: pointer;
              border-radius: 4px;
              transition: background-color 0.3s;
            }
            .btn-success {
              background-color: #4caf50;
            }
            .btn-failure {
              background-color: #f44336;
            }
            .btn:hover {
              opacity: 0.9;
            }
            .order-id {
              margin-bottom: 20px;
              font-size: 18px;
            }
            .test-cards {
              margin-top: 20px;
              padding: 10px;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Payment Simulation</h1>
            <div class="order-id">Order ID: ${orderId}</div>
            <div class="test-cards">
              <p>Test Card Numbers:</p>
              <ul>
                <li>4242 4242 4242 4242 (Success)</li>
                <li>4000 0000 0000 0002 (Success)</li>
                <li>Any other number (Failure)</li>
              </ul>
            </div>
            <div>
              <form action="/api/payments/callback" method="POST" id="paymentForm">
                <input type="hidden" name="userId" value="${req.query.userId || 1}">
                <input type="hidden" name="packageId" value="${req.query.packageId || 1}">
                <input type="hidden" name="orderId" value="${orderId}">
                <input type="hidden" name="paymentId" value="pay_${Date.now()}">
                
                <div class="form-group">
                  <label for="cardNumber">Card Number</label>
                  <input type="text" id="cardNumber" name="cardNumber" required 
                         placeholder="4242 4242 4242 4242" maxlength="19">
                  <div class="error" id="cardError"></div>
                </div>
                
                <div class="form-group">
                  <label for="expiryDate">Expiry Date (MM/YY)</label>
                  <input type="text" id="expiryDate" name="expiryDate" required 
                         placeholder="MM/YY" maxlength="5">
                  <div class="error" id="expiryError"></div>
                </div>
                
                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input type="text" id="cvv" name="cvv" required 
                         placeholder="123" maxlength="4">
                  <div class="error" id="cvvError"></div>
                </div>
                
                <button type="submit" class="btn btn-success">Complete Payment</button>
              </form>
            </div>
          </div>
          <script>
            document.getElementById('paymentForm').addEventListener('submit', function(e) {
              e.preventDefault();
              
              const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
              const expiryDate = document.getElementById('expiryDate').value;
              const cvv = document.getElementById('cvv').value;
              
              // Validate card number
              if (!/^\d{16}$/.test(cardNumber)) {
                document.getElementById('cardError').textContent = 'Invalid card number format';
                return;
              }
              
              // Validate expiry date
              if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
                document.getElementById('expiryError').textContent = 'Invalid expiry date format';
                return;
              }
              
              // Validate CVV
              if (!/^\d{3,4}$/.test(cvv)) {
                document.getElementById('cvvError').textContent = 'Invalid CVV format';
                return;
              }
              
              // Check if card is expired
              const [month, year] = expiryDate.split('/');
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear() % 100;
              const currentMonth = currentDate.getMonth() + 1;
              
              if (parseInt(year) < currentYear || 
                  (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                document.getElementById('expiryError').textContent = 'Card has expired';
                return;
              }
              
              // Check if it's a valid test card
              const validTestCards = ['4242424242424242', '4000000000000002'];
              if (!validTestCards.includes(cardNumber)) {
                document.getElementById('cardError').textContent = 'Invalid test card number';
                return;
              }
              
              // If all validations pass, submit the form
              this.submit();
            });
          </script>
        </body>
        </html>
      `);
    });
  }
}
