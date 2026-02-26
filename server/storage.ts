import { db } from "./db";
import { conversations, messages } from "@shared/schema";
import type { Conversation, InsertConversation, Message, InsertMessage } from "@shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  deleteLastExchange(conversationId: number): Promise<Message | null>;
}

class DatabaseStorage implements IStorage {
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async createConversation(title: string): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  async deleteLastExchange(conversationId: number): Promise<Message | null> {
    const allMsgs = await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));
    
    if (allMsgs.length < 2) return null;
    
    const lastAssistant = allMsgs[0];
    const lastUser = allMsgs[1];
    
    if (lastAssistant.role === "assistant" && lastUser.role === "user") {
      await db.delete(messages).where(eq(messages.id, lastAssistant.id));
      await db.delete(messages).where(eq(messages.id, lastUser.id));
      return lastUser;
    }
    return null;
  }
}

export const storage = new DatabaseStorage();
