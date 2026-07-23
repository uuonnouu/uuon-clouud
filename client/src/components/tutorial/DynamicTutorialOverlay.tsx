import React, { useEffect, useState } from 'react';
import { useTutorialStore, TUTORIALS, Tutorial } from '../../stores/tutorialStore';
import { Button } from '../ui/button';
import { X, ChevronLeft, ChevronRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface DynamicTutorialOverlayProps {
  onParameterChange?: (params: any) => void;
}

export function DynamicTutorialOverlay({ onParameterChange }: DynamicTutorialOverlayProps) {
  const {
    isActive,
    currentTutorial,
    currentStepIndex,
    nextStep,
    prevStep,
    skipTutorial,
    getCurrentStep,
  } = useTutorialStore();

  const [isAnimating, setIsAnimating] = useState(false);
  const currentStep = getCurrentStep();

  useEffect(() => {
    if (currentStep?.shapeToShow && onParameterChange) {
      onParameterChange({ type: currentStep.shapeToShow });
      console.log('📚 Tutorial: Switching to shape', currentStep.shapeToShow);
    }
  }, [currentStep?.shapeToShow, onParameterChange]);

  useEffect(() => {
    if (currentStep?.parameterDemo && onParameterChange && !isAnimating) {
      const { param, startValue, endValue, duration } = currentStep.parameterDemo;
      setIsAnimating(true);

      onParameterChange({ [param]: startValue });
      console.log('📚 Tutorial: Starting parameter demo', param, startValue, '->', endValue);

      const steps = 30;
      const stepDuration = duration / steps;
      const valueStep = (endValue - startValue) / steps;
      let currentValue = startValue;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        currentValue += valueStep;
        onParameterChange({ [param]: Number(currentValue.toFixed(4)) });

        if (step >= steps) {
          clearInterval(interval);
          setIsAnimating(false);
          console.log('📚 Tutorial: Parameter demo complete', param);
        }
      }, stepDuration);

      return () => {
        clearInterval(interval);
        setIsAnimating(false);
      };
    }
  }, [currentStep?.id, onParameterChange]);

  useEffect(() => {
    if (currentStep?.highlightElement) {
      const element = document.querySelector(currentStep.highlightElement);
      if (element) {
        element.classList.add('tutorial-highlight');
        return () => element.classList.remove('tutorial-highlight');
      }
    }
  }, [currentStep?.highlightElement]);

  if (!isActive || !currentTutorial || !currentStep) return null;

  const progress = ((currentStepIndex + 1) / currentTutorial.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 p-6 max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">{currentTutorial.title}</span>
            </div>
            <button
              onClick={skipTutorial}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              {currentStep.title}
              {isAnimating && <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />}
            </h3>
            <p className="text-gray-300 leading-relaxed">{currentStep.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">
              Step {currentStepIndex + 1} of {currentTutorial.steps.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                size="sm"
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                {currentStepIndex === currentTutorial.steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TutorialMenuProps {
  onClose?: () => void;
}

export function TutorialMenu({ onClose }: TutorialMenuProps) {
  const { startTutorial, completedTutorials } = useTutorialStore();

  const categories = [...new Set(TUTORIALS.map(t => t.category))];

  const handleStart = (tutorial: Tutorial) => {
    startTutorial(tutorial);
    onClose?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6 max-w-2xl max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Interactive Tutorials</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-gray-400 mb-6">
        Learn mathematical concepts step-by-step with interactive demonstrations.
      </p>

      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {TUTORIALS.filter(t => t.category === category).map(tutorial => (
              <div
                key={tutorial.id}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
                onClick={() => handleStart(tutorial)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                        {tutorial.title}
                      </h4>
                      {completedTutorials.includes(tutorial.id) && (
                        <span className="text-green-400 text-xs">✓ Completed</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{tutorial.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="text-gray-500 text-xs">{tutorial.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DynamicTutorialOverlay;
