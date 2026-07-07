/**
 * Active Learning: Feedback → Real System Improvement
 * 
 * Problem: Current feedback (Helped/Partial/Missed) logs data but doesn't train
 * Solution: Use feedback to retrain lattice weights, recalibrate domain models, update tool reputation
 * 
 * Three feedback loops:
 * 1. Lattice recalibration (already in self-learning-lattice.ts)
 * 2. SA score recalibration (detect what kind of responses users find helpful)
 * 3. Tool performance ranking (reputation affects tool selection)
 */

import { FeedbackEntry, DomainLatticeWeights, updateDomainLatticeWithFeedback } from "./self-learning-lattice";
import { ToolExecutionResult } from "./tool-factory";

/**
 * User feedback on a response
 */
export interface ResponseFeedback {
  responseId: string;
  conversationId: string;
  userId?: string;
  feedback: "helped" | "partial" | "missed";
  reason?: string; // optional: why they gave this feedback
  timeToUseful?: number; // ms: how long until they found it useful
  correctness?: number; // 0-100: how correct was the response
  clarity?: number; // 0-100: how clear/understandable
  actionTaken?: string; // what did user do with this response
}

/**
 * SA Score Recalibration
 * Learn what properties of responses users actually find helpful
 */
export interface SARecalibrationData {
  responseId: string;
  originalScore: number;
  wordCount: number;
  sentenceLength: number;
  hasHedging: boolean;
  hasMarkdown: boolean;
  hasTools: boolean;
  toolCount: number;
  latticePositions: number[];
  feedback: "helped" | "partial" | "missed";
}

export interface SAWeightModel {
  version: number;
  weights: {
    word_count: number; // bias against long responses
    hedging_penalty: number;
    markdown_penalty: number;
    tool_usage_bonus: number;
    lattice_coverage: number; // bonus for diverse lattice positions
  };
  accuracy: number; // how well this model predicts helpful responses
  samplesUsed: number;
  lastUpdated: string;
}

export class ActiveLearningSystem {
  private saWeightModel: SAWeightModel = {
    version: 1,
    weights: {
      word_count: -0.1, // -0.1 points per word over 150
      hedging_penalty: -5,
      markdown_penalty: -10,
      tool_usage_bonus: 10,
      lattice_coverage: 5,
    },
    accuracy: 0.75,
    samplesUsed: 0,
    lastUpdated: new Date().toISOString(),
  };

  private feedbackHistory: ResponseFeedback[] = [];
  private saRecalibrationData: SARecalibrationData[] = [];

  /**
   * Record user feedback
   */
  recordFeedback(feedback: ResponseFeedback): void {
    this.feedbackHistory.push(feedback);

    // Trigger recalibration if we've accumulated enough feedback
    if (this.feedbackHistory.length % 20 === 0) {
      this.recalibrateModel();
    }
  }

  /**
   * Add SA recalibration data (what made responses helpful/unhelpful)
   */
  recordSAData(data: SARecalibrationData): void {
    this.saRecalibrationData.push(data);
  }

