import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupPayment } from "./payment";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertMessageSchema } from "@shared/schema";
import { HfInference } from "@huggingface/inference";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Set up payment routes
  setupPayment(app);
  
  // API routes with /api prefix
  
  // Get user's remaining minutes
  app.get("/api/user/minutes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ minutes: user.remainingMinutes });
    } catch (error) {
      console.error("Error fetching user minutes:", error);
      res.status(500).json({ message: "Failed to fetch remaining minutes" });
    }
  });
  
  // Test endpoint to add minutes directly (for development testing only)
  app.post("/api/user/minutes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const minutesToAdd = req.body.minutes || 20;
      const updatedUser = await storage.updateUserMinutes(req.user.id, minutesToAdd);
      res.json({ minutes: updatedUser.remainingMinutes });
    } catch (error) {
      console.error("Error adding minutes:", error);
      res.status(500).json({ message: "Failed to add minutes" });
    }
  });
  
  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  
  // Get user's payment history
  app.get("/api/payments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const payments = await storage.getPaymentsByUserId(req.user.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payment history" });
    }
  });
  
  // Start a new conversation
  app.post("/api/conversations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.remainingMinutes <= 0) {
        return res.status(402).json({ message: "Insufficient minutes. Please purchase more time." });
      }
      
      const conversation = await storage.createConversation({
        userId: req.user.id,
        status: "active"
      });
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });
  
  // Get user's conversation history
  app.get("/api/conversations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const conversations = await storage.getConversationsByUserId(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversation history" });
    }
  });
  
  // Get messages for a specific conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Send a message in a conversation
  app.post("/api/conversations/:id/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const conversationId = parseInt(req.params.id);
      const { content, isUser } = insertMessageSchema.parse(req.body);
      
      const message = await storage.createMessage({
        conversationId,
        content,
        isUser
      });
      
      // If this is a user message, generate an AI response
      if (isUser) {
        // Simple mock AI response
        const aiResponse = await generateAIResponse(content);
        
        const aiMessage = await storage.createMessage({
          conversationId,
          content: aiResponse,
          isUser: false
        });
        
        // For a realistic application, we would deduct minutes here
        // This is just a simple implementation for demo purposes
        await storage.updateUserMinutes(req.user.id, -0.2); // Deduct 0.2 minutes for each exchange
        
        return res.status(201).json([message, aiMessage]);
      }
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // End a conversation
  app.post("/api/conversations/:id/end", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const conversationId = parseInt(req.params.id);
      const endTime = new Date();
      const duration = req.body.duration || 1; // Duration in minutes
      
      const updatedConversation = await storage.updateConversation(
        conversationId,
        endTime,
        duration
      );
      
      res.json(updatedConversation);
    } catch (error) {
      console.error("Error ending conversation:", error);
      res.status(500).json({ message: "Failed to end conversation" });
    }
  });
  
  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }
    
    try {
      // We should add a method to IStorage to get all users
      // For now, we'll just use a workaround
      const users = [];
      // Get all users who have made a payment or started a conversation
      const payments = await storage.getPaymentsByUserId(req.user.id);
      const userIds = new Set(payments.map(p => p.userId));
      
      const conversations = await storage.getConversationsByUserId(req.user.id);
      conversations.forEach(c => userIds.add(c.userId));
      
      // Add the current admin user
      userIds.add(req.user.id);
      
      // Fetch all users
      // Convert Set to Array for iteration
      const userIdArray = Array.from(userIds);
      for (const userId of userIdArray) {
        const user = await storage.getUser(userId);
        if (user) users.push(user);
      }
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users for admin:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}

// AI response generator using Hugging Face
async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    // Use HuggingFace API for inference (completely free)
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    
    // Create a context that makes it act as a helpful therapist
    const prompt = `You are MindfulAI, a supportive AI-powered therapy assistant. You provide empathetic, 
    thoughtful responses to help people with their mental health concerns. You never diagnose or prescribe medication, 
    but focus on active listening and helpful coping strategies.
    
    Human: ${userMessage}
    
    MindfulAI:`;
    
    // Use a free model that's good for conversational AI
    // DialoGPT-large is free to use and good for conversational responses
    const response = await hf.textGeneration({
      model: "microsoft/DialoGPT-large",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true
      }
    });
    
    let aiResponse = response.generated_text.replace(prompt, "").trim();
    
    // Fallback in case the response is empty or too short
    if (!aiResponse || aiResponse.length < 10) {
      const fallbackResponses = [
        "I understand how you're feeling. Let's explore that further.",
        "That's a common experience. Here are some strategies that might help you manage those feelings.",
        "Thank you for sharing that with me. How long have you been feeling this way?",
        "I'm here to support you. Would you like to try some mindfulness exercises that might help?",
        "It sounds like you're going through a challenging time. Remember that it's okay to ask for help.",
        "Let's break this down into smaller parts that might feel more manageable for you.",
        "Have you tried any coping strategies so far? I'd love to hear what has worked or not worked for you."
      ];
      aiResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Fallback responses if the API fails
    const fallbackResponses = [
      "I understand how you're feeling. Let's explore that further.",
      "That's a common experience. Here are some strategies that might help you manage those feelings.",
      "Thank you for sharing that with me. How long have you been feeling this way?",
      "I'm here to support you. Would you like to try some mindfulness exercises that might help?",
      "It sounds like you're going through a challenging time. Remember that it's okay to ask for help.",
      "Let's break this down into smaller parts that might feel more manageable for you.",
      "Have you tried any coping strategies so far? I'd love to hear what has worked or not worked for you."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}
