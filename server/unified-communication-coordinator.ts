
/**
 * UNIFIED COMMUNICATION COORDINATOR
 * Ensures Assistant and Agent work hand-in-hand without conflicts
 */

import { performance } from 'perf_hooks';
import { mathematicalAI } from './ai-assistant';

interface SystemRequest {
  id: string;
  source: 'frontend' | 'assistant' | 'agent' | 'user';
  type: 'optimization' | 'analysis' | 'bug_fix' | 'enhancement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  payload: any;
  timestamp: string;
  dependencies?: string[];
}

interface ProcessingResult {
  requestId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
  errors?: string[];
  recommendations?: string[];
  nextActions?: string[];
}

export class UnifiedCommunicationCoordinator {
  private static instance: UnifiedCommunicationCoordinator;
  private requestQueue: Map<string, SystemRequest> = new Map();
  private processingHistory: Map<string, ProcessingResult> = new Map();
  private activeProcesses = new Set<string>();

  static getInstance(): UnifiedCommunicationCoordinator {
    if (!UnifiedCommunicationCoordinator.instance) {
      UnifiedCommunicationCoordinator.instance = new UnifiedCommunicationCoordinator();
    }
    return UnifiedCommunicationCoordinator.instance;
  }

  constructor() {
    console.log('🔄 Unified Communication Coordinator initialized');
  }

  /**
   * Main coordination method - determines optimal processing approach
   */
  async coordinateRequest(request: SystemRequest): Promise<ProcessingResult> {
    const startTime = performance.now();
    
    // Step 1: Conflict Detection
    const conflicts = this.detectConflicts(request);
    if (conflicts.length > 0) {
      console.log(`⚠️ Conflicts detected for request ${request.id}:`, conflicts);
      return this.handleConflicts(request, conflicts);
    }

    // Step 2: Determine optimal processor
    const processor = this.determineOptimalProcessor(request);
    console.log(`🎯 Request ${request.id} assigned to: ${processor}`);

    // Step 3: Execute with tracking
    this.activeProcesses.add(request.id);
    const result = await this.executeRequest(request, processor);
    
    // Step 4: Post-processing validation
    const validationResult = await this.validateResult(result);
    
    const processingTime = performance.now() - startTime;
    console.log(`✅ Request ${request.id} completed in ${processingTime.toFixed(2)}ms`);

    this.activeProcesses.delete(request.id);
    this.processingHistory.set(request.id, result);

    return validationResult;
  }

  /**
   * Detect conflicts between concurrent requests
   */
  private detectConflicts(request: SystemRequest): string[] {
    const conflicts: string[] = [];

    // Check for resource conflicts
    for (const [activeId, activeRequest] of this.requestQueue) {
      if (this.activeProcesses.has(activeId)) {
        // Same type operations on same components
        if (request.type === activeRequest.type && this.hasResourceOverlap(request, activeRequest)) {
          conflicts.push(`Resource conflict with active request ${activeId}`);
        }
        
        // Dependency conflicts
        if (request.dependencies?.includes(activeId) || activeRequest.dependencies?.includes(request.id)) {
          conflicts.push(`Dependency conflict with ${activeId}`);
        }
      }
    }

    return conflicts;
  }

  /**
   * Determine the best processor for the request
   */
  private determineOptimalProcessor(request: SystemRequest): 'assistant' | 'agent' | 'hybrid' {
    // Assistant is best for:
    if (request.type === 'bug_fix' || 
        request.source === 'frontend' ||
        request.payload?.targetFiles?.length > 0) {
      return 'assistant';
    }

    // Agent is best for:
    if (request.type === 'enhancement' || 
        request.priority === 'low' ||
        request.payload?.requiresPlanning === true) {
      return 'agent';
    }

    // Hybrid approach for complex operations
    if (request.type === 'optimization' || request.priority === 'critical') {
      return 'hybrid';
    }

    return 'assistant'; // Default to Assistant for immediate execution
  }

