CREATE TABLE "ai_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text,
	"query" text,
	"response" text,
	"shape_context" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_learning_patterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"pattern_type" text,
	"pattern_data" jsonb,
	"confidence" real DEFAULT 0.5,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "algorithm_constants" (
	"id" serial PRIMARY KEY NOT NULL,
	"algorithm_name" text NOT NULL,
	"constant_type" text,
	"constant_value" text,
	"usage_context" text,
	"mathematical_significance" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cross_system_correlations" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_shape" text,
	"target_shape" text,
	"correlation_type" text,
	"strength" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "custom_fused_shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"shape_types" jsonb,
	"parameters" jsonb,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "energy_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text,
	"balance" real DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "formula_implementations" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_type" varchar NOT NULL,
	"display_name" varchar,
	"category" varchar DEFAULT 'general',
	"subcategory" varchar,
	"equation_x" text,
	"equation_y" text,
	"equation_z" text,
	"default_parameters" jsonb,
	"parameter_ranges" jsonb,
	"fibonacci_level" integer,
	"string_theory_dim" integer,
	"complexity_class" varchar,
	"verified" boolean DEFAULT false,
	"verification_hash" varchar,
	"source_file" varchar DEFAULT 'parametricSurfacesClean.ts',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "formula_implementations_shape_type_unique" UNIQUE("shape_type")
);
--> statement-breakpoint
CREATE TABLE "mathematical_constants" (
	"id" serial PRIMARY KEY NOT NULL,
	"constant_name" text NOT NULL,
	"symbol" text,
	"value" text,
	"scientific_notation" text,
	"units" text,
	"category" text,
	"description" text,
	"mathematical_basis" text,
	"real_world_applications" text,
	"precision_digits" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "mathematical_constants_constant_name_unique" UNIQUE("constant_name")
);
--> statement-breakpoint
CREATE TABLE "mathematical_pattern_recognition" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_type" text,
	"pattern_name" text,
	"pattern_data" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parameter_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"parameter_name" text NOT NULL,
	"full_name" text,
	"category" text,
	"affects_geometry" boolean DEFAULT true,
	"affects_position" boolean DEFAULT false,
	"affects_visualization" boolean DEFAULT false,
	"min_value" real DEFAULT -10,
	"max_value" real DEFAULT 10,
	"default_value" real DEFAULT 1,
	"precision_step" real DEFAULT 0.01,
	"units" text DEFAULT 'dimensionless',
	"description" text,
	"mathematical_role" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "parameter_definitions_parameter_name_unique" UNIQUE("parameter_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shape_token_energy" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text NOT NULL,
	"energy_in" real DEFAULT 0,
	"energy_out" real DEFAULT 0,
	"energy_hash" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shape_token_ledger" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text NOT NULL,
	"shape_type" text NOT NULL,
	"token_name" text NOT NULL,
	"token_symbol" text DEFAULT 'UUON',
	"token_uri" text,
	"owner_wallet_address" text,
	"status" text DEFAULT 'active',
	"issuance_tx_id" text,
	"current_state_hash" text,
	"on_chain_status" text DEFAULT 'pending',
	"on_chain_contract" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "shape_token_ledger_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shape_token_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text NOT NULL,
	"param_hash" text,
	"energy_hash" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "shape_token_metadata_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "shape_token_state_roots" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text NOT NULL,
	"latest_tx_id" text,
	"state_leaf_hash" text,
	"state_merkle_root" text,
	"cumulative_energy_hash" text,
	"leaf_count" integer,
	"bridge_status" text DEFAULT 'not_bridged',
	"bridge_tx_hash" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "shape_token_state_roots_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "shape_token_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" text NOT NULL,
	"tx_type" text NOT NULL,
	"from_address" text,
	"to_address" text,
	"amount" real DEFAULT 0,
	"tx_hash" text,
	"block_number" integer,
	"gas_used" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_evolution_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_id" text,
	"event_type" text,
	"event_data" jsonb,
	"computation_time_ms" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "uuon_system_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"base_token_price" text DEFAULT '1.618',
	"named_token_price" text DEFAULT '1618',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uuon-algorithm-metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"algorithm-id" text,
	"metric-name" text NOT NULL,
	"metric-value" real NOT NULL,
	"measured-at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uuon-blockchain-algorithms" (
	"id" serial PRIMARY KEY NOT NULL,
	"algorithm-name" text NOT NULL,
	"algorithm-id" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"complexity" text NOT NULL,
	"security-level" text NOT NULL,
	"use-cases" text,
	"implementation" text NOT NULL,
	"proof-of-concept" text,
	"created-at" timestamp DEFAULT now(),
	"updated-at" timestamp DEFAULT now(),
	CONSTRAINT "uuon-blockchain-algorithms_algorithm-id_unique" UNIQUE("algorithm-id")
);
--> statement-breakpoint
CREATE TABLE "uuon-proof-verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"algorithm-id" text,
	"verification-type" text NOT NULL,
	"status" text NOT NULL,
	"proof-data" text,
	"verified-at" timestamp DEFAULT now(),
	"verifier-info" text
);
--> statement-breakpoint
ALTER TABLE "ai_ml_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "model_training_data" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "model_performance_logs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ai_ml_models" CASCADE;--> statement-breakpoint
DROP TABLE "model_training_data" CASCADE;--> statement-breakpoint
DROP TABLE "model_performance_logs" CASCADE;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP CONSTRAINT "unique_shape_type";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "shape_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "shape_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "display_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "display_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "category" SET DEFAULT 'general';--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "subcategory" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "source" SET DEFAULT 'frontend';--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "priority" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "priority" SET DEFAULT 0.8;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "mint_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ALTER COLUMN "mint_status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "portfolio_state" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "morph_manifold_data" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "portfolio_state" ADD COLUMN "total_fiat_value" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "portfolio_state" ADD COLUMN "total_token_value" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "portfolio_state" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "energy_transactions" ADD COLUMN "token_id" text;--> statement-breakpoint
ALTER TABLE "energy_transactions" ADD COLUMN "energy_in" real DEFAULT 0;--> statement-breakpoint
ALTER TABLE "energy_transactions" ADD COLUMN "conversion_timestamp" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "morph_manifold_data" ADD COLUMN "shape_type" text;--> statement-breakpoint
ALTER TABLE "morph_manifold_data" ADD COLUMN "manifold_data" jsonb;--> statement-breakpoint
ALTER TABLE "morph_manifold_data" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "uuon-algorithm-metrics" ADD CONSTRAINT "uuon-algorithm-metrics_algorithm-id_uuon-blockchain-algorithms_algorithm-id_fk" FOREIGN KEY ("algorithm-id") REFERENCES "public"."uuon-blockchain-algorithms"("algorithm-id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uuon-proof-verifications" ADD CONSTRAINT "uuon-proof-verifications_algorithm-id_uuon-blockchain-algorithms_algorithm-id_fk" FOREIGN KEY ("algorithm-id") REFERENCES "public"."uuon-blockchain-algorithms"("algorithm-id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "base_energy";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "asset_value_usd";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "onchain_token_id";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "erc20_contract_address";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "morph_parameters";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" DROP COLUMN "last_morph_at";--> statement-breakpoint
ALTER TABLE "portfolio_state" DROP COLUMN "total_value_usd";--> statement-breakpoint
ALTER TABLE "portfolio_state" DROP COLUMN "last_updated";--> statement-breakpoint
ALTER TABLE "energy_transactions" DROP COLUMN "sender_id";--> statement-breakpoint
ALTER TABLE "energy_transactions" DROP COLUMN "receiver_id";--> statement-breakpoint
ALTER TABLE "energy_transactions" DROP COLUMN "energy_units";--> statement-breakpoint
ALTER TABLE "energy_transactions" DROP COLUMN "timestamp";--> statement-breakpoint
ALTER TABLE "morph_manifold_data" DROP COLUMN "current_amplitude";--> statement-breakpoint
ALTER TABLE "morph_manifold_data" DROP COLUMN "synchronized_at";--> statement-breakpoint
ALTER TABLE "complete_shape_registry" ADD CONSTRAINT "complete_shape_registry_shape_type_unique" UNIQUE("shape_type");--> statement-breakpoint
DROP SEQUENCE "public"."complete_shape_registry_id_seq";