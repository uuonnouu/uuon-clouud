// Brain Compression System - Complete Exports

export * from "./types";
export { brainService } from "./service";
export { brainScanner } from "./scanner";
export { orchestrator } from "./compression/orchestrator";
export { registerBrainRoutes } from "./routes";
export { metricsCollector } from "./metrics-collector";
export { batchWorker } from "./batch-worker";

// Handlers
export { parametricHandler } from "./compression/parametric";
export { temporalHandler } from "./compression/temporal";
export { relationshipHandler } from "./compression/relationship";
export { transformationHandler } from "./compression/transformation";
export { functionalHandler } from "./compression/functional";
export { constraintsHandler } from "./compression/constraints";
export { deterministicHandler } from "./compression/deterministic";

// Testing & Load Tests
export { BrainCompressionLoadTester } from "./load-tests";
