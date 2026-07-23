import { create } from 'zustand';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  highlightElement?: string;
  parameterDemo?: {
    param: string;
    startValue: number;
    endValue: number;
    duration: number;
  };
  shapeToShow?: string;
  action?: 'next' | 'complete' | 'skip';
}

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: TutorialStep[];
}

interface TutorialState {
  isActive: boolean;
  currentTutorial: Tutorial | null;
  currentStepIndex: number;
  completedTutorials: string[];
  isFirstTimeUser: boolean;
  hasSeenWelcome: boolean;
  
  startTutorial: (tutorial: Tutorial) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
  checkFirstTimeUser: () => boolean;
  markWelcomeSeen: () => void;
  startWelcomeTutorial: () => void;
}

export const TUTORIALS: Tutorial[] = [
  {
    id: 'welcome',
    title: 'Welcome to Δmension',
    category: 'Getting Started',
    description: 'Learn the basics of the mathematical universe',
    difficulty: 'beginner',
    estimatedTime: '2 min',
    steps: [
      {
        id: 'welcome-1',
        title: 'Welcome to U² Mathematics',
        description: 'This is your gateway to exploring 1,900+ mathematical shapes. The Hello UUorld shape you see represents the fundamental U² (U-squared) transformation.',
      },
      {
        id: 'welcome-2',
        title: 'Shape Selection',
        description: 'Use the Shape dropdown to explore different mathematical forms. Shapes are organized into categories like Basic Shapes, Surfaces, Fractals, and more.',
        highlightElement: '[data-tutorial="shape-selector"]',
      },
      {
        id: 'welcome-3',
        title: 'Parameter Controls',
        description: 'Adjust the A-Z parameters to morph shapes in real-time. Parameters A, B, C control scale, while D-Z affect curvature, twist, and complexity.',
        highlightElement: '[data-tutorial="parameters"]',
      },
      {
        id: 'welcome-4',
        title: 'Visualization Modes',
        description: 'Switch between Surface (solid), Wireframe, and Points modes to see different aspects of the geometry.',
        highlightElement: '[data-tutorial="viz-mode"]',
      },
      {
        id: 'welcome-5',
        title: 'You\'re Ready!',
        description: 'Explore the mathematical universe! Try different shapes, adjust parameters, and discover the beauty of mathematics.',
      },
    ],
  },
  {
    id: 'fractals',
    title: 'Understanding Fractals',
    category: 'Fractals & Chaos',
    description: 'Explore self-similar patterns and infinite complexity',
    difficulty: 'intermediate',
    estimatedTime: '5 min',
    steps: [
      {
        id: 'fractal-1',
        title: 'What are Fractals?',
        description: 'Fractals are mathematical sets that exhibit self-similarity at every scale. The patterns you see repeat infinitely as you zoom in.',
        shapeToShow: 'mandelbrot_surface',
      },
      {
        id: 'fractal-2',
        title: 'The Mandelbrot Set',
        description: 'The most famous fractal, defined by the equation z = z² + c. Each point is colored based on how quickly the iteration escapes to infinity.',
        shapeToShow: 'mandelbrot_surface',
        parameterDemo: { param: 'a', startValue: 1, endValue: 5, duration: 2000 },
      },
      {
        id: 'fractal-3',
        title: 'Julia Sets',
        description: 'Related to Mandelbrot, Julia sets use a fixed c value. Different c values create dramatically different patterns.',
        shapeToShow: 'julia_set_surface',
      },
      {
        id: 'fractal-4',
        title: 'Chaos Parameters',
        description: 'Parameters V and W control fractal behavior. Small changes can create dramatically different patterns - this is chaos theory in action!',
        highlightElement: '[data-tutorial="parameters"]',
        parameterDemo: { param: 'v', startValue: 0, endValue: 10, duration: 3000 },
      },
    ],
  },
  {
    id: 'minimal-surfaces',
    title: 'Minimal Surfaces',
    category: 'Topology',
    description: 'Surfaces with zero mean curvature - nature\'s soap films',
    difficulty: 'intermediate',
    estimatedTime: '4 min',
    steps: [
      {
        id: 'minimal-1',
        title: 'What are Minimal Surfaces?',
        description: 'Minimal surfaces have zero mean curvature at every point. They minimize surface area for given boundary conditions - like soap films!',
        shapeToShow: 'catenoid',
      },
      {
        id: 'minimal-2',
        title: 'The Catenoid',
        description: 'The catenoid is a surface of revolution formed by rotating a catenary curve. It\'s the shape of a soap film between two rings.',
        shapeToShow: 'catenoid',
        parameterDemo: { param: 'a', startValue: 1, endValue: 8, duration: 2500 },
      },
      {
        id: 'minimal-3',
        title: 'The Helicoid',
        description: 'A helicoid is a ruled surface shaped like a spiral staircase. Remarkably, it can be continuously deformed into a catenoid!',
        shapeToShow: 'helicoid',
      },
      {
        id: 'minimal-4',
        title: 'Enneper Surface',
        description: 'The Enneper surface is a self-intersecting minimal surface. Parameter adjustments reveal its complex saddle-point geometry.',
        shapeToShow: 'enneper_surface',
        parameterDemo: { param: 'b', startValue: 1, endValue: 3, duration: 2000 },
      },
    ],
  },
  {
    id: 'higher-dimensions',
    title: '4D & Higher Dimensions',
    category: 'Hyperdimensional',
    description: 'Visualize objects beyond 3D space',
    difficulty: 'advanced',
    estimatedTime: '6 min',
    steps: [
      {
        id: '4d-1',
        title: 'Beyond 3D',
        description: 'Just as a 3D cube casts a 2D shadow, 4D objects cast 3D "shadows" - these projections are what we visualize.',
        shapeToShow: 'tesseract_4d',
      },
      {
        id: '4d-2',
        title: 'The Tesseract (Hypercube)',
        description: 'A tesseract is the 4D analog of a cube. It has 8 cubic cells, 24 square faces, 32 edges, and 16 vertices.',
        shapeToShow: 'tesseract_4d',
        parameterDemo: { param: 'd', startValue: 0, endValue: 90, duration: 4000 },
      },
      {
        id: '4d-3',
        title: '4D Rotation',
        description: 'Parameters D and E control rotation in 4D. Watch how the projection changes as the hypercube rotates through the fourth dimension!',
        highlightElement: '[data-tutorial="parameters"]',
      },
      {
        id: '4d-4',
        title: 'The 120-Cell',
        description: 'One of the most beautiful 4D polytopes, the 120-cell has 120 dodecahedral cells. It\'s the 4D analog of the dodecahedron.',
        shapeToShow: '120_cell',
      },
    ],
  },
  {
    id: 'dna-biology',
    title: 'DNA & Biological Forms',
    category: 'Biology',
    description: 'Explore the mathematics of life',
    difficulty: 'intermediate',
    estimatedTime: '4 min',
    steps: [
      {
        id: 'bio-1',
        title: 'The Double Helix',
        description: 'DNA\'s iconic structure is a right-handed double helix. The mathematics describe two intertwined spirals connected by base pairs.',
        shapeToShow: 'b_form_dna_helix',
      },
      {
        id: 'bio-2',
        title: 'B-form DNA',
        description: 'The most common DNA form with 10.5 base pairs per turn and 3.4nm pitch. This is the structure Watson and Crick discovered.',
        shapeToShow: 'b_form_dna_helix',
        parameterDemo: { param: 'a', startValue: 5, endValue: 15, duration: 2500 },
      },
      {
        id: 'bio-3',
        title: 'A-form DNA',
        description: 'A more compact, wider helix that forms in dehydrated conditions. It has 11 base pairs per turn.',
        shapeToShow: 'a_form_dna_helix',
      },
      {
        id: 'bio-4',
        title: 'Z-form DNA',
        description: 'A left-handed helix! Z-DNA has a zigzag backbone and may play roles in gene regulation.',
        shapeToShow: 'z_form_dna_helix',
      },
    ],
  },
];

