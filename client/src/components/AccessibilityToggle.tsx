import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Eye, Moon, Sun, Contrast, ZoomIn, Focus } from 'lucide-react';

interface AccessibilityTheme {
  id: string;
  name: string;
  icon: React.ReactNode;
  background: string;
  foreground: string;
  accent: string;
  wireframe: string;
  grid: string;
  text: string;
  border: string;
}

interface AccessibilityToggleProps {
  onThemeChange: (theme: AccessibilityTheme) => void;
}

const ACCESSIBILITY_THEMES: AccessibilityTheme[] = [
  {
    id: 'default',
    name: 'Default',
    icon: <Eye className="w-4 h-4" />,
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent: '#00ff88',
    wireframe: '#00ff88',
    grid: '#333333',
    text: '#ffffff',
    border: '#666666'
  },
  {
    id: 'pure_white',
    name: 'Pure White',
    icon: <Sun className="w-4 h-4" />,
    background: '#ffffff',
    foreground: '#000000',
    accent: '#000000',
    wireframe: '#000000',
    grid: '#e0e0e0',
    text: '#000000',
    border: '#cccccc'
  },
  {
    id: 'pure_black',
    name: 'Pure Black',
    icon: <Moon className="w-4 h-4" />,
    background: '#000000',
    foreground: '#ffffff',
    accent: '#ffffff',
    wireframe: '#ffffff',
    grid: '#333333',
    text: '#ffffff',
    border: '#666666'
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    icon: <Contrast className="w-4 h-4" />,
    background: '#000000',
    foreground: '#ffffff',
    accent: '#ffff00',
    wireframe: '#ffffff',
    grid: '#ffffff',
    text: '#ffffff',
    border: '#ffffff'
  },
  {
    id: 'dark_enhanced',
    name: 'Dark Enhanced',
    icon: <Moon className="w-4 h-4" />,
    background: '#0d0d0d',
    foreground: '#e0e0e0',
    accent: '#00ccff',
    wireframe: '#00ccff',
    grid: '#404040',
    text: '#e0e0e0',
    border: '#808080'
  },
  {
    id: 'light_accessible',
    name: 'Light Accessible',
    icon: <Sun className="w-4 h-4" />,
    background: '#f8f9fa',
    foreground: '#212529',
    accent: '#0056b3',
    wireframe: '#0056b3',
    grid: '#dee2e6',
    text: '#212529',
    border: '#6c757d'
  },
  {
    id: 'large_focus',
    name: 'Large Focus',
    icon: <ZoomIn className="w-4 h-4" />,
    background: '#1a1a1a',
    foreground: '#ffffff',
    accent: '#ff6b35',
    wireframe: '#ff6b35',
    grid: '#555555',
    text: '#ffffff',
    border: '#ff6b35'
  },
  {
    id: 'focus_mode',
    name: 'Focus Mode',
    icon: <Focus className="w-4 h-4" />,
    background: '#0f0f0f',
    foreground: '#f0f0f0',
    accent: '#9d4edd',
    wireframe: '#9d4edd',
    grid: '#2a2a2a',
    text: '#f0f0f0',
    border: '#9d4edd'
  }
];

