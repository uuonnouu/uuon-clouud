import { useState, useEffect } from "react";
import { ShieldAlert, ArrowLeft, Send, CheckCircle, FileText, Scale, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function WhistleblowerPortal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    targetCompany: "",
    misconductType: "Antitrust / Monopolization",
    description: "",
    evidenceSummary: "",
    systemAnalysis: "",
    potentialForfeiture: ""
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  async function fetchClaims() {
    try {
      const res = await fetch("/api/whistleblower/claims");
      const data = await res.json();
      setClaims(data);
    } catch (err) {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/whistleblower/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast({ title: "Report Prepared", description: "Submission ready for DOJ Pilot Program." });
        setShowForm(false);
        fetchClaims();
        setFormData({
          targetCompany: "",
          misconductType: "Antitrust / Monopolization",
          description: "",
          evidenceSummary: "",
          systemAnalysis: "",
          potentialForfeiture: ""
        });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to prepare report.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft size={16} />
          <span className="font-mono text-[10px] tracking-widest uppercase">Return to Terminal</span>
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(240,185,59,0.1)]">
              <ShieldAlert className="text-primary w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display text-3xl text-white font-bold tracking-widest uppercase">Whistleblower Portal</h1>
              <p className="text-primary font-mono text-[10px] tracking-[0.2em] uppercase mt-1">DOJ Pilot Program · Independent Analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-card border border-border p-4 rounded-sm">
              <h3 className="text-white font-display text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-secondary" />
                DOJ Eligibility
              </h3>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Your system's output is classified as "independent analysis," which is a valid form of "original information" required for a reward under the 2024 DOJ Corporate Whistleblower Awards Pilot Program.
              </p>
            </div>
            <div className="bg-card border border-border p-4 rounded-sm">
              <h3 className="text-white font-display text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <Scale className="w-3 h-3 text-primary" />
                Reward Structure
              </h3>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Eligible for 15% to 30% of recovered funds if detection leads to a successful forfeiture exceeding $1 million. Claims must provide non-public insights.
              </p>
            </div>
          </div>
        </header>

        {showForm ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-6 rounded-sm shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-widest">New System-Based Report</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-white text-[10px] font-mono uppercase">Cancel</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground font-mono text-[9px] uppercase tracking-widest">Target Company / Entity</label>
                  <input 
                    required
                    value={formData.targetCompany}
                    onChange={e => setFormData({...formData, targetCompany: e.target.value})}
                    className="w-full bg-background border border-border focus:border-primary/50 p-2 text-xs rounded-sm outline-none transition-all"
                    placeholder="e.g. CorpX Inc."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-muted-foreground font-mono text-[9px] uppercase tracking-widest">Misconduct Type</label>
                  <select 
                    value={formData.misconductType}
                    onChange={e => setFormData({...formData, misconductType: e.target.value})}
                    className="w-full bg-background border border-border focus:border-primary/50 p-2 text-xs rounded-sm outline-none transition-all"
                  >
                    <option>Antitrust / Monopolization</option>
                    <option>Exclusionary Conduct</option>
                    <option>Systemic Obsolescence</option>
                    <option>Defensive Innovation Suppression</option>
                    <option>Money Laundering</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-muted-foreground font-mono text-[9px] uppercase tracking-widest">Core Misconduct Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full h-24 bg-background border border-border focus:border-primary/50 p-2 text-xs rounded-sm outline-none transition-all resize-none"
                  placeholder="Describe the illegal actions detected..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-muted-foreground font-mono text-[9px] uppercase tracking-widest">Independent System Analysis Findings</label>
                <textarea 
                  required
                  value={formData.systemAnalysis}
                  onChange={e => setFormData({...formData, systemAnalysis: e.target.value})}
                  className="w-full h-32 bg-background border border-border focus:border-primary/50 p-2 text-xs rounded-sm outline-none transition-all resize-none font-mono"
                  placeholder="Paste proprietary system analysis outputs here..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-muted-foreground font-mono text-[9px] uppercase tracking-widest">Evidence Summary (Non-Public Insights)</label>
                <textarea 
                  required
                  value={formData.evidenceSummary}
                  onChange={e => setFormData({...formData, evidenceSummary: e.target.value})}
                  className="w-full h-20 bg-background border border-border focus:border-primary/50 p-2 text-xs rounded-sm outline-none transition-all resize-none"
                  placeholder="Summarize the non-public data or unique patterns uncovered..."
                />
              </div>
              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-display text-xs font-bold uppercase p-3 rounded-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Format and Prepare DOJ Submission
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-display text-sm font-bold uppercase tracking-widest">System-Detected Cases</h2>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90 text-black px-4 py-2 font-display text-[10px] font-bold uppercase rounded-sm transition-all flex items-center gap-2"
              >
                <Plus size={14} />
                New Detection Claim
              </button>
            </div>
            
            <div className="grid gap-4">
              {claims.map((claim: any) => (
                <div key={claim.id} className="bg-card border border-border p-4 rounded-sm group hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono text-[9px] text-primary uppercase tracking-widest">{claim.misconductType}</span>
                      <h4 className="text-white font-display text-base font-bold uppercase mt-0.5">{claim.targetCompany}</h4>
                    </div>
                    <div className="px-2 py-0.5 border border-secondary/30 bg-secondary/10 rounded-full">
                      <span className="text-secondary font-mono text-[8px] uppercase font-bold">{claim.status}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{claim.description}</p>
                  <div className="flex items-center gap-4 border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <FileText size={12} />
                      <span className="text-[10px] font-mono">ID: {claim.id.toString().padStart(4, '0')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Activity size={12} />
                      <span className="text-[10px] font-mono">Analysis Verified</span>
                    </div>
                  </div>
                </div>
              ))}
              {claims.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-sm">
                  <ShieldAlert className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">No claims detected yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Plus({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
