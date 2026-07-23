/**
 * UUON Foundation — Blockchain Schema  (was empty)
 * Drizzle table definitions for on-chain anchoring, level registry,
 * PIEZ distributor, and PSENT token tables.
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import {
  pgTable, serial, text, boolean, real, integer,
  timestamp, jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── On-Chain Anchors (Base mainnet calldata records) ─────────────────────────
export const blockchain_anchors = pgTable("blockchain_anchors", {
  id:               serial("id").primaryKey(),
  anchor_type:      text("anchor_type").notNull(),          // "merkle_root" | "state_hash"
  network:          text("network").notNull(),              // "base" | "polygon"
  tx_hash:          text("tx_hash").notNull().unique(),
  block_number:     integer("block_number"),
  merkle_root:      text("merkle_root"),
  state_hash:       text("state_hash"),
  ipfs_cid:         text("ipfs_cid"),
  shapes_committed: integer("shapes_committed"),
  equation_coverage:text("equation_coverage"),
  calldata:         text("calldata"),
  gas_used:         text("gas_used"),
  anchored_at:      timestamp("anchored_at").defaultNow(),
  explorer_url:     text("explorer_url"),
});

export const insertAnchorSchema = createInsertSchema(blockchain_anchors);
export type BlockchainAnchor = typeof blockchain_anchors.$inferSelect;

// ── Level Registry (UUONLevelRegistry contract state mirror) ─────────────────
export const level_registry = pgTable("level_registry", {
  id:               serial("id").primaryKey(),
  level:            integer("level").notNull(),             // 1, 2, 3 …
  level_name:       text("level_name").notNull(),           // "UUON", "PIEZ+PSENT", …
  token_address:    text("token_address"),
  contract_address: text("contract_address"),
  is_active:        boolean("is_active").default(false),
  activation_tx:    text("activation_tx"),
  activated_at:     timestamp("activated_at"),
  metadata:         jsonb("metadata"),
  created_at:       timestamp("created_at").defaultNow(),
  updated_at:       timestamp("updated_at").defaultNow(),
});

export const insertLevelSchema = createInsertSchema(level_registry);
export type LevelRegistry = typeof level_registry.$inferSelect;

// ── PIEZ Distributor events ───────────────────────────────────────────────────
export const piez_distributions = pgTable("piez_distributions", {
  id:               serial("id").primaryKey(),
  distribution_id:  text("distribution_id").notNull().unique(),
  recipient:        text("recipient").notNull(),
  amount_piez:      text("amount_piez").notNull(),           // wei string
  amount_usd:       real("amount_usd"),
  shape_type:       text("shape_type"),
  trigger_event:    text("trigger_event"),                   // "mint" | "transfer" | "weekly"
  tx_hash:          text("tx_hash"),
  block_number:     integer("block_number"),
  network:          text("network").default("base"),
  distributed_at:   timestamp("distributed_at").defaultNow(),
});

export const insertPiezSchema = createInsertSchema(piez_distributions);
export type PiezDistribution = typeof piez_distributions.$inferSelect;

// ── Blockchain Algorithms (shape → algorithm category mapping) ────────────────
export const blockchain_algorithms = pgTable("uuon_blockchain_algorithms", {
  id:                  serial("id").primaryKey(),
  algorithm_name:      text("algorithm_name").notNull(),
  algorithm_type:      text("algorithm_type"),              // "consensus" | "hash" | "zk" | "signature"
  security_level:      text("security_level").default("standard"),
  quantum_resistant:   boolean("quantum_resistant").default(false),
  shape_type:          text("shape_type"),
  equation_hash:       text("equation_hash"),               // SHA-256 of equations
  computational_complexity: text("computational_complexity"),
  description:         text("description"),
  parameters:          jsonb("parameters"),
  is_active:           boolean("is_active").default(true),
  created_at:          timestamp("created_at").defaultNow(),
  updated_at:          timestamp("updated_at").defaultNow(),
});

export const insertAlgoSchema = createInsertSchema(blockchain_algorithms);
export type BlockchainAlgorithm = typeof blockchain_algorithms.$inferSelect;

// ── Token Integration Links ───────────────────────────────────────────────────
export const token_integration_links = pgTable("token_integration_links", {
  id:                   serial("id").primaryKey(),
  token_id:             text("token_id").notNull(),
  target_chain_id:      text("target_chain_id").notNull(),  // "base" | "polygon" | "sei"
  target_chain_network: text("target_chain_network"),
  bridge_contract:      text("bridge_contract"),
  bridge_status:        text("bridge_status").default("pending"),
  bridge_tx_hash:       text("bridge_tx_hash"),
  bridge_payload:       jsonb("bridge_payload"),
  created_at:           timestamp("created_at").defaultNow(),
  updated_at:           timestamp("updated_at").defaultNow(),
});

export const insertLinkSchema = createInsertSchema(token_integration_links);
export type TokenIntegrationLink = typeof token_integration_links.$inferSelect;

// ── NFT Mint Records ──────────────────────────────────────────────────────────
export const nft_mint_records = pgTable("nft_mint_records", {
  id:               serial("id").primaryKey(),
  shape_type:       text("shape_type").notNull(),
  token_id_onchain: text("token_id_onchain"),               // ERC-1155 token ID
  contract_address: text("contract_address"),
  network:          text("network").default("base"),
  minter_address:   text("minter_address"),
  tx_hash:          text("tx_hash").unique(),
  block_number:     integer("block_number"),
  ipfs_metadata_uri:text("ipfs_metadata_uri"),
  equation_hash:    text("equation_hash"),                  // provenance
  merkle_root:      text("merkle_root"),                    // state at time of mint
  rarity:           text("rarity"),
  mint_status:      text("mint_status").default("pending"), // "pending"|"minted"|"failed"
  error_message:    text("error_message"),
  minted_at:        timestamp("minted_at").defaultNow(),
});

export const insertNFTSchema = createInsertSchema(nft_mint_records);
export type NFTMintRecord = typeof nft_mint_records.$inferSelect;

// ── Weekly Polygon Reports (persisted copy) ───────────────────────────────────
export const weekly_polygon_reports = pgTable("weekly_polygon_reports", {
  id:               serial("id").primaryKey(),
  report_sequence:  integer("report_sequence").notNull().unique(),
  report_week:      text("report_week").notNull(),
  report_hash:      text("report_hash").notNull(),
  report_data:      jsonb("report_data").notNull(),
  polygon_tx_hash:  text("polygon_tx_hash"),
  polygon_block:    integer("polygon_block"),
  generated_at:     timestamp("generated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(weekly_polygon_reports);
export type WeeklyPolygonReport = typeof weekly_polygon_reports.$inferSelect;