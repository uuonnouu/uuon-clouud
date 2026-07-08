import { z } from 'zod';

// Message validation
export const createMessageSchema = {
  body: z.object({
    content: z
      .string()
      .min(1, 'Message content cannot be empty')
      .max(50000, 'Message content cannot exceed 50000 characters')
      .trim(),
  }),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Conversation ID must be a number'),
  }),
};

// API reason schema (public API)
export const reasonSchema = {
  body: z.object({
    input: z
      .string()
      .min(1, 'Input cannot be empty')
      .max(10000, 'Input cannot exceed 10000 characters')
      .trim(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Conversation ID in params
export const conversationIdParamSchema = {
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Conversation ID must be a number'),
  }),
};

// Fingerprint registration
export const fingerprintSchema = {
  body: z.object({
    components: z.record(z.any()).refine(
      (obj) => Object.keys(obj).length > 0,
      'Fingerprint components cannot be empty'
    ),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Upload with file
export const uploadSchema = {
  body: z.object({}).strict(), // File is multipart, not in body
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// URL scrape
export const scrapeSchema = {
  body: z.object({
    url: z
      .string()
      .url('Invalid URL format')
      .max(2048, 'URL cannot exceed 2048 characters'),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Creator profile entry
export const creatorProfileSchema = {
  body: z.object({
    key: z
      .string()
      .min(1, 'Key cannot be empty')
      .max(256, 'Key cannot exceed 256 characters')
      .regex(/^[A-Z0-9_]+$/, 'Key must contain only uppercase letters, numbers, and underscores'),
    value: z
      .string()
      .min(1, 'Value cannot be empty')
      .max(10000, 'Value cannot exceed 10000 characters'),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Discovery creation
export const discoverySchema = {
  body: z.object({
    category: z
      .enum(['PATTERN', 'TOOL', 'LINK', 'HISTORICAL', 'TECHNICAL', 'PRINCIPLE', 'CONNECTION'])
      .refine((cat) => cat, 'Invalid discovery category'),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    content: z
      .string()
      .min(10, 'Content must be at least 10 characters')
      .max(5000, 'Content cannot exceed 5000 characters'),
    source: z
      .string()
      .max(500, 'Source cannot exceed 500 characters')
      .optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Feedback submission
export const feedbackSchema = {
  body: z.object({
    messageId: z.number().int('Message ID must be an integer'),
    conversationId: z.number().int('Conversation ID must be an integer'),
    response: z.enum(['helped', 'partial', 'missed']),
    saScore: z.number().int().min(0).max(100).optional(),
    hash: z.string().max(256).optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Backup run
export const backupSchema = {
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// GitHub push
export const githubPushSchema = {
  body: z.object({
    owner: z.string().min(1, 'Owner cannot be empty').max(100),
    repo: z.string().min(1, 'Repo cannot be empty').max(100),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Pattern claim
export const patternClaimSchema = {
  body: z.object({
    category: z
      .enum([
        'MATHEMATICAL',
        'LINGUISTIC',
        'PHYSICAL',
        'STRUCTURAL',
        'CIPHER',
        'GEOMETRIC',
        'CONCEPTUAL',
        'BIOLOGICAL',
        'HARMONIC',
        'PERCEPTUAL',
        'CUSTOM',
      ])
      .refine((cat) => cat, 'Invalid pattern category'),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description cannot exceed 5000 characters'),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// Dmension shape send
export const dmensionShapeSchema = {
  body: z.object({
    shapeType: z.string().min(1, 'Shape type is required').max(100),
    parameters: z.record(z.any()).refine(
      (obj) => Object.keys(obj).length > 0,
      'Parameters cannot be empty'
    ),
    physicsCategory: z
      .enum(['quantum', 'wave', 'relativity', 'topology', 'molecular', 'tensor', 'collision', 'galaxy', 'therapeutic'])
      .optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};

// UInVerse ingest
export const uinverseIngestSchema = {
  body: z.object({
    content: z.string().min(100, 'Content must be at least 100 characters').max(1000000),
    source: z.enum(['chatgpt', 'claude', 'other']),
    filename: z.string().max(256).optional(),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
};
