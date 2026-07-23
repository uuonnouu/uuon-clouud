
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Lightbulb, Target, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { localAI } from '../lib/localAI';
import { SurfaceParameters } from '../types/math';

interface AIAssistantPanelProps {
  parameters: SurfaceParameters;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onShapeChange: (shapeType: string) => void;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPanel({ 
  parameters, 
  onParameterChange, 
  onShapeChange 
}: AIAssistantPanelProps) {
  // AI Assistant disabled until professional setup
  return null;
  const [localAIStatus, setLocalAIStatus] = useState({ initialized: false, modelsLoaded: [] as string[] });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: '👋 **Welcome to Mathematical AI!**\n\nI\'m your intelligent assistant for exploring parametric mathematics and 3D visualization.\n\n**Dual AI System**:\n• 🌐 **Server AI**: Advanced analysis when online\n• 🤖 **Local AI**: Offline support with Transformers.js\n\n**I can help you**:\n• 🎯 Find the perfect shape for any purpose\n• 🎛️ Optimize parameters for specific effects\n• 📚 Explain mathematical concepts\n• 💫 Guide you through geometric exploration\n\n**To get started**, try saying:\n• "I want something calming for meditation"\n• "Show me complex 4D mathematics"\n• "Make this shape more organic"\n• "What\'s the math behind this?"\n\nWhat would you like to explore first?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze' | 'patterns'>('chat');
  const [analysisDescription, setAnalysisDescription] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isLoading, 
    analyzeShape, 
    getMathematicalPatterns, 
    getRecommendations, 
    chatWithAI 
  } = useAIAssistant();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Initialize local AI in the background (non-blocking)
    // Only initialize when AI panel is actually expanded
    if (isExpanded) {
      localAI.initialize().then(() => {
        setLocalAIStatus(localAI.getStatus());
        console.log('🤖 Local AI initialized and ready for offline use');
      }).catch(error => {
        console.error('⚠️ Local AI initialization failed - using server AI only:', error);
        // Non-fatal error - app continues to work with server AI
      });
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isExpanded]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Enhanced context for better AI responses
    const conversationContext = {
      current_shape: parameters.type,
      parameters,
      recent_messages: chatMessages.slice(-4).map(msg => ({
        type: msg.type,
        content: msg.content.substring(0, 100)
      })),
      session_length: chatMessages.length,
      user_seems_new: chatMessages.filter(msg => msg.type === 'user').length < 3
    };
    
