/**
 * PHASE 6: Custom Sensor Control & Human-Bot Verification
 * 
 * Proprietary human authentication via behavioral fingerprinting + challenge-response.
 * No external dependencies (vHAP-SIM) — fully proprietary implementation.
 */

import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// ============================================================================
// 1. SENSOR INPUT LAYER
// ============================================================================

export interface SensorInput {
  timestamp: number;
  deviceId: string; // Physical controller identifier
  sensorType: 'scroll' | 'mouse' | 'keyboard' | 'touch' | 'controller'; // Input type
  value: number; // Raw sensor value (0-255, angle, pressure, etc.)
  velocity: number; // Rate of change
  acceleration: number; // Rate of acceleration
  pressure?: number; // For touch/haptic devices
  orientation?: { x: number; y: number; z: number }; // 3D orientation if available
}

export interface SensorSession {
  sessionId: string;
  deviceId: string;
  humanScore: number; // 0-100, higher = more likely human
  botScore: number; // 0-100, higher = more likely bot
  lastSensorTime: number;
  sensorHistory: SensorInput[];
  behaviorFlags: string[]; // ["suspicious_timing", "bot_pattern", etc.]
  verified: boolean;
  verifiedAt?: number;
}

const activeSessions = new Map<string, SensorSession>();
const HISTORY_LIMIT = 100; // Keep last 100 sensor readings per session

/**
 * Register a new sensor session from physical controller
 */
export function initializeSensorSession(deviceId: string): SensorSession {
  const sessionId = crypto.randomUUID();
  const session: SensorSession = {
    sessionId,
    deviceId,
    humanScore: 50, // Start neutral
    botScore: 50,
    lastSensorTime: Date.now(),
    sensorHistory: [],
    behaviorFlags: [],
    verified: false,
  };

  activeSessions.set(sessionId, session);
  return session;
}

/**
 * Process raw sensor input and update session
 */
export function processSensorInput(sessionId: string, input: SensorInput): SensorSession | null {
  const session = activeSessions.get(sessionId);
  if (!session) {
    console.warn(`Session ${sessionId} not found`);
    return null;
  }

  // Add to history
  session.sensorHistory.push(input);
  if (session.sensorHistory.length > HISTORY_LIMIT) {
    session.sensorHistory.shift();
  }

  session.lastSensorTime = input.timestamp;

  // Analyze behavior
  analyzeBehavior(session);

  return session;
}

/**
 * Get session by ID
 */
export function getSession(sessionId: string): SensorSession | null {
  return activeSessions.get(sessionId) || null;
}

/**
 * Verify session (confirm human after challenges passed)
 */
export function verifySession(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return false;

  session.verified = true;
  session.verifiedAt = Date.now();
  return true;
}

// ============================================================================
// 2. BEHAVIORAL FINGERPRINTING ENGINE
// ============================================================================

/**
 * Analyze sensor input patterns to differentiate human vs bot
 */
