import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export interface AuditLogEntry {
  timestamp: string;
  method: string;
  path: string;
  query?: Record<string, any>;
  userId?: string;
  statusCode: number;
  duration: number;
  ip: string;
  userAgent?: string;
  referrer?: string;
  requestSize?: number;
  responseSize?: number;
  error?: string;
}

/**
 * Audit logging middleware
 * Logs all API requests with metadata
 */
export function auditLogMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const startHrTime = process.hrtime();

  // Capture request metadata
  const method = req.method;
  const path = req.path;
  const query = Object.keys(req.query).length > 0 ? req.query : undefined;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'];
  const referrer = req.headers['referer'];
  const requestSize = parseInt(req.headers['content-length'] || '0', 10);

  // Capture response metadata
  let responseSize = 0;
  const originalResJson = res.json;

  res.json = function (body: any, ...args: any[]) {
    responseSize = JSON.stringify(body).length;
    return originalResJson.apply(res, [body, ...args]);
  };

  // Emit 'finish' event to log after response is sent
  res.on('finish', async () => {
    try {
      const hrTime = process.hrtime(startHrTime);
      const duration = (hrTime[0] * 1000 + hrTime[1] / 1000000); // Convert to milliseconds

      const auditEntry: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        method,
        path,
        query,
        userId: (req as any).userId,
        statusCode: res.statusCode,
        duration: Math.round(duration),
        ip,
        userAgent,
        referrer,
        requestSize,
        responseSize,
        error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
      };

      // Log sensitive operations and errors
      if (shouldLogEntry(auditEntry)) {
        await logAuditEntry(auditEntry);
      }
    } catch (error) {
      console.error('[AUDIT] Error logging entry:', error);
    }
  });

  next();
}

/**
 * Determine if an audit entry should be logged
 */
function shouldLogEntry(entry: AuditLogEntry): boolean {
  const { method, path, statusCode } = entry;

  // Always log authentication operations
  if (path.includes('/auth/')) return true;

  // Always log errors
  if (statusCode >= 400) return true;

  // Always log mutations (POST, PUT, PATCH, DELETE)
  if (method !== 'GET' && method !== 'OPTIONS') return true;

  // Always log admin endpoints
  if (path.includes('/admin/') || path.includes('/system/')) return true;

  // Log specific API operations
  const significantPaths = [
    '/api/conversations',
    '/api/discoveries',
    '/api/feedback',
    '/api/backup',
    '/api/github',
    '/api/upload',
  ];

  return significantPaths.some(p => path.includes(p));
}

/**
 * Store audit log entry in database
 */
async function logAuditEntry(entry: AuditLogEntry): Promise<void> {
  try {
    // TODO: Implement database storage
    // await storage.createAuditLog(entry);
    
    // For now, log to console
    if (entry.statusCode >= 400) {
      console.warn(`[AUDIT] ${entry.method} ${entry.path} ${entry.statusCode} (${entry.duration}ms) | User: ${entry.userId || 'anonymous'} | IP: ${entry.ip}`);
    } else if (entry.method !== 'GET') {
      console.log(`[AUDIT] ${entry.method} ${entry.path} ${entry.statusCode} (${entry.duration}ms) | User: ${entry.userId || 'anonymous'}`);
    }
  } catch (error) {
    console.error('[AUDIT] Failed to log entry:', error);
  }
}

/**
 * Query audit logs
 */
export async function getAuditLogs(options?: {
  limit?: number;
  offset?: number;
  userId?: string;
  path?: string;
  statusCode?: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<AuditLogEntry[]> {
  try {
    // TODO: Implement database query
    // return await storage.getAuditLogs(options);
    return [];
  } catch (error) {
    console.error('[AUDIT] Error retrieving logs:', error);
    return [];
  }
}

/**
 * Log a custom audit event
 */
export async function logCustomEvent(
  category: string,
  action: string,
  details?: Record<string, any>,
  userId?: string
): Promise<void> {
  try {
    const entry = {
      timestamp: new Date().toISOString(),
      category,
      action,
      details,
      userId,
    };

    console.log(`[AUDIT-EVENT] ${category}/${action}`, details);
    // TODO: Store in database
    // await storage.createCustomAuditEvent(entry);
  } catch (error) {
    console.error('[AUDIT] Error logging custom event:', error);
  }
}

/**
 * Log failed authentication attempt
 */
export async function logAuthFailure(
  email: string,
  reason: string,
  ip: string,
  userAgent?: string
): Promise<void> {
  await logCustomEvent('AUTH', 'FAILED_LOGIN', { email, reason, ip, userAgent });
}

/**
 * Log successful authentication
 */
export async function logAuthSuccess(
  userId: string,
  ip: string,
  userAgent?: string
): Promise<void> {
  await logCustomEvent('AUTH', 'LOGIN_SUCCESS', { userId, ip, userAgent });
}

/**
 * Log security-relevant events
 */
export async function logSecurityEvent(
  eventType: 'RATE_LIMIT' | 'INVALID_TOKEN' | 'CORS_BLOCKED' | 'INJECTION_ATTEMPT' | 'SUSPICIOUS_REQUEST',
  details?: Record<string, any>
): Promise<void> {
  await logCustomEvent('SECURITY', eventType, details);
}
