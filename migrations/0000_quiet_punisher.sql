CREATE TABLE "access_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"fingerprint_hash" text NOT NULL,
	"action" text NOT NULL,
	"granted" boolean NOT NULL,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brain_compression_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_type" text NOT NULL,
	"total_rules" integer NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"avg_compression_ratio" text NOT NULL,
	"min_compression_ratio" text,
	"max_compression_ratio" text,
	"avg_reconstruction_time_ms" integer,
	"total_storage_saved" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brain_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_path" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"content_hash" text NOT NULL,
	"compressed" boolean DEFAULT false NOT NULL,
	"rule_id" integer,
	"domain" text,
	"priority" text DEFAULT 'MEDIUM' NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed" timestamp,
	"scanned_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "brain_inventory_file_path_unique" UNIQUE("file_path"),
	CONSTRAINT "brain_inventory_content_hash_unique" UNIQUE("content_hash")
);
--> statement-breakpoint
CREATE TABLE "brain_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" text NOT NULL,
	"source_file" text NOT NULL,
	"rule_type" text NOT NULL,
	"rule_content" text NOT NULL,
	"original_size" integer NOT NULL,
	"compressed_size" integer NOT NULL,
	"compression_ratio" text NOT NULL,
	"reconstruction_time_ms" integer,
	"content_hash" text NOT NULL,
	"reconstruction_hash" text,
	"verified" boolean DEFAULT false NOT NULL,
	"blockchain_anchor" text,
	"domain" text,
	"dependencies" text,
	"metadata" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "brain_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "creator_profile_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "discoveries" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"source" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dmension_shapes" (
	"id" serial PRIMARY KEY NOT NULL,
	"shape_id" text,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"domain" text NOT NULL,
	"description" text,
	"formula" text,
	"parameters" text,
	"earth_link" text,
	"sketchfab_url" text,
	"tags" text,
	"engine_name" text,
	"metadata" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "dmension_shapes_shape_id_unique" UNIQUE("shape_id")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"response" text NOT NULL,
	"sa_score" integer,
	"hash" text,
	"version" text DEFAULT '3.3' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fingerprints" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"components" text NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	"blocked" boolean DEFAULT false NOT NULL,
	"last_seen" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "fingerprints_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
CREATE TABLE "founder_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_uuid" text NOT NULL,
	"name" text NOT NULL,
	"summary" text,
	"message_count" integer DEFAULT 0 NOT NULL,
	"topic_tags" text DEFAULT '[]' NOT NULL,
	"project_name" text,
	"original_created_at" timestamp NOT NULL,
	"imported_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "founder_conversations_external_uuid_unique" UNIQUE("external_uuid")
);
--> statement-breakpoint
CREATE TABLE "founder_corrections" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"correction_type" text NOT NULL,
	"founder_statement" text NOT NULL,
	"assistant_error" text,
	"resolution" text NOT NULL,
	"topic_tags" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "founder_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"external_uuid" text NOT NULL,
	"sender" text NOT NULL,
	"content" text NOT NULL,
	"is_correction" boolean DEFAULT false NOT NULL,
	"is_directive" boolean DEFAULT false NOT NULL,
	"topic_tags" text,
	"original_created_at" timestamp NOT NULL,
	"imported_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "founder_messages_external_uuid_unique" UNIQUE("external_uuid")
);
--> statement-breakpoint
CREATE TABLE "gcentric_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_number" text NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'installed' NOT NULL,
	"sequence_index" integer NOT NULL,
	"installed_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "gcentric_versions_version_number_unique" UNIQUE("version_number")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"tool_call" text,
	"hash" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pattern_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"pattern_id" integer,
	"alert_type" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pattern_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_pattern_id" integer NOT NULL,
	"to_pattern_id" integer NOT NULL,
	"link_type" text NOT NULL,
	"description" text,
	"strength" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "pattern_links_unique" UNIQUE("from_pattern_id","to_pattern_id","link_type")
);
--> statement-breakpoint
CREATE TABLE "patterns" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"public_summary" text,
	"category" text NOT NULL,
	"source_type" text NOT NULL,
	"source_reference" text,
	"discovered_by" text DEFAULT 'Phillip Aguilar Ruiz III' NOT NULL,
	"fingerprint_id" integer,
	"ello_hash" text NOT NULL,
	"origin_timestamp" timestamp NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "patterns_ello_hash_unique" UNIQUE("ello_hash")
);
--> statement-breakpoint
CREATE TABLE "self_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"score" integer NOT NULL,
	"word_count" integer NOT NULL,
	"pass" boolean NOT NULL,
	"flags" text DEFAULT '[]' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uinverse_ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"import_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"verdict" text NOT NULL,
	"confidence" integer NOT NULL,
	"reasoning" text NOT NULL,
	"source_excerpt" text NOT NULL,
	"priority" text DEFAULT 'MEDIUM' NOT NULL,
	"implemented" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uinverse_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"filename" text,
	"raw_content" text NOT NULL,
	"message_count" integer DEFAULT 0 NOT NULL,
	"ideas_extracted" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"conversation_id" integer,
	"extracted_text" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uuon_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	"message_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	"origin" text DEFAULT 'UUON-FOUNDATION-GCENTRIC-V1' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uuon_tokens_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
