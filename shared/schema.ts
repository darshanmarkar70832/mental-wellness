import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  remainingMinutes: doublePrecision("remaining_minutes").default(0).notNull()
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  minutes: doublePrecision("minutes").notNull(),
  paymentId: text("payment_id").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationMinutes: doublePrecision("duration_minutes"),
  status: text("status").notNull()
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  minutes: doublePrecision("minutes").notNull(),
  price: doublePrecision("price").notNull(),
  isPopular: boolean("is_popular").default(false).notNull()
});

// Schema for inserting users
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    firstName: true,
    lastName: true
  });

// Schema for inserting payments
export const insertPaymentSchema = createInsertSchema(payments)
  .pick({
    userId: true,
    amount: true,
    minutes: true,
    paymentId: true,
    status: true
  });

// Schema for inserting conversations
export const insertConversationSchema = createInsertSchema(conversations)
  .pick({
    userId: true,
    status: true
  });

// Schema for inserting messages
export const insertMessageSchema = createInsertSchema(messages)
  .pick({
    conversationId: true,
    content: true,
    isUser: true
  });

// Schema for inserting packages
export const insertPackageSchema = createInsertSchema(packages);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
