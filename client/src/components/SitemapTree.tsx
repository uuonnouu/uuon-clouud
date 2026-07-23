import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, Cpu, Image, Video, Link, Shield, BookOpen, Globe } from 'lucide-react';
import { sdkClient } from '../lib/unifiedSDKClient';

interface SitemapNode {
  id: string;
  type: 'root' | 'category' | 'subcategory' | 'algorithm' | 'engine' | 'asset' | 'endpoint' | 'license' | 'documentation';
  title: string;
  abstractId: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    lastModified: string;
    changeFrequency: string;
    canonicalUrl: string;
    breadcrumb: string[];
  };
  references?: {
    algorithms?: string[];
    engines?: string[];
    assets?: string[];
    documentation?: string;
  };
  licensing?: {
    tier: string;
    abstractPurchaseInfo: string;
    documentationLink: string;
  };
  endpoint?: {
    method: string;
    inputSchema: Record<string, string>;
    outputSchema: Record<string, string>;
    categoryMapping: string[];
  };
  asset?: {
    type: 'image' | 'video';
    altText: string;
    caption: string;
    previewUrl: string;
  };
  children?: SitemapNode[];
}

interface TreeNodeProps {
  node: SitemapNode;
  depth: number;
  onSelect: (node: SitemapNode) => void;
  selectedId: string | null;
}

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'root': return <Globe className="w-4 h-4 text-blue-500" />;
    case 'category': return <Folder className="w-4 h-4 text-yellow-500" />;
    case 'subcategory': return <Folder className="w-4 h-4 text-orange-500" />;
    case 'algorithm': return <Cpu className="w-4 h-4 text-purple-500" />;
    case 'engine': return <Cpu className="w-4 h-4 text-green-500" />;
    case 'asset': return <Image className="w-4 h-4 text-pink-500" />;
    case 'endpoint': return <Link className="w-4 h-4 text-cyan-500" />;
    case 'license': return <Shield className="w-4 h-4 text-amber-500" />;
    case 'documentation': return <BookOpen className="w-4 h-4 text-indigo-500" />;
    default: return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, onSelect, selectedId }) => {
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700/50 rounded transition-colors ${
          isSelected ? 'bg-blue-600/30 border-l-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-600 rounded mr-1"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        ) : (
          <span className="w-5 mr-1" />
        )}
        {getNodeIcon(node.type)}
        <span className="ml-2 text-sm text-gray-200 truncate">{node.title}</span>
        <span className="ml-2 text-xs text-gray-500 font-mono">{node.abstractId}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MetadataPanel: React.FC<{ node: SitemapNode | null }> = ({ node }) => {
  if (!node) {
    return (
      <div className="p-4 text-gray-400 text-center">
        Select a node to view metadata
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="border-b border-gray-700 pb-3">
        <div className="flex items-center gap-2 mb-2">
          {getNodeIcon(node.type)}
          <h3 className="text-lg font-semibold text-white">{node.title}</h3>
        </div>
        <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded text-gray-300">
          {node.abstractId}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">SEO Title</h4>
          <p className="text-sm text-gray-200">{node.seo.title}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Description</h4>
          <p className="text-sm text-gray-300">{node.seo.description}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {node.seo.keywords.map((kw, i) => (
              <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Last Modified</h4>
            <p className="text-sm text-gray-300">{node.seo.lastModified}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Change Frequency</h4>
            <p className="text-sm text-gray-300 capitalize">{node.seo.changeFrequency}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Breadcrumb</h4>
          <p className="text-sm text-gray-300">{node.seo.breadcrumb.join(' > ')}</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">Canonical URL</h4>
          <a href={node.seo.canonicalUrl} className="text-sm text-blue-400 hover:underline break-all">
            {node.seo.canonicalUrl}
          </a>
        </div>
      </div>

      {node.references && (
        <div className="border-t border-gray-700 pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">References</h4>
          {node.references.algorithms && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Algorithms: </span>
              <span className="text-sm text-purple-400">{node.references.algorithms.join(', ')}</span>
            </div>
          )}
          {node.references.engines && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Engines: </span>
              <span className="text-sm text-green-400">{node.references.engines.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {node.endpoint && (
        <div className="border-t border-gray-700 pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">API Endpoint</h4>
          <div className="bg-gray-800 p-3 rounded text-sm font-mono">
            <div className="mb-2">
              <span className="text-cyan-400">{node.endpoint.method}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-500">Input: </span>
              <span className="text-gray-300">{JSON.stringify(node.endpoint.inputSchema)}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-500">Output: </span>
              <span className="text-gray-300">{JSON.stringify(node.endpoint.outputSchema)}</span>
            </div>
            <div>
              <span className="text-gray-500">Maps to: </span>
              <span className="text-yellow-400">{node.endpoint.categoryMapping.join(', ')}</span>
            </div>
          </div>
        </div>
      )}

      {node.licensing && (
        <div className="border-t border-gray-700 pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Licensing</h4>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500">Tier: </span>
              <span className="text-sm text-amber-400">{node.licensing.tier}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">Info: </span>
              <span className="text-sm text-gray-300">{node.licensing.abstractPurchaseInfo}</span>
            </div>
          </div>
        </div>
      )}

      {node.asset && (
        <div className="border-t border-gray-700 pt-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Asset Preview</h4>
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              {node.asset.type === 'image' ? (
                <Image className="w-4 h-4 text-pink-500" />
              ) : (
                <Video className="w-4 h-4 text-pink-500" />
              )}
              <span className="text-sm text-gray-300 capitalize">{node.asset.type}</span>
            </div>
            <p className="text-xs text-gray-400 mb-1">{node.asset.altText}</p>
            <p className="text-xs text-gray-500 italic">{node.asset.caption}</p>
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 pt-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">JSON-LD Structured Data</h4>
        <pre className="bg-gray-800 p-3 rounded text-xs text-gray-300 overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": node.type === 'algorithm' ? 'SoftwareSourceCode' : 
           node.type === 'engine' ? 'SoftwareApplication' :
           node.type === 'documentation' ? 'TechArticle' : 'WebPage',
  "name": node.seo.title,
  "description": node.seo.description,
  "url": node.seo.canonicalUrl,
  "dateModified": node.seo.lastModified,
  "keywords": node.seo.keywords.join(', ')
}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const SitemapTree: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<SitemapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<SitemapNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ totalNodes: number; generatedAt: string } | null>(null);

  const fetchHierarchy = useCallback(async () => {
    try {
      setLoading(true);
      const result = await sdkClient.getSitemapHierarchy();
      if (result.success && result.data) {
        setHierarchy(result.data.hierarchy);
        setMeta(result.data.meta);
        setError(null);
      } else {
        setError('Failed to load sitemap hierarchy');
      }
    } catch (err) {
      setError('Error fetching sitemap hierarchy');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHierarchy();
    const interval = setInterval(fetchHierarchy, 60000);
    return () => clearInterval(interval);
  }, [fetchHierarchy]);

  if (loading && !hierarchy) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error && !hierarchy) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <h2 className="font-semibold">Sitemap Hierarchy</h2>
        </div>
        {meta && (
          <div className="text-xs text-gray-400">
            {meta.totalNodes} nodes | Updated: {new Date(meta.generatedAt).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
          {hierarchy && (
            <TreeNode
              node={hierarchy}
              depth={0}
              onSelect={setSelectedNode}
              selectedId={selectedNode?.id || null}
            />
          )}
        </div>

        <div className="w-1/2 overflow-y-auto bg-gray-850">
          <MetadataPanel node={selectedNode} />
        </div>
      </div>
    </div>
  );
};

export default SitemapTree;