  /**
   * Recalibrate SA weight model from feedback history
   */
  private recalibrateModel(): void {
    if (this.saRecalibrationData.length < 10) {
      return; // need minimum data
    }

    // Separate helpful from unhelpful
    const helpful = this.saRecalibrationData.filter((d) => d.feedback === "helped");
    const unhelpful = this.saRecalibrationData.filter((d) => d.feedback === "missed");

    if (helpful.length === 0 || unhelpful.length === 0) {
      return;
    }

    // Calculate mean properties
    const avgHelpfulWordCount = helpful.reduce((sum, d) => sum + d.wordCount, 0) / helpful.length;
    const avgUnhelpfulWordCount = unhelpful.reduce((sum, d) => sum + d.wordCount, 0) / unhelpful.length;

    const helpfulHedgingRate = helpful.filter((d) => d.hasHedging).length / helpful.length;
    const unhelpfulHedgingRate = unhelpful.filter((d) => d.hasHedging).length / unhelpful.length;

    const helpfulToolRate = helpful.filter((d) => d.hasTools).length / helpful.length;
    const unhelpfulToolRate = unhelpful.filter((d) => d.hasTools).length / unhelpful.length;

    // Adjust weights: if helpful responses are shorter, penalize length more
    const wordCountDelta = avgUnhelpfulWordCount - avgHelpfulWordCount;
    if (wordCountDelta > 0) {
      this.saWeightModel.weights.word_count *= 1.2; // increase penalty
    }

    // If helpful responses have less hedging, penalize hedging more
    const hedgingDelta = unhelpfulHedgingRate - helpfulHedgingRate;
    if (hedgingDelta > 0.2) {
      this.saWeightModel.weights.hedging_penalty *= 1.15;
    }

    // If helpful responses use more tools, increase tool bonus
    const toolDelta = helpfulToolRate - unhelpfulToolRate;
    if (toolDelta > 0.2) {
      this.saWeightModel.weights.tool_usage_bonus *= 1.2;
    }

    // Update accuracy metric (how many we correctly predicted)
    const predictions = this.saRecalibrationData.map((d) => {
      const predicted = this.predictFeedback(d);
      return predicted === d.feedback;
    });
    const correctCount = predictions.filter((p) => p).length;
    this.saWeightModel.accuracy = correctCount / predictions.length;

    this.saWeightModel.samplesUsed = this.saRecalibrationData.length;
    this.saWeightModel.lastUpdated = new Date().toISOString();
  }

  /**
   * Predict if a response will be helpful (using recalibrated model)
   */
  private predictFeedback(data: SARecalibrationData): "helped" | "partial" | "missed" {
    let score = 100;

    // Apply recalibrated weights
    if (data.wordCount > 150) {
      score += this.saWeightModel.weights.word_count * (data.wordCount - 150);
    }

    if (data.hasHedging) {
      score += this.saWeightModel.weights.hedging_penalty;
    }

    if (data.hasMarkdown) {
      score += this.saWeightModel.weights.markdown_penalty;
    }

    if (data.hasTools) {
      score += this.saWeightModel.weights.tool_usage_bonus * Math.max(1, data.toolCount);
    }

    const latticeUniqueness = new Set(data.latticePositions).size;
    score += this.saWeightModel.weights.lattice_coverage * (latticeUniqueness / 33);

    if (score >= 80) return "helped";
    if (score >= 60) return "partial";
    return "missed";
  }

  /**
   * Tool performance ranking: rank tools by success rate + latency
   */
  rankTools(toolExecutions: ToolExecutionResult[]): Array<{ toolId: string; score: number }> {
    const toolStats: Record<string, { success: number; total: number; latency: number }> = {};

    for (const execution of toolExecutions) {
      if (!toolStats[execution.toolId]) {
        toolStats[execution.toolId] = { success: 0, total: 0, latency: 0 };
      }

      const stats = toolStats[execution.toolId];
      stats.total += 1;
      if (execution.success) stats.success += 1;
      stats.latency = (stats.latency * (stats.total - 1) + execution.executionTime) / stats.total;
    }

    // Rank: 70% success rate, 30% inverse latency (lower is better)
    const ranked = Object.entries(toolStats).map(([toolId, stats]) => {
      const successRate = stats.total > 0 ? stats.success / stats.total : 0;
      const latencyScore = Math.max(0, 100 - stats.latency); // normalize latency to 0-100
      const score = successRate * 70 + (latencyScore / 100) * 30;

      return { toolId, score };
    });

    return ranked.sort((a, b) => b.score - a.score);
  }

