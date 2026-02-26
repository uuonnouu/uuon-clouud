import { db } from "./db";
import { conversations, messages, uuonTokens, creatorProfile, fingerprints, accessLog, uploads } from "@shared/schema";
import type { Conversation, InsertConversation, Message, InsertMessage, UuonToken, InsertUuonToken, CreatorProfileEntry, Fingerprint, AccessLogEntry, Upload } from "@shared/schema";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";

export interface IStorage {
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(title: string): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  deleteLastExchange(conversationId: number): Promise<Message | null>;
  saveUuonToken(data: InsertUuonToken): Promise<UuonToken>;
  getUuonTokens(): Promise<UuonToken[]>;
  getUuonTokensByConversation(conversationId: number): Promise<UuonToken[]>;
  getUuonTokenCount(): Promise<number>;
  getCreatorProfile(): Promise<Record<string, string>>;
  setCreatorProfileEntry(key: string, value: string): Promise<void>;
  getAllCreatorProfileEntries(): Promise<CreatorProfileEntry[]>;
  getFingerprint(hash: string): Promise<Fingerprint | undefined>;
  getOwnerFingerprint(): Promise<Fingerprint | undefined>;
  registerFingerprint(hash: string, components: string, isOwner: boolean): Promise<Fingerprint>;
  updateFingerprintLastSeen(hash: string): Promise<void>;
  blockFingerprint(hash: string): Promise<void>;
  logAccess(fingerprintHash: string, action: string, granted: boolean, ip?: string, userAgent?: string): Promise<void>;
  getAccessLog(limit?: number): Promise<AccessLogEntry[]>;
  saveUpload(data: { filename: string; originalName: string; mimeType: string; size: number; conversationId?: number; extractedText?: string }): Promise<Upload>;
  getUpload(id: number): Promise<Upload | undefined>;
  getUploadsByConversation(conversationId: number): Promise<Upload[]>;
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

  async saveUuonToken(data: InsertUuonToken): Promise<UuonToken> {
    const [token] = await db.insert(uuonTokens).values(data).onConflictDoNothing().returning();
    return token;
  }

  async getUuonTokens(): Promise<UuonToken[]> {
    return db.select().from(uuonTokens).orderBy(desc(uuonTokens.createdAt));
  }

  async getUuonTokensByConversation(conversationId: number): Promise<UuonToken[]> {
    return db.select().from(uuonTokens).where(eq(uuonTokens.conversationId, conversationId)).orderBy(desc(uuonTokens.createdAt));
  }

  async getUuonTokenCount(): Promise<number> {
    const [result] = await db.select({ value: count() }).from(uuonTokens);
    return result?.value ?? 0;
  }

  async getCreatorProfile(): Promise<Record<string, string>> {
    const entries = await db.select().from(creatorProfile);
    const profile: Record<string, string> = {};
    for (const entry of entries) {
      profile[entry.key] = entry.value;
    }
    return profile;
  }

  async setCreatorProfileEntry(key: string, value: string): Promise<void> {
    await db.insert(creatorProfile)
      .values({ key, value })
      .onConflictDoUpdate({
        target: creatorProfile.key,
        set: { value, updatedAt: sql`CURRENT_TIMESTAMP` },
      });
  }

  async getAllCreatorProfileEntries(): Promise<CreatorProfileEntry[]> {
    return db.select().from(creatorProfile).orderBy(creatorProfile.key);
  }

  async getFingerprint(hash: string): Promise<Fingerprint | undefined> {
    const [fp] = await db.select().from(fingerprints).where(eq(fingerprints.hash, hash));
    return fp;
  }

  async getOwnerFingerprint(): Promise<Fingerprint | undefined> {
    const [fp] = await db.select().from(fingerprints).where(eq(fingerprints.isOwner, true));
    return fp;
  }

  async registerFingerprint(hash: string, components: string, isOwner: boolean): Promise<Fingerprint> {
    const existing = await this.getFingerprint(hash);
    if (existing) {
      await db.update(fingerprints)
        .set({ lastSeen: sql`CURRENT_TIMESTAMP`, isOwner: isOwner || existing.isOwner })
        .where(eq(fingerprints.hash, hash));
      return { ...existing, isOwner: isOwner || existing.isOwner };
    }
    const [fp] = await db.insert(fingerprints).values({ hash, components, isOwner }).returning();
    return fp;
  }

  async updateFingerprintLastSeen(hash: string): Promise<void> {
    await db.update(fingerprints)
      .set({ lastSeen: sql`CURRENT_TIMESTAMP` })
      .where(eq(fingerprints.hash, hash));
  }

  async blockFingerprint(hash: string): Promise<void> {
    await db.update(fingerprints)
      .set({ blocked: true })
      .where(eq(fingerprints.hash, hash));
  }

  async logAccess(fingerprintHash: string, action: string, granted: boolean, ip?: string, userAgent?: string): Promise<void> {
    await db.insert(accessLog).values({ fingerprintHash, action, granted, ip, userAgent });
  }

  async getAccessLog(limit: number = 50): Promise<AccessLogEntry[]> {
    return db.select().from(accessLog).orderBy(desc(accessLog.createdAt)).limit(limit);
  }

  async saveUpload(data: { filename: string; originalName: string; mimeType: string; size: number; conversationId?: number; extractedText?: string }): Promise<Upload> {
    const [upload] = await db.insert(uploads).values(data).returning();
    return upload;
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload;
  }

  async getUploadsByConversation(conversationId: number): Promise<Upload[]> {
    return db.select().from(uploads).where(eq(uploads.conversationId, conversationId)).orderBy(desc(uploads.createdAt));
  }
}

export const storage = new DatabaseStorage();
