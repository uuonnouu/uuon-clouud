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
  relevanceScore: integer("relevance_score").notNull().default(50),
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
  missionAlignment: integer("mission_alignment").notNull().default(100),
  responseQuality: integer("response_quality").notNull().default(100),
  formatCompliance: integer("format_compliance").notNull().default(100),
  identityIntegrity: integer("identity_integrity").notNull().default(100),
  wordCount: integer("word_count").notNull(),
  pass: boolean("pass").notNull(),
  flags: text("flags").notNull().default("[]"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const wasteLog = pgTable("waste_log", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),
  wasteType: text("waste_type").notNull(),
  original: text("original").notNull(),
  correction: text("correction").notNull(),
  recycledInto: text("recycled_into"),
  extinct: boolean("extinct").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWasteLogSchema = createInsertSchema(wasteLog).omit({
  id: true,
  createdAt: true,
});

export const quarantine = pgTable("quarantine", {
  id: serial("id").primaryKey(),
  wasteType: text("waste_type").notNull(),
  pattern: text("pattern").notNull(),
  occurrences: integer("occurrences").notNull().default(1),
  status: text("status").notNull().default("isolated"),
  diagnosis: text("diagnosis"),
  beneficialUse: text("beneficial_use"),
  convertedTo: text("converted_to"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertQuarantineSchema = createInsertSchema(quarantine).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const symbionts = pgTable("symbionts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  originType: text("origin_type").notNull(),
  originPattern: text("origin_pattern").notNull(),
  function: text("function").notNull(),
  context: text("context").notNull(),
  active: boolean("active").notNull().default(true),
  absorptionCount: integer("absorption_count").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertSymbiontSchema = createInsertSchema(symbionts).omit({
  id: true,
  createdAt: true,
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
export type WasteLogEntry = typeof wasteLog.$inferSelect;
export type InsertWasteLog = z.infer<typeof insertWasteLogSchema>;
export type QuarantineEntry = typeof quarantine.$inferSelect;
export type InsertQuarantine = z.infer<typeof insertQuarantineSchema>;
export type Symbiont = typeof symbionts.$inferSelect;
export type InsertSymbiont = z.infer<typeof insertSymbiontSchema>;
