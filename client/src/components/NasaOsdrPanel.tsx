import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Rocket, Dna, Activity, Atom, Satellite, Globe } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface OsdrStudy {
  id: string;
  accession: string;
  title: string;
  organism: string;
  tissue?: string;
  assayType?: string;
  mission?: string;
  description?: string;
}

interface OsdrMission {
  name: string;
  vehicle?: string;
  destination?: string;
  year?: number;
}

export function NasaOsdrPanel({ onSelectStudy }: { onSelectStudy?: (study: OsdrStudy) => void }) {
  const [studies, setStudies] = useState<OsdrStudy[]>([]);
  const [missions, setMissions] = useState<OsdrMission[]>([]);
  const [organisms, setOrganisms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'studies' | 'missions' | 'organisms'>('studies');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudies();
    fetchMissions();
    fetchOrganisms();
  }, []);

  const fetchStudies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await sdkClient.legacyCall('/api/external/osdr/studies', 'GET');
      const data = result.data;
      if (result.success && data?.data?.results) {
        setStudies(data.data.results.map((r: any) => ({
          id: r.id || r.accession,
          accession: r.accession || r.id,
          title: r.title || r.study_title || 'Untitled Study',
          organism: r.organism || 'Unknown',
          tissue: r.tissue,
          assayType: r.assay_type,
          mission: r.mission,
          description: r.description
        })));
      } else if (data?.fallback) {
        setStudies(data.fallback);
      }
    } catch (err: any) {
      setError('Unable to fetch studies');
      console.error('OSDR fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMissions = async () => {
    try {
      const result = await sdkClient.legacyCall('/api/external/osdr/missions', 'GET');
      const data = result.data;
      if (result.success && data?.missions) {
        setMissions(Array.isArray(data.missions) ? data.missions : []);
      }
    } catch (err) {
      console.error('Missions fetch error:', err);
    }
  };

  const fetchOrganisms = async () => {
    try {
      const result = await sdkClient.legacyCall('/api/external/osdr/organisms', 'GET');
      const data = result.data;
      if (result.success && data?.organisms) {
        setOrganisms(Array.isArray(data.organisms) ? data.organisms : []);
      }
    } catch (err) {
      console.error('Organisms fetch error:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await sdkClient.legacyCall(`/api/external/osdr/search?q=${encodeURIComponent(searchQuery)}`, 'GET');
      const data = result.data;
      if (result.success && data?.results) {
        const results = data.results.hits?.hits || [];
        setStudies(results.map((hit: any) => ({
          id: hit._id || hit._source?.accession,
          accession: hit._source?.accession || hit._id,
          title: hit._source?.study_title || hit._source?.title || 'Untitled',
          organism: hit._source?.organism || 'Unknown',
          tissue: hit._source?.tissue,
          mission: hit._source?.mission
        })));
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getOrganismIcon = (organism: string) => {
    const lower = organism.toLowerCase();
    if (lower.includes('homo') || lower.includes('human')) return <Activity className="w-4 h-4" />;
    if (lower.includes('mus') || lower.includes('mouse')) return <Dna className="w-4 h-4" />;
    if (lower.includes('arabidopsis') || lower.includes('plant')) return <Globe className="w-4 h-4" />;
    return <Atom className="w-4 h-4" />;
  };

  return (
    <Card className="bg-black/80 border-blue-500/30 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Rocket className="w-5 h-5 text-blue-400" />
          NASA OSDR Integration
          <Badge variant="outline" className="ml-auto text-xs border-blue-500/50 text-blue-300">
            500+ Studies
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search space biology studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-gray-900/50 border-gray-700 text-white text-sm"
          />
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex gap-1">
          {(['studies', 'missions', 'organisms'] as const).map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab)}
              className={`text-xs capitalize ${activeTab === tab ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {error && (
          <div className="text-red-400 text-xs p-2 bg-red-900/20 rounded">{error}</div>
        )}

        <ScrollArea className="h-48">
          {activeTab === 'studies' && (
            <div className="space-y-2">
              {studies.length === 0 && !loading && (
                <div className="text-gray-500 text-sm text-center py-4">No studies found</div>
              )}
              {studies.map((study) => (
                <div
                  key={study.id}
                  className="p-2 bg-gray-900/50 rounded border border-gray-700/50 hover:border-blue-500/50 cursor-pointer transition-colors"
                  onClick={() => onSelectStudy?.(study)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getOrganismIcon(study.organism)}
                    <span className="text-blue-300 text-xs font-mono">{study.accession}</span>
                    {study.mission && (
                      <Badge variant="outline" className="text-xs border-green-500/50 text-green-300">
                        <Satellite className="w-3 h-3 mr-1" />
                        {study.mission}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-white truncate">{study.title}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {study.organism} {study.tissue && `• ${study.tissue}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="space-y-2">
              {missions.map((mission, i) => (
                <div key={i} className="p-2 bg-gray-900/50 rounded border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">{mission.name}</span>
                    {mission.year && <span className="text-gray-500 text-xs">{mission.year}</span>}
                  </div>
                  {mission.vehicle && (
                    <div className="text-xs text-gray-400 mt-1">Vehicle: {mission.vehicle}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'organisms' && (
            <div className="flex flex-wrap gap-2">
              {organisms.map((org, i) => (
                <Badge key={i} variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                  {org}
                </Badge>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700/50">
          Data from NASA Open Science Data Repository
        </div>
      </CardContent>
    </Card>
  );
}

export default NasaOsdrPanel;
