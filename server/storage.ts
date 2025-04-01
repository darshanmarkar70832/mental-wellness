import { users, type User, type InsertUser, payments, type Payment, type InsertPayment, conversations, type Conversation, type InsertConversation, messages, type Message, type InsertMessage, packages, type Package, type InsertPackage } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { eq, desc } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";

// Initialize the session store with PostgreSQL
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserMinutes(userId: number, minutesToAdd: number): Promise<User>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: number): Promise<Payment[]>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, endTime: Date, duration: number): Promise<Conversation>;
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  
  // Package operations
  getPackages(): Promise<Package[]>;
  getPackageById(id: number): Promise<Package | undefined>;
  
  // Session store
  sessionStore: any; // Store for session data
  
  // Database initialization
  setupSchema(): Promise<void>;
  setupSampleData(): Promise<void>;
}

// PostgreSQL implementation
export class PostgresStorage implements IStorage {
  sessionStore: any; // Session store instance
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }
  
  // Initialize the database schema
  async setupSchema(): Promise<void> {
    console.log("Setting up PostgreSQL schema...");
    try {
      // We don't need to create tables here since they are managed by Drizzle ORM
      console.log("Schema setup complete");
    } catch (error) {
      console.error("Error setting up schema:", error);
      throw error;
    }
  }
  
  // Insert sample data if not already present
  async setupSampleData(): Promise<void> {
    try {
      // Check if we have packages
      const existingPackages = await this.getPackages();
      
      if (existingPackages.length === 0) {
        console.log("Inserting sample packages...");
        
        await db.insert(packages).values([
          {
            name: "Basic Package",
            description: "20 minutes of AI therapy",
            minutes: 20,
            price: 199,
            isPopular: false
          },
          {
            name: "Standard Package",
            description: "60 minutes of AI therapy",
            minutes: 60,
            price: 499,
            isPopular: true
          },
          {
            name: "Premium Package",
            description: "150 minutes of AI therapy",
            minutes: 150,
            price: 999,
            isPopular: false
          }
        ]);
        
        console.log("Sample packages created successfully");
      }
    } catch (error) {
      console.error("Error setting up sample data:", error);
    }
  }
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values({
        ...insertUser,
        isAdmin: false,
        remainingMinutes: 0
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  
  async updateUserMinutes(userId: number, minutesToAdd: number): Promise<User> {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        throw new Error("User not found");
      }
      
      const newMinutes = Math.max(0, user.remainingMinutes + minutesToAdd);
      
      const result = await db.update(users)
        .set({ remainingMinutes: newMinutes })
        .where(eq(users.id, userId))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error updating user minutes:", error);
      throw error;
    }
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    try {
      const result = await db.insert(payments)
        .values(payment)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    try {
      return await db.select()
        .from(payments)
        .where(eq(payments.userId, userId))
        .orderBy(desc(payments.createdAt));
    } catch (error) {
      console.error("Error getting payments by user ID:", error);
      return [];
    }
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    try {
      const result = await db.insert(conversations)
        .values(conversation)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }
  
  async updateConversation(id: number, endTime: Date, duration: number): Promise<Conversation> {
    try {
      const result = await db.update(conversations)
        .set({
          endedAt: endTime,
          durationMinutes: duration,
          status: "completed"
        })
        .where(eq(conversations.id, id))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw error;
    }
  }
  
  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    try {
      return await db.select()
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.startedAt));
    } catch (error) {
      console.error("Error getting conversations by user ID:", error);
      return [];
    }
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const result = await db.insert(messages)
        .values(message)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }
  
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    try {
      return await db.select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.timestamp);
    } catch (error) {
      console.error("Error getting messages by conversation ID:", error);
      return [];
    }
  }
  
  async getPackages(): Promise<Package[]> {
    try {
      return await db.select().from(packages);
    } catch (error) {
      console.error("Error getting packages:", error);
      return [];
    }
  }
  
  async getPackageById(id: number): Promise<Package | undefined> {
    try {
      const result = await db.select()
        .from(packages)
        .where(eq(packages.id, id));
      
      return result[0];
    } catch (error) {
      console.error("Error getting package by ID:", error);
      return undefined;
    }
  }
}

// Memory Storage implementation - kept for backup if needed
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private packages: Map<number, Package>;
  
  sessionStore: any; // Session store instance
  private userId: number = 1;
  private paymentId: number = 1;
  private conversationId: number = 1;
  private messageId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.packages = new Map();
    
    // Create default packages
    this.packages.set(1, {
      id: 1,
      name: "Basic Package",
      description: "20 minutes of AI therapy",
      minutes: 20,
      price: 199,
      isPopular: false
    });
    
    this.packages.set(2, {
      id: 2,
      name: "Standard Package",
      description: "60 minutes of AI therapy",
      minutes: 60,
      price: 499,
      isPopular: true
    });
    
    this.packages.set(3, {
      id: 3,
      name: "Premium Package",
      description: "150 minutes of AI therapy",
      minutes: 150,
      price: 999,
      isPopular: false
    });
    
    // Initialize memory session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // Methods remain the same as before
  async setupSchema(): Promise<void> {
    console.log("No schema needed for memory storage");
  }
  
  async setupSampleData(): Promise<void> {
    console.log("Sample data already created for memory storage");
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    // Ensure phone is not undefined (convert to null if it is)
    const phone = insertUser.phone === undefined ? null : insertUser.phone;
    
    const user: User = { 
      ...insertUser,
      phone, // Use the processed phone value
      id,
      isAdmin: false,
      createdAt: new Date(),
      remainingMinutes: 0
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserMinutes(userId: number, minutesToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = {
      ...user,
      remainingMinutes: user.remainingMinutes + minutesToAdd
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = this.paymentId++;
    const newPayment: Payment = {
      ...payment,
      id,
      createdAt: new Date()
    };
    this.payments.set(id, newPayment);
    return newPayment;
  }
  
  async getPaymentsByUserId(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const newConversation: Conversation = {
      ...conversation,
      id,
      startedAt: new Date(),
      endedAt: null,
      durationMinutes: null
    };
    this.conversations.set(id, newConversation);
    return newConversation;
  }
  
  async updateConversation(id: number, endTime: Date, duration: number): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    const updatedConversation: Conversation = {
      ...conversation,
      endedAt: endTime,
      durationMinutes: duration,
      status: "completed"
    };
    
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
  
  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }
  
  async getPackageById(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }
}

// Use PostgreSQL storage in production or testing, fallback to memory storage in development if needed
export const storage = new PostgresStorage();