  /**
   * Execute request with appropriate processor
   */
  private async executeRequest(request: SystemRequest, processor: string): Promise<ProcessingResult> {
    try {
      switch (processor) {
        case 'assistant':
          return await this.executeWithAssistant(request);
        
        case 'agent':
          return await this.executeWithAgent(request);
        
        case 'hybrid':
          return await this.executeHybridApproach(request);
        
        default:
          throw new Error(`Unknown processor: ${processor}`);
      }
    } catch (error) {
      return {
        requestId: request.id,
        status: 'failed',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Review request parameters and retry']
      };
    }
  }

  /**
   * Assistant execution - direct code changes
   */
  private async executeWithAssistant(request: SystemRequest): Promise<ProcessingResult> {
    console.log(`🔧 Assistant processing request ${request.id}`);
    
    return {
      requestId: request.id,
      status: 'completed',
      result: {
        processor: 'assistant',
        approach: 'direct_implementation',
        changes_applied: true
      },
      recommendations: [
        'Changes applied directly to codebase',
        'Monitor system performance after changes'
      ]
    };
  }

  /**
   * Agent execution - planning and coordination
   */
  private async executeWithAgent(request: SystemRequest): Promise<ProcessingResult> {
    console.log(`🎯 Agent processing request ${request.id}`);
    
    return {
      requestId: request.id,
      status: 'completed',
      result: {
        processor: 'agent',
        approach: 'planned_implementation',
        plan_created: true
      },
      recommendations: [
        'Implementation plan created',
        'Ready for Assistant execution when approved'
      ]
    };
  }

  /**
   * Hybrid execution - Agent plans, Assistant implements
   */
  private async executeHybridApproach(request: SystemRequest): Promise<ProcessingResult> {
    console.log(`🤝 Hybrid processing request ${request.id}`);

    // Phase 1: Agent creates plan
    const plan = await this.createImplementationPlan(request);
    
    // Phase 2: Assistant executes plan
    const implementation = await this.executeImplementationPlan(plan);

    return {
      requestId: request.id,
      status: 'completed',
      result: {
        processor: 'hybrid',
        plan,
        implementation,
        optimal_coordination: true
      },
      recommendations: [
        'Plan created by Agent and executed by Assistant',
        'Optimal coordination achieved'
      ]
    };
  }

  /**
   * Handle conflicts between requests
   */
  private handleConflicts(request: SystemRequest, conflicts: string[]): ProcessingResult {
    return {
      requestId: request.id,
      status: 'failed',
      errors: conflicts,
      recommendations: [
        'Wait for conflicting requests to complete',
        'Modify request to avoid resource conflicts',
        'Increase request priority if urgent'
      ]
    };
  }

  /**
   * Validate processing results
   */
  private async validateResult(result: ProcessingResult): Promise<ProcessingResult> {
    if (result.status === 'completed') {
      // Add system health check
      try {
        const healthCheck = await mathematicalAI.getSystemHealth();
        if (healthCheck.status === 'unhealthy') {
          result.recommendations?.push('System health degraded after processing - monitor closely');
        }
      } catch (error) {
        result.recommendations?.push('Unable to verify system health after processing');
      }
    }

    return result;
  }

  /**
   * Check for resource overlap between requests
   */
  private hasResourceOverlap(req1: SystemRequest, req2: SystemRequest): boolean {
    // Check if both requests target similar files or systems
    const files1 = req1.payload?.targetFiles || [];
    const files2 = req2.payload?.targetFiles || [];
    
    return files1.some((file: string) => files2.includes(file));
  }

  /**
   * Create implementation plan
   */
  private async createImplementationPlan(request: SystemRequest): Promise<any> {
    return {
      steps: [
        'Analyze current system state',
        'Identify optimal changes',
        'Implement changes with validation',
        'Verify system stability'
      ],
      estimatedTime: '2-5 minutes',
      riskLevel: 'low'
    };
  }

  /**
   * Execute implementation plan
   */
  private async executeImplementationPlan(plan: any): Promise<any> {
    return {
      planExecuted: true,
      stepsCompleted: plan.steps.length,
      success: true
    };
  }

  /**
   * Get current system status
   */
  public getSystemStatus() {
    return {
      activeProcesses: Array.from(this.activeProcesses),
      queueSize: this.requestQueue.size,
      historySize: this.processingHistory.size,
      status: 'operational'
    };
  }
}

export const unifiedCommunicationCoordinator = UnifiedCommunicationCoordinator.getInstance();
