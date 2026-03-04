import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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
});

export const uuonTokens = pgTable("uuon_tokens", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull().unique(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  origin: text("origin").notNull().default("UUON-FOUNDATION-GCENTRIC-V1"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const creatorProfile = pgTable("creator_profile", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const fingerprints = pgTable("fingerprints", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
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
});

export const selfAssessments = pgTable("self_assessments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  wordCount: integer("word_count").notNull(),
  pass: boolean("pass").notNull(),
  flags: text("flags").notNull().default("[]"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

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
