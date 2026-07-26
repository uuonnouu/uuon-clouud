/**
 * UUON Foundation — Shared Drizzle Schema  (was empty)
 * Defines the tables used by tokenLedgerService, weeklyPublisher,
 * compute-merkle-root, and all blockchain/registry scripts.
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import {
  pgTable, serial, text, boolean, real, integer, timestamp,
  timestamp, jsonb, bigint, varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ─────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id:               serial("id").primaryKey(),
  username:         text("username").notNull().unique(),
  password:         text("password").notNull(),
  email:            text("email").unique(),
  role:             text("role").default("user"),
  github_id:        text("github_id").unique(),
  github_username:  text("github_username"),
  email_verified:   boolean("email_verified").default(false),
  created_at:       timestamp("created_at").defaultNow(),
});
export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User       = typeof users.$inferSelect;

// ── Formula Implementations ───────────────────────────────────────────────────
export const formula_implementations = pgTable("formula_implementations", {
  id:                  serial("id").primaryKey(),
  shape_type:          varchar("shape_type").notNull().unique(),
  display_name:        varchar("display_name"),
  category:            varchar("category").default("general"),
  subcategory:         varchar("subcategory"),
  equation_x:          text("equation_x"),
  equation_y:          text("equation_y"),
  equation_z:          text("equation_z"),
  default_parameters:  jsonb("default_parameters"),
  parameter_ranges:    jsonb("parameter_ranges"),
  fibonacci_level:     integer("fibonacci_level"),
  string_theory_dim:   integer("string_theory_dim"),
  complexity_class:    varchar("complexity_class"),
  verified:            boolean("verified").default(false),
  verification_hash:   varchar("verification_hash"),
  source_file:         varchar("source_file").default("parametricSurfacesClean.ts"),
  created_at:          timestamp("created_at").defaultNow(),
  updated_at:          timestamp("updated_at").defaultNow(),
});

// ── Complete Shape Registry ───────────────────────────────────────────────────
export const complete_shape_registry = pgTable("complete_shape_registry", {
  id:            integer("id").primaryKey(),
  shape_type:    text("shape_type").notNull().unique(),
  display_name:  text("display_name").notNull(),
  category:      text("category").default("general"),
  subcategory:   text("subcategory"),
  description:   text("description"),
  source:        text("source").default("frontend"),
  priority:      real("priority").default(0.8),
  seo_keywords:  text("seo_keywords"),
  canonical_url: text("canonical_url"),
  is_active:     boolean("is_active").default(true),
  mint_status:   text("mint_status").default("pending"),
  base_energy:              real("base_energy"),
  asset_value_usd:          text("asset_value_usd"),
  onchain_token_id:         text("onchain_token_id"),
  erc20_contract_address:   text("erc20_contract_address"),
  morph_parameters:         jsonb("morph_parameters"),
  last_morph_at:            timestamp("last_morph_at"),
  created_at:    timestamp("created_at").defaultNow(),
  updated_at:    timestamp("updated_at").defaultNow(),
});

// ── Shape Token Ledger ────────────────────────────────────────────────────────
export const shape_token_ledger = pgTable("shape_token_ledger", {
  id:                    serial("id").primaryKey(),
  token_id:              text("token_id").notNull().unique(),
  shape_type:            text("shape_type").notNull(),
  token_name:            text("token_name").notNull(),
  token_symbol:          text("token_symbol").default("UUON"),
  token_uri:             text("token_uri"),
  owner_wallet_address:  text("owner_wallet_address"),
  status:                text("status").default("active"),
  issuance_tx_id:        text("issuance_tx_id"),
  current_state_hash:    text("current_state_hash"),
  on_chain_status:       text("on_chain_status").default("pending"),
  on_chain_contract:     text("on_chain_contract"),
  created_at:            timestamp("created_at").defaultNow(),
  updated_at:            timestamp("updated_at").defaultNow(),
});

// ── Shape Token Transactions ──────────────────────────────────────────────────
export const shape_token_transactions = pgTable("shape_token_transactions", {
  id:             serial("id").primaryKey(),
  token_id:       text("token_id").notNull(),
  tx_type:        text("tx_type").notNull(),
  from_address:   text("from_address"),
  to_address:     text("to_address"),
  amount:         real("amount").default(0),
  tx_hash:        text("tx_hash"),
  block_number:   integer("block_number"),
  gas_used:       text("gas_used"),
  created_at:     timestamp("created_at").defaultNow(),
});

// ── Shape Token Energy ────────────────────────────────────────────────────────
export const shape_token_energy = pgTable("shape_token_energy", {
  id:                       serial("id").primaryKey(),
  token_id:                 text("token_id").notNull(),
  energy_in:                real("energy_in").default(0),
  energy_out:               real("energy_out").default(0),
  energy_source:            text("energy_source"),
  base_energy:              real("base_energy"),
  interaction_delta:        real("interaction_delta"),
  cumulative_energy:        real("cumulative_energy"),
  cross_learn_connections:  integer("cross_learn_connections"),
  pattern_discoveries:      integer("pattern_discoveries"),
  energy_hash:              text("energy_hash"),
  created_at:               timestamp("created_at").defaultNow(),
  captured_at:              timestamp("captured_at").defaultNow(),
});

// ── Energy Transactions ───────────────────────────────────────────────────────
export const energy_transactions = pgTable("energy_transactions", {
  id:                    serial("id").primaryKey(),
  token_id:              text("token_id"),
  energy_in:             real("energy_in").default(0),
  conversion_timestamp:  timestamp("conversion_timestamp").defaultNow(),
  sender_id:    text("sender_id"),
  receiver_id:  text("receiver_id"),
  energy_units: real("energy_units"),
  timestamp:    timestamp("timestamp"),
});

// ── Shape Token Metadata ──────────────────────────────────────────────────────
export const shape_token_metadata = pgTable("shape_token_metadata", {
  id:                       serial("id").primaryKey(),
  token_id:                 text("token_id").notNull().unique(),
  param_hash:               text("param_hash"),
  param_snapshot:           jsonb("param_snapshot"),
  energy_hash:              text("energy_hash"),
  energy_signature:         text("energy_signature"),
  base_energy:              real("base_energy"),
  erc721_compatible:        boolean("erc721_compatible").default(false),
  equation_snapshot:        text("equation_snapshot"),
  mathematical_properties:  jsonb("mathematical_properties"),
  uuon_signature:           text("uuon_signature"),
  metadata:                 jsonb("metadata"),
  created_at:               timestamp("created_at").defaultNow(),
  updated_at:               timestamp("updated_at").defaultNow(),
});

// ── State Roots (Merkle anchors) ──────────────────────────────────────────────
export const shape_token_state_roots = pgTable("shape_token_state_roots", {
  id:                      serial("id").primaryKey(),
  token_id:                text("token_id").notNull().unique(),
  latest_tx_id:            text("latest_tx_id"),
  state_leaf_hash:         text("state_leaf_hash"),
  state_merkle_root:       text("state_merkle_root"),
  cumulative_energy_hash:  text("cumulative_energy_hash"),
  leaf_count:              integer("leaf_count"),
  bridge_status:           text("bridge_status").default("not_bridged"),
  bridge_tx_hash:          text("bridge_tx_hash"),
  created_at:              timestamp("created_at").defaultNow(),
  updated_at:              timestamp("updated_at").defaultNow(),
});

// ── System Config ─────────────────────────────────────────────────────────────
export const uuon_system_config = pgTable("uuon_system_config", {
  id:                serial("id").primaryKey(),
  base_token_price:  text("base_token_price").default("1.618"),
  named_token_price: text("named_token_price").default("1618"),
  updated_at:        timestamp("updated_at").defaultNow(),
});

// ── Portfolio State ───────────────────────────────────────────────────────────
export const portfolio_state = pgTable("portfolio_state", {
  id:                integer("id").primaryKey(),
  total_fiat_value:  text("total_fiat_value").default("0"),
  total_token_value: text("total_token_value").default("0"),
  total_value_usd: text("total_value_usd"),
  last_updated:    timestamp("last_updated"),
  updated_at:        timestamp("updated_at").defaultNow(),
});

// ── System Evolution Tracking ─────────────────────────────────────────────────
export const system_evolution_tracking = pgTable("system_evolution_tracking", {
  id:                   serial("id").primaryKey(),
  shape_id:             text("shape_id"),
  event_type:           text("event_type"),
  event_data:           jsonb("event_data"),
  computation_time_ms:  integer("computation_time_ms").default(0),
  created_at:           timestamp("created_at").defaultNow(),
});

// ── Mathematical Constants ────────────────────────────────────────────────────
export const mathematical_constants = pgTable("mathematical_constants", {
  id:                      serial("id").primaryKey(),
  constant_name:           text("constant_name").notNull().unique(),
  symbol:                  text("symbol"),
  value:                   text("value"),
  scientific_notation:     text("scientific_notation"),
  units:                   text("units"),
  category:                text("category"),
  description:             text("description"),
  mathematical_basis:      text("mathematical_basis"),
  real_world_applications: text("real_world_applications"),
  precision_digits:        integer("precision_digits"),
  created_at:              timestamp("created_at").defaultNow(),
  updated_at:              timestamp("updated_at").defaultNow(),
});

// ── Parameter Definitions ─────────────────────────────────────────────────────
export const parameter_definitions = pgTable("parameter_definitions", {
  id:                  serial("id").primaryKey(),
  parameter_name:      text("parameter_name").notNull().unique(),
  full_name:           text("full_name"),
  category:            text("category"),
  affects_geometry:    boolean("affects_geometry").default(true),
  affects_position:    boolean("affects_position").default(false),
  affects_visualization: boolean("affects_visualization").default(false),
  min_value:           real("min_value").default(-10),
  max_value:           real("max_value").default(10),
  default_value:       real("default_value").default(1),
  precision_step:      real("precision_step").default(0.01),
  units:               text("units").default("dimensionless"),
  description:         text("description"),
  mathematical_role:   text("mathematical_role"),
  created_at:          timestamp("created_at").defaultNow(),
  updated_at:          timestamp("updated_at").defaultNow(),
});

// ── Algorithm Constants ───────────────────────────────────────────────────────
export const algorithm_constants = pgTable("algorithm_constants", {
  id:                      serial("id").primaryKey(),
  algorithm_name:          text("algorithm_name").notNull(),
  constant_type:           text("constant_type"),
  constant_value:          text("constant_value"),
  usage_context:           text("usage_context"),
  mathematical_significance: text("mathematical_significance"),
  created_at:              timestamp("created_at").defaultNow(),
});

// ── AI Interactions ───────────────────────────────────────────────────────────
export const ai_interactions = pgTable("ai_interactions", {
  id:           serial("id").primaryKey(),
  session_id:   text("session_id"),
  query:        text("query"),
  response:     text("response"),
  shape_context:text("shape_context"),
  created_at:   timestamp("created_at").defaultNow(),
});

export const ai_learning_patterns = pgTable("ai_learning_patterns", {
  id:            serial("id").primaryKey(),
  pattern_type:  text("pattern_type"),
  pattern_data:  jsonb("pattern_data"),
  confidence:    real("confidence").default(0.5),
  created_at:    timestamp("created_at").defaultNow(),
});

// ── Mathematical Pattern Recognition ─────────────────────────────────────────
export const mathematical_pattern_recognition = pgTable("mathematical_pattern_recognition", {
  id:             serial("id").primaryKey(),
  shape_type:     text("shape_type"),
  pattern_name:   text("pattern_name"),
  pattern_data:   jsonb("pattern_data"),
  created_at:     timestamp("created_at").defaultNow(),
});

export const cross_system_correlations = pgTable("cross_system_correlations", {
  id:               serial("id").primaryKey(),
  source_shape:     text("source_shape"),
  target_shape:     text("target_shape"),
  correlation_type: text("correlation_type"),
  strength:         real("strength").default(0),
  created_at:       timestamp("created_at").defaultNow(),
});

// ── Custom Fused Shapes ───────────────────────────────────────────────────────
export const custom_fused_shapes = pgTable("custom_fused_shapes", {
  id:            serial("id").primaryKey(),
  name:          text("name").notNull(),
  shape_types:   jsonb("shape_types"),
  parameters:    jsonb("parameters"),
  created_by:    text("created_by"),
  created_at:    timestamp("created_at").defaultNow(),
});

// ── Shape Tokens (legacy table alias) ────────────────────────────────────────
export const shape_tokens = shape_token_ledger;

// ── Morph Manifold Data ───────────────────────────────────────────────────────
export const morph_manifold_data = pgTable("morph_manifold_data", {
  id:              integer("id").primaryKey(),
  shape_type:      text("shape_type"),
  manifold_data:   jsonb("manifold_data"),
  current_amplitude: real("current_amplitude"),
  synchronized_at:   timestamp("synchronized_at"),
  created_at:      timestamp("created_at").defaultNow(),
});

// ── Energy Balance ────────────────────────────────────────────────────────────
export const energy_balance = pgTable("energy_balance", {
  id:          serial("id").primaryKey(),
  token_id:    text("token_id"),
  balance:     real("balance").default(0),
  updated_at:  timestamp("updated_at").defaultNow(),
});

// ── UUON Shapes (legacy) ──────────────────────────────────────────────────────
export const uuon_shapes = complete_shape_registry;
// ── Token Blocks ───────────────────────────────────────────────────────────────
export const token_blocks = pgTable("token_blocks", {
  block_number:         bigint("block_number", { mode: "number" }).primaryKey(),
  block_hash:           text("block_hash").notNull(),
  previous_block_hash:  text("previous_block_hash"),
  transaction_count:    integer("transaction_count").notNull().default(1),
  block_timestamp:      timestamp("block_timestamp", { withTimezone: true }).notNull().defaultNow(),
});

// ── CLOUUD CHAT TABLES ────────────────────────────────────────────────────
export const conversations = pgTable("conversations", {
  id:        serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id:             serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role:           text("role").notNull(),
  content:        text("content").notNull(),
  timestamp:      timestamp("timestamp").defaultNow().notNull(),
});
// ─────────────────────────────────────────────────────────────────────────
