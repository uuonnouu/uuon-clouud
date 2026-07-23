import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, Users, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { SurfaceParameters } from '../types/math';

interface CollaborativeSession {
  id: string;
  name: string;
  description: string;
  parameters: SurfaceParameters;
  createdAt: string;
  lastModified: string;
  sharedWith: string[];
  isPublic: boolean;
  viewCount: number;
}

interface CollaborativeSharingProps {
  currentParameters: SurfaceParameters;
  onLoadSession: (parameters: SurfaceParameters) => void;
}

export default function CollaborativeSharing({
  currentParameters,
  onLoadSession
}: CollaborativeSharingProps) {
  const [sessions, setSessions] = useState<CollaborativeSession[]>([]);
  const [shareUrl, setShareUrl] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate unique session ID
  const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  // Create shareable session
  const createShareableSession = async () => {
    if (!sessionName.trim()) {
      toast.error('Please enter a session name');
      return;
    }

    setIsSharing(true);
    
    try {
      const sessionId = generateSessionId();
      const newSession: CollaborativeSession = {
        id: sessionId,
        name: sessionName,
        description: sessionDescription,
        parameters: currentParameters,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        sharedWith: [],
        isPublic: true,
        viewCount: 0
      };

      // Save to localStorage (in production, this would be sent to a server)
      const existingSessions = JSON.parse(localStorage.getItem('uuon-shared-sessions') || '[]');
      existingSessions.push(newSession);
      localStorage.setItem('uuon-shared-sessions', JSON.stringify(existingSessions));

      // Generate shareable URL
      const baseUrl = window.location.origin + window.location.pathname;
      const url = `${baseUrl}?session=${sessionId}`;
      setShareUrl(url);

      // Update sessions list
      setSessions(existingSessions);
      
      toast.success('Session created and ready to share!');
      
      // Clear form
      setSessionName('');
      setSessionDescription('');
    } catch (error) {
      toast.error('Failed to create shareable session');
      console.error('Share creation error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Copy share URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  // Load shared session
  const loadSharedSession = (session: CollaborativeSession) => {
    onLoadSession(session.parameters);
    
    // Update view count
    const existingSessions = JSON.parse(localStorage.getItem('uuon-shared-sessions') || '[]');
    const updatedSessions = existingSessions.map((s: CollaborativeSession) =>
      s.id === session.id ? { ...s, viewCount: s.viewCount + 1 } : s
    );
    localStorage.setItem('uuon-shared-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    
    toast.success(`Loaded: ${session.name}`);
  };

  // Export session data
  const exportSession = (session: CollaborativeSession) => {
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.name.replace(/\s+/g, '_')}_session.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('Session exported!');
  };

  // Load sessions on component mount
  useEffect(() => {
    // Migrate old localStorage key to UUON format
    const oldSessions = localStorage.getItem('sharedSessions');
    if (oldSessions) {
      localStorage.setItem('uuon-shared-sessions', oldSessions);
      localStorage.removeItem('sharedSessions');
    }
    
    const loadSessions = () => {
      const existingSessions = JSON.parse(localStorage.getItem('uuon-shared-sessions') || '[]');
      setSessions(existingSessions);
    };

    loadSessions();

    // Check for session parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
      const existingSessions = JSON.parse(localStorage.getItem('uuon-shared-sessions') || '[]');
      const session = existingSessions.find((s: CollaborativeSession) => s.id === sessionId);
      
      if (session) {
        loadSharedSession(session);
        // Clean URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        toast.error('Session not found');
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Create New Share */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Current Visualization
          </CardTitle>
          <CardDescription>
            Create a shareable link for your current mathematical visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <Input
              id="session-name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Hyperbolic Pentagon Study"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="session-description">Description (Optional)</Label>
            <Input
              id="session-description"
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              placeholder="Brief description of the visualization"
            />
          </div>

          <Button 
            onClick={createShareableSession} 
            disabled={isSharing || !sessionName.trim()}
            className="w-full"
          >
            {isSharing ? 'Creating...' : 'Create Shareable Link'}
          </Button>

          {shareUrl && (
            <div className="space-y-2">
              <Label>Shareable URL</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shared Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Shared Sessions
          </CardTitle>
          <CardDescription>
            Browse and load previously shared mathematical visualizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No shared sessions yet. Create your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{session.name}</h4>
                      {session.description && (
                        <p className="text-sm text-gray-600">{session.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Shape: {session.parameters.type}</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {session.viewCount}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadSharedSession(session)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `${window.location.origin}${window.location.pathname}?session=${session.id}`;
                          copyToClipboard(url);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportSession(session)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                    {session.lastModified !== session.createdAt && (
                      <span> • Modified: {new Date(session.lastModified).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}