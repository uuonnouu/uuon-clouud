import React, { useCallback, useRef, useState } from "react";

export function MediaLightbox(props: { src: string; alt?: string; onClose: () => void }) {
  return (
    <div onClick={props.onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
      <img src={props.src} alt={props.alt || ""} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 8, boxShadow: "0 0 40px rgba(255,180,60,0.25)" }} />
      <button onClick={props.onClose} aria-label="Close" style={{ position: "fixed", top: 18, right: 22, background: "none", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 16 }}>X</button>
    </div>
  );
}

export interface ScrapeResult {
  url: string; status: number; title: string; description: string;
  text: string; images: string[]; links: string[]; fetchedAt: string; sha256: string;
}

export function ScrapeCard(props: { result: ScrapeResult }) {
  const result = props.result;
  const [popup, setPopup] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ border: "1px solid rgba(120,170,255,0.35)", borderRadius: 10, padding: 14, margin: "8px 0", background: "#060a12", color: "#dde", fontFamily: "monospace", fontSize: 13, maxWidth: 640 }}>
      <div style={{ color: "#7ab0ff", marginBottom: 4 }}>{result.status} - {new URL(result.url).hostname}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{result.title || "(no title)"}</div>
      {result.description ? <div style={{ color: "#99a", margin: "4px 0" }}>{result.description}</div> : null}
      {result.images.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
          {result.images.map((src) => (
            <img key={src} src={src} loading="lazy" onClick={() => setPopup(src)} style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 6, cursor: "zoom-in", border: "1px solid rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      ) : null}
      <div style={{ whiteSpace: "pre-wrap", color: "#bbc" }}>
        {expanded ? result.text : result.text.slice(0, 400)}
        {result.text.length > 400 ? (
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: "#e0a53a", cursor: "pointer" }}>
            {expanded ? " show less" : " ...show more"}
          </button>
        ) : null}
      </div>
      <div style={{ color: "#556", marginTop: 6, fontSize: 11 }}>sha256 {result.sha256.slice(0, 16)}... - fetched {result.fetchedAt}</div>
      {popup ? <MediaLightbox src={popup} onClose={() => setPopup(null)} /> : null}
    </div>
  );
}

export function useClouudUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/clouud/upload", { method: "POST", body: form });
      if (!r.ok) {
        const body = await r.json();
        throw new Error(body.error || ("HTTP " + r.status));
      }
      setLastUpload(await r.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, []);

  const inputEl = <input ref={inputRef} type="file" hidden onChange={onChange} />;
  const pickFile = () => { if (inputRef.current) inputRef.current.click(); };
  return { pickFile: pickFile, uploading: uploading, lastUpload: lastUpload, error: error, inputEl: inputEl };
}
