import { useState } from "react";
import FractalSkinGenerator from "@/components/FRACTAL-SKIN-GENERATOR";

const PRODUCTS = [
  {
    id: "hermite-pack",
    title: "Hermite-Gaussian Surface Pack",
    algorithm: "HERMITE-GAUSS-001",
    price: 29,
    extPrice: 149,
    description: "5 meshes. Organic field-driven surface displacement from H_x × H_y Gaussian equations.",
    tags: ["organic", "smooth", "natural textures"],
    cgtraderUrl: "https://www.cgtrader.com/uuon-foundation",
  },
  {
    id: "vortex-pack",
    title: "Laguerre-Gaussian Vortex Collection",
    algorithm: "LAGUERRE-GAUSS-001",
    price: 29,
    extPrice: 149,
    description: "6 meshes. Spiral vortex surfaces from optical angular momentum equations.",
    tags: ["spiral", "vortex", "sci-fi"],
    cgtraderUrl: "https://www.cgtrader.com/uuon-foundation",
  },
  {
    id: "sem-burn",
    title: "SEM Burn Pattern Pack",
    algorithm: "GLL + MORTAR + DG-SPECTRAL",
    price: 39,
    extPrice: 199,
    description: "24 meshes. 6 spectral element burn algorithms × 4 shapes. CFD-grade geometry.",
    tags: ["burn", "energy", "CFD", "scientific"],
    cgtraderUrl: "https://www.cgtrader.com/uuon-foundation",
  },
  {
    id: "complete-bundle",
    title: "Complete Physics Surface Library",
    algorithm: "All 14 algorithms",
    price: 49,
    extPrice: 299,
    description: "70 meshes. Every algorithm. Every shape. Full provenance manifest included.",
    tags: ["bundle", "complete", "best value"],
    cgtraderUrl: "https://www.cgtrader.com/uuon-foundation",
    featured: true,
  },
];

const ALGORITHMS_EXPLAINED = [
  { group: "Electromagnetic Field Modes", color: "#00e5cc", items: [
    { id: "EM-PLANE",       desc: "Plane wave propagation. A sin(k·r − ωt)" },
    { id: "TEM-00",         desc: "Transverse electromagnetic. Smooth Gaussian envelope" },
    { id: "TE-10",          desc: "Transverse electric. Structured standing wave pattern" },
    { id: "TM-11",          desc: "Transverse magnetic. Radially symmetric displacement" },
    { id: "GAUSSIAN-BEAM",  desc: "Focused beam profile with Rayleigh range falloff" },
    { id: "HERMITE-GAUSS",  desc: "H_mn beam mode. Complex cross-sectional patterns" },
    { id: "LAGUERRE-GAUSS", desc: "LG beam. Spiral vortex from orbital angular momentum" },
    { id: "SPHERICAL-H",    desc: "Y_lm spherical harmonic. Seamless sphere mapping" },
  ]},
  { group: "Spectral Element Burn Modes", color: "#ff8a3d", items: [
    { id: "GLL",         desc: "Gauss-Lobatto-Legendre. Energy concentrates at quadrature nodes" },
    { id: "GRL",         desc: "Gauss-Radau-Legendre. Asymmetric one-sided burn propagation" },
    { id: "GL",          desc: "Gauss-Legendre. Smooth thermal gradient fields" },
    { id: "MORTAR",      desc: "Mortar element method. Fracture and crack patterns" },
    { id: "hp-SEM",      desc: "hp-refinement. 3 overlapping frequency cascades" },
    { id: "DG-SPECTRAL", desc: "Discontinuous Galerkin. Cellular energy boundary walls" },
  ]},
];