function analyzeBehavior(session: SensorSession): void {
  if (session.sensorHistory.length < 3) return; // Need baseline

  const history = session.sensorHistory;
  const recent = history.slice(-10); // Last 10 inputs

  let humanIndicators = 0;
  let botIndicators = 0;

  // Indicator 1: Timing variance (humans have jitter, bots are precise)
  const timingDeltas = getTimingDeltas(recent);
  const timingVariance = calculateVariance(timingDeltas);
  if (timingVariance > 30) {
    // Natural human jitter
    humanIndicators++;
  } else if (timingVariance < 5) {
    // Too precise = bot
    botIndicators += 2;
  }

  // Indicator 2: Velocity smoothness
  const velocities = recent.map(r => r.velocity);
  const velocityVariance = calculateVariance(velocities);
  if (velocityVariance > 20 && velocityVariance < 100) {
    // Natural variation
    humanIndicators++;
  } else if (velocityVariance < 5) {
    // Constant velocity = bot
    botIndicators += 2;
  }

  // Indicator 3: Acceleration patterns
  const accelerations = recent.map(r => r.acceleration);
  const hasAcceleration = accelerations.some(a => Math.abs(a) > 10);
  if (hasAcceleration) {
    // Real acceleration changes = human
    humanIndicators++;
  } else {
    // Perfectly linear = bot
    botIndicators++;
  }

  // Indicator 4: Value entropy (randomness)
  const values = recent.map(r => r.value);
  const entropy = calculateEntropy(values);
  if (entropy > 3) {
    // High entropy = human variety
    humanIndicators++;
  } else if (entropy < 1) {
    // Low entropy = repetitive bot
    botIndicators += 2;
  }

  // Indicator 5: Pause patterns (humans take breaks)
  const pauses = getPauseDurations(recent);
  if (pauses.some(p => p > 100 && p < 2000)) {
    // Natural thinking pauses
    humanIndicators++;
  }

  // Indicator 6: Pressure sensitivity (if available)
  const pressures = recent
    .filter(r => r.pressure !== undefined)
    .map(r => r.pressure!);
  if (pressures.length > 0) {
    const pressureVar = calculateVariance(pressures);
    if (pressureVar > 5) {
      // Humans apply varying pressure
      humanIndicators++;
    } else if (pressureVar === 0) {
      // Constant pressure = bot
      botIndicators += 2;
    }
  }

  // Indicator 7: Suspicious patterns
  checkSuspiciousPatterns(session);

  // Calculate scores
  const totalIndicators = humanIndicators + botIndicators;
  if (totalIndicators > 0) {
    session.humanScore = (humanIndicators / totalIndicators) * 100;
    session.botScore = (botIndicators / totalIndicators) * 100;
  }
}

/**
 * Get time deltas between consecutive inputs (milliseconds)
 */
function getTimingDeltas(inputs: SensorInput[]): number[] {
  const deltas: number[] = [];
  for (let i = 1; i < inputs.length; i++) {
    deltas.push(inputs[i].timestamp - inputs[i - 1].timestamp);
  }
  return deltas;
}

/**
 * Calculate variance of array
 */
function calculateVariance(arr: number[]): number {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance); // Return standard deviation
}

/**
 * Calculate Shannon entropy (measure of randomness)
 */
