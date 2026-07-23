import { useParameterLinkStore } from '../stores/parameterLinkStore';
import ParameterLinkPanel from '../components/ParameterLinkPanel';
import LinkedShapesVisualization from '../components/LinkedShapesVisualization';

export default function ParameterLinkingPage() {
  const activeLink = useParameterLinkStore(state => state.activeLink);

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-950 relative">
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg px-6 py-3">
          <h1 className="text-2xl font-bold text-white text-center">
            Dynamic Parameter Linking
          </h1>
          <p className="text-gray-400 text-sm text-center mt-1">
            Connect multiple geometries and synchronize their parameters
          </p>
        </div>
      </div>

      <ParameterLinkPanel />

      {activeLink ? (
        <LinkedShapesVisualization linkId={activeLink} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🔗</div>
            <h2 className="text-2xl font-bold text-white">No Active Link</h2>
            <p className="text-gray-400 max-w-md">
              Create a parameter link and add shapes to see synchronized visualization.
              Use the panel on the right to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
