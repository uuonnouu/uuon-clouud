import { z, ZodSchema, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// Declare augmentation for typed request
declare global {
  namespace Express {
    interface Request {
      validatedData?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

/**
 * Validation middleware factory
 * Validates request body, query, and params against a Zod schema
 * Schema structure: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
export function validateRequest(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationSchema = z.object({
      body: schema.body || z.unknown(),
      query: schema.query || z.unknown(),
      params: schema.params || z.unknown(),
    });

    try {
      const validated = validationSchema.parse({
        body: req.body || {},
        query: req.query || {},
        params: req.params || {},
      });

      // Store validated data on request
      req.validatedData = validated;
      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            path: e.path.join('.') || 'root',
            message: e.message,
            code: e.code,
          })),
          timestamp: new Date().toISOString(),
        });
      }

      // Non-Zod validation error
      return res.status(400).json({
        error: 'Validation error',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Quick validation for single schemas
 * Use this for one-off validations, prefer middleware for routes
 */
export async function validateData<T>(
  data: unknown,
  schema: ZodSchema
): Promise<{ valid: true; data: T } | { valid: false; errors: any[] }> {
  try {
    const result = schema.parse(data);
    return { valid: true, data: result as T };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        valid: false,
        errors: error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      };
    }
    return { valid: false, errors: [{ message: 'Unknown validation error' }] };
  }
}
