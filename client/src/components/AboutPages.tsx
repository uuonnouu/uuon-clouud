import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useLocation, Link } from 'react-router-dom';

interface AboutPageData {
  title: string;
  description: string;
  content: React.ReactNode;
}

const ABOUT_PAGES: Record<string, AboutPageData> = {
  '/about': {
    title: 'About UUON Foundation',
    description: 'Learn about the organization behind Δmension Mathematical Universe',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-purple-300">UUON Foundation Inc.</CardTitle>
            <Badge className="bg-blue-600 w-fit">Universally United Obscured Node</Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>UUON Foundation Inc. is a pioneering organization dedicated to the visualization and democratization of mathematical knowledge through advanced 3D rendering technology.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Founded</h4>
                <p>2025 - Yuma, Arizona, USA</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Founder</h4>
                <p>Phillip Aguilar Ruiz III</p>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-semibold text-white mb-2">Platform Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">2,677+</div>
                  <div className="text-sm text-gray-400">Parametric Shapes</div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">2,302</div>
                  <div className="text-sm text-gray-400">Equations</div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">150+</div>
                  <div className="text-sm text-gray-400">Categories</div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">49</div>
                  <div className="text-sm text-gray-400">Materials</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/mission': {
    title: 'Our Mission',
    description: 'Making mathematics visible and accessible to everyone',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-green-300">Mission Statement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p className="text-lg italic">"To democratize mathematical visualization and make complex concepts accessible through interactive 3D experiences."</p>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-white mb-2">🎯 Education</h4>
                <p>Provide free educational tools for students, researchers, and enthusiasts to explore mathematical concepts visually.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🔬 Research</h4>
                <p>Enable researchers to visualize complex mathematical structures in real-time with parametric control.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🌐 Accessibility</h4>
                <p>Browser-based platform requires no installation, making mathematical visualization accessible worldwide.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/founder': {
    title: 'Founder',
    description: 'Phillip Aguilar Ruiz III - Independent Researcher & Digital Architect',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-blue-300">Phillip Aguilar Ruiz III</CardTitle>
            <Badge className="bg-purple-600 w-fit">Founder & Principal Lead</Badge>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Independent researcher and digital architect at the leading edge of computational geometry and theoretical physics.</p>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Expertise</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Computational Geometry</li>
                  <li>Theoretical Physics Visualization</li>
                  <li>Parametric Surface Design</li>
                  <li>WebGL/Three.js Development</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Connect</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="https://sketchfab.com/uuon" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sketchfab</a>
                  <span className="text-gray-500">|</span>
                  <a href="https://www.instagram.com/uuon.foundation" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/technology': {
    title: 'Technology',
    description: 'The technical architecture behind Δmension',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-cyan-500/50">
          <CardHeader>
            <CardTitle className="text-cyan-300">Technical Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Frontend</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>React with TypeScript</li>
                  <li>Three.js / React Three Fiber</li>
                  <li>Tailwind CSS</li>
                  <li>Radix UI Components</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Backend</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Node.js with Express</li>
                  <li>PostgreSQL with Drizzle ORM</li>
                  <li>REST API Architecture</li>
                  <li>WebSocket for real-time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">3D Rendering</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>WebGL 2.0</li>
                  <li>Custom Parametric Engine</li>
                  <li>Post-processing Effects</li>
                  <li>PBR Material System</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Export Formats</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>GLB/glTF 2.0</li>
                  <li>PLY Point Clouds</li>
                  <li>Animated Sequences</li>
                  <li>NeRF JSON</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/intelligent-geometry': {
    title: 'Intelligent Geometry',
    description: 'Mathematical intelligence embedded in geometric forms',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-300">Intelligent Geometry Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>Geometry that understands, responds, and evolves based on mathematical relationships.</p>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-white mb-2">26-Parameter System (A-Z)</h4>
                <p>Every shape responds to a comprehensive parameter system organized by chaos level:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>A-C: Global transforms (foundation)</li>
                  <li>D-E: Foundational curves</li>
                  <li>F-K: Surfaces and interpolations</li>
                  <li>L-Q: Superquadrics and waveforms</li>
                  <li>R-V: Fractals and noise</li>
                  <li>W-Z: Spatial and chaos throttle</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/applications': {
    title: 'Applications',
    description: 'Real-world applications of mathematical visualization',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-orange-500/50">
          <CardHeader>
            <CardTitle className="text-orange-300">Application Domains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">🎓 Education</h4>
                <p>Interactive learning tools for mathematics, physics, and engineering students.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🔬 Research</h4>
                <p>Visualization of complex mathematical structures for academic research.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🏥 Medical</h4>
                <p>TPMS structures for tissue engineering and medical implant design.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🏗️ Architecture</h4>
                <p>Geodesic structures and lattice configurations for architectural design.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🧬 Biotechnology</h4>
                <p>Molecular modeling and protein structure visualization.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">⚛️ Quantum Computing</h4>
                <p>Quantum algorithm visualization and quantum state representation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  '/about/contact': {
    title: 'Contact',
    description: 'Get in touch with UUON Foundation',
    content: (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-pink-500/50">
          <CardHeader>
            <CardTitle className="text-pink-300">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">📧 Email</h4>
                <p>phi1@uuonfoundation.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🌐 Website</h4>
                <p><a href="https://uuon-foundation.com" className="text-blue-400 hover:underline">uuon-foundation.com</a></p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📍 Location</h4>
                <p>Yuma, Arizona, USA</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">🔗 Social</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="https://sketchfab.com/uuon" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Sketchfab</a>
                  <a href="https://www.instagram.com/uuon.foundation" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">Instagram</a>
                  <a href="https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">YouTube</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
};

export default function AboutPages() {
  const location = useLocation();
  const pageData = ABOUT_PAGES[location.pathname] || ABOUT_PAGES['/about'];
  
  const navLinks = [
    { path: '/about', label: 'Overview' },
    { path: '/about/mission', label: 'Mission' },
    { path: '/about/founder', label: 'Founder' },
    { path: '/about/technology', label: 'Technology' },
    { path: '/about/intelligent-geometry', label: 'Intelligent Geometry' },
    { path: '/about/applications', label: 'Applications' },
    { path: '/about/contact', label: 'Contact' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Link to="/" className="text-blue-400 hover:underline mb-4 inline-block">&larr; Back to App</Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {pageData.title}
          </h1>
          <p className="text-xl text-gray-400 mt-2">{pageData.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {pageData.content}
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; 2025 UUON Foundation Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