ALTER TABLE "brain_inventory" ADD CONSTRAINT "brain_inventory_rule_id_brain_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."brain_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "founder_corrections" ADD CONSTRAINT "founder_corrections_message_id_founder_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."founder_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "founder_corrections" ADD CONSTRAINT "founder_corrections_conversation_id_founder_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."founder_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "founder_messages" ADD CONSTRAINT "founder_messages_conversation_id_founder_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."founder_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_alerts" ADD CONSTRAINT "pattern_alerts_pattern_id_patterns_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_links" ADD CONSTRAINT "pattern_links_from_pattern_id_patterns_id_fk" FOREIGN KEY ("from_pattern_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pattern_links" ADD CONSTRAINT "pattern_links_to_pattern_id_patterns_id_fk" FOREIGN KEY ("to_pattern_id") REFERENCES "public"."patterns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patterns" ADD CONSTRAINT "patterns_fingerprint_id_fingerprints_id_fk" FOREIGN KEY ("fingerprint_id") REFERENCES "public"."fingerprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "self_assessments" ADD CONSTRAINT "self_assessments_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "self_assessments" ADD CONSTRAINT "self_assessments_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uinverse_ideas" ADD CONSTRAINT "uinverse_ideas_import_id_uinverse_imports_id_fk" FOREIGN KEY ("import_id") REFERENCES "public"."uinverse_imports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uuon_tokens" ADD CONSTRAINT "uuon_tokens_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uuon_tokens" ADD CONSTRAINT "uuon_tokens_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brain_compression_metrics_rule_type_idx" ON "brain_compression_metrics" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "brain_inventory_file_path_idx" ON "brain_inventory" USING btree ("file_path");--> statement-breakpoint
CREATE INDEX "brain_inventory_compressed_idx" ON "brain_inventory" USING btree ("compressed");--> statement-breakpoint
CREATE INDEX "brain_inventory_domain_idx" ON "brain_inventory" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "brain_rules_rule_type_idx" ON "brain_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "brain_rules_domain_idx" ON "brain_rules" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "brain_rules_verified_idx" ON "brain_rules" USING btree ("verified");--> statement-breakpoint
CREATE INDEX "brain_rules_source_file_idx" ON "brain_rules" USING btree ("source_file");--> statement-breakpoint
CREATE INDEX "dmension_shapes_category_idx" ON "dmension_shapes" USING btree ("category");--> statement-breakpoint
CREATE INDEX "dmension_shapes_domain_idx" ON "dmension_shapes" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "founder_messages_conversation_id_idx" ON "founder_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "pattern_alerts_read_idx" ON "pattern_alerts" USING btree ("read");--> statement-breakpoint
CREATE INDEX "pattern_links_from_idx" ON "pattern_links" USING btree ("from_pattern_id");--> statement-breakpoint
CREATE INDEX "pattern_links_to_idx" ON "pattern_links" USING btree ("to_pattern_id");--> statement-breakpoint
CREATE INDEX "patterns_category_idx" ON "patterns" USING btree ("category");--> statement-breakpoint
CREATE INDEX "patterns_source_type_idx" ON "patterns" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "patterns_discovered_by_idx" ON "patterns" USING btree ("discovered_by");--> statement-breakpoint
CREATE INDEX "self_assessments_conversation_id_idx" ON "self_assessments" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "uploads_conversation_id_idx" ON "uploads" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "uuon_tokens_conversation_id_idx" ON "uuon_tokens" USING btree ("conversation_id");