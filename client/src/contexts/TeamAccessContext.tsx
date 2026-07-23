import { createContext, useContext, useState, ReactNode } from 'react';

const TeamAccessContext = createContext<{
  isUnlocked: boolean;
  requestAccess: () => Promise<boolean>;
} | null>(null);

export function TeamAccessProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

  const requestAccess = () => {
    if (isUnlocked) return Promise.resolve(true);
    setShowModal(true);
    setError('');
    return new Promise<boolean>((resolve) => setResolver(() => resolve));
  };

  const submit = async () => {
    try {
      const res = await fetch('/api/team-access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const ok = res.ok;
      if (ok) { setIsUnlocked(true); setShowModal(false); resolver?.(true); }
      else { setError('Incorrect password'); }
    } catch { setError('Connection error'); }
  };

  const cancel = () => { setShowModal(false); resolver?.(false); };

  return (
    <TeamAccessContext.Provider value={{ isUnlocked, requestAccess }}>
      {children}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #00E5CC', borderRadius: 8, padding: 24, width: 320 }}>
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Team Access Required</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Password"
              style={{ width: '100%', padding: 8, marginBottom: 8, background: '#1a1a1a', color: '#fff', border: '1px solid #333' }}
              autoFocus
            />
            {error && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} style={{ flex: 1, padding: 8, background: '#00E5CC', border: 'none', borderRadius: 4 }}>Unlock</button>
              <button onClick={cancel} style={{ flex: 1, padding: 8, background: '#333', color: '#fff', border: 'none', borderRadius: 4 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </TeamAccessContext.Provider>
  );
}

export const useTeamAccess = () => useContext(TeamAccessContext)!;
