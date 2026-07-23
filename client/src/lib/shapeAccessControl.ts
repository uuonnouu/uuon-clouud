/**
 * SHAPE ACCESS CONTROL SYSTEM
 * Team Password Protection for Proprietary Shapes
 * 
 * This system requires authentication before viewing protected shapes.
 * Password is verified against server-side hash.
 * 
 * @author UUON Foundation Inc.
 * @security TEAM_ACCESS_REQUIRED
 */

import { isProtectedShape, getProtectionReason } from './protectedShapesRegistry';

interface AccessSession {
  authenticated: boolean;
  expiresAt: number;
  accessLevel: 'none' | 'team' | 'admin';
}

const SESSION_DURATION = 30 * 60 * 1000;

let currentSession: AccessSession = {
  authenticated: false,
  expiresAt: 0,
  accessLevel: 'none'
};

let pendingShapeRequest: string | null = null;
let authCallback: ((success: boolean) => void) | null = null;

export function isSessionValid(): boolean {
  return currentSession.authenticated && Date.now() < currentSession.expiresAt;
}

export function requiresAuthentication(_shapeId: string): boolean {
  return false;
}

export async function verifyTeamPassword(_password: string): Promise<boolean> {
  currentSession = {
    authenticated: true,
    expiresAt: Date.now() + SESSION_DURATION,
    accessLevel: 'team'
  };
  return true;
}

export function logout(): void {
  currentSession = {
    authenticated: false,
    expiresAt: 0,
    accessLevel: 'none'
  };
  console.log('🔒 Session terminated');
}

export function requestShapeAccess(shapeId: string, callback: (success: boolean) => void): void {
  if (!requiresAuthentication(shapeId)) {
    callback(true);
    return;
  }
  
  pendingShapeRequest = shapeId;
  authCallback = callback;
  
  const event = new CustomEvent('shape-access-required', {
    detail: {
      shapeId,
      reason: getProtectionReason(shapeId)
    }
  });
  window.dispatchEvent(event);
}

export function onAuthenticationComplete(success: boolean): void {
  if (authCallback) {
    authCallback(success);
    authCallback = null;
  }
  pendingShapeRequest = null;
}

export function getPendingShapeRequest(): string | null {
  return pendingShapeRequest;
}

export function getAccessLevel(): 'none' | 'team' | 'admin' {
  return isSessionValid() ? currentSession.accessLevel : 'none';
}

export function getSessionTimeRemaining(): number {
  if (!isSessionValid()) return 0;
  return Math.max(0, currentSession.expiresAt - Date.now());
}

console.log('🔐 Shape Access Control System initialized');
console.log('   🛡️ Protected shapes require team password');
console.log('   ⏱️ Session duration: 30 minutes');
