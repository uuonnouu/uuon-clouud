import type {
  IStorage,
  Conversation,
  Message,
  InsertMessage,
  UuonToken,
  InsertUuonToken,
  CreatorProfileEntry,
  Fingerprint,
  AccessLogEntry,
  Upload,
  SelfAssessment,
  UinverseImport,
  UinverseIdea,
  Discovery,
  InsertDiscovery,
  Feedback,
  InsertFeedback,
  GcentricVersion,
  InsertGcentricVersion,
  FounderConversation,
  InsertFounderConversation,
  FounderMessage,
  InsertFounderMessage,
  FounderCorrection,
  InsertFounderCorrection,
  Pattern,
  InsertPattern,
  PatternLink,
  InsertPatternLink,
  PatternAlert,
  InsertPatternAlert,
  DmensionShape,
  InsertDmensionShape,
} from "@shared/schema";

export class InMemoryStorage implements IStorage {
  private conversations = new Map<number, Conversation>();
  private messages = new Map<number, Message>();
  private nextId = { conversations: 1, messages: 1 };

  async getConversation(id: number) { return this.conversations.get(id); }
  async getAllConversations() { return Array.from(this.conversations.values()); }
  async createConversation(title: string) {
    const c = { id: this.nextId.conversations++, title, createdAt: new Date() } as Conversation;
    this.conversations.set(c.id, c);
    return c;
  }
  async deleteConversation(id: number) { this.conversations.delete(id); }
  async getMessagesByConversation(conversationId: number) {
    return Array.from(this.messages.values()).filter((m: any) => m.conversationId === conversationId);
  }
  async createMessage(data: InsertMessage) {
    const m = { id: this.nextId.messages++, ...data, createdAt: new Date() } as Message;
    this.messages.set(m.id, m);
    return m;
  }
  async deleteLastExchange() { return null; }
  async saveUuonToken(data: InsertUuonToken) { return data as any; }
  async getUuonTokens() { return []; }
  async getUuonTokensByConversation() { return []; }
  async getUuonTokenCount() { return 0; }
  async getCreatorProfile() { return {}; }
  async setCreatorProfileEntry() {}
  async getAllCreatorProfileEntries() { return []; }
  async getFingerprint() { return undefined; }
  async getOwnerFingerprint() { return undefined; }
  async registerFingerprint(hash: string, components: string, isOwner: boolean) { return { hash, components, isOwner } as any; }
  async updateFingerprintLastSeen() {}
  async blockFingerprint() {}
  async logAccess() {}
  async getAccessLog() { return []; }
  async saveUpload(data: any) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getUpload() { return undefined; }
  async getUploadsByConversation() { return []; }
  async saveSelfAssessment(data: any) { return data as any; }
  async getSelfAssessmentReport() { return { avgScore: 100, totalAssessments: 0, totalFlags: 0, recentFlags: [], scoreHistory: [], gapAnalysis: [] }; }
  async createUinverseImport(data: any) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async updateUinverseImport() {}
  async getUinverseImports() { return []; }
  async getUinverseImport() { return undefined; }
  async createUinverseIdea(data: any) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getUinverseIdeas() { return []; }
  async updateIdeaStatus() {}
  async getUinverseSummary() { return { totalImports: 0, totalIdeas: 0, buildCount: 0, considerCount: 0, skipCount: 0, implementedCount: 0 }; }
  async createDiscovery(data: InsertDiscovery) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getActiveDiscoveries() { return []; }
  async getAllDiscoveries() { return []; }
  async toggleDiscovery() {}
  async deleteDiscovery() {}
  async saveFeedback(data: InsertFeedback) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getFeedbackByConversation() { return []; }
  async getFeedbackSummary() { return { helped: 0, partial: 0, missed: 0, calibrationWeight: 0, recent: [] }; }
  async getInstalledVersions() { return []; }
  async installVersion(data: InsertGcentricVersion) { return { ...data, installedAt: new Date() } as any; }
  async getVersion() { return undefined; }
  async importFounderConversation(data: InsertFounderConversation) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async importFounderMessage(data: InsertFounderMessage) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async saveFounderCorrection(data: InsertFounderCorrection) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getFounderConversations() { return []; }
  async getFounderMessages() { return []; }
  async searchFounderMemory() { return []; }
  async searchFounderMemoryMulti() { return []; }
  async getFounderCorrections() { return []; }
  async getFounderStats() { return { conversations: 0, messages: 0, corrections: 0, directives: 0, dateRange: { earliest: null, latest: null }, topTopics: [] }; }
  async createPattern(data: InsertPattern) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async createPatterns(data: InsertPattern[]) { return data.map((d, i) => ({ id: i, ...d, createdAt: new Date() } as any)); }
  async getPatterns() { return []; }
  async getPatternById() { return undefined; }
  async verifyPattern() {}
  async togglePatternPublic() {}
  async searchPatterns() { return []; }
  async checkDuplicateHash() { return undefined; }
  async getPatternStats() { return { total: 0, verified: 0, public: 0, byCategory: {}, bySource: {} }; }
  async getActiveVerifiedPatterns() { return []; }
  async createPatternLink(data: InsertPatternLink) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getPatternLinks() { return []; }
  async deletePatternLink() {}
  async suggestLinks() { return []; }
  async createPatternAlert(data: InsertPatternAlert) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async getPatternAlerts() { return []; }
  async markAlertRead() {}
  async markAllAlertsRead() {}
  async getUnreadAlertCount() { return 0; }
  async saveDmensionShape(data: InsertDmensionShape) { return { id: 1, ...data, createdAt: new Date() } as any; }
  async saveDmensionShapes(data: InsertDmensionShape[]) { return data.length; }
  async searchDmensionShapes() { return []; }
  async getDmensionShapeCount() { return 0; }
  async getDmensionShapesByCategory() { return []; }
}
