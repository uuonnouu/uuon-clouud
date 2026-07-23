
#!/usr/bin/env node

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function cleanupDatabase() {
  console.log('🗃️ Starting database cleanup...');
  
  try {
    // Remove duplicate shapes (keep latest)
    await sql`
      DELETE FROM shapes s1 
      WHERE s1.id < (
        SELECT MAX(s2.id) 
        FROM shapes s2 
        WHERE s1.name = s2.name
      )
    `;
    
    // Clean up old algorithm cache entries (older than 30 days)
    await sql`
      DELETE FROM algorithm_cache 
      WHERE created_at < NOW() - INTERVAL '30 days'
    `;
    
    // Update statistics
    await sql`ANALYZE`;
    
    console.log('✅ Database cleanup completed');
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDatabase();
}

export { cleanupDatabase };