export default function AccessibilityToggle({ onThemeChange }: AccessibilityToggleProps) {
  const [currentTheme, setCurrentTheme] = useState<AccessibilityTheme>(ACCESSIBILITY_THEMES[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const oldThemeId = localStorage.getItem('accessibility-theme');
    if (oldThemeId) {
      localStorage.setItem('uuon-accessibility-theme', oldThemeId);
      localStorage.removeItem('accessibility-theme');
    }
    
    const savedThemeId = localStorage.getItem('uuon-accessibility-theme');
    if (savedThemeId) {
      const savedTheme = ACCESSIBILITY_THEMES.find(theme => theme.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
        applyThemeToDocument(savedTheme);
        onThemeChange(savedTheme);
      }
    }
  }, [onThemeChange]);

  const applyThemeToDocument = (theme: AccessibilityTheme) => {
    const root = document.documentElement;
    
    // Set CSS custom properties for smooth transitions
    root.style.setProperty('--bg-primary', theme.background);
    root.style.setProperty('--fg-primary', theme.foreground);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--wireframe-color', theme.wireframe);
    root.style.setProperty('--grid-color', theme.grid);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--border-color', theme.border);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.background);
    }
  };

  const handleThemeChange = async (theme: AccessibilityTheme) => {
    if (theme.id === currentTheme.id) return;
    
    setIsTransitioning(true);
    
    // Apply transition class to body
    document.body.classList.add('theme-transition');
    
    // Small delay to ensure transition class is applied
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Apply the new theme
    setCurrentTheme(theme);
    applyThemeToDocument(theme);
    onThemeChange(theme);
    
    // Save to localStorage
    localStorage.setItem('uuon-accessibility-theme', theme.id);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
      setIsTransitioning(false);
    }, 300);
    
    setIsExpanded(false);
  };

  const cycleTheme = () => {
    const currentIndex = ACCESSIBILITY_THEMES.findIndex(theme => theme.id === currentTheme.id);
    const nextIndex = (currentIndex + 1) % ACCESSIBILITY_THEMES.length;
    handleThemeChange(ACCESSIBILITY_THEMES[nextIndex]);
  };

  return (
    <>
      {/* Add CSS transitions to head */}
      <style>
        {`
          :root {
            --bg-primary: ${currentTheme.background};
            --fg-primary: ${currentTheme.foreground};
            --accent-color: ${currentTheme.accent};
            --wireframe-color: ${currentTheme.wireframe};
            --grid-color: ${currentTheme.grid};
            --text-color: ${currentTheme.text};
            --border-color: ${currentTheme.border};
          }
          
          body.theme-transition,
          body.theme-transition * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease,
                       box-shadow 0.3s ease !important;
          }
          
          .accessibility-panel {
            background: var(--bg-primary);
            color: var(--text-color);
            border-color: var(--border-color);
          }
          
          .accessibility-button {
            background: var(--accent-color);
            color: var(--bg-primary);
          }
          
          .accessibility-button:hover {
            opacity: 0.8;
          }
        `}
      </style>

      <div className="fixed top-4 right-16 z-50">
        {/* Main toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`accessibility-button p-3 rounded-full shadow-lg transition-all duration-300 ${
            isTransitioning ? 'animate-pulse' : ''
          }`}
          title={`Current: ${currentTheme.name} - Click to expand options`}
        >
          {currentTheme.icon}
        </Button>

        {/* Expanded theme options */}
        {isExpanded && (
          <div className={`accessibility-panel absolute top-14 right-0 rounded-lg p-3 shadow-xl border backdrop-blur-sm min-w-48 transition-all duration-300 ease-out transform ${
            isExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
          } animate-in slide-in-from-top-2 fade-in`}>
            <div className="text-sm font-semibold mb-3">Accessibility Themes</div>
            
            <div className="space-y-2">
              {ACCESSIBILITY_THEMES.map((theme) => (
                <Button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full text-left p-2 rounded transition-all duration-200 flex items-center space-x-2 ${
                    theme.id === currentTheme.id 
                      ? 'accessibility-button font-semibold' 
                      : 'bg-transparent hover:bg-gray-700 border border-transparent hover:border-gray-600'
                  }`}
                  disabled={isTransitioning}
                >
                  <span className="flex-shrink-0">{theme.icon}</span>
                  <span className="flex-1">{theme.name}</span>
                  {theme.id === currentTheme.id && (
                    <span className="text-xs">✓</span>
                  )}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-600">
              <Button
                onClick={cycleTheme}
                className="w-full text-xs p-2 bg-transparent hover:bg-gray-700 border border-gray-600 hover:border-gray-500 transition-all duration-200"
                disabled={isTransitioning}
              >
                Quick Cycle (Alt+T)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Global keyboard shortcut listener */}
      {typeof window !== 'undefined' && (
        <div
          className="sr-only"
          ref={(el) => {
            if (el) {
              const handleKeyDown = (e: KeyboardEvent) => {
                if (e.altKey && e.key.toLowerCase() === 't') {
                  e.preventDefault();
                  cycleTheme();
                }
                if (e.key === 'Escape' && isExpanded) {
                  setIsExpanded(false);
                }
              };
              
              window.addEventListener('keydown', handleKeyDown);
              // Don't return a cleanup function - use useEffect instead
            }
          }}
        />
      )}
    </>
  );
}

export type { AccessibilityTheme };