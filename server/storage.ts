import { db } from "./db";
import { conversations, messages, uuonTokens, creatorProfile, fingerprints, accessLog, uploads, selfAssessments, uinverseImports, uinverseIdeas, discoveries, feedback, gcentricVersions, founderConversations, founderMessages, founderCorrections } from "@shared/schema";
import type { Conversation, InsertConversation, Message, InsertMessage, UuonToken, InsertUuonToken, CreatorProfileEntry, Fingerprint, AccessLogEntry, Upload, SelfAssessment, UinverseImport, UinverseIdea, Discovery, InsertDiscovery, Feedback, InsertFeedback, GcentricVersion, InsertGcentricVersion, FounderConversation, InsertFounderConversation, FounderMessage, InsertFounderMessage, FounderCorrection, InsertFounderCorrection } from "@shared/schema";
import { eq, desc, and, gte, count, sql, avg, ilike, or } from "drizzle-orm";

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
  saveSelfAssessment(data: { messageId: number; conversationId: number; score: number; wordCount: number; pass: boolean; flags: string }): Promise<SelfAssessment>;
  getSelfAssessmentReport(): Promise<{ avgScore: number; totalAssessments: number; totalFlags: number; recentFlags: string[]; scoreHistory: number[]; gapAnalysis: { category: string; count: number; severity: string }[] }>;
  createUinverseImport(data: { source: string; filename?: string; rawContent: string; messageCount: number }): Promise<UinverseImport>;
  updateUinverseImport(id: number, data: { status: string; ideasExtracted: number }): Promise<void>;
  getUinverseImports(): Promise<UinverseImport[]>;
  getUinverseImport(id: number): Promise<UinverseImport | undefined>;
  createUinverseIdea(data: { importId: number; title: string; description: string; category: string; verdict: string; confidence: number; reasoning: string; sourceExcerpt: string; priority: string }): Promise<UinverseIdea>;
  getUinverseIdeas(importId?: number): Promise<UinverseIdea[]>;
  updateIdeaStatus(id: number, implemented: boolean): Promise<void>;
  getUinverseSummary(): Promise<{ totalImports: number; totalIdeas: number; buildCount: number; considerCount: number; skipCount: number; implementedCount: number }>;
  createDiscovery(data: InsertDiscovery): Promise<Discovery>;
  getActiveDiscoveries(): Promise<Discovery[]>;
  getAllDiscoveries(): Promise<Discovery[]>;
  toggleDiscovery(id: number, active: boolean): Promise<void>;
  deleteDiscovery(id: number): Promise<void>;
  saveFeedback(data: InsertFeedback): Promise<Feedback>;
  getFeedbackByConversation(conversationId: number): Promise<Feedback[]>;
  getFeedbackSummary(): Promise<{ helped: number; partial: number; missed: number; calibrationWeight: number; recent: Feedback[] }>;
  getInstalledVersions(): Promise<GcentricVersion[]>;
  installVersion(data: InsertGcentricVersion): Promise<GcentricVersion>;
  getVersion(versionNumber: string): Promise<GcentricVersion | undefined>;
  importFounderConversation(data: InsertFounderConversation): Promise<FounderConversation>;
  importFounderMessage(data: InsertFounderMessage): Promise<FounderMessage>;
  saveFounderCorrection(data: InsertFounderCorrection): Promise<FounderCorrection>;
  getFounderConversations(options?: { topic?: string; limit?: number; offset?: number }): Promise<FounderConversation[]>;
  getFounderMessages(conversationId: number, options?: { limit?: number; offset?: number }): Promise<FounderMessage[]>;
  searchFounderMemory(query: string, limit?: number): Promise<FounderMessage[]>;
  getFounderCorrections(options?: { type?: string; limit?: number }): Promise<FounderCorrection[]>;
  getFounderStats(): Promise<{ conversations: number; messages: number; corrections: number; directives: number; dateRange: { earliest: string | null; latest: string | null }; topTopics: { topic: string; count: number }[] }>;
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
    if (!token) {
      const [existing] = await db.select().from(uuonTokens).where(eq(uuonTokens.hash, data.hash));
      return existing;
    }
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

  async saveSelfAssessment(data: { messageId: number; conversationId: number; score: number; wordCount: number; pass: boolean; flags: string }): Promise<SelfAssessment> {
    const [assessment] = await db.insert(selfAssessments).values(data).returning();
    return assessment;
  }

  async getSelfAssessmentReport(): Promise<{ avgScore: number; totalAssessments: number; totalFlags: number; recentFlags: string[]; scoreHistory: number[]; gapAnalysis: { category: string; count: number; severity: string }[] }> {
    const allAssessments = await db.select().from(selfAssessments).orderBy(desc(selfAssessments.createdAt));

    if (allAssessments.length === 0) {
      return { avgScore: 100, totalAssessments: 0, totalFlags: 0, recentFlags: [], scoreHistory: [], gapAnalysis: [] };
    }

    const totalAssessments = allAssessments.length;
    const avgScore = Math.round(allAssessments.reduce((sum, a) => sum + a.score, 0) / totalAssessments);
    const scoreHistory = allAssessments.slice(0, 50).reverse().map(a => a.score);

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
      totalAssessments,
      totalFlags,
      recentFlags: recentFlagsSet.slice(0, 10),
      scoreHistory,
      gapAnalysis,
    };
  }

  async createUinverseImport(data: { source: string; filename?: string; rawContent: string; messageCount: number }): Promise<UinverseImport> {
    const [imp] = await db.insert(uinverseImports).values(data).returning();
    return imp;
  }

  async updateUinverseImport(id: number, data: { status: string; ideasExtracted: number }): Promise<void> {
    await db.update(uinverseImports).set(data).where(eq(uinverseImports.id, id));
  }

  async getUinverseImports(): Promise<UinverseImport[]> {
    return db.select().from(uinverseImports).orderBy(desc(uinverseImports.createdAt));
  }

  async getUinverseImport(id: number): Promise<UinverseImport | undefined> {
    const [imp] = await db.select().from(uinverseImports).where(eq(uinverseImports.id, id));
    return imp;
  }

  async createUinverseIdea(data: { importId: number; title: string; description: string; category: string; verdict: string; confidence: number; reasoning: string; sourceExcerpt: string; priority: string }): Promise<UinverseIdea> {
    const [idea] = await db.insert(uinverseIdeas).values(data).returning();
    return idea;
  }

  async getUinverseIdeas(importId?: number): Promise<UinverseIdea[]> {
    if (importId) {
      return db.select().from(uinverseIdeas).where(eq(uinverseIdeas.importId, importId)).orderBy(desc(uinverseIdeas.confidence));
    }
    return db.select().from(uinverseIdeas).orderBy(desc(uinverseIdeas.confidence));
  }

  async updateIdeaStatus(id: number, implemented: boolean): Promise<void> {
    await db.update(uinverseIdeas).set({ implemented }).where(eq(uinverseIdeas.id, id));
  }

  async getUinverseSummary(): Promise<{ totalImports: number; totalIdeas: number; buildCount: number; considerCount: number; skipCount: number; implementedCount: number }> {
    const allIdeas = await db.select().from(uinverseIdeas);
    const imports = await db.select({ value: count() }).from(uinverseImports);
    return {
      totalImports: imports[0]?.value ?? 0,
      totalIdeas: allIdeas.length,
      buildCount: allIdeas.filter(i => i.verdict === "BUILD").length,
      considerCount: allIdeas.filter(i => i.verdict === "CONSIDER").length,
      skipCount: allIdeas.filter(i => i.verdict === "SKIP").length,
      implementedCount: allIdeas.filter(i => i.implemented).length,
    };
  }
  async createDiscovery(data: InsertDiscovery): Promise<Discovery> {
    const [d] = await db.insert(discoveries).values(data).returning();
    return d;
  }

  async getActiveDiscoveries(): Promise<Discovery[]> {
    return db.select().from(discoveries).where(eq(discoveries.active, true)).orderBy(desc(discoveries.createdAt));
  }

  async getAllDiscoveries(): Promise<Discovery[]> {
    return db.select().from(discoveries).orderBy(desc(discoveries.createdAt));
  }

  async toggleDiscovery(id: number, active: boolean): Promise<void> {
    await db.update(discoveries).set({ active }).where(eq(discoveries.id, id));
  }

  async deleteDiscovery(id: number): Promise<void> {
    await db.delete(discoveries).where(eq(discoveries.id, id));
  }

  async saveFeedback(data: InsertFeedback): Promise<Feedback> {
    const [entry] = await db.insert(feedback).values(data).returning();
    return entry;
  }

  async getFeedbackByConversation(conversationId: number): Promise<Feedback[]> {
    return db.select().from(feedback).where(eq(feedback.conversationId, conversationId)).orderBy(desc(feedback.createdAt));
  }

  async getFeedbackSummary(): Promise<{ helped: number; partial: number; missed: number; calibrationWeight: number; recent: Feedback[] }> {
    const all = await db.select().from(feedback).orderBy(desc(feedback.createdAt));
    const helped = all.filter(f => f.response === "helped").length;
    const partial = all.filter(f => f.response === "partial").length;
    const missed = all.filter(f => f.response === "missed").length;
    const calibrationWeight = (helped * 0.5) + (partial * 0.0) + (missed * -1.0);
    return { helped, partial, missed, calibrationWeight, recent: all.slice(0, 20) };
  }

  async getInstalledVersions(): Promise<GcentricVersion[]> {
    return db.select().from(gcentricVersions).orderBy(gcentricVersions.sequenceIndex);
  }

  async installVersion(data: InsertGcentricVersion): Promise<GcentricVersion> {
    const [version] = await db.insert(gcentricVersions)
      .values(data)
      .onConflictDoUpdate({
        target: gcentricVersions.versionNumber,
        set: { title: data.title, status: data.status, sequenceIndex: data.sequenceIndex, installedAt: sql`CURRENT_TIMESTAMP` },
      })
      .returning();
    return version;
  }

  async getVersion(versionNumber: string): Promise<GcentricVersion | undefined> {
    const [v] = await db.select().from(gcentricVersions).where(eq(gcentricVersions.versionNumber, versionNumber));
    return v;
  }

  async importFounderConversation(data: InsertFounderConversation): Promise<FounderConversation> {
    const [conv] = await db.insert(founderConversations)
      .values(data)
      .onConflictDoUpdate({
        target: founderConversations.externalUuid,
        set: { name: data.name, summary: data.summary, messageCount: data.messageCount, topicTags: data.topicTags, projectName: data.projectName },
      })
      .returning();
    return conv;
  }

  async importFounderMessage(data: InsertFounderMessage): Promise<FounderMessage> {
    const [msg] = await db.insert(founderMessages)
      .values(data)
      .onConflictDoUpdate({
        target: founderMessages.externalUuid,
        set: { content: data.content, isCorrection: data.isCorrection, isDirective: data.isDirective, topicTags: data.topicTags },
      })
      .returning();
    return msg;
  }

  async saveFounderCorrection(data: InsertFounderCorrection): Promise<FounderCorrection> {
    const [correction] = await db.insert(founderCorrections).values(data).returning();
    return correction;
  }

  async getFounderConversations(options?: { topic?: string; limit?: number; offset?: number }): Promise<FounderConversation[]> {
    const limit = options?.limit ?? 50;
    const offset = options?.offset ?? 0;
    let query = db.select().from(founderConversations).orderBy(desc(founderConversations.originalCreatedAt)).limit(limit).offset(offset);
    if (options?.topic) {
      return db.select().from(founderConversations)
        .where(ilike(founderConversations.topicTags, `%${options.topic}%`))
        .orderBy(desc(founderConversations.originalCreatedAt))
        .limit(limit).offset(offset);
    }
    return query;
  }

  async getFounderMessages(conversationId: number, options?: { limit?: number; offset?: number }): Promise<FounderMessage[]> {
    const limit = options?.limit ?? 500;
    const offset = options?.offset ?? 0;
    return db.select().from(founderMessages)
      .where(eq(founderMessages.conversationId, conversationId))
      .orderBy(founderMessages.originalCreatedAt)
      .limit(limit).offset(offset);
  }

  async searchFounderMemory(query: string, limit: number = 20): Promise<FounderMessage[]> {
    return db.select().from(founderMessages)
      .where(ilike(founderMessages.content, `%${query}%`))
      .orderBy(desc(founderMessages.originalCreatedAt))
      .limit(limit);
  }

  async getFounderCorrections(options?: { type?: string; limit?: number }): Promise<FounderCorrection[]> {
    const limit = options?.limit ?? 50;
    if (options?.type) {
      return db.select().from(founderCorrections)
        .where(eq(founderCorrections.correctionType, options.type))
        .orderBy(desc(founderCorrections.createdAt))
        .limit(limit);
    }
    return db.select().from(founderCorrections).orderBy(desc(founderCorrections.createdAt)).limit(limit);
  }

  async getFounderStats(): Promise<{ conversations: number; messages: number; corrections: number; directives: number; dateRange: { earliest: string | null; latest: string | null }; topTopics: { topic: string; count: number }[] }> {
    const [convCount] = await db.select({ value: count() }).from(founderConversations);
    const [msgCount] = await db.select({ value: count() }).from(founderMessages);
    const [corrCount] = await db.select({ value: count() }).from(founderCorrections);
    const [dirCount] = await db.select({ value: count() }).from(founderMessages).where(eq(founderMessages.isDirective, true));

    const allConvos = await db.select({ originalCreatedAt: founderConversations.originalCreatedAt }).from(founderConversations).orderBy(founderConversations.originalCreatedAt);
    const earliest = allConvos.length > 0 ? allConvos[0].originalCreatedAt.toISOString() : null;
    const latest = allConvos.length > 0 ? allConvos[allConvos.length - 1].originalCreatedAt.toISOString() : null;

    const allTags = await db.select({ topicTags: founderConversations.topicTags }).from(founderConversations);
    const topicCounts: Record<string, number> = {};
    for (const row of allTags) {
      try {
        const tags: string[] = JSON.parse(row.topicTags);
        for (const t of tags) { topicCounts[t] = (topicCounts[t] || 0) + 1; }
      } catch {}
    }
    const topTopics = Object.entries(topicCounts).sort(([, a], [, b]) => b - a).slice(0, 20).map(([topic, cnt]) => ({ topic, count: cnt }));

    return {
      conversations: convCount?.value ?? 0,
      messages: msgCount?.value ?? 0,
      corrections: corrCount?.value ?? 0,
      directives: dirCount?.value ?? 0,
      dateRange: { earliest, latest },
      topTopics,
    };
  }
}

export const storage = new DatabaseStorage();
