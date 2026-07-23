import { pgTable, text, integer, boolean, timestamp, serial, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const blockchain_algorithms = pgTable("uuon-blockchain-algorithms", {
  id: serial("id").primaryKey(),
  algorithm_name: text("algorithm-name").notNull(),
  algorithm_id: text("algorithm-id").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  complexity: text("complexity").notNull(),
  security_level: text("security-level").notNull(),
  use_cases: text("use-cases"), // JSON array
  implementation: text("implementation").notNull(),
  proof_of_concept: text("proof-of-concept"),
  created_at: timestamp("created-at").defaultNow(),
  updated_at: timestamp("updated-at").defaultNow(),
});

export const algorithm_metrics = pgTable("uuon-algorithm-metrics", {
  id: serial("id").primaryKey(),
  algorithm_id: text("algorithm-id").references(() => blockchain_algorithms.algorithm_id),
  metric_name: text("metric-name").notNull(),
  metric_value: real("metric-value").notNull(),
  measured_at: timestamp("measured-at").defaultNow(),
});

export const proof_verifications = pgTable("uuon-proof-verifications", {
  id: serial("id").primaryKey(),
  algorithm_id: text("algorithm-id").references(() => blockchain_algorithms.algorithm_id),
  verification_type: text("verification-type").notNull(),
  status: text("status").notNull(),
  proof_data: text("proof-data"), // JSON
  verified_at: timestamp("verified-at").defaultNow(),
  verifier_info: text("verifier-info"),
});

export type BlockchainAlgorithm = typeof blockchain_algorithms.$inferSelect;
export type AlgorithmMetric = typeof algorithm_metrics.$inferSelect;
export type ProofVerification = typeof proof_verifications.$inferSelect;

// Validation schemas
export const insertAlgorithmSchema = createInsertSchema(blockchain_algorithms);
export const insertAlgorithmMetricSchema = createInsertSchema(algorithm_metrics);
export const insertProofVerificationSchema = createInsertSchema(proof_verifications);