const FIRST_TIME_KEY = 'dmension_first_visit';
const WELCOME_SEEN_KEY = 'dmension_welcome_seen';

export const useTutorialStore = create<TutorialState>((set, get) => ({
  isActive: false,
  currentTutorial: null,
  currentStepIndex: 0,
  completedTutorials: JSON.parse(localStorage.getItem('completedTutorials') || '[]'),
  isFirstTimeUser: !localStorage.getItem(FIRST_TIME_KEY),
  hasSeenWelcome: !!localStorage.getItem(WELCOME_SEEN_KEY),

  checkFirstTimeUser: () => {
    const isFirstTime = !localStorage.getItem(FIRST_TIME_KEY);
    if (isFirstTime) {
      localStorage.setItem(FIRST_TIME_KEY, Date.now().toString());
    }
    return isFirstTime;
  },

  markWelcomeSeen: () => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    set({ hasSeenWelcome: true, isFirstTimeUser: false });
  },

  startWelcomeTutorial: () => {
    const welcomeTutorial = TUTORIALS.find(t => t.id === 'welcome');
    if (welcomeTutorial) {
      get().startTutorial(welcomeTutorial);
      get().markWelcomeSeen();
    }
  },

  startTutorial: (tutorial) => {
    set({
      isActive: true,
      currentTutorial: tutorial,
      currentStepIndex: 0,
    });
    console.log('📚 Tutorial started:', tutorial.title);
  },

  nextStep: () => {
    const { currentTutorial, currentStepIndex } = get();
    if (!currentTutorial) return;

    if (currentStepIndex < currentTutorial.steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
      console.log('📚 Tutorial step:', currentStepIndex + 2, '/', currentTutorial.steps.length);
    } else {
      get().completeTutorial();
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  skipTutorial: () => {
    set({
      isActive: false,
      currentTutorial: null,
      currentStepIndex: 0,
    });
    console.log('📚 Tutorial skipped');
  },

  completeTutorial: () => {
    const { currentTutorial, completedTutorials } = get();
    if (currentTutorial && !completedTutorials.includes(currentTutorial.id)) {
      const newCompleted = [...completedTutorials, currentTutorial.id];
      localStorage.setItem('completedTutorials', JSON.stringify(newCompleted));
      set({ completedTutorials: newCompleted });
    }
    set({
      isActive: false,
      currentTutorial: null,
      currentStepIndex: 0,
    });
    console.log('📚 Tutorial completed!');
  },

  resetTutorial: () => {
    set({
      isActive: false,
      currentTutorial: null,
      currentStepIndex: 0,
    });
  },

  getCurrentStep: () => {
    const { currentTutorial, currentStepIndex } = get();
    if (!currentTutorial) return null;
    return currentTutorial.steps[currentStepIndex] || null;
  },
}));

if (typeof window !== 'undefined') {
  (window as any).TutorialStore = useTutorialStore;
}
