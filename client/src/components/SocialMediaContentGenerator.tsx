
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Share2, Copy, Video } from 'lucide-react';

interface ContentTemplate {
  platform: string;
  type: string;
  title: string;
  content: string;
  hashtags: string[];
  duration?: string;
  hooks: string[];
}

const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    platform: 'tiktok',
    type: 'educational',
    title: 'Mathematical Visualization Discovery',
    content: `Watch me control 4D geometry with real-time parameters

This platform lets you explore mathematical surfaces that most people never get to see.

From parametric equations to hyperdimensional projections - all in your browser.

#mathematics #geometry #visualization #3D #education #STEM #science`,
    hashtags: ['mathematics', 'geometry', 'visualization', '3D', 'education', 'STEM', 'science'],
    duration: '60 seconds',
    hooks: [
      'Watch 4D geometry unfold in real-time',
      'Mathematics has never looked like this',
      'Explore shapes most people never see'
    ]
  },
  {
    platform: 'youtube',
    type: 'educational',
    title: 'Exploring Mathematical Surfaces: An Interactive Guide',
    content: `INTERACTIVE MATHEMATICS VISUALIZATION

Dmension is a browser-based platform that transforms mathematical equations into interactive 3D models.

WHAT YOU'LL LEARN:
- How parametric equations create 3D surfaces
- Exploring 4D mathematical projections
- Using 26 parameters for real-time shape control
- Exporting models for 3D printing and games

FEATURED CAPABILITIES:
- Parametric surface visualization
- Minimal surfaces and topological forms
- 4D tesseract and hypersphere projections
- Professional export formats

TRY IT YOURSELF: Link in description

#Mathematics #Visualization #Geometry #3DModeling #STEM #Education #Science #Technology`,
    hashtags: ['Mathematics', 'Visualization', 'Geometry', '3DModeling', 'STEM', 'Education'],
    duration: '10-15 minutes',
    hooks: [
      'What does 4D mathematics actually look like?',
      'Interactive mathematics visualization',
      'Explore equations as 3D surfaces'
    ]
  },
  {
    platform: 'instagram',
    type: 'showcase',
    title: 'Mathematical Surface Gallery',
    content: `MATHEMATICAL VISUALIZATION

Swipe to see parametric surfaces come to life

What you're seeing:
- Klein bottles and Möbius strips
- 4D projections into 3D space  
- Minimal surfaces from soap bubble physics
- Fractal patterns from iterative mathematics

All generated from pure mathematical equations.
No modeling required - just math.

Experience it yourself - link in bio

#Mathematics #Geometry #3DVisualization #Parametric #STEM #Education #Science #Art #Technology`,
    hashtags: ['Mathematics', 'Geometry', '3DVisualization', 'Parametric', 'STEM', 'Education'],
    duration: '90 seconds',
    hooks: [
      'Mathematics as visual art',
      'Pure equations become 3D surfaces',
      'Explore mathematical beauty'
    ]
  }
];

export default function SocialMediaContentGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [customContent, setCustomContent] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateContent = async (template: ContentTemplate) => {
    setGenerating(true);
    setSelectedTemplate(template);
    setCustomContent(template.content);
    
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadScript = (template: ContentTemplate) => {
    const content = `
PLATFORM: ${template.platform.toUpperCase()}
TYPE: ${template.type}
TITLE: ${template.title}
DURATION: ${template.duration || 'N/A'}

CONTENT:
${template.content}

HOOKS:
${template.hooks.map(hook => `- ${hook}`).join('\n')}

HASHTAGS:
#${template.hashtags.join(' #')}

TIPS:
- Start with compelling hook in first 3 seconds
- Use high-quality screen recordings of the app
- End with clear call-to-action
- Include captions for accessibility
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.platform}-${template.type}-script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const platformTemplates = CONTENT_TEMPLATES.filter(t => t.platform === selectedPlatform);

  return (
    <div className="social-media-generator p-6 bg-black/90 backdrop-blur-sm rounded-lg border border-purple-400 text-white max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-300 mb-2">Content Generator</h2>
        <p className="text-gray-300">Templates for TikTok, YouTube, and Instagram</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-300 mb-2">Select Platform</label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiktok">TikTok (60s)</SelectItem>
                <SelectItem value="youtube">YouTube (long-form)</SelectItem>
                <SelectItem value="instagram">Instagram (stories/reels)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {platformTemplates.map((template, index) => (
              <Card key={index} className="bg-gray-900/80 border-gray-600 hover:border-purple-400 transition-colors">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-lg">{template.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Video className="w-4 h-4" />
                    {template.duration}
                    <span>-</span>
                    <span className="capitalize">{template.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <p className="text-sm text-gray-300 mb-2">Preview hooks:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {template.hooks.slice(0, 2).map((hook, i) => (
                        <li key={i}>- {hook}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateContent(template)}
                      disabled={generating}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      {generating ? 'Generating...' : 'Use Template'}
                    </Button>
                    <Button 
                      onClick={() => downloadScript(template)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          {selectedTemplate && (
            <Card className="bg-gray-900/80 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Content Editor</CardTitle>
                <p className="text-gray-400">Customize your {selectedTemplate.platform} content</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Script Content</label>
                    <Textarea 
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      className="min-h-[300px] bg-gray-800 border-gray-600 text-white"
                      placeholder="Your content will appear here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">Hashtags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.hashtags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => copyToClipboard(customContent)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Script
                    </Button>
                    <Button 
                      onClick={() => downloadScript(selectedTemplate)}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!selectedTemplate && (
            <div className="flex items-center justify-center h-96 bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg">
              <div className="text-center">
                <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select a template to start creating content</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
        <h3 className="font-bold text-blue-300 mb-2">Content Tips</h3>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>- Start with a compelling hook in the first 3 seconds</li>
          <li>- Use high-quality screen recordings of the app</li>
          <li>- End with clear call-to-action</li>
          <li>- Include captions for accessibility</li>
          <li>- Focus on educational value</li>
        </ul>
      </div>
    </div>
  );
}
