import { Express } from "express";
import { storage } from "./storage";
import { insertPaymentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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
      
      // In a real application, this would initiate a payment with Cashfree API
      // Here we're just returning the order details
      const orderDetails = {
        orderId: `order_${Date.now()}`,
        orderAmount: packageItem.price,
        orderCurrency: "INR",
        customerDetails: {
          customerId: req.user.id.toString(),
          customerName: `${req.user.firstName} ${req.user.lastName}`,
          customerEmail: req.user.email
        },
        packageDetails: packageItem
      };
      
      res.json(orderDetails);
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });
  
  // Process payment callback from Cashfree
  app.post("/api/payments/callback", async (req, res) => {
    try {
      // In a real application, you would verify the payment with Cashfree
      // Here we're simulating a successful payment response
      const { 
        userId, 
        packageId, 
        orderId, 
        paymentId, 
        status 
      } = req.body;
      
      if (!userId || !packageId || !paymentId || !status) {
        return res.status(400).json({ message: "Missing required payment details" });
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
        paymentId,
        status
      });
      
      // If payment was successful, add the minutes to the user's account
      if (status === "SUCCESS") {
        await storage.updateUserMinutes(parseInt(userId), packageItem.minutes);
      }
      
      res.json({ message: "Payment processed successfully", payment });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });
  
  // Webhook for payment status updates from Cashfree
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      // In a real application, you would verify the webhook signature
      // and update the payment status accordingly
      
      // This is a simplified implementation
      const { paymentId, orderId, status } = req.body;
      
      console.log(`Received payment webhook: ${paymentId}, status: ${status}`);
      
      // For a real implementation, you would update the payment status in your database
      
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing payment webhook:", error);
      res.status(500).json({ message: "Failed to process payment webhook" });
    }
  });
}
