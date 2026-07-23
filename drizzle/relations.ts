import { relations } from "drizzle-orm/relations";
import { aiMlModels, modelTrainingData, modelPerformanceLogs } from "./schema";

export const modelTrainingDataRelations = relations(modelTrainingData, ({one}) => ({
	aiMlModel: one(aiMlModels, {
		fields: [modelTrainingData.modelId],
		references: [aiMlModels.id]
	}),
}));

export const aiMlModelsRelations = relations(aiMlModels, ({many}) => ({
	modelTrainingData: many(modelTrainingData),
	modelPerformanceLogs: many(modelPerformanceLogs),
}));

export const modelPerformanceLogsRelations = relations(modelPerformanceLogs, ({one}) => ({
	aiMlModel: one(aiMlModels, {
		fields: [modelPerformanceLogs.modelId],
		references: [aiMlModels.id]
	}),
}));