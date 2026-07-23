
import { promises as fs } from 'fs';
import path from 'path';

interface ChangeEntry {
  timestamp: string;
  version: string;
  category: 'feature' | 'fix' | 'optimization' | 'security' | 'documentation';
  component: string;
  description: string;
  files: string[];
  impact: 'low' | 'medium' | 'high' | 'critical';
  author?: string;
}

class ChangelogTracker {
  private changelogPath = 'CHANGELOG.md';
  private changes: ChangeEntry[] = [];

  constructor() {
    console.log('📝 Changelog Tracker initialized - Automated system change documentation active');
  }

  async logChange(entry: Omit<ChangeEntry, 'timestamp'>): Promise<void> {
    const changeEntry: ChangeEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    this.changes.push(changeEntry);
    await this.updateChangelog(changeEntry);
  }

  async logShapeRegistryChange(action: string, shapes: number, files: string[]): Promise<void> {
    await this.logChange({
      version: this.getCurrentVersion(),
      category: 'optimization',
      component: 'Shape Registry System',
      description: `${action}: ${shapes} shapes affected`,
      files,
      impact: 'medium'
    });
  }

  async logSystemOptimization(component: string, description: string, files: string[]): Promise<void> {
    await this.logChange({
      version: this.getCurrentVersion(),
      category: 'optimization',
      component,
      description,
      files,
      impact: 'medium'
    });
  }

  async logBugFix(component: string, description: string, files: string[]): Promise<void> {
    await this.logChange({
      version: this.getCurrentVersion(),
      category: 'fix',
      component,
      description,
      files,
      impact: 'high'
    });
  }

  async logNewFeature(component: string, description: string, files: string[]): Promise<void> {
    await this.logChange({
      version: this.getCurrentVersion(),
      category: 'feature',
      component,
      description,
      files,
      impact: 'high'
    });
  }

  private getCurrentVersion(): string {
    const date = new Date();
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate()}`;
  }

  private async updateChangelog(entry: ChangeEntry): Promise<void> {
    try {
      let existingChangelog = '';
      try {
        existingChangelog = await fs.readFile(this.changelogPath, 'utf8');
      } catch {
        // File doesn't exist, will create new one
      }

      const versionHeader = `## Version ${entry.version} - ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;

      const changeDescription = this.formatChangeEntry(entry);

      // Check if version section exists
      if (existingChangelog.includes(versionHeader)) {
        // Add to existing version section
        const versionIndex = existingChangelog.indexOf(versionHeader);
        const nextVersionIndex = existingChangelog.indexOf('## Version', versionIndex + 1);
        
        if (nextVersionIndex !== -1) {
          existingChangelog = existingChangelog.slice(0, nextVersionIndex - 1) + 
                             changeDescription + '\n\n' +
                             existingChangelog.slice(nextVersionIndex);
        } else {
          existingChangelog += changeDescription + '\n';
        }
      } else {
        // Create new version section
        const headerIndex = existingChangelog.indexOf('---\n');
        if (headerIndex !== -1) {
          const insertion = `\n${versionHeader}\n\n${changeDescription}\n\n---\n`;
          existingChangelog = existingChangelog.slice(0, headerIndex) + 
                             insertion + 
                             existingChangelog.slice(headerIndex + 5);
        } else {
          existingChangelog = `${versionHeader}\n\n${changeDescription}\n\n---\n\n` + existingChangelog;
        }
      }

      await fs.writeFile(this.changelogPath, existingChangelog, 'utf8');
      
    } catch (error) {
      console.error('❌ Failed to update changelog:', error);
    }
  }

  private formatChangeEntry(entry: ChangeEntry): string {
    const categoryEmoji = {
      feature: '✨',
      fix: '🐛',
      optimization: '⚡',
      security: '🔒',
      documentation: '📝'
    };

    const impactBadge = entry.impact === 'critical' ? ' **[CRITICAL]**' : 
                       entry.impact === 'high' ? ' **[HIGH]**' : '';

    let formatted = `### ${categoryEmoji[entry.category]} ${entry.component}${impactBadge}\n`;
    formatted += `**${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}**: ${entry.description}\n\n`;
    
    if (entry.files.length > 0) {
      formatted += `**Files Modified**:\n`;
      entry.files.forEach(file => {
        formatted += `- \`${file}\`\n`;
      });
      formatted += '\n';
    }

    formatted += `**Timestamp**: ${new Date(entry.timestamp).toLocaleString()}\n`;
    
    return formatted;
  }

  async generateSystemReport(): Promise<{
    totalChanges: number;
    recentChanges: ChangeEntry[];
    categoryBreakdown: Record<string, number>;
    impactAnalysis: Record<string, number>;
  }> {
    const recent = this.changes.slice(-10);
    
    const categoryBreakdown = this.changes.reduce((acc, change) => {
      acc[change.category] = (acc[change.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const impactAnalysis = this.changes.reduce((acc, change) => {
      acc[change.impact] = (acc[change.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalChanges: this.changes.length,
      recentChanges: recent,
      categoryBreakdown,
      impactAnalysis
    };
  }

  async exportChangelogData(): Promise<string> {
    const report = await this.generateSystemReport();
    
    return JSON.stringify({
      metadata: {
        generatedAt: new Date().toISOString(),
        totalTrackedChanges: report.totalChanges
      },
      changes: this.changes,
      analytics: {
        categoryBreakdown: report.categoryBreakdown,
        impactAnalysis: report.impactAnalysis
      }
    }, null, 2);
  }
}

export const changelogTracker = new ChangelogTracker();
