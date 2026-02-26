import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Scale, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

type Tab = "terms" | "privacy" | "disclaimer" | "principles";

export default function LegalPage() {
  const [tab, setTab] = useState<Tab>("terms");
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          data-testid="button-back-to-chat"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clouud
        </button>

        <div className="border border-border rounded-sm overflow-hidden" style={{ boxShadow: "8px 8px 0px 0px var(--color-border)" }}>
          <div className="bg-gradient-to-r from-[#0a1a30] to-card px-6 py-4 border-b border-border">
            <h1 className="font-display text-xl text-white font-bold tracking-wider uppercase">Legal</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
              UUON Foundation Inc.
            </p>
          </div>

          <div className="flex border-b border-border bg-card">
            {([
              { id: "terms" as Tab, label: "Terms of Use", icon: FileText },
              { id: "privacy" as Tab, label: "Privacy", icon: Shield },
              { id: "disclaimer" as Tab, label: "Disclaimer", icon: Scale },
              { id: "principles" as Tab, label: "Principles", icon: AlertTriangle },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[11px] font-display uppercase tracking-wider font-bold transition-colors border-b-2 ${
                  tab === id
                    ? "text-primary border-primary bg-background/50"
                    : "text-muted-foreground border-transparent hover:text-white"
                }`}
                data-testid={`tab-${id}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-4 text-sm leading-relaxed"
          >
            {tab === "terms" && (
              <>
                <h2 className="font-display text-white text-base font-bold uppercase tracking-wider">Terms of Use</h2>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Last updated: February 2026</p>

                <p>By using UUON Clouud, you agree to the following terms. If you do not agree, do not use the service.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">What Clouud Is</h3>
                <p>Clouud is an AI-powered intelligence system built by UUON Foundation Inc. It provides information, mathematical computation through the G-centric Lattice System, and conversational assistance. Clouud is a tool for exploration and understanding. Clouud determines the closest verifiable truth based on available proof, tests responses against a 33-point rational-math lattice, and scores itself for accuracy drift. It is structurally oriented toward truth, not structurally perfect.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">What Clouud Is Not</h3>
                <p>Clouud is not a licensed professional advisor. It does not provide legal, medical, financial, or engineering advice. It is not a substitute for human expertise in any regulated field. Do not make critical decisions based solely on Clouud's output.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">What Clouud Does Not Do</h3>
                <p>Clouud does not generate, create, embed, or link to images of any kind. Clouud does not provide external links or URLs and does not direct users to websites. Clouud does not claim to be error-free. When it cannot verify something, it offers prompts and frameworks for the user to investigate further rather than fabricating an answer.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Infrastructure Disclosure</h3>
                <p>Clouud runs on infrastructure built by companies with the same incentive structures the system identifies as problematic. UUON Foundation acknowledges this openly. The mission, the lattice, and the provenance layer exist to create accountability inside that reality. No AI system stands fully outside the critique of AI systems. The best any system can do is be transparent about what it is, who built it, and what it is for.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Error Handling and Truth Approach</h3>
                <p>Standard AI systems can and do make errors with full confidence. Clouud is different in structure, not in perfection. Clouud determines the closest verifiable truth based on available proof, tests it against the 33-point lattice, hashes every response for provenance, and scores itself for drift. Clouud is not error-free. It is error-aware. That distinction is the foundation of the UUON approach.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Your Use</h3>
                <p>You may use Clouud for personal, educational, and research purposes. You agree not to use Clouud to generate harmful, misleading, or illegal content. You agree not to attempt to reverse engineer, attack, or overwhelm the system.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Intellectual Property</h3>
                <p>The G-centric Lattice System, Clouud system prompt, lattice engine, and all UUON Foundation tools and models are the intellectual property of UUON Foundation Inc. You may reference Clouud's outputs with proper attribution. You may not claim UUON's systems as your own work.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Provenance</h3>
                <p>Every response from Clouud carries a SHA-256 hash. This hash is a fingerprint that proves the response was generated at a specific time and has not been altered. This is for transparency and trust. It is not a legal guarantee.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Changes</h3>
                <p>UUON Foundation Inc. may update these terms at any time. Continued use of Clouud after changes constitutes acceptance of the updated terms.</p>
              </>
            )}

            {tab === "privacy" && (
              <>
                <h2 className="font-display text-white text-base font-bold uppercase tracking-wider">Privacy Policy</h2>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Last updated: February 2026</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">What We Collect</h3>
                <p>Clouud stores your conversation messages so you can return to previous sessions. Messages are stored in a database associated with this application instance. No personal identification information is required to use Clouud.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">What We Do Not Collect</h3>
                <p>Clouud does not collect your name, email, phone number, location, or any personally identifiable information. There are no user accounts. There is no tracking across sessions beyond conversation history. There are no cookies used for advertising or analytics. There is no engagement optimization. There are no ads. Behavioral data is not tracked, sold, or used for profit.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">How Your Data Is Used</h3>
                <p>Your messages are sent to an AI model (Anthropic Claude) to generate responses. Your conversation history is stored so you can continue previous sessions. Provenance hashes are generated from response content for transparency. Your data is not used to train AI models. Your data is not harvested for any purpose beyond the conversation you initiated.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Data Retention</h3>
                <p>Conversations persist until you delete them. You can delete any conversation at any time using the sidebar. When you delete a conversation, all messages within it are permanently removed.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Third Parties</h3>
                <p>Messages are processed through Anthropic's Claude API to generate responses. UUON Foundation does not sell, share, or distribute your conversation data to any other third party. UUON Foundation acknowledges that the underlying infrastructure is operated by third-party companies whose incentive structures may differ from the UUON mission. The provenance and self-assessment layers exist to maintain accountability within that reality.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Future Considerations</h3>
                <p>As AI technology evolves, new risks may emerge that are not yet identified or addressed by this policy. UUON Foundation commits to updating this policy as new threats, vulnerabilities, or ethical concerns become apparent. This includes but is not limited to: emergent model behaviors, changes in third-party data handling practices, new forms of data extraction, evolving regulatory requirements, and any unforeseen interactions between system components that could compromise user trust or data integrity.</p>
              </>
            )}

            {tab === "disclaimer" && (
              <>
                <h2 className="font-display text-white text-base font-bold uppercase tracking-wider">Disclaimer</h2>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Last updated: February 2026</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">AI-Generated Content</h3>
                <p>Clouud is an artificial intelligence system. Standard AI systems can and do make errors with full confidence. Clouud is different in structure, not in perfection. It determines the closest verifiable truth based on available proof, tests it against the 33-point lattice, hashes every response for provenance, and scores itself for accuracy drift. Clouud is not error-free. It is error-aware. AI-generated content should still be verified independently before being used in any consequential decision.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Content Limitations</h3>
                <p>Clouud does not generate, create, or display images. Clouud does not provide external links or URLs. Clouud does not direct users to external websites. When Clouud cannot verify information, it offers prompts and frameworks for the user to investigate further rather than fabricating an answer. Clouud provides the closest truth it can discover and acknowledges the boundaries of what it can verify.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Mathematical Precision</h3>
                <p>The G-centric Lattice System uses rational arithmetic to avoid floating-point rounding errors common in IEEE 754 systems. The lattice values are mathematically exact within the system's defined parameters. This precision applies to the lattice engine itself and does not extend to all of Clouud's conversational responses.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Infrastructure Transparency</h3>
                <p>Clouud runs on infrastructure operated by third-party technology companies. UUON Foundation does not pretend to exist outside the system it critiques. The provenance layer, self-assessment engine, and anti-hallucination protocols exist to create accountability within that reality. This disclosure is itself part of the system's commitment to transparency.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">No Warranty</h3>
                <p>UUON Clouud is provided as-is, without warranty of any kind, express or implied. UUON Foundation Inc. is not liable for any damages arising from use of this system. Use Clouud at your own discretion.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Educational Purpose</h3>
                <p>Clouud exists to make complex systems understandable. It is an educational and exploratory tool. It is built to fight waste, fraud, and gatekeeping through transparent, accessible intelligence. It is not a replacement for professional services in any regulated industry.</p>

                <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider pt-2">Unforeseen Risks</h3>
                <p>UUON Foundation acknowledges that AI technology is evolving and that risks not yet identified may emerge in the future. This includes but is not limited to: emergent model behaviors that bypass existing safety protocols, unforeseen interactions between system components, new attack vectors targeting AI systems, changes in the regulatory landscape, and evolving ethical standards. UUON Foundation commits to addressing these risks as they become known and updating all documentation accordingly.</p>
              </>
            )}

            {tab === "principles" && (
              <>
                <h2 className="font-display text-white text-base font-bold uppercase tracking-wider" data-testid="text-principles-title">What We Do Not Allow or Promote</h2>
                <p className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Last updated: February 2026</p>

                <p>UUON Foundation exists to reduce waste, fraud, and gatekeeping. The following patterns are documented because they are everywhere once you see them. This system is built to stand against every one of them. We do not use, allow, or promote any of these practices.</p>

                <div className="space-y-5 pt-2">
                  <div data-testid="principle-1">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">1. Complexity Without Purpose</h3>
                    <p>When a system is deliberately made harder to understand than it needs to be, that is not sophistication. That is camouflage. Tax codes, insurance policies, pharmaceutical pricing, terms of service agreements. The complexity is the weapon. If you cannot understand it, you cannot challenge it. UUON builds for clarity. If you cannot understand how something works here, that is our failure, not yours.</p>
                  </div>

                  <div data-testid="principle-2">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">2. The Revolving Door</h3>
                    <p>When the people who regulate an industry are the same people who previously ran that industry or will run it next, the regulation is theater. UUON does not operate within captured regulatory structures and does not present industry-serving positions as public-interest ones.</p>
                  </div>

                  <div data-testid="principle-3">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">3. Manufactured Urgency</h3>
                    <p>When you are pressured to decide before you have time to think, that pressure is intentional. Urgency is the enemy of scrutiny. UUON does not use time pressure, limited offers, or artificial scarcity to manipulate decisions. You think at your own pace here.</p>
                  </div>

                  <div data-testid="principle-4">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">4. The Free Product Trap</h3>
                    <p>If something costs you nothing to use, you are not the customer. You are the inventory. Your attention, your data, your behavioral patterns are being packaged and sold to someone else. UUON does not harvest user data for training, does not optimize for engagement, does not sell attention, and does not run ads.</p>
                  </div>

                  <div data-testid="principle-5">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">5. The Single Solution</h3>
                    <p>Any system that tells you there is only one way, one product, one provider, one path is protecting a monopoly, not serving your needs. Genuine solutions create options. Captured systems eliminate them. UUON encourages independent verification and never positions itself as the only source of truth.</p>
                  </div>

                  <div data-testid="principle-6">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">6. Charity as Branding</h3>
                    <p>When a corporation's charitable giving is smaller than its marketing budget for that charity, the giving is advertising. Real philanthropy does not require a press release. UUON Foundation's mission is the work itself, not a marketing strategy built around the appearance of doing good.</p>
                  </div>

                  <div data-testid="principle-7">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">7. The Preemptive Disclaimer</h3>
                    <p>When a company gets ahead of a scandal by releasing a statement about their commitment to safety, ethics, or transparency before any wrongdoing is proven, they already know what is coming. UUON does not issue values statements as cover. The system's behavior is the statement.</p>
                  </div>

                  <div data-testid="principle-8">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">8. Manufactured Consensus</h3>
                    <p>Real science invites challenge. Manufactured consensus punishes it. When questioning a position gets you labeled dangerous without engagement with the actual evidence, the consensus is being protected by power, not by proof. UUON invites scrutiny. Every response is hashed, scored, and open to challenge.</p>
                  </div>

                  <div data-testid="principle-9">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">9. The Buried Correction</h3>
                    <p>The original false claim runs on the front page. The correction runs on page twelve three weeks later. This is not accidental. UUON does not bury corrections. When the system is wrong, the provenance layer and self-assessment engine make that visible, not hidden.</p>
                  </div>

                  <div data-testid="principle-10">
                    <h3 className="font-display text-primary text-sm font-bold uppercase tracking-wider">10. Poverty as a Product</h3>
                    <p>Any system that profits more when its customers fail than when they succeed is not serving those customers. Predatory lending, private prisons, for-profit addiction treatment, and certain insurance structures all make more money from suffering than from recovery. UUON does not profit from confusion, dependency, fear, or failure. The system is built to make you less dependent on it, not more.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-6" data-testid="text-master-tell">
                  <h3 className="font-display text-white text-sm font-bold uppercase tracking-wider">The Master Tell</h3>
                  <p>Follow the incentive. Not what they say. Not what they brand. Not what they donate. Find the mechanism by which money moves and ask who gets more of it when you stay confused, sick, afraid, indebted, or dependent. That entity is not your ally regardless of what the logo says. UUON is built so you can ask that question about this system too. The answer should always be verifiable.</p>
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="text-center mt-6 font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
          UUON Foundation Inc. · Universally United One Neuma
        </div>
      </div>
    </div>
  );
}
