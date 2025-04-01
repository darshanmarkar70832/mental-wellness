import { users, type User, type InsertUser, payments, type Payment, type InsertPayment, conversations, type Conversation, type InsertConversation, messages, type Message, type InsertMessage, packages, type Package, type InsertPackage } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private payments: Map<number, Payment>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private packages: Map<number, Package>;
  
  sessionStore: session.SessionStore;
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
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
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
    const user: User = { 
      ...insertUser, 
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

export const storage = new MemStorage();