function calculateEntropy(arr: number[]): number {
  if (arr.length === 0) return 0;

  // Quantize to buckets
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const buckets = 10;
  const range = max - min || 1;

  const histogram: { [key: number]: number } = {};
  for (const val of arr) {
    const bucket = Math.floor(((val - min) / range) * (buckets - 1));
    histogram[bucket] = (histogram[bucket] || 0) + 1;
  }

  // Calculate entropy
  let entropy = 0;
  for (const count of Object.values(histogram)) {
    const p = count / arr.length;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Get pause durations (gaps between inputs)
 */
function getPauseDurations(inputs: SensorInput[]): number[] {
  const pauses: number[] = [];
  for (let i = 1; i < inputs.length; i++) {
    const gap = inputs[i].timestamp - inputs[i - 1].timestamp;
    if (gap > 50) {
      // Consider gap > 50ms as a pause
      pauses.push(gap);
    }
  }
  return pauses;
}

/**
 * Check for known bot patterns
 */
function checkSuspiciousPatterns(session: SensorSession): void {
  const history = session.sensorHistory;
  session.behaviorFlags = [];

  // Pattern 1: Identical sequences (bot repetition)
  const lastFive = history.slice(-5).map(h => h.value);
  const checkFour = history.slice(-4).map(h => h.value);
  if (JSON.stringify(lastFive) === JSON.stringify(lastFive.slice(0, -1).concat([lastFive[0]]))) {
    session.behaviorFlags.push('identical_pattern');
  }

  // Pattern 2: Perfect linearity (bot progression)
  if (history.length >= 5) {
    const recent = history.slice(-5);
    let isLinear = true;
    for (let i = 1; i < recent.length - 1; i++) {
      const expected = recent[i - 1].value + (recent[i].value - recent[i - 1].value);
      if (Math.abs(recent[i + 1].value - expected) > 5) {
        isLinear = false;
        break;
      }
    }
    if (isLinear) {
      session.behaviorFlags.push('linear_progression');
    }
  }

  // Pattern 3: Impossibly fast input (bot speed)
  const timingDeltas = getTimingDeltas(history.slice(-10));
  if (timingDeltas.some(d => d < 5)) {
    session.behaviorFlags.push('superhuman_speed');
  }

  // Pattern 4: Exactly uniform timing (bot precision)
  if (timingDeltas.length > 3) {
    const variance = calculateVariance(timingDeltas);
    if (variance === 0) {
      session.behaviorFlags.push('perfect_timing');
    }
  }
}

// ============================================================================
// 3. CHALLENGE-RESPONSE PROTOCOL
// ============================================================================

export interface Challenge {
  id: string;
  type: 'timing' | 'gesture' | 'entropy' | 'pressure';
  prompt: string;
  expectedPattern: string; // What to look for in response
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  createdAt: number;
  timeoutMs: number;
  passed: boolean;
}

const activeChallenges = new Map<string, Challenge>();

/**
 * Generate a challenge that only humans can pass
 */
export function generateChallenge(sessionId: string, difficulty: 1 | 2 | 3 = 1): Challenge {
  const challengeTypes: Array<'timing' | 'gesture' | 'entropy' | 'pressure'> = [
    'timing',
    'gesture',
    'entropy',
    'pressure',
  ];
  const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];

  let prompt = '';
  let expectedPattern = '';
  let timeoutMs = 5000;

  switch (type) {
    case 'timing':
      // User must wait 1-2 seconds between inputs (bots go too fast)
      prompt = 'Wait 1-2 seconds, then input a value';
      expectedPattern = 'timing_delay_1000_2000';
      timeoutMs = 5000;
      break;

    case 'gesture':
      // User must perform a specific gesture (e.g., double-tap)
      prompt = 'Double-tap the scroll wheel';
      expectedPattern = 'double_tap_pattern';
      timeoutMs = 3000;
      break;

    case 'entropy':
      // User must input random values (bots are predictable)
      prompt = 'Input 5 random values quickly';
      expectedPattern = 'entropy_threshold_3.5';
      timeoutMs = 3000;
      break;

    case 'pressure':
      // User must vary pressure (physical controllers only)
      prompt = 'Apply varying pressure to the sensor';
      expectedPattern = 'pressure_variance_threshold_5';
      timeoutMs = 4000;
      break;
  }

  const challenge: Challenge = {
    id: crypto.randomUUID(),
    type,
    prompt,
    expectedPattern,
    difficulty,
    createdAt: Date.now(),
    timeoutMs,
    passed: false,
  };

  activeChallenges.set(challenge.id, challenge);

  return challenge;
}

/**
 * Validate user's response to challenge
 */
export function validateChallengeResponse(
  sessionId: string,
  challengeId: string,
  inputs: SensorInput[]
): boolean {
  const challenge = activeChallenges.get(challengeId);
  if (!challenge) return false;

  const session = activeSessions.get(sessionId);
  if (!session) return false;

  // Check timeout
  if (Date.now() - challenge.createdAt > challenge.timeoutMs) {
    challenge.passed = false;
    return false;
  }

  // Validate based on challenge type
  let passed = false;

  switch (challenge.type) {
    case 'timing': {
      // Check for 1-2 second delay in inputs
      const deltas = getTimingDeltas(inputs);
      passed = deltas.some(d => d >= 1000 && d <= 2000);
      break;
    }

    case 'gesture': {
      // Check for double-tap (two rapid inputs ~200-400ms apart)
      const deltas = getTimingDeltas(inputs);
      passed = deltas.some(d => d >= 100 && d <= 400);
      break;
    }

    case 'entropy': {
      // Check for sufficient randomness in input sequence
      const values = inputs.map(i => i.value);
      const entropy = calculateEntropy(values);
      passed = entropy > 3.5;
      break;
    }

    case 'pressure': {
      // Check for pressure variation
      const pressures = inputs
        .filter(i => i.pressure !== undefined)
        .map(i => i.pressure!);
      if (pressures.length > 0) {
        const variance = calculateVariance(pressures);
        passed = variance > 5;
      }
      break;
    }
  }

  challenge.passed = passed;
  if (passed) {
    session.verified = true;
    session.verifiedAt = Date.now();
  }

  return passed;
}

// ============================================================================
// 4. EXPRESS MIDDLEWARE
// ============================================================================

/**
 * Middleware: Attach sensor session to request
 */
export function sensorSessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const sessionId = req.headers['x-sensor-session'] as string;

  if (sessionId) {
    const session = activeSessions.get(sessionId);
    if (session) {
      (req as any).sensorSession = session;
      (req as any).humanScore = session.humanScore;
      (req as any).verified = session.verified;
    }
  }

  next();
}

