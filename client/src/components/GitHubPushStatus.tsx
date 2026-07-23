import React, { useEffect, useState } from 'react';
import { GitBranch, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

interface PushStatus {
  found: boolean;
  success?: boolean;
  lastPushAt?: string;
  commitSha?: string;
  commitMsg?: string;
  repo?: string;
  error?: string;
}

export default function GitHubPushStatus() {
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/push-status');
      if (res.ok) {
        const data: PushStatus = await res.json();
        setStatus(data);
      }
    } catch {
      // server not reachable
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const formatAge = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const hasHistory = status?.found && status.lastPushAt;

  return (
    <div className="rounded border border-gray-700/50 bg-gray-900/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
          <GitBranch className="w-3 h-3 text-teal-400" />
          GitHub Sync
        </div>
        <button
          onClick={fetchStatus}
          className="text-gray-500 hover:text-teal-400 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !status && (
        <p className="text-[10px] text-gray-500">Checking status…</p>
      )}

      {!loading && (!status || !hasHistory) && (
        <p className="text-[10px] text-gray-500">
          No push history yet. Run <code className="text-teal-400">bash push.sh</code> to sync.
        </p>
      )}

      {hasHistory && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            {status!.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            )}
            <span className={`text-[11px] font-medium ${status!.success ? 'text-green-400' : 'text-red-400'}`}>
              {status!.success ? 'Push succeeded' : 'Push failed'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Clock className="w-3 h-3" />
            {formatAge(status!.lastPushAt!)}
          </div>

          {status!.repo && (
            <p className="text-[10px] text-gray-400 truncate">
              → <span className="text-teal-400/80">{status!.repo}</span>
            </p>
          )}

          {status!.commitSha && (
            <p className="text-[10px] text-gray-500 truncate">
              <span className="text-yellow-400/70 font-mono">{status!.commitSha}</span>{' '}
              {status!.commitMsg}
            </p>
          )}

          {!status!.success && status!.error && (
            <p className="text-[10px] text-red-400/80 bg-red-900/20 rounded p-1.5 break-all">
              {status!.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
