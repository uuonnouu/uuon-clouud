
import React from 'react';
import { Calculator, Heart, Brain, Atom, Microscope, BookOpen } from 'lucide-react';

const FormulaBenefitsPage = () => {
  const formulaCategories = [
    {
      icon: Heart,
      title: "Medical & Therapeutic Formulas",
      description: "Mathematical equations used in healing, medical device design, and therapeutic applications",
      benefits: [
        "TPMS scaffolds for bone regeneration (60-70% porosity optimization)",
        "Chakra geometry visualization for meditation and healing",
        "Solfeggio frequencies (528Hz) for stress reduction",
        "Heart shape mathematics for cardiovascular education"
      ],
      applications: ["Orthopedic implants", "Tissue engineering", "Mental health therapy", "Medical education"]
    },
    {
      icon: Atom,
      title: "Physics & Quantum Mechanics",
      description: "Fundamental equations describing the behavior of matter and energy at all scales",
      benefits: [
        "Schrödinger equation for quantum state visualization",
        "Einstein field equations for spacetime understanding",
        "Hydrogen orbitals for atomic structure education",
        "Wave function mathematics for quantum computing"
      ],
      applications: ["Quantum computing", "Materials science", "Energy research", "Space exploration"]
    },
    {
      icon: Brain,
      title: "4D Mathematics & Topology",
      description: "Higher-dimensional mathematics for consciousness research and advanced visualization",
      benefits: [
        "Tesseract (4D hypercube) for spatial reasoning",
        "Klein bottle topology for non-orientable surfaces",
        "Hopf fibration for fiber bundle visualization",
        "Calabi-Yau manifolds for string theory"
      ],
      applications: ["Consciousness studies", "Advanced physics", "Mathematical education", "AI research"]
    },
    {
      icon: Microscope,
      title: "Biological & DNA Mathematics",
      description: "Mathematical models of biological structures and processes",
      benefits: [
        "DNA double helix structural equations",
        "Protein folding optimization algorithms",
        "Cellular division mathematical models",
        "Mitochondrial energy calculation formulas"
      ],
      applications: ["Biotechnology", "Drug discovery", "Genetic research", "Medical diagnostics"]
    },
    {
      icon: Calculator,
      title: "Sacred Geometry & Constants",
      description: "Ancient mathematical principles with modern therapeutic applications",
      benefits: [
        "Golden ratio (φ) spiral mathematics",
        "Fibonacci sequence natural patterns",
        "Flower of Life geometric principles",
        "Pi (π) and Euler's number applications"
      ],
      applications: ["Architecture", "Art therapy", "Meditation practices", "Educational tools"]
    },
    {
      icon: BookOpen,
      title: "Educational Mathematics",
      description: "Interactive mathematical visualization for learning and comprehension",
      benefits: [
        "Trigonometric function 3D visualization",
        "Calculus concepts through geometry",
        "Fractal mathematics education",
        "Statistical distribution modeling"
      ],
      applications: ["STEM education", "Mathematical literacy", "Academic research", "Student engagement"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* SEO Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Mathematical Formula Benefits & Applications
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover how advanced mathematical formulas are revolutionizing medicine, education, therapy, and scientific research. 
            Our platform provides interactive 3D visualizations of over 1,400+ mathematical equations with real-world applications.
          </p>
          
          {/* Key Benefits Summary */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/20">
              <h3 className="text-2xl font-bold text-blue-400 mb-2">Medical Innovation</h3>
              <p className="text-gray-300">TPMS scaffolds, therapeutic geometry, and healing mathematics for healthcare advancement</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-6 rounded-xl border border-green-500/20">
              <h3 className="text-2xl font-bold text-green-400 mb-2">Educational Excellence</h3>
              <p className="text-gray-300">Interactive 3D mathematical visualization for enhanced STEM learning and comprehension</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20">
              <h3 className="text-2xl font-bold text-purple-400 mb-2">Therapeutic Healing</h3>
              <p className="text-gray-300">Sacred geometry, chakra mathematics, and frequency therapy for mental wellness</p>
            </div>
          </div>
        </div>

        {/* Formula Categories */}
        <div className="space-y-16">
          {formulaCategories.map((category, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
              
              <div className="flex items-center mb-6">
                <category.icon className="w-12 h-12 text-cyan-400 mr-4" />
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{category.title}</h2>
                  <p className="text-gray-300 text-lg">{category.description}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Mathematical Benefits */}
                <div>
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">🧮 Mathematical Benefits</h3>
                  <ul className="space-y-3">
                    {category.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-400 mr-2 mt-1">✓</span>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real-World Applications */}
                <div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-4">🌍 Real-World Applications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {category.applications.map((app, i) => (
                      <div key={i} className="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-3 rounded-lg border border-orange-500/30">
                        <span className="text-orange-300 font-medium">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* SEO Footer Information */}
        <div className="mt-16 text-center bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-8 rounded-xl border border-indigo-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">Why Mathematical Visualization Matters</h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed mb-6">
            Mathematical formulas are the language of the universe, describing everything from quantum mechanics to biological growth patterns. 
            Our platform makes these complex equations accessible through interactive 3D visualization, enabling breakthrough discoveries in 
            medicine, education, and scientific research.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">1,400+</div>
              <div className="text-gray-400">Mathematical Formulas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">86</div>
              <div className="text-gray-400">Scientific Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">26</div>
              <div className="text-gray-400">Parameter Controls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">∞</div>
              <div className="text-gray-400">Learning Possibilities</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FormulaBenefitsPage;