/**
 * Middleware: Require human verification for sensitive endpoints
 */
export function requireHumanVerification(req: Request, res: Response, next: NextFunction): void {
  const session = (req as any).sensorSession;

  if (!session) {
    return res.status(401).json({ error: 'No sensor session', code: 'NO_SESSION' });
  }

  if (!session.verified) {
    return res.status(403).json({ error: 'Human verification required', code: 'NOT_VERIFIED' });
  }

  if (session.humanScore < 60) {
    return res.status(403).json({ error: 'Bot score too high', code: 'BOT_DETECTED' });
  }

  next();
}

// ============================================================================
// 5. API ENDPOINTS
// ============================================================================

export function registerSensorRoutes(app: any): void {
  /**
   * POST /api/sensor/session/init
   * Initialize a new sensor session
   */
  app.post('/api/sensor/session/init', (req: Request, res: Response) => {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId required' });
    }

    const session = initializeSensorSession(deviceId);
    res.json({
      sessionId: session.sessionId,
      message: 'Session initialized',
    });
  });

  /**
   * POST /api/sensor/input
   * Process sensor input from physical device
   */
  app.post('/api/sensor/input', (req: Request, res: Response) => {
    const { sessionId, input } = req.body;

    if (!sessionId || !input) {
      return res.status(400).json({ error: 'sessionId and input required' });
    }

    const session = processSensorInput(sessionId, input);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      humanScore: session.humanScore,
      botScore: session.botScore,
      verified: session.verified,
      flags: session.behaviorFlags,
    });
  });

  /**
   * GET /api/sensor/session/:sessionId
   * Get session status and scores
   */
  app.get('/api/sensor/session/:sessionId', (req: Request, res: Response) => {
    const session = getSession(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.sessionId,
      humanScore: session.humanScore,
      botScore: session.botScore,
      verified: session.verified,
      behaviorFlags: session.behaviorFlags,
      inputCount: session.sensorHistory.length,
    });
  });

  /**
   * POST /api/sensor/challenge
   * Generate a challenge for human verification
   */
  app.post('/api/sensor/challenge', (req: Request, res: Response) => {
    const { sessionId, difficulty } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required' });
    }

    const challenge = generateChallenge(sessionId, difficulty || 1);

    res.json({
      challengeId: challenge.id,
      type: challenge.type,
      prompt: challenge.prompt,
      timeoutMs: challenge.timeoutMs,
    });
  });

  /**
   * POST /api/sensor/challenge/:challengeId/validate
   * Validate response to challenge
   */
  app.post('/api/sensor/challenge/:challengeId/validate', (req: Request, res: Response) => {
    const { sessionId, inputs } = req.body;
    const { challengeId } = req.params;

    if (!sessionId || !inputs) {
      return res.status(400).json({ error: 'sessionId and inputs required' });
    }

    const passed = validateChallengeResponse(sessionId, challengeId, inputs);

    res.json({
      passed,
      message: passed ? 'Challenge passed - human verified' : 'Challenge failed',
    });
  });

  /**
   * GET /api/sensor/stats
   * Get aggregate statistics
   */
  app.get('/api/sensor/stats', (req: Request, res: Response) => {
    const sessions = Array.from(activeSessions.values());
    const avgHumanScore =
      sessions.reduce((sum, s) => sum + s.humanScore, 0) / Math.max(sessions.length, 1);
    const verifiedCount = sessions.filter(s => s.verified).length;

    res.json({
      totalSessions: sessions.length,
      verifiedSessions: verifiedCount,
      averageHumanScore: avgHumanScore.toFixed(1),
      activeChallenges: activeChallenges.size,
    });
  });
}
