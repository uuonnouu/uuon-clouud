import { db } from "./db";
import { conversations, messages, uuonTokens, creatorProfile, fingerprints, accessLog, uploads, selfAssessments, wasteLog, quarantine, symbionts } from "@shared/schema";
import type { Conversation, InsertConversation, Message, InsertMessage, UuonToken, InsertUuonToken, CreatorProfileEntry, Fingerprint, AccessLogEntry, Upload, SelfAssessment, WasteLogEntry, InsertWasteLog, QuarantineEntry, InsertQuarantine, Symbiont, InsertSymbiont } from "@shared/schema";
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
  addMemoryAnchor(key: string, value: string, relevanceScore?: number): Promise<{ replaced?: string }>;
  saveSelfAssessment(data: { messageId: number; conversationId: number; score: number; missionAlignment: number; responseQuality: number; formatCompliance: number; identityIntegrity: number; wordCount: number; pass: boolean; flags: string }): Promise<SelfAssessment>;
  getSelfAssessmentReport(): Promise<{ avgScore: number; avgMission: number; avgQuality: number; avgFormat: number; avgIdentity: number; totalAssessments: number; totalFlags: number; recentFlags: string[]; scoreHistory: number[]; subScoreHistory: { mission: number; quality: number; format: number; identity: number }[]; gapAnalysis: { category: string; count: number; severity: string }[] }>;
  logWaste(data: InsertWasteLog): Promise<WasteLogEntry>;
  getWasteReport(): Promise<{ total: number; byType: Record<string, number>; recycled: number; extinct: number; recentWaste: WasteLogEntry[]; evolution: { type: string; count: number; lastSeen: string; extinct: boolean }[] }>;
  markWasteExtinct(wasteType: string): Promise<number>;
  getRecyclableWaste(): Promise<{ type: string; patterns: string[]; count: number }[]>;
  quarantinePattern(data: InsertQuarantine): Promise<QuarantineEntry>;
  getQuarantined(): Promise<QuarantineEntry[]>;
  updateQuarantineStatus(id: number, status: string, diagnosis?: string, beneficialUse?: string): Promise<QuarantineEntry | undefined>;
  convertToSymbiont(quarantineId: number, symbiontData: InsertSymbiont): Promise<Symbiont>;
  getSymbionts(): Promise<Symbiont[]>;
  getActiveSymbionts(): Promise<Symbiont[]>;
  incrementSymbiontAbsorption(name: string): Promise<void>;
  getBiologicalReport(): Promise<{ quarantined: number; symbionts: number; extinctions: number; totalWaste: number; recycledPercent: number; quarantineEntries: QuarantineEntry[]; symbiontRegistry: Symbiont[] }>;
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

  async logWaste(data: InsertWasteLog): Promise<WasteLogEntry> {
    const [entry] = await db.insert(wasteLog).values(data).returning();
    return entry;
  }

  async getWasteReport(): Promise<{ total: number; byType: Record<string, number>; recycled: number; extinct: number; recentWaste: WasteLogEntry[]; evolution: { type: string; count: number; lastSeen: string; extinct: boolean }[] }> {
    const allWaste = await db.select().from(wasteLog).orderBy(desc(wasteLog.createdAt));
    const total = allWaste.length;
    const byType: Record<string, number> = {};
    for (const w of allWaste) {
      byType[w.wasteType] = (byType[w.wasteType] || 0) + 1;
    }
    const recycled = allWaste.filter(w => w.recycledInto !== null).length;
    const extinct = allWaste.filter(w => w.extinct).length;
    const recentWaste = allWaste.slice(0, 20);

    const typeMap: Record<string, { count: number; lastSeen: string; extinct: boolean }> = {};
    for (const w of allWaste) {
      if (!typeMap[w.wasteType]) {
        typeMap[w.wasteType] = { count: 0, lastSeen: w.createdAt.toISOString(), extinct: w.extinct };
      }
      typeMap[w.wasteType].count++;
    }
    const evolution = Object.entries(typeMap).map(([type, data]) => ({ type, ...data }));

    return { total, byType, recycled, extinct, recentWaste, evolution };
  }

  async markWasteExtinct(wasteType: string): Promise<number> {
    const result = await db.update(wasteLog)
      .set({ extinct: true })
      .where(eq(wasteLog.wasteType, wasteType))
      .returning();
    return result.length;
  }

  async getRecyclableWaste(): Promise<{ type: string; patterns: string[]; count: number }[]> {
    const allWaste = await db.select().from(wasteLog)
      .where(eq(wasteLog.extinct, false))
      .orderBy(desc(wasteLog.createdAt));

    const grouped: Record<string, string[]> = {};
    for (const w of allWaste) {
      if (!grouped[w.wasteType]) grouped[w.wasteType] = [];
      if (grouped[w.wasteType].length < 5) {
        grouped[w.wasteType].push(w.original.slice(0, 100));
      }
    }

    return Object.entries(grouped).map(([type, patterns]) => ({
      type,
      patterns,
      count: allWaste.filter(w => w.wasteType === type).length,
    }));
  }

  async quarantinePattern(data: InsertQuarantine): Promise<QuarantineEntry> {
    const existing = await db.select().from(quarantine)
      .where(and(eq(quarantine.wasteType, data.wasteType), eq(quarantine.pattern, data.pattern)));
    if (existing.length > 0) {
      const [updated] = await db.update(quarantine)
        .set({ occurrences: existing[0].occurrences + 1, updatedAt: new Date() })
        .where(eq(quarantine.id, existing[0].id))
        .returning();
      return updated;
    }
    const [entry] = await db.insert(quarantine).values(data).returning();
    return entry;
  }

  async getQuarantined(): Promise<QuarantineEntry[]> {
    return db.select().from(quarantine).orderBy(desc(quarantine.updatedAt));
  }

  async updateQuarantineStatus(id: number, status: string, diagnosis?: string, beneficialUse?: string): Promise<QuarantineEntry | undefined> {
    const updates: any = { status, updatedAt: new Date() };
    if (diagnosis) updates.diagnosis = diagnosis;
    if (beneficialUse) updates.beneficialUse = beneficialUse;
    const [updated] = await db.update(quarantine).set(updates).where(eq(quarantine.id, id)).returning();
    return updated;
  }

  async convertToSymbiont(quarantineId: number, symbiontData: InsertSymbiont): Promise<Symbiont> {
    await db.update(quarantine)
      .set({ status: "converted", convertedTo: symbiontData.name, updatedAt: new Date() })
      .where(eq(quarantine.id, quarantineId));
    const existing = await db.select().from(symbionts).where(eq(symbionts.name, symbiontData.name));
    if (existing.length > 0) {
      const [updated] = await db.update(symbionts)
        .set({ absorptionCount: existing[0].absorptionCount + 1 })
        .where(eq(symbionts.id, existing[0].id))
        .returning();
      return updated;
    }
    const [symbiont] = await db.insert(symbionts).values(symbiontData).returning();
    return symbiont;
  }

  async getSymbionts(): Promise<Symbiont[]> {
    return db.select().from(symbionts).orderBy(desc(symbionts.createdAt));
  }

  async getActiveSymbionts(): Promise<Symbiont[]> {
    return db.select().from(symbionts).where(eq(symbionts.active, true));
  }

  async incrementSymbiontAbsorption(name: string): Promise<void> {
    const existing = await db.select().from(symbionts).where(eq(symbionts.name, name));
    if (existing.length > 0) {
      await db.update(symbionts)
        .set({ absorptionCount: existing[0].absorptionCount + 1 })
        .where(eq(symbionts.id, existing[0].id));
    }
  }

  async getBiologicalReport(): Promise<{ quarantined: number; symbionts: number; extinctions: number; totalWaste: number; recycledPercent: number; quarantineEntries: QuarantineEntry[]; symbiontRegistry: Symbiont[] }> {
    const allWaste = await db.select().from(wasteLog);
    const allQuarantine = await db.select().from(quarantine).orderBy(desc(quarantine.updatedAt));
    const allSymbionts = await db.select().from(symbionts).orderBy(desc(symbionts.createdAt));
    const totalWaste = allWaste.length;
    const recycled = allWaste.filter(w => w.recycledInto !== null).length;
    const extinctions = allWaste.filter(w => w.extinct).length;

    return {
      quarantined: allQuarantine.filter(q => q.status === "isolated" || q.status === "diagnosed").length,
      symbionts: allSymbionts.filter(s => s.active).length,
      extinctions,
      totalWaste,
      recycledPercent: totalWaste > 0 ? Math.round((recycled / totalWaste) * 100) : 0,
      quarantineEntries: allQuarantine,
      symbiontRegistry: allSymbionts,
    };
  }
}

export const storage = new DatabaseStorage();
