import { useState } from 'react';
import { useParameterLinkStore } from '../stores/parameterLinkStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { X, Plus, Link2, Unlink, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

const PARAMETER_NAMES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];

export default function ParameterLinkPanel() {
  const {
    links,
    activeLink,
    createLink,
    removeLink,
    setActiveLink,
    addShapeToLink,
    removeShapeFromLink,
    linkParameter,
    unlinkParameter,
    updateLinkedParameter,
    updateShapeParameter,
    setMasterShape,
    getLinkById
  } = useParameterLinkStore();

  const [newLinkName, setNewLinkName] = useState('');
  const [newShapeName, setNewShapeName] = useState('');
  const [showPanel, setShowPanel] = useState(true);

  const activeLinkData = activeLink ? getLinkById(activeLink) : null;

  const handleCreateLink = () => {
    if (newLinkName.trim()) {
      createLink(newLinkName.trim());
      setNewLinkName('');
    }
  };

  const handleAddShape = () => {
    if (activeLink && newShapeName.trim()) {
      const defaultParams = {
        a: 1.0, b: 1.0, c: 0.0, d: 0.0, e: 0.0, f: 0.0,
        g: 0.0, h: 0.0, i: 0.0, j: 0.0, k: 0.0, l: 0.0, m: 0.0
      };
      addShapeToLink(activeLink, newShapeName.trim(), defaultParams);
      setNewShapeName('');
    }
  };

  const handleLinkedParamChange = (paramName: string, value: number) => {
    if (activeLink) {
      updateLinkedParameter(activeLink, paramName, value);
    }
  };

  const handleShapeParamChange = (shapeId: string, paramName: string, value: number) => {
    if (activeLink) {
      updateShapeParameter(activeLink, shapeId, paramName, value);
    }
  };

  if (!showPanel) {
    return (
      <div className="fixed top-24 right-4 z-50">
        <Button
          onClick={() => setShowPanel(true)}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Show Links
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-24 right-4 w-96 max-h-[calc(100vh-120px)] overflow-y-auto z-50">
      <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-400" />
            Parameter Links
          </h3>
          <Button
            onClick={() => setShowPanel(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white text-sm">Create New Link</Label>
            <div className="flex gap-2">
              <Input
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="Link name..."
                className="bg-gray-800 border-gray-700 text-white text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
              />
              <Button
                onClick={handleCreateLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {links.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white text-sm">Active Link</Label>
              <Select value={activeLink || ''} onValueChange={setActiveLink}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select link..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {links.map((link) => (
                    <SelectItem key={link.id} value={link.id} className="text-white">
                      {link.name} ({link.shapes.length} shapes)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {activeLinkData && (
            <div className="space-y-4 border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">{activeLinkData.name}</h4>
                <Button
                  onClick={() => removeLink(activeLinkData.id)}
                  size="sm"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Add Shape</Label>
                <div className="flex gap-2">
                  <Input
                    value={newShapeName}
                    onChange={(e) => setNewShapeName(e.target.value)}
                    placeholder="Shape name (e.g., dna_double_helix)"
                    className="bg-gray-800 border-gray-700 text-white text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddShape()}
                  />
                  <Button
                    onClick={handleAddShape}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white text-sm font-semibold">Linked Parameters</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PARAMETER_NAMES.map((param) => {
                    const isLinked = activeLinkData.linkedParams.includes(param);
                    return (
                      <div key={param} className="flex items-center gap-2">
                        <Switch
                          checked={isLinked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              linkParameter(activeLinkData.id, param);
                            } else {
                              unlinkParameter(activeLinkData.id, param);
                            }
                          }}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-white text-sm uppercase">{param}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {activeLinkData.linkedParams.length > 0 && (
                <div className="space-y-3 border-t border-gray-700 pt-3">
                  <Label className="text-white text-sm font-semibold">Master Controls</Label>
                  {activeLinkData.linkedParams.map((param) => {
                    const masterShape = activeLinkData.shapes.find(
                      s => s.id === activeLinkData.masterShapeId
                    );
                    const value = masterShape?.parameters[param] ?? 1.0;

                    return (
                      <div key={param} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-white text-xs uppercase">{param}</Label>
                          <span className="text-blue-400 text-xs font-mono">
                            {value.toFixed(5)}
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          onValueChange={([v]) => handleLinkedParamChange(param, v)}
                          min={param === 'a' || param === 'b' ? 0.1 : -5}
                          max={5}
                          step={0.00001}
                          className="w-full"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-3 border-t border-gray-700 pt-3">
                <Label className="text-white text-sm font-semibold">
                  Shapes ({activeLinkData.shapes.length})
                </Label>
                {activeLinkData.shapes.map((shape, idx) => (
                  <div
                    key={shape.id}
                    className="bg-gray-800/50 rounded p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          {idx + 1}. {shape.shapeName}
                        </span>
                        {shape.id === activeLinkData.masterShapeId && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                            MASTER
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {shape.id !== activeLinkData.masterShapeId && (
                          <Button
                            onClick={() => setMasterShape(activeLinkData.id, shape.id)}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
                          >
                            Set Master
                          </Button>
                        )}
                        <Button
                          onClick={() => removeShapeFromLink(activeLinkData.id, shape.id)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {links.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Create a link to start connecting shapes together
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
