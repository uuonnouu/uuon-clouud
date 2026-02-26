import { db } from "./db";
import { conversations, messages, uuonTokens, creatorProfile, uploads, selfAssessments, whistleblowerClaims } from "@shared/schema";
import type { Conversation, InsertConversation, Message, InsertMessage, UuonToken, InsertUuonToken, CreatorProfileEntry, Upload, SelfAssessment, WhistleblowerClaim, InsertWhistleblowerClaim } from "@shared/schema";
import { eq, desc, and, gte, count, sql, avg } from "drizzle-orm";

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
  addMemoryAnchor(key: string, value: string, relevanceScore?: number): Promise<{ replaced?: string }>;
  saveSelfAssessment(data: { messageId: number; conversationId: number; score: number; missionAlignment: number; responseQuality: number; formatCompliance: number; identityIntegrity: number; wordCount: number; pass: boolean; flags: string }): Promise<SelfAssessment>;
  getSelfAssessmentReport(): Promise<{ avgScore: number; avgMission: number; avgQuality: number; avgFormat: number; avgIdentity: number; totalAssessments: number; totalFlags: number; recentFlags: string[]; scoreHistory: number[]; subScoreHistory: { mission: number; quality: number; format: number; identity: number }[]; gapAnalysis: { category: string; count: number; severity: string }[] }>;
  createWhistleblowerClaim(data: InsertWhistleblowerClaim): Promise<WhistleblowerClaim>;
  getAllWhistleblowerClaims(): Promise<WhistleblowerClaim[]>;
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

  async setCreatorProfileEntry(key: string, value: string, relevanceScore?: number): Promise<void> {
    await db.insert(creatorProfile)
      .values({ key, value, relevanceScore: relevanceScore ?? 50 })
      .onConflictDoUpdate({
        target: creatorProfile.key,
        set: { value, relevanceScore: relevanceScore ?? 50, updatedAt: sql`CURRENT_TIMESTAMP` },
      });
  }

  async addMemoryAnchor(key: string, value: string, relevanceScore: number = 50): Promise<{ replaced?: string }> {
    const MAX_ANCHORS = 33;
    const existing = await db.select().from(creatorProfile).where(eq(creatorProfile.key, key));
    if (existing.length > 0) {
      await db.update(creatorProfile)
        .set({ value, relevanceScore, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(creatorProfile.key, key));
      return {};
    }

    const allEntries = await db.select().from(creatorProfile).orderBy(creatorProfile.relevanceScore);
    if (allEntries.length >= MAX_ANCHORS) {
      const lowest = allEntries[0];
      await db.delete(creatorProfile).where(eq(creatorProfile.id, lowest.id));
      await db.insert(creatorProfile).values({ key, value, relevanceScore });
      return { replaced: lowest.key };
    }

    await db.insert(creatorProfile).values({ key, value, relevanceScore });
    return {};
  }

  async getAllCreatorProfileEntries(): Promise<CreatorProfileEntry[]> {
    return db.select().from(creatorProfile).orderBy(desc(creatorProfile.relevanceScore));
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

  async saveSelfAssessment(data: { messageId: number; conversationId: number; score: number; missionAlignment: number; responseQuality: number; formatCompliance: number; identityIntegrity: number; wordCount: number; pass: boolean; flags: string }): Promise<SelfAssessment> {
    const [assessment] = await db.insert(selfAssessments).values(data).returning();
    return assessment;
  }

  async getSelfAssessmentReport(): Promise<{ avgScore: number; avgMission: number; avgQuality: number; avgFormat: number; avgIdentity: number; totalAssessments: number; totalFlags: number; recentFlags: string[]; scoreHistory: number[]; subScoreHistory: { mission: number; quality: number; format: number; identity: number }[]; gapAnalysis: { category: string; count: number; severity: string }[] }> {
    const allAssessments = await db.select().from(selfAssessments).orderBy(desc(selfAssessments.createdAt));

    if (allAssessments.length === 0) {
      return { avgScore: 100, avgMission: 100, avgQuality: 100, avgFormat: 100, avgIdentity: 100, totalAssessments: 0, totalFlags: 0, recentFlags: [], scoreHistory: [], subScoreHistory: [], gapAnalysis: [] };
    }

    const totalAssessments = allAssessments.length;
    const avgScore = Math.round(allAssessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments);
    const avgMission = Math.round(allAssessments.reduce((sum, a) => sum + a.missionAlignment, 0) / totalAssessments);
    const avgQuality = Math.round(allAssessments.reduce((sum, a) => sum + a.responseQuality, 0) / totalAssessments);
    const avgFormat = Math.round(allAssessments.reduce((sum, a) => sum + a.formatCompliance, 0) / totalAssessments);
    const avgIdentity = Math.round(allAssessments.reduce((sum, a) => sum + a.identityIntegrity, 0) / totalAssessments);
    const scoreHistory = allAssessments.slice(0, 50).reverse().map(a => a.score);
    const subScoreHistory = allAssessments.slice(0, 50).reverse().map(a => ({
      mission: a.missionAlignment,
      quality: a.responseQuality,
      format: a.formatCompliance,
      identity: a.identityIntegrity,
    }));

    const flagCounts: Record<string, number> = {};
    let totalFlags = 0;
    const recentFlagsSet: string[] = [];

    for (const a of allAssessments) {
      try {
        const flags: string[] = JSON.parse(a.flags);
        totalFlags += flags.length;
        for (const flag of flags) {
          const category = flag.split(":")[0].trim();
          flagCounts[category] = (flagCounts[category] || 0) + 1;
        }
        if (recentFlagsSet.length < 10) {
          recentFlagsSet.push(...flags);
        }
      } catch {}
    }

    const gapAnalysis = Object.entries(flagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, cnt]) => ({
        category,
        count: cnt,
        severity: cnt > totalAssessments * 0.5 ? "CRITICAL" : cnt > totalAssessments * 0.2 ? "HIGH" : cnt > totalAssessments * 0.1 ? "MODERATE" : "LOW",
      }));

    return {
      avgScore,
      avgMission,
      avgQuality,
      avgFormat,
      avgIdentity,
      totalAssessments,
      totalFlags,
      recentFlags: recentFlagsSet.slice(0, 10),
      scoreHistory,
      subScoreHistory,
      gapAnalysis,
    };
  }

  async createWhistleblowerClaim(data: InsertWhistleblowerClaim): Promise<WhistleblowerClaim> {
    const [claim] = await db.insert(whistleblowerClaims).values(data).returning();
    return claim;
  }

  async getAllWhistleblowerClaims(): Promise<WhistleblowerClaim[]> {
    return db.select().from(whistleblowerClaims).orderBy(desc(whistleblowerClaims.createdAt));
  }
}

export const storage = new DatabaseStorage();
