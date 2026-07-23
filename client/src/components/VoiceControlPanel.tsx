/**
 * VOICE CONTROL PANEL
 * Hands-free manipulation of parameters and views using Web Speech API
 * © 2025 UUON Foundation Inc.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurfaceParameters } from '../types/math';

interface VoiceControlPanelProps {
  parameters: SurfaceParameters;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onShapeChange?: (shapeType: string) => void;
}

interface VoiceCommand {
  patterns: RegExp[];
  action: (match: RegExpMatchArray, params: SurfaceParameters) => Partial<SurfaceParameters> | null;
  description: string;
}

const PARAMETER_NAMES: Record<string, keyof SurfaceParameters> = {
  'alpha': 'a', 'a': 'a', 'scale': 'a',
  'beta': 'b', 'b': 'b', 'width': 'b',
  'gamma': 'c', 'c': 'c', 'height': 'c',
  'delta': 'd', 'd': 'd', 'twist': 'd',
  'epsilon': 'e', 'e': 'e', 'wave': 'e',
  'zeta': 'f', 'f': 'f', 'ripple': 'f',
  'eta': 'g', 'g': 'g', 'frequency': 'g',
  'theta': 'h', 'h': 'h', 'amplitude': 'h',
  'iota': 'i', 'i': 'i', 'bulge': 'i',
  'kappa': 'j', 'j': 'j', 'pinch': 'j',
  'lambda': 'k', 'k': 'k', 'flare': 'k',
  'mu': 'l', 'l': 'l', 'taper': 'l',
  'nu': 'm', 'm': 'm', 'symmetry': 'm',
  'x': 'x', 'x offset': 'x', 'horizontal': 'x',
  'y': 'y', 'y offset': 'y', 'vertical': 'y',
  'z': 'z', 'z offset': 'z', 'depth': 'z',
};

const VOICE_COMMANDS: VoiceCommand[] = [
  {
    patterns: [
      /set (\w+) to (-?\d+(?:\.\d+)?)/i,
      /(\w+) equals? (-?\d+(?:\.\d+)?)/i,
      /change (\w+) to (-?\d+(?:\.\d+)?)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const value = parseFloat(match[2]);
      const key = PARAMETER_NAMES[paramName];
      if (key && !isNaN(value)) {
        return { [key]: value };
      }
      return null;
    },
    description: 'Set [parameter] to [value]'
  },
  {
    patterns: [
      /increase (\w+)(?: by (\d+(?:\.\d+)?))?/i,
      /(\w+) up(?: by (\d+(?:\.\d+)?))?/i,
      /more (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const amount = match[2] ? parseFloat(match[2]) : 10;
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        const current = (params[key] as number) || 0;
        return { [key]: current + amount };
      }
      return null;
    },
    description: 'Increase [parameter] (by [amount])'
  },
  {
    patterns: [
      /decrease (\w+)(?: by (\d+(?:\.\d+)?))?/i,
      /(\w+) down(?: by (\d+(?:\.\d+)?))?/i,
      /less (\w+)/i,
      /reduce (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const amount = match[2] ? parseFloat(match[2]) : 10;
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        const current = (params[key] as number) || 0;
        return { [key]: current - amount };
      }
      return null;
    },
    description: 'Decrease [parameter] (by [amount])'
  },
  {
    patterns: [
      /reset (\w+)/i,
      /zero (\w+)/i,
      /clear (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        if (key === 'a' || key === 'b' || key === 'c') return { [key]: 1 };
        return { [key]: 0 };
      }
      return null;
    },
    description: 'Reset [parameter]'
  },
  {
    patterns: [
      /reset all/i,
      /clear all/i,
      /reset everything/i,
    ],
    action: () => ({
      a: 1, b: 1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
      x: 0, y: 0, z: 0
    }),
    description: 'Reset all parameters'
  },
  {
    patterns: [
      /double (\w+)/i,
      /(\w+) times two/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        const current = (params[key] as number) || 1;
        return { [key]: current * 2 };
      }
      return null;
    },
    description: 'Double [parameter]'
  },
  {
    patterns: [
      /half (\w+)/i,
      /halve (\w+)/i,
      /(\w+) divided by two/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        const current = (params[key] as number) || 1;
        return { [key]: current / 2 };
      }
      return null;
    },
    description: 'Halve [parameter]'
  },
  {
    patterns: [
      /negate (\w+)/i,
      /flip (\w+)/i,
      /invert (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        const current = (params[key] as number) || 0;
        return { [key]: -current };
      }
      return null;
    },
    description: 'Negate [parameter]'
  },
  {
    patterns: [
      /maximize (\w+)/i,
      /max (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        if (key === 'x' || key === 'y' || key === 'z') return { [key]: 10 };
        if (key === 'a' || key === 'b' || key === 'c') return { [key]: 26 };
        return { [key]: 180 };
      }
      return null;
    },
    description: 'Maximize [parameter]'
  },
  {
    patterns: [
      /minimize (\w+)/i,
      /min (\w+)/i,
    ],
    action: (match, params) => {
      const paramName = match[1].toLowerCase();
      const key = PARAMETER_NAMES[paramName];
      if (key) {
        if (key === 'x' || key === 'y' || key === 'z') return { [key]: -10 };
        if (key === 'a' || key === 'b' || key === 'c') return { [key]: -26 };
        return { [key]: -180 };
      }
      return null;
    },
    description: 'Minimize [parameter]'
  },
];

export default function VoiceControlPanel({ 
  parameters, 
  onParameterChange,
  onShapeChange 
}: VoiceControlPanelProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsSupported(false);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            setIsListening(false);
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const processCommand = useCallback((text: string) => {
    const normalizedText = text.toLowerCase().trim();
    
    for (const command of VOICE_COMMANDS) {
      for (const pattern of command.patterns) {
        const match = normalizedText.match(pattern);
        if (match) {
          const result = command.action(match, parameters);
          if (result) {
            setLastCommand(`✓ ${text}`);
            onParameterChange(result);
            
            if (!isMuted) {
              speak(`Okay, ${text}`);
            }
            return;
          }
        }
      }
    }

    setLastCommand(`? ${text}`);
    if (!isMuted) {
      speak("Command not recognized");
    }
  }, [parameters, onParameterChange, isMuted]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2;
      utterance.pitch = 1;
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MicOff className="w-4 h-4" />
          <span>Voice control unavailable in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 rounded-lg p-3 border border-gray-700 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            size="sm"
            className={`${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isListening ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
            {isListening ? 'Stop' : 'Voice'}
          </Button>
          
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-600"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <Button
            onClick={() => setShowCommands(!showCommands)}
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-600"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <span className={`text-xs ${isListening ? 'text-green-400' : 'text-gray-500'}`}>
          {isListening ? '🎤 Listening...' : '🔇 Inactive'}
        </span>
      </div>

      {transcript && (
        <div className="text-sm text-blue-300 bg-blue-900/30 rounded px-2 py-1">
          {transcript}
        </div>
      )}

      {lastCommand && (
        <div className={`text-xs ${lastCommand.startsWith('✓') ? 'text-green-400' : 'text-yellow-400'}`}>
          {lastCommand}
        </div>
      )}

      {showCommands && (
        <div className="mt-2 p-2 bg-gray-800 rounded text-xs space-y-1 max-h-40 overflow-y-auto">
          <div className="text-gray-400 font-bold mb-1">Voice Commands:</div>
          {VOICE_COMMANDS.map((cmd, i) => (
            <div key={i} className="text-gray-300">• {cmd.description}</div>
          ))}
          <div className="text-gray-500 mt-2 italic">
            Parameters: alpha/a, beta/b, gamma/c, delta/d, epsilon/e, zeta/f, eta/g, theta/h, iota/i, kappa/j, lambda/k, mu/l, nu/m, x, y, z
          </div>
        </div>
      )}
    </div>
  );
}