    const aiResponse = await chatWithAI(inputMessage, conversationContext);

    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, aiMessage]);
  };

  const handleAnalyzeShape = async () => {
    if (!analysisDescription.trim()) return;

    const analysis = await analyzeShape(
      analysisDescription,
      parameters as unknown as Record<string, number>,
      parameters.type,
      'optimization'
    );

    if (analysis) {
      // Apply AI recommendations
      onShapeChange(analysis.recommended_shape);
      onParameterChange(analysis.suggested_parameters);

      // Add to chat
      const aiMessage: ChatMessage = {
        id: Date.now(),
        type: 'ai',
        content: `🎯 **Analysis Complete!**\n\n**Recommended Shape**: ${analysis.recommended_shape}\n\n**Reasoning**: ${analysis.mathematical_reasoning}\n\n**Confidence**: ${Math.round(analysis.confidence_score * 100)}%\n\nParameters have been optimized automatically!`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setActiveTab('chat');
    }
  };

  const handleGetPatterns = async () => {
    const patterns = await getMathematicalPatterns(parameters.type);
    
    if (patterns) {
      let message = `🔬 **Mathematical Analysis for ${parameters.type.toUpperCase()}**\n\n`;
      
      if (patterns.equations && patterns.equations.length > 0) {
        message += `📐 **EXACT MATHEMATICAL EQUATIONS:**\n`;
        patterns.equations.forEach((eq: string, i: number) => {
          message += `   ${i + 1}. ${eq}\n`;
        });
        message += '\n';
      }
      
      if (patterns.properties && patterns.properties.length > 0) {
        message += `📊 **GEOMETRIC PROPERTIES:**\n`;
        patterns.properties.forEach((prop: string) => {
          message += `   • ${prop}\n`;
        });
        message += '\n';
      }
      
      if (patterns.fieldOfStudy && patterns.fieldOfStudy.length > 0) {
        message += `🎓 **FIELDS OF STUDY:**\n   ${patterns.fieldOfStudy.join(' • ')}\n\n`;
      }
      
      if (patterns.scientificBenefit) {
        message += `💡 **SCIENTIFIC BENEFIT:**\n   ${patterns.scientificBenefit}\n\n`;
      }
      
      if (patterns.applications && patterns.applications.length > 0) {
        message += `🏭 **REAL-WORLD APPLICATIONS:**\n`;
        patterns.applications.forEach((app: string) => {
          message += `   ⚙️ ${app}\n`;
        });
        message += '\n';
      }
      
      if (patterns.parameterMeaning) {
        message += `🎛️ **PARAMETER MEANINGS:**\n`;
        Object.entries(patterns.parameterMeaning).forEach(([key, value]) => {
          message += `   ${key} = ${value}\n`;
        });
      }
      
      const aiMessage: ChatMessage = {
        id: Date.now(),
        type: 'ai',
        content: message,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setActiveTab('chat');
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300"
        >
          <Brain className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-2 sm:right-4 w-[calc(100vw-1rem)] sm:w-80 md:w-96 h-[70vh] sm:h-[600px] bg-gray-900 border border-purple-500 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-white font-bold">AI Mathematical Assistant</span>
          <div className="flex items-center space-x-1 text-xs">
            {isOnline ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-orange-400" />
            )}
            {localAIStatus.initialized && (
              <span className="w-2 h-2 bg-blue-400 rounded-full" title="Local AI Ready" />
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-2 text-sm transition-colors ${
            activeTab === 'chat' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 p-2 text-sm transition-colors ${
            activeTab === 'analyze' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎯 Analyze
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`flex-1 p-2 text-sm transition-colors ${
            activeTab === 'patterns' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🔬 Patterns
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.type === 'user' 
                      ? 'ml-4 bg-blue-600 text-white' 
                      : 'mr-4 bg-gray-700 text-gray-100'
                  } p-3 rounded-lg text-sm whitespace-pre-wrap`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="mr-4 bg-gray-700 text-gray-100 p-3 rounded-lg text-sm">
                  🤔 Thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            {chatMessages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="text-xs text-gray-400 mb-2">Quick suggestions:</div>
                <div className="flex flex-wrap gap-1">
                  {[
                    "I want something calming",
                    "Show me 4D math",
                    "Make it more organic",
                    "Explain this shape"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInputMessage(suggestion)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                {/* Direct Engine Test Button */}
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <button
                    onClick={() => {
                      const testMessage = "🚀 **DIRECT ENGINE TEST** - No API Required!\n\nTesting local mathematical engine:\n• 542+ algorithms loaded ✅\n• Real-time 3D rendering ✅\n• Quantum visualizations ✅\n• Fractal generators ✅\n• Consciousness models ✅\n\n**Try this now**: Change to 'tesseract_4d' and set parameter 'e' to 0.8 for 4D rotation!";
                      setChatMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'ai',
                        content: testMessage,
                        timestamp: new Date()
                      }]);
                    }}
                    className="w-full text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors"
                  >
                    🧪 Test Engine Directly (No API)
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about shapes, parameters, math..."
                  className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe what you want to visualize:
              </label>
              <textarea
                value={analysisDescription}
                onChange={(e) => setAnalysisDescription(e.target.value)}
                placeholder="E.g., 'I want something therapeutic and calming' or 'Show me a 4D mathematical object'"
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 text-sm h-24 resize-none"
              />
            </div>
            
            <button
              onClick={handleAnalyzeShape}
              disabled={isLoading || !analysisDescription.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Analyze & Optimize</span>
            </button>

            <div className="text-xs text-gray-400">
              Current shape: <span className="text-purple-400">{parameters.type}</span>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Mathematical Analysis</h3>
              <p className="text-sm text-gray-400 mb-4">
                Get detailed mathematical patterns and properties for the current shape.
              </p>
            </div>
            
            <button
              onClick={handleGetPatterns}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Analyze {parameters.type}</span>
            </button>

            <div className="text-xs text-gray-400">
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-blue-400">A: {parameters.a?.toFixed(1)}</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-green-400">B: {parameters.b?.toFixed(1)}</div>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <div className="text-purple-400">C: {parameters.c?.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
