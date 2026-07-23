
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Share2, Download, Globe, Star } from 'lucide-react';

interface ViralWebPresenceProps {
  currentParameters?: any;
  onShare?: () => void;
  onDownload?: () => void;
}

function ViralWebPresence({ 
  currentParameters, 
  onShare, 
  onDownload 
}: ViralWebPresenceProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Viral Web Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onShare}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Creation
            </Button>
            
            <Button
              onClick={onDownload}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Media
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Viral Potential:</span>
              <Badge className="bg-orange-500">
                <Star className="w-3 h-3 mr-1" />
                HIGH
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Social Reach:</span>
              <Badge className="bg-purple-500">GLOBAL</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Educational Impact:</span>
              <Badge className="bg-green-500">MAXIMUM</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViralWebPresence;
