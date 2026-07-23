
/**
 * AGENT SYSTEM INDEX
 * Centralized exports for all SDK governance agents
 */

export { architecturePlatformAgent, ArchitecturePlatformAgent } from './architectureAgent';
export { dataGovernanceAgent, DataGovernanceAgent } from './dataGovernanceAgent';  
export { buildPackagingAgent, BuildPackagingAgent } from './buildPackagingAgent';
export { observabilityAgent, ObservabilityAgent } from './observabilityAgent';

// Agent coordination
export { agentCoordinationRoutes } from '../routes/agent-coordination';

// Agent status summary
export const getAgentSystemStatus = () => {
  return {
    architecture: {
      agent: 'ArchitecturePlatformAgent',
      status: 'active',
      description: 'Controls SDK structure and evolution'
    },
    dataGovernance: {
      agent: 'DataGovernanceAgent', 
      status: 'active',
      description: 'Manages storage policies and data retention'
    },
    buildPackaging: {
      agent: 'BuildPackagingAgent',
      status: 'active', 
      description: 'Handles SDK bundling and distribution'
    },
    observability: {
      agent: 'ObservabilityAgent',
      status: 'active',
      description: 'Monitors health and validates operations'
    }
  };
};

console.log(`
🤖 SDK GOVERNANCE AGENTS INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Architecture Platform Agent - SDK structure control
✅ Data Governance Agent - Storage & retention policies  
✅ Build Packaging Agent - Distribution management
✅ Observability Agent - Health monitoring & validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Agent coordination available at /api/agents/*
`);
