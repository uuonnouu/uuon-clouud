import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Rocket, ExternalLink, Dna, Activity, FlaskConical, 
  Satellite, BookOpen, Info, ChevronDown, ChevronUp 
} from 'lucide-react';
import { getShapeStudyContext, isSpaceBiologyShape, ShapeExperimentalContext, OsdrStudyReference } from '@/lib/osdrShapeMapping';

interface OsdrStudyPanelProps {
  shapeName: string;
  currentParams?: Record<string, number>;
  onStudySelect?: (study: OsdrStudyReference) => void;
}

export function OsdrStudyPanel({ shapeName, currentParams, onStudySelect }: OsdrStudyPanelProps) {
  const [context, setContext] = useState<ShapeExperimentalContext | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [showVariables, setShowVariables] = useState(false);

  useEffect(() => {
    if (isSpaceBiologyShape(shapeName)) {
      setContext(getShapeStudyContext(shapeName));
    } else {
      setContext(null);
    }
  }, [shapeName]);

  if (!context) return null;

  const getOrganismIcon = (organism: string) => {
    const lower = organism.toLowerCase();
    if (lower.includes('homo') || lower.includes('human')) return <Activity className="w-3 h-3" />;
    if (lower.includes('mus') || lower.includes('mouse')) return <Dna className="w-3 h-3" />;
    if (lower.includes('arabidopsis') || lower.includes('plant')) return <FlaskConical className="w-3 h-3" />;
    return <Dna className="w-3 h-3" />;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/95 to-blue-900/30 border-blue-500/40 text-white shadow-lg">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Rocket className="w-4 h-4 text-blue-400" />
          <span className="text-blue-100">NASA OSDR Research</span>
          <Badge variant="outline" className="ml-auto text-xs border-green-500/50 text-green-300">
            {context.relatedStudies.length} Studies
          </Badge>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3 pt-0">
          <div className="bg-black/30 rounded-md p-2 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300 leading-relaxed">
                {context.scientificBackground}
              </p>
            </div>
          </div>

          <Separator className="bg-blue-500/20" />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-200">Related NASA Studies</span>
            </div>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {context.relatedStudies.map((study, idx) => (
                  <div 
                    key={idx}
                    className="bg-black/40 rounded-md p-2 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                    onClick={() => onStudySelect?.(study)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getOrganismIcon(study.organism)}
                      <span className="text-xs font-mono text-blue-300">{study.studyId}</span>
                      {study.mission && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1 border-green-500/40 text-green-300">
                          <Satellite className="w-2 h-2 mr-1" />
                          {study.mission}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-white font-medium truncate">{study.title}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span>{study.organism}</span>
                      <span>•</span>
                      <span>{study.tissue}</span>
                      <span>•</span>
                      <span>{study.assayType}</span>
                    </div>
                    <a 
                      href={study.osdrUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1"
                    >
                      <ExternalLink className="w-2 h-2" />
                      View on NASA OSDR
                    </a>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator className="bg-blue-500/20" />

          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-between text-xs text-blue-200 hover:text-white hover:bg-blue-900/30"
              onClick={() => setShowVariables(!showVariables)}
            >
              <span className="flex items-center gap-2">
                <Info className="w-3 h-3" />
                Experimental Variable Mapping
              </span>
              {showVariables ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>

            {showVariables && (
              <div className="mt-2 space-y-1">
                {Object.entries(context.experimentalVariables).map(([key, info]) => (
                  <div key={key} className="flex items-center justify-between bg-black/30 rounded px-2 py-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] py-0 px-1 border-purple-500/50 text-purple-300">
                        {info.parameter}
                      </Badge>
                      <span className="text-gray-300">{info.experimentalMeaning}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      {info.unit && <span>{info.unit}</span>}
                      {currentParams && currentParams[key] !== undefined && (
                        <span className="text-blue-300 font-mono">
                          {currentParams[key].toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[10px] text-gray-500 text-center pt-1 border-t border-gray-700/30">
            Data from NASA Open Science Data Repository
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default OsdrStudyPanel;
