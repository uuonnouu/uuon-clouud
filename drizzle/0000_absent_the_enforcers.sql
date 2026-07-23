-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SEQUENCE "public"."complete_shape_registry_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "complete_shape_registry" (
	"id" integer PRIMARY KEY DEFAULT nextval('complete_shape_registry_id_seq'::regclass) NOT NULL,
	"shape_type" varchar(255),
	"display_name" varchar(255),
	"category" varchar(255),
	"subcategory" varchar(255),
	"description" text,
	"source" text,
	"priority" varchar(100),
	"seo_keywords" text,
	"canonical_url" text,
	"base_energy" numeric(38, 6),
	"asset_value_usd" numeric(24, 6),
	"mint_status" varchar(100),
	"onchain_token_id" text,
	"erc20_contract_address" varchar(255),
	"morph_parameters" jsonb,
	"last_morph_at" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_shape_type" UNIQUE("shape_type")
);
--> statement-breakpoint
CREATE TABLE "portfolio_state" (
	"id" integer PRIMARY KEY NOT NULL,
	"total_value_usd" numeric(24, 6) DEFAULT '0.000000',
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "energy_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer,
	"receiver_id" integer,
	"energy_units" numeric(38, 6) DEFAULT '0.000000',
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "morph_manifold_data" (
	"id" integer PRIMARY KEY NOT NULL,
	"current_amplitude" numeric(24, 6) DEFAULT '0.000000',
	"synchronized_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_ml_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_name" text NOT NULL,
	"shape_type" text NOT NULL,
	"category" text NOT NULL,
	"url_slug" text NOT NULL,
	"mathematical_equation" text NOT NULL,
	"ai_capabilities" jsonb NOT NULL,
	"ml_architecture" jsonb NOT NULL,
	"training_data_size" integer NOT NULL,
	"performance_metrics" jsonb NOT NULL,
	"applications" jsonb NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "ai_ml_models_model_name_key" UNIQUE("model_name"),
	CONSTRAINT "ai_ml_models_url_slug_key" UNIQUE("url_slug")
);
--> statement-breakpoint
CREATE TABLE "model_training_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer,
	"data_type" text NOT NULL,
	"compressed_data" text NOT NULL,
	"data_size" integer NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_performance_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer,
	"accuracy_score" real NOT NULL,
	"training_time" integer NOT NULL,
	"memory_usage" integer NOT NULL,
	"test_case" text NOT NULL,
	"result_data" jsonb NOT NULL,
	"timestamp" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "model_training_data" ADD CONSTRAINT "model_training_data_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."ai_ml_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_performance_logs" ADD CONSTRAINT "model_performance_logs_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."ai_ml_models"("id") ON DELETE no action ON UPDATE no action;
*/