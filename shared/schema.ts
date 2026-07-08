import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  toolCall: text("tool_call"),
  hash: text("hash"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("messages_conversation_id_idx").on(table.conversationId),
]);

export const uuonTokens = pgTable("uuon_tokens", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  origin: text("origin").notNull().default("UUON-FOUNDATION-GCENTRIC-V1"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("uuon_tokens_conversation_id_idx").on(table.conversationId),
]);

export const creatorProfile = pgTable("creator_profile", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const fingerprints = pgTable("fingerprints", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  components: text("components").notNull(),
  isOwner: boolean("is_owner").notNull().default(false),
  blocked: boolean("blocked").notNull().default(false),
  lastSeen: timestamp("last_seen").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const accessLog = pgTable("access_log", {
  id: serial("id").primaryKey(),
  fingerprintHash: text("fingerprint_hash").notNull(),
  action: text("action").notNull(),
  granted: boolean("granted").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  conversationId: integer("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),
  extractedText: text("extracted_text"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("uploads_conversation_id_idx").on(table.conversationId),
]);

export const selfAssessments = pgTable("self_assessments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  wordCount: integer("word_count").notNull(),
  pass: boolean("pass").notNull(),
  flags: text("flags").notNull().default("[]"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("self_assessments_conversation_id_idx").on(table.conversationId),
]);

export const uinverseImports = pgTable("uinverse_imports", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  filename: text("filename"),
  rawContent: text("raw_content").notNull(),
  messageCount: integer("message_count").notNull().default(0),
  ideasExtracted: integer("ideas_extracted").notNull().default(0),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const uinverseIdeas = pgTable("uinverse_ideas", {
  id: serial("id").primaryKey(),
  importId: integer("import_id").notNull().references(() => uinverseImports.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  verdict: text("verdict").notNull(),
  confidence: integer("confidence").notNull(),
  reasoning: text("reasoning").notNull(),
  sourceExcerpt: text("source_excerpt").notNull(),
  priority: text("priority").notNull().default("MEDIUM"),
  implemented: boolean("implemented").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const discoveries = pgTable("discoveries", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  source: text("source"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  response: text("response").notNull(), // helped/partial/missed
  saScore: integer("sa_score"),
  hash: text("hash"),
  version: text("version").notNull().default("3.3"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const gcentricVersions = pgTable("gcentric_versions", {
  id: serial("id").primaryKey(),
  versionNumber: text("version_number").notNull().unique(),
  title: text("title").notNull(),
  status: text("status").notNull().default("installed"),
  sequenceIndex: integer("sequence_index").notNull(),
  installedAt: timestamp("installed_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const founderConversations = pgTable("founder_conversations", {
  id: serial("id").primaryKey(),
  externalUuid: text("external_uuid").notNull().unique(),
  name: text("name").notNull(),
  summary: text("summary"),
  messageCount: integer("message_count").notNull().default(0),
  topicTags: text("topic_tags").notNull().default("[]"),
  projectName: text("project_name"),
  originalCreatedAt: timestamp("original_created_at").notNull(),
  importedAt: timestamp("imported_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const founderMessages = pgTable("founder_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => founderConversations.id, { onDelete: "cascade" }),
  externalUuid: text("external_uuid").notNull().unique(),
  sender: text("sender").notNull(),
  content: text("content").notNull(),
  isCorrection: boolean("is_correction").notNull().default(false),
  isDirective: boolean("is_directive").notNull().default(false),
  topicTags: text("topic_tags"),
  originalCreatedAt: timestamp("original_created_at").notNull(),
  importedAt: timestamp("imported_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("founder_messages_conversation_id_idx").on(table.conversationId),
]);

export const founderCorrections = pgTable("founder_corrections", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => founderMessages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => founderConversations.id, { onDelete: "cascade" }),
  correctionType: text("correction_type").notNull(),
  founderStatement: text("founder_statement").notNull(),
  assistantError: text("assistant_error"),
  resolution: text("resolution").notNull(),
  topicTags: text("topic_tags"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const patterns = pgTable("patterns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  publicSummary: text("public_summary"),
  category: text("category").notNull(),
  sourceType: text("source_type").notNull(),
  sourceReference: text("source_reference"),
  discoveredBy: text("discovered_by").notNull().default("Phillip Aguilar Ruiz III"),
  fingerprintId: integer("fingerprint_id").references(() => fingerprints.id),
  elloHash: text("ello_hash").notNull().unique(),
  originTimestamp: timestamp("origin_timestamp").notNull(),
  verified: boolean("verified").notNull().default(false),
  active: boolean("active").notNull().default(true),
  public: boolean("public").notNull().default(false),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("patterns_category_idx").on(table.category),
  index("patterns_source_type_idx").on(table.sourceType),
  index("patterns_discovered_by_idx").on(table.discoveredBy),
]);

export const patternLinks = pgTable("pattern_links", {
  id: serial("id").primaryKey(),
  fromPatternId: integer("from_pattern_id").notNull().references(() => patterns.id, { onDelete: "cascade" }),
  toPatternId: integer("to_pattern_id").notNull().references(() => patterns.id, { onDelete: "cascade" }),
  linkType: text("link_type").notNull(),
  description: text("description"),
  strength: integer("strength").notNull().default(5),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  unique("pattern_links_unique").on(table.fromPatternId, table.toPatternId, table.linkType),
  index("pattern_links_from_idx").on(table.fromPatternId),
  index("pattern_links_to_idx").on(table.toPatternId),
]);

export const patternAlerts = pgTable("pattern_alerts", {
  id: serial("id").primaryKey(),
  patternId: integer("pattern_id").references(() => patterns.id, { onDelete: "cascade" }),
  alertType: text("alert_type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("pattern_alerts_read_idx").on(table.read),
]);

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertUuonTokenSchema = createInsertSchema(uuonTokens).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export const insertGcentricVersionSchema = createInsertSchema(gcentricVersions).omit({
  id: true,
  installedAt: true,
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UuonToken = typeof uuonTokens.$inferSelect;
export type InsertUuonToken = z.infer<typeof insertUuonTokenSchema>;
export type CreatorProfileEntry = typeof creatorProfile.$inferSelect;
export type Fingerprint = typeof fingerprints.$inferSelect;
export type AccessLogEntry = typeof accessLog.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
export type SelfAssessment = typeof selfAssessments.$inferSelect;
export type UinverseImport = typeof uinverseImports.$inferSelect;
export type UinverseIdea = typeof uinverseIdeas.$inferSelect;
export type Discovery = typeof discoveries.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type GcentricVersion = typeof gcentricVersions.$inferSelect;
export type InsertGcentricVersion = z.infer<typeof insertGcentricVersionSchema>;

export const insertDiscoverySchema = createInsertSchema(discoveries).omit({
  id: true,
  createdAt: true,
});
export type InsertDiscovery = z.infer<typeof insertDiscoverySchema>;

export const insertFounderConversationSchema = createInsertSchema(founderConversations).omit({
  id: true,
  importedAt: true,
});
export const insertFounderMessageSchema = createInsertSchema(founderMessages).omit({
  id: true,
  importedAt: true,
});
export const insertFounderCorrectionSchema = createInsertSchema(founderCorrections).omit({
  id: true,
  createdAt: true,
});

export type FounderConversation = typeof founderConversations.$inferSelect;
export type InsertFounderConversation = z.infer<typeof insertFounderConversationSchema>;
export type FounderMessage = typeof founderMessages.$inferSelect;
export type InsertFounderMessage = z.infer<typeof insertFounderMessageSchema>;
export type FounderCorrection = typeof founderCorrections.$inferSelect;
export type InsertFounderCorrection = z.infer<typeof insertFounderCorrectionSchema>;

export const dmensionShapes = pgTable("dmension_shapes", {
  id: serial("id").primaryKey(),
  shapeId: text("shape_id").unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
  formula: text("formula"),
  parameters: text("parameters"),
  earthLink: text("earth_link"),
  sketchfabUrl: text("sketchfab_url"),
  tags: text("tags"),
  engineName: text("engine_name"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("dmension_shapes_category_idx").on(table.category),
  index("dmension_shapes_domain_idx").on(table.domain),
]);

export const insertPatternSchema = createInsertSchema(patterns).omit({
  id: true,
  createdAt: true,
});
export const insertPatternLinkSchema = createInsertSchema(patternLinks).omit({
  id: true,
  createdAt: true,
});
export const insertPatternAlertSchema = createInsertSchema(patternAlerts).omit({
  id: true,
  createdAt: true,
});

export type Pattern = typeof patterns.$inferSelect;
export type InsertPattern = z.infer<typeof insertPatternSchema>;
export type PatternLink = typeof patternLinks.$inferSelect;
export type InsertPatternLink = z.infer<typeof insertPatternLinkSchema>;
export type PatternAlert = typeof patternAlerts.$inferSelect;
export type InsertPatternAlert = z.infer<typeof insertPatternAlertSchema>;

export const insertDmensionShapeSchema = createInsertSchema(dmensionShapes).omit({
  id: true,
  createdAt: true,
});
export type DmensionShape = typeof dmensionShapes.$inferSelect;
export type InsertDmensionShape = z.infer<typeof insertDmensionShapeSchema>;

// ════════════════════════════════════════════════════════════════
// BRAIN COMPRESSION SYSTEM - Schema for rule-based infrastructure
// ════════════════════════════════════════════════════════════════

export const brainRules = pgTable("brain_rules", {
  id: serial("id").primaryKey(),
  ruleId: text("rule_id").notNull().unique(),
  sourceFile: text("source_file").notNull(),
  ruleType: text("rule_type").notNull(), // parametric|temporal|relationship|transformation|functional|constraints|deterministic
  ruleContent: text("rule_content").notNull(), // JSON: {seed, generator, params, metadata}
  originalSize: integer("original_size").notNull(),
  compressedSize: integer("compressed_size").notNull(),
  compressionRatio: text("compression_ratio").notNull(), // decimal string for precision
  reconstructionTimeMs: integer("reconstruction_time_ms"),
  contentHash: text("content_hash").notNull(),
  reconstructionHash: text("reconstruction_hash"),
  verified: boolean("verified").notNull().default(false),
  blockchainAnchor: text("blockchain_anchor"),
  domain: text("domain"),
  dependencies: text("dependencies"), // JSON array
  metadata: text("metadata"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("brain_rules_rule_type_idx").on(table.ruleType),
  index("brain_rules_domain_idx").on(table.domain),
  index("brain_rules_verified_idx").on(table.verified),
  index("brain_rules_source_file_idx").on(table.sourceFile),
]);

export const brainInventory = pgTable("brain_inventory", {
  id: serial("id").primaryKey(),
  filePath: text("file_path").notNull().unique(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  contentHash: text("content_hash").notNull().unique(),
  compressed: boolean("compressed").notNull().default(false),
  ruleId: integer("rule_id").references(() => brainRules.id),
  domain: text("domain"),
  priority: text("priority").notNull().default("MEDIUM"), // HIGH|MEDIUM|LOW
  accessCount: integer("access_count").notNull().default(0),
  lastAccessed: timestamp("last_accessed"),
  scannedAt: timestamp("scanned_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("brain_inventory_file_path_idx").on(table.filePath),
  index("brain_inventory_compressed_idx").on(table.compressed),
  index("brain_inventory_domain_idx").on(table.domain),
]);

export const brainCompressionMetrics = pgTable("brain_compression_metrics", {
  id: serial("id").primaryKey(),
  ruleType: text("rule_type").notNull(),
  totalRules: integer("total_rules").notNull(),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
  avgCompressionRatio: text("avg_compression_ratio").notNull(),
  minCompressionRatio: text("min_compression_ratio"),
  maxCompressionRatio: text("max_compression_ratio"),
  avgReconstructionTimeMs: integer("avg_reconstruction_time_ms"),
  totalStorageSaved: integer("total_storage_saved").notNull().default(0),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("brain_compression_metrics_rule_type_idx").on(table.ruleType),
]);

export const insertBrainRuleSchema = createInsertSchema(brainRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrainInventorySchema = createInsertSchema(brainInventory).omit({
  id: true,
  scannedAt: true,
  createdAt: true,
});

export type BrainRule = typeof brainRules.$inferSelect;
export type InsertBrainRule = z.infer<typeof insertBrainRuleSchema>;
export type BrainInventoryEntry = typeof brainInventory.$inferSelect;
export type InsertBrainInventoryEntry = z.infer<typeof insertBrainInventorySchema>;
export type BrainCompressionMetrics = typeof brainCompressionMetrics.$inferSelect;
