
import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql, count } from 'drizzle-orm';
import { 
  formula_implementations, 
  shape_tokens, 
  mathematical_constants,
} from '../../shared/schema';

const router = Router();
const connectionString = process.env.DATABASE_URL!;
const neonSql = neon(connectionString);
const db = drizzle(neonSql);

/**
 * Comprehensive database diagnostics
 */
router.get('/diagnostics', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Parallel health checks
    const [
      connectionTest,
      tableStats,
      indexHealth,
      queryPerformance
    ] = await Promise.all([
      // Basic connection test
      db.execute(sql`SELECT 1 as status, current_database() as db_name, version() as pg_version`),
      
      // Table statistics
      Promise.all([
        db.select({ count: count() }).from(formula_implementations),
        db.select({ count: count() }).from(shape_tokens),
        db.select({ count: count() }).from(mathematical_constants),
      ]),
      
      // Index health check
      db.execute(sql`
        SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
        FROM pg_stat_user_indexes 
        WHERE idx_tup_read > 0 
        ORDER BY idx_tup_read DESC 
        LIMIT 10
      `),
      
      // Query performance
      db.execute(sql`
        SELECT query, calls, total_time, mean_time
        FROM pg_stat_statements 
        WHERE query LIKE '%formula_implementations%' OR query LIKE '%shape_tokens%'
        ORDER BY total_time DESC 
        LIMIT 5
      `).catch(() => []) // pg_stat_statements might not be enabled
    ]);

    const totalTime = Date.now() - startTime;
    
    const diagnostics = {
      connection: {
        status: 'healthy',
        database: connectionTest[0]?.db_name,
        version: connectionTest[0]?.pg_version,
        responseTime: `${totalTime}ms`
      },
      tables: {
        formula_implementations: tableStats[0][0]?.count || 0,
        shape_tokens: tableStats[1][0]?.count || 0,
        mathematical_constants: tableStats[2][0]?.count || 0,
      },
      performance: {
        totalDiagnosticsTime: totalTime,
        indexesActive: indexHealth.length,
        queryStatsAvailable: queryPerformance.length > 0
      },
      recommendations: []
    };

    // Generate recommendations
    if (totalTime > 1000) {
      diagnostics.recommendations.push('Database response time is slow - consider connection pooling optimization');
    }
    
    if (indexHealth.length === 0) {
      diagnostics.recommendations.push('No active index usage detected - verify indexes are being used');
    }

    if (diagnostics.tables.shape_tokens === 0) {
      diagnostics.recommendations.push('Shape tokens table is empty - token generation may not be working');
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      diagnostics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database diagnostics failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Database optimization suggestions
 */
router.get('/optimization-suggestions', async (req: Request, res: Response) => {
  try {
    // Check for missing indexes
    const slowQueries = await db.execute(sql`
      SELECT schemaname, tablename, attname, n_distinct, correlation
      FROM pg_stats 
      WHERE schemaname = 'public' 
      AND n_distinct > 100
      ORDER BY n_distinct DESC
      LIMIT 10
    `).catch(() => []);

    // Check table sizes
    const tableSizes = await db.execute(sql`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `).catch(() => []);

    const suggestions = {
      indexing: slowQueries.length > 0 ? 
        'Consider adding indexes on high-cardinality columns' : 
        'Index usage appears optimal',
      
      storage: tableSizes.length > 0 ? 
        `Largest table: ${tableSizes[0]?.tablename} (${tableSizes[0]?.size})` :
        'Storage analysis unavailable',
        
      performance: 'Monitor query execution times and optimize slow queries',
      
      maintenance: [
        'Run ANALYZE periodically to update statistics',
        'Consider VACUUM for space reclamation',
        'Monitor connection pool usage'
      ]
    };

    res.json({
      success: true,
      suggestions,
      tableStats: tableSizes.slice(0, 5),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Optimization analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as databaseDiagnosticsRoutes };
