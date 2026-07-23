import { pgTable, unique, integer, varchar, text, numeric, jsonb, boolean, timestamp, serial, foreignKey, real, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const completeShapeRegistryIdSeq = pgSequence("complete_shape_registry_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const completeShapeRegistry = pgTable("complete_shape_registry", {
	id: integer().default(sql`nextval('complete_shape_registry_id_seq'::regclass)`).primaryKey().notNull(),
	shapeType: varchar("shape_type", { length: 255 }),
	displayName: varchar("display_name", { length: 255 }),
	category: varchar({ length: 255 }),
	subcategory: varchar({ length: 255 }),
	description: text(),
	source: text(),
	priority: varchar({ length: 100 }),
	seoKeywords: text("seo_keywords"),
	canonicalUrl: text("canonical_url"),
	baseEnergy: numeric("base_energy", { precision: 38, scale:  6 }),
	assetValueUsd: numeric("asset_value_usd", { precision: 24, scale:  6 }),
	mintStatus: varchar("mint_status", { length: 100 }),
	onchainTokenId: text("onchain_token_id"),
	erc20ContractAddress: varchar("erc20_contract_address", { length: 255 }),
	morphParameters: jsonb("morph_parameters"),
	lastMorphAt: text("last_morph_at"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("unique_shape_type").on(table.shapeType),
]);

export const portfolioState = pgTable("portfolio_state", {
	id: integer().primaryKey().notNull(),
	totalValueUsd: numeric("total_value_usd", { precision: 24, scale:  6 }).default('0.000000'),
	lastUpdated: timestamp("last_updated", { mode: 'string' }).defaultNow(),
});

export const energyTransactions = pgTable("energy_transactions", {
	id: serial().primaryKey().notNull(),
	senderId: integer("sender_id"),
	receiverId: integer("receiver_id"),
	energyUnits: numeric("energy_units", { precision: 38, scale:  6 }).default('0.000000'),
	timestamp: timestamp({ mode: 'string' }).defaultNow(),
});

export const morphManifoldData = pgTable("morph_manifold_data", {
	id: integer().primaryKey().notNull(),
	currentAmplitude: numeric("current_amplitude", { precision: 24, scale:  6 }).default('0.000000'),
	synchronizedAt: timestamp("synchronized_at", { mode: 'string' }).defaultNow(),
});

export const aiMlModels = pgTable("ai_ml_models", {
	id: serial().primaryKey().notNull(),
	modelName: text("model_name").notNull(),
	shapeType: text("shape_type").notNull(),
	category: text().notNull(),
	urlSlug: text("url_slug").notNull(),
	mathematicalEquation: text("mathematical_equation").notNull(),
	aiCapabilities: jsonb("ai_capabilities").notNull(),
	mlArchitecture: jsonb("ml_architecture").notNull(),
	trainingDataSize: integer("training_data_size").notNull(),
	performanceMetrics: jsonb("performance_metrics").notNull(),
	applications: jsonb().notNull(),
	isPremium: boolean("is_premium").default(false).notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
}, (table) => [
	unique("ai_ml_models_model_name_key").on(table.modelName),
	unique("ai_ml_models_url_slug_key").on(table.urlSlug),
]);

export const modelTrainingData = pgTable("model_training_data", {
	id: serial().primaryKey().notNull(),
	modelId: integer("model_id"),
	dataType: text("data_type").notNull(),
	compressedData: text("compressed_data").notNull(),
	dataSize: integer("data_size").notNull(),
	createdAt: text("created_at").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [aiMlModels.id],
			name: "model_training_data_model_id_fkey"
		}),
]);

export const modelPerformanceLogs = pgTable("model_performance_logs", {
	id: serial().primaryKey().notNull(),
	modelId: integer("model_id"),
	accuracyScore: real("accuracy_score").notNull(),
	trainingTime: integer("training_time").notNull(),
	memoryUsage: integer("memory_usage").notNull(),
	testCase: text("test_case").notNull(),
	resultData: jsonb("result_data").notNull(),
	timestamp: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.modelId],
			foreignColumns: [aiMlModels.id],
			name: "model_performance_logs_model_id_fkey"
		}),
]);