export default function FractalSkinShowcase() {
  const [activeTab, setActiveTab] = useState<"try" | "buy" | "about">("try");

  return (
    <div style={{ minHeight: "100vh", background: "#04080f", color: "#fff", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 24px 0", textAlign: "center", borderBottom: "1px solid rgba(0,229,204,0.15)" }}>
        <div style={{ fontSize: 11, color: "#7b5ea7", letterSpacing: 3, marginBottom: 8 }}>UUON FOUNDATION INC.</div>
        <h1 style={{ fontSize: 28, fontWeight: "normal", color: "#00e5cc", letterSpacing: 2, margin: "0 0 8px" }}>
          FRACTAL SKIN GENERATOR
        </h1>
        <p style={{ fontSize: 13, color: "#9aa", maxWidth: 560, margin: "0 auto 24px", lineHeight: 1.6 }}>
          14 physics algorithms. Real electromagnetic field equations applied as 3D surface displacement.
          No sculpting. No AI. The math runs — the mesh emerges.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: -1 }}>
          {(["try", "buy", "about"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 28px", background: activeTab === tab ? "rgba(0,229,204,0.1)" : "transparent",
                border: "1px solid rgba(0,229,204,0.25)", borderBottom: activeTab === tab ? "1px solid #04080f" : "1px solid rgba(0,229,204,0.25)",
                color: activeTab === tab ? "#00e5cc" : "#666", cursor: "pointer", fontSize: 12, letterSpacing: 1,
                marginRight: -1,
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: TRY ── */}
      {activeTab === "try" && (
        <div style={{ padding: "0 0 40px" }}>
          <FractalSkinGenerator />
          <div style={{ padding: "24px 24px 0", textAlign: "center", color: "#9aa", fontSize: 12, lineHeight: 1.8 }}>
            <p>Export OBJ → your mesh, your provenance token embedded in the file header.</p>
            <p>Export PNG → LSB steganographic watermark embedded invisibly in the bottom row of pixels.</p>
            <p>Every export carries a UUON session hash — verifiable at{" "}
              <span style={{ color: "#00e5cc" }}>uuon.world/app/verify</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Tab: BUY ── */}
      {activeTab === "buy" && (
        <div style={{ padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ color: "#9aa", fontSize: 13 }}>
                Pre-generated packs with high-density exports (64–128 mesh resolution),
                full provenance manifest, and re-export rights for renders and animations.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {PRODUCTS.map(p => (
                <div key={p.id} style={{
                  background: p.featured ? "rgba(0,229,204,0.05)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${p.featured ? "#00e5cc" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 8, padding: 20, position: "relative",
                }}>
                  {p.featured && (
                    <div style={{ position: "absolute", top: -1, right: 16, background: "#00e5cc", color: "#04080f", fontSize: 9, padding: "2px 8px", fontWeight: "bold", letterSpacing: 1 }}>
                      BEST VALUE
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: "#7b5ea7", letterSpacing: 1, marginBottom: 6 }}>{p.algorithm}</div>
                  <h3 style={{ fontSize: 13, color: "#fff", margin: "0 0 8px", fontWeight: "normal" }}>{p.title}</h3>
                  <p style={{ fontSize: 11, color: "#9aa", lineHeight: 1.5, margin: "0 0 12px" }}>{p.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize: 9, background: "rgba(0,229,204,0.1)", color: "#00e5cc", padding: "2px 6px", borderRadius: 3 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 18, color: "#c9a84c", fontWeight: "bold" }}>${p.price}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>Standard · ${p.extPrice} Extended commercial</div>
                  </div>
                  <a
                    href={p.cgtraderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", padding: "8px", background: "rgba(201,168,76,0.15)", border: "1px solid #c9a84c", color: "#c9a84c", borderRadius: 4, fontSize: 11, textDecoration: "none", cursor: "pointer" }}
                  >
                    Buy on CGTrader →
                  </a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: 24, background: "rgba(123,94,167,0.08)", border: "1px solid rgba(123,94,167,0.3)", borderRadius: 8 }}>
              <h3 style={{ color: "#7b5ea7", fontSize: 14, marginBottom: 12 }}>License Tiers</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 12, color: "#9aa", lineHeight: 1.8 }}>
                <div>
                  <div style={{ color: "#00e5cc", marginBottom: 6 }}>Standard License</div>
                  ✅ Personal projects<br />
                  ✅ Educational use<br />
                  ✅ Portfolio and social media<br />
                  ✅ YouTube / streaming<br />
                  ❌ Client deliverables<br />
                  ❌ Commercial products or apps<br />
                  ❌ Game engine distribution<br />
                </div>
                <div>
                  <div style={{ color: "#c9a84c", marginBottom: 6 }}>Extended Commercial License</div>
                  ✅ All Standard uses<br />
                  ✅ Client work and deliverables<br />
                  ✅ Games and interactive apps<br />
                  ✅ Broadcast and film<br />
                  ✅ Product packaging and print<br />
                  ✅ Resale as part of a larger product<br />
                  ✅ Unlimited end-users<br />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: ABOUT ── */}
      {activeTab === "about" && (
        <div style={{ padding: "40px 24px", maxWidth: 720, margin: "0 auto" }}>

          <h2 style={{ color: "#00e5cc", fontSize: 16, fontWeight: "normal", letterSpacing: 2, marginBottom: 24 }}>HOW IT WORKS</h2>

          {ALGORITHMS_EXPLAINED.map(group => (
            <div key={group.group} style={{ marginBottom: 32 }}>
              <h3 style={{ color: group.color, fontSize: 12, letterSpacing: 2, marginBottom: 16 }}>{group.group.toUpperCase()}</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {group.items.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: 12, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${group.color}`, borderRadius: "0 4px 4px 0" }}>
                    <div style={{ minWidth: 120, fontSize: 10, color: group.color, fontWeight: "bold" }}>{item.id}</div>
                    <div style={{ fontSize: 11, color: "#9aa", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 20, background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8 }}>
            <h3 style={{ color: "#c9a84c", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>PROVENANCE</h3>
            <p style={{ fontSize: 12, color: "#9aa", lineHeight: 1.8, margin: 0 }}>
              Every export from this tool carries embedded provenance.<br /><br />
              OBJ files include a full header block: session hash, timestamp, algorithm name,
              shape, parameters, and attribution to UUON Foundation Inc.<br /><br />
              PNG exports carry an LSB steganographic watermark: the session hash is encoded
              into the least significant bit of the blue channel in the bottom row of pixels.
              Imperceptible to the eye. Machine-verifiable.<br /><br />
              Verify any export at: <span style={{ color: "#00e5cc" }}>uuon.world/app/verify</span>
            </p>
          </div>

          <div style={{ marginTop: 24, padding: 20, background: "rgba(0,0,0,0.3)", borderRadius: 8 }}>
            <h3 style={{ color: "#7b5ea7", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>ABOUT UUON FOUNDATION</h3>
            <p style={{ fontSize: 12, color: "#9aa", lineHeight: 1.8, margin: "0 0 12px" }}>
              UUON Foundation Inc. builds tools that make mathematics visible.
              Over 2,642 physics-derived 3D shapes across 35 mathematical domains.
              Every model is generated from real formulas — quantum mechanics, topology,
              electromagnetic theory, spectral analysis.
            </p>
            <p style={{ fontSize: 12, color: "#9aa", lineHeight: 1.8, margin: "0 0 12px" }}>
              The Fractal Skin Generator is one tool in a larger ecosystem that includes
              ©LOUUD (the AI reasoning machine), Dmension (the mathematical universe explorer),
              and the G°centric Lattice (bounded rational arithmetic framework).
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              {[
                { label: "GitHub", url: "https://github.com/UUON-Foundation" },
                { label: "Sketchfab", url: "https://sketchfab.com/uuon-foundation" },
                { label: "CGTrader", url: "https://www.cgtrader.com/uuon-foundation" },
                { label: "Dmension", url: "https://uuon.world/app" },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "#00e5cc", border: "1px solid rgba(0,229,204,0.3)", padding: "6px 12px", borderRadius: 4, textDecoration: "none" }}>
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(201,168,76,0.2)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: "#7b5ea7", letterSpacing: 1 }}>©LOUUD — UUON FOUNDATION INC. 2026</div>
        <div style={{ fontSize: 10, color: "#444" }}>The Earth is the zero-point. All reasoning begins here.</div>
      </div>
    </div>
  );
}
