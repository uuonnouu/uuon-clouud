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

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: serial("id").primaryKey(),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  transports: text("transports"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const ownerPassphrase = pgTable("owner_passphrase", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const authSessions = pgTable("auth_sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  fingerprintHash: text("fingerprint_hash").notNull(),
  layersCompleted: integer("layers_completed").notNull().default(0),
  webauthnVerified: boolean("webauthn_verified").notNull().default(false),
  webauthnSkipped: boolean("webauthn_skipped").notNull().default(false),
  passphraseVerified: boolean("passphrase_verified").notNull().default(false),
  fingerprintVerified: boolean("fingerprint_verified").notNull().default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
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
export type WebAuthnCredential = typeof webauthnCredentials.$inferSelect;
export type OwnerPassphrase = typeof ownerPassphrase.$inferSelect;
export const whistleblowerClaims = pgTable("whistleblower_claims", {
  id: serial("id").primaryKey(),
  targetCompany: text("target_company").notNull(),
  misconductType: text("misconduct_type").notNull(),
  description: text("description").notNull(),
  evidenceSummary: text("evidence_summary").notNull(),
  systemAnalysis: text("system_analysis").notNull(),
  potentialForfeiture: text("potential_forfeiture"),
  status: text("status").notNull().default("prepared"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertWhistleblowerClaimSchema = createInsertSchema(whistleblowerClaims).omit({
  id: true,
  createdAt: true,
});

export type WhistleblowerClaim = typeof whistleblowerClaims.$inferSelect;
export type InsertWhistleblowerClaim = z.infer<typeof insertWhistleblowerClaimSchema>;
