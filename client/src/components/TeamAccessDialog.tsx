/**
 * TEAM ACCESS DIALOG
 * Password protection modal for proprietary shapes
 * 
 * Displays when user attempts to access protected shapes.
 * Requires team password for authentication.
 * 
 * @author UUON Foundation Inc.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, AlertTriangle } from 'lucide-react';
import { verifyTeamPassword, onAuthenticationComplete } from '@/lib/shapeAccessControl';

interface TeamAccessDialogProps {
  onAccessGranted?: () => void;
  onAccessDenied?: () => void;
}

export function TeamAccessDialog({ onAccessGranted, onAccessDenied }: TeamAccessDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shapeInfo, setShapeInfo] = useState<{ shapeId: string; reason: string } | null>(null);

  const handleAccessRequired = useCallback((event: CustomEvent) => {
    setShapeInfo(event.detail);
    setIsOpen(true);
    setError('');
    setPassword('');
  }, []);

  useEffect(() => {
    window.addEventListener('shape-access-required', handleAccessRequired as EventListener);
    return () => {
      window.removeEventListener('shape-access-required', handleAccessRequired as EventListener);
    };
  }, [handleAccessRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter the team password');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const success = await verifyTeamPassword(password);
      
      if (success) {
        setIsOpen(false);
        onAuthenticationComplete(true);
        onAccessGranted?.();
      } else {
        setError('Invalid team password. Access denied.');
        onAuthenticationComplete(false);
        onAccessDenied?.();
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      onAuthenticationComplete(false);
    } finally {
      setIsVerifying(false);
      setPassword('');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    onAuthenticationComplete(false);
    onAccessDenied?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md bg-black/95 border-red-500/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <Shield className="w-5 h-5" />
            Protected Shape - Team Access Required
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This shape contains proprietary UUON Foundation intellectual property.
          </DialogDescription>
        </DialogHeader>

        {shapeInfo && (
          <Alert variant="destructive" className="bg-red-950/50 border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-300 text-sm">
              <strong>{shapeInfo.shapeId}</strong>
              <br />
              {shapeInfo.reason}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-password" className="text-gray-300">
              Team Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="team-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter team password"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                autoFocus
                disabled={isVerifying}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-950/30 border-red-500/30">
              <AlertDescription className="text-red-400 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Authenticate'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-2">
          Access will be granted for 30 minutes after successful authentication.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default TeamAccessDialog;
