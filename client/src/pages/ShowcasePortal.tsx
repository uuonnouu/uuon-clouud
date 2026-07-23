import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ShowcaseItem {
  id: string;
  type: 'html' | 'sketchfab' | 'model';
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
}

function ModelViewer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.setScalar(scale);
      
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center.multiplyScalar(scale));
    }
  }, [scene]);

  return (
    <group ref={ref}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function DropZone3D({ onModelLoad }: { onModelLoad: (url: string, name: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadedModel, setLoadedModel] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file);
      setLoadedModel(url);
      setModelName(file.name.replace(/\.(glb|gltf)$/i, ''));
      onModelLoad(url, file.name);
    }
  }, [onModelLoad]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      className={`relative w-full h-96 rounded-xl border-2 border-dashed transition-all ${
        isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 bg-gray-900/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {loadedModel ? (
        <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <React.Suspense fallback={
            <Html center>
              <div className="text-white text-sm">Loading model...</div>
            </Html>
          }>
            <Center>
              <ModelViewer url={loadedModel} />
            </Center>
          </React.Suspense>
          <OrbitControls enableDamping dampingFactor={0.05} />
          <Environment preset="city" />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-lg font-medium">Drop GLB/GLTF model here</p>
          <p className="text-sm text-gray-500 mt-1">Drag and drop to preview in 3D</p>
        </div>
      )}
      {loadedModel && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white font-medium">{modelName}</p>
          <p className="text-gray-400 text-sm">Use mouse to rotate, scroll to zoom</p>
        </div>
      )}
    </div>
  );
}

export default function ShowcasePortal() {
  const [activeTab, setActiveTab] = useState<'html' | 'sketchfab' | 'models' | 'gallery'>('gallery');
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [htmlPreviewUrl, setHtmlPreviewUrl] = useState<string | null>(null);
  const [sketchfabEmbed, setSketchfabEmbed] = useState('');
  const [sketchfabTitle, setSketchfabTitle] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadShowcaseItems();
  }, []);

  const loadShowcaseItems = async () => {
    try {
      const response = await fetch('/api/showcase/items');
      if (response.ok) {
        const data = await response.json();
        setShowcaseItems(data.items || []);
      }
    } catch (error) {
      console.log('Loading showcase items...');
    }
  };

  const handleHtmlUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.html')) {
      setHtmlFile(file);
      const url = URL.createObjectURL(file);
      setHtmlPreviewUrl(url);
      setItemTitle(file.name.replace('.html', ''));
    }
  }, []);

  const handleHtmlDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.html')) {
      setHtmlFile(file);
      const url = URL.createObjectURL(file);
      setHtmlPreviewUrl(url);
      setItemTitle(file.name.replace('.html', ''));
    }
  }, []);

  const saveHtmlShowcase = async () => {
    if (!htmlFile || !itemTitle) return;
    
    const formData = new FormData();
    formData.append('file', htmlFile);
    formData.append('title', itemTitle);
    formData.append('description', itemDescription);
    formData.append('type', 'html');

    try {
      const response = await fetch('/api/showcase/upload-html', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setShowcaseItems(prev => [...prev, data.item]);
        setHtmlFile(null);
        setHtmlPreviewUrl(null);
        setItemTitle('');
        setItemDescription('');
        setActiveTab('gallery');
      }
    } catch (error) {
      console.error('Error saving HTML:', error);
    }
  };

  const saveSketchfabEmbed = async () => {
    if (!sketchfabEmbed || !sketchfabTitle) return;

    try {
      const response = await fetch('/api/showcase/add-sketchfab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sketchfabTitle,
          description: itemDescription,
          embedCode: sketchfabEmbed
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShowcaseItems(prev => [...prev, data.item]);
        setSketchfabEmbed('');
        setSketchfabTitle('');
        setItemDescription('');
        setActiveTab('gallery');
      }
    } catch (error) {
      console.error('Error saving Sketchfab:', error);
    }
  };

  const handleModelLoad = async (url: string, filename: string) => {
    console.log('Model loaded:', filename);
  };

  const renderGallery = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Showcase Gallery</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            + Add HTML App
          </button>
          <button
            onClick={() => setActiveTab('sketchfab')}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            + Embed Sketchfab
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            + 3D Model
          </button>
        </div>
      </div>

      {showcaseItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
          <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No Showcase Items Yet</h3>
          <p className="text-gray-400 mb-6">Start by uploading HTML apps, embedding Sketchfab models, or adding 3D visualizers</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setActiveTab('html')} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Upload HTML App
            </button>
            <button onClick={() => setActiveTab('sketchfab')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Embed Sketchfab
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900/70 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                {item.type === 'html' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                )}
                {item.type === 'sketchfab' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>
                )}
                {item.type === 'model' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium">View</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                    item.type === 'html' ? 'bg-purple-600/30 text-purple-300' :
                    item.type === 'sketchfab' ? 'bg-blue-600/30 text-blue-300' :
                    'bg-green-600/30 text-green-300'
                  }`}>
                    {item.type === 'html' ? 'HTML App' : item.type === 'sketchfab' ? 'Sketchfab' : '3D Model'}
                  </span>
                </div>
                <h3 className="text-white font-semibold truncate">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHtmlUploader = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Upload HTML Application</h2>
        <button
          onClick={() => setActiveTab('gallery')}
          className="text-gray-400 hover:text-white"
        >
          Back to Gallery
        </button>
      </div>

      <div
        className={`relative w-full h-64 rounded-xl border-2 border-dashed transition-all ${
          htmlFile ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 bg-gray-900/50'
        } cursor-pointer`}
        onDrop={handleHtmlDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".html"
          onChange={handleHtmlUpload}
          className="hidden"
        />
        {htmlFile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">{htmlFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">Click to change file</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium">Drop HTML file here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Supports screensavers, animations, interactive apps</p>
          </div>
        )}
      </div>

      {htmlPreviewUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-700">
            <iframe
              src={htmlPreviewUrl}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin"
              title="HTML Preview"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            placeholder="e.g., Fractal Screensaver"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Brief description of the app"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={saveHtmlShowcase}
        disabled={!htmlFile || !itemTitle}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Showcase
      </button>
    </div>
  );

  const renderSketchfabEmbed = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Embed Sketchfab Model</h2>
        <button
          onClick={() => setActiveTab('gallery')}
          className="text-gray-400 hover:text-white"
        >
          Back to Gallery
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model Title</label>
          <input
            type="text"
            value={sketchfabTitle}
            onChange={(e) => setSketchfabTitle(e.target.value)}
            placeholder="e.g., Mathematical Torus"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sketchfab Embed Code</label>
          <textarea
            value={sketchfabEmbed}
            onChange={(e) => setSketchfabEmbed(e.target.value)}
            placeholder='Paste the embed code from Sketchfab here (e.g., <iframe title="..." src="https://sketchfab.com/models/..." ...)>'
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-gray-500 text-xs mt-1">Go to a Sketchfab model → Click "Embed" → Copy the iframe code</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
          <input
            type="text"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Brief description of the model"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {sketchfabEmbed && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-700">
            <div dangerouslySetInnerHTML={{ __html: sketchfabEmbed }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
          </div>
        </div>
      )}

      <button
        onClick={saveSketchfabEmbed}
        disabled={!sketchfabEmbed || !sketchfabTitle}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Showcase
      </button>
    </div>
  );

  const renderModelUploader = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">3D Model Visualizer</h2>
        <button
          onClick={() => setActiveTab('gallery')}
          className="text-gray-400 hover:text-white"
        >
          Back to Gallery
        </button>
      </div>

      <DropZone3D onModelLoad={handleModelLoad} />

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Supported Formats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 font-mono text-sm">.glb</span>
            </div>
            <div>
              <p className="text-white font-medium">GLB Binary</p>
              <p className="text-gray-400 text-sm">Recommended format</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 font-mono text-sm">.gltf</span>
            </div>
            <div>
              <p className="text-white font-medium">GLTF JSON</p>
              <p className="text-gray-400 text-sm">With external assets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItemModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
        <div className="w-full max-w-5xl h-[80vh] bg-gray-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-gray-400 text-sm mt-1">{selectedItem.description}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="h-[calc(80vh-73px)]">
            {selectedItem.type === 'html' && (
              <iframe
                src={selectedItem.content}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
                title={selectedItem.title}
              />
            )}
            {selectedItem.type === 'sketchfab' && (
              <div dangerouslySetInnerHTML={{ __html: selectedItem.content }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <nav className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/welcome" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Δ</span>
              </div>
              <span className="text-xl font-bold text-white">Showcase Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/museum" className="text-gray-400 hover:text-white transition-colors">
                Shape Museum
              </Link>
              <Link to="/sdk-portal" className="text-gray-400 hover:text-white transition-colors">
                SDK Portal
              </Link>
              <Link to="/" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Open App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'gallery' && renderGallery()}
        {activeTab === 'html' && renderHtmlUploader()}
        {activeTab === 'sketchfab' && renderSketchfabEmbed()}
        {activeTab === 'models' && renderModelUploader()}
      </main>

      {renderItemModal()}
    </div>
  );
}