  /**
   * Online learning: incrementally update model on new feedback
   */
  onlineLearning(feedback: ResponseFeedback, responseMetadata: SARecalibrationData): void {
    this.recordFeedback(feedback);
    this.recordSAData(responseMetadata);

    // Online update (exponential moving average)
    const alpha = 0.1; // learning rate

    if (feedback.feedback === "helped") {
      if (responseMetadata.wordCount < 150) {
        // helpful response was short → reduce word count penalty
        this.saWeightModel.weights.word_count *= 1 - alpha;
      }
      if (!responseMetadata.hasHedging) {
        // helpful response had no hedging → increase hedging penalty
        this.saWeightModel.weights.hedging_penalty *= 1 + alpha;
      }
      if (responseMetadata.hasTools) {
        // helpful response used tools → increase tool bonus
        this.saWeightModel.weights.tool_usage_bonus *= 1 + alpha;
      }
    } else if (feedback.feedback === "missed") {
      if (responseMetadata.wordCount > 150) {
        // unhelpful response was long → increase word count penalty
        this.saWeightModel.weights.word_count *= 1 + alpha;
      }
      if (responseMetadata.hasHedging) {
        // unhelpful response had hedging → increase hedging penalty
        this.saWeightModel.weights.hedging_penalty *= 1 + alpha;
      }
    }

    this.saWeightModel.lastUpdated = new Date().toISOString();
  }

  /**
   * Get current model
   */
  getModel(): SAWeightModel {
    return this.saWeightModel;
  }

  /**
   * Get feedback statistics
   */
  getStats(): {
    totalFeedback: number;
    helpedRate: number;
    partialRate: number;
    missedRate: number;
    modelAccuracy: number;
  } {
    const total = this.feedbackHistory.length;
    const helped = this.feedbackHistory.filter((f) => f.feedback === "helped").length;
    const partial = this.feedbackHistory.filter((f) => f.feedback === "partial").length;
    const missed = this.feedbackHistory.filter((f) => f.feedback === "missed").length;

    return {
      totalFeedback: total,
      helpedRate: total > 0 ? helped / total : 0,
      partialRate: total > 0 ? partial / total : 0,
      missedRate: total > 0 ? missed / total : 0,
      modelAccuracy: this.saWeightModel.accuracy,
    };
  }

  /**
   * Export model for federation (share learning across instances)
   */
  exportModel(): { model: SAWeightModel; stats: ReturnType<typeof this.getStats> } {
    return {
      model: this.saWeightModel,
      stats: this.getStats(),
    };
  }

  /**
   * Import federated model (blend with local model)
   */
  importModel(remoteModel: SAWeightModel): void {
    // Blend: 70% local, 30% remote (trust local more)
    const alpha = 0.3;
    for (const [key, remoteWeight] of Object.entries(remoteModel.weights)) {
      const localWeight = this.saWeightModel.weights[key as keyof typeof remoteModel.weights];
      this.saWeightModel.weights[key as keyof typeof remoteModel.weights] =
        (1 - alpha) * localWeight + alpha * remoteWeight;
    }

    // Update accuracy if remote is better
    if (remoteModel.accuracy > this.saWeightModel.accuracy) {
      this.saWeightModel.accuracy = (this.saWeightModel.accuracy + remoteModel.accuracy) / 2;
    }
  }
}

/**
 * Database schema
 */
export const activeLearningSchema = {
  response_feedback: `
    CREATE TABLE IF NOT EXISTS response_feedback (
      id SERIAL PRIMARY KEY,
      response_id VARCHAR(255) NOT NULL,
      conversation_id VARCHAR(255) NOT NULL,
      feedback VARCHAR(50) NOT NULL,
      reason TEXT,
      time_to_useful INTEGER,
      correctness NUMERIC(3, 0),
      clarity NUMERIC(3, 0),
      action_taken TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  sa_recalibration_data: `
    CREATE TABLE IF NOT EXISTS sa_recalibration_data (
      id SERIAL PRIMARY KEY,
      response_id VARCHAR(255) NOT NULL,
      original_score NUMERIC(5, 2),
      word_count INTEGER,
      sentence_length NUMERIC(5, 2),
      has_hedging BOOLEAN,
      has_markdown BOOLEAN,
      has_tools BOOLEAN,
      tool_count INTEGER,
      lattice_positions INTEGER[],
      feedback VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  sa_weight_models: `
    CREATE TABLE IF NOT EXISTS sa_weight_models (
      id SERIAL PRIMARY KEY,
      version INTEGER UNIQUE NOT NULL,
      weights JSONB NOT NULL,
      accuracy NUMERIC(5, 4),
      samples_used INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

export default {
  ActiveLearningSystem,
};
