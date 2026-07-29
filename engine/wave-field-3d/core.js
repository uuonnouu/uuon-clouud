/**
 * Wave Field 3D Engine — Core
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * LICENSE: USAL-1.0
 * This file is the proprietary core of the Wave Field 3D Engine.
 * It is NOT included in the public GitHub repository.
 * It is distributed separately under commercial license agreement.
 *
 * What this file contains:
 *   - surfCoord()  — unified surface coordinate abstraction (UUON IP)
 *   - WFE_ALG      — 24-algorithm catalog with shared fn() interface (UUON IP)
 *   - buildGLB()   — hand-built GLTF 2.0 morph-target GLB encoder (UUON IP)
 *   - doBake()     — deterministic frame sampler tied to the catalog (UUON IP)
 *
 * What this file does NOT contain:
 *   - Three.js (MIT — three.min.js)
 *   - OrbitControls (MIT)
 *   - Any UI/DOM code
 *   - Any rendering logic
 *
 * The individual wave equations implemented here (sine, Gerstner, Rayleigh,
 * Bessel, Phillips, etc.) are prior-art mathematics in the public domain.
 * The IP is in the unified interface, the surface coordinate abstraction,
 * and the morph-target export pipeline — not in any individual equation.
 *
 * @version 1.0.0
 * @author  Phillip Aguilar Ruiz III
 * @org     UUON Foundation Inc.
 * @contact phi1@uuonfoundation.com
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Surface Coordinate Abstraction
// IP: UUON Foundation Inc.
//
// Converts 3D vertex position on any supported primitive into a scalar `s`
// that all catalog algorithms consume identically. This is what makes the
// catalog shape-agnostic — the same fn(x,y,z,t,p,s) call works across
// sphere, cube, and pyramid without branching inside the algorithm.
//
// Sphere:  s = atan2(y,x) + acos(z/r)  — geodesic-like angular sum
// Cube:    s = |x| + |y| + |z|          — L1 (taxicab) norm
// Pyramid: s = √(x²+y²) + |z|           — radial + axial distance
// ─────────────────────────────────────────────────────────────────────────────
function WFE_surfCoord(shape, x, y, z) {
    if (shape === 'sphere') {
        const r = Math.sqrt(x*x + y*y + z*z) || 1;
        return Math.atan2(y, x) + Math.acos(Math.max(-1, Math.min(1, z / r)));
    }
    if (shape === 'cube') return Math.abs(x) + Math.abs(y) + Math.abs(z);
    return Math.sqrt(x*x + y*y) + Math.abs(z); // pyramid / cone
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Sin-Hash Noise
// Technique: public domain (GLSL sin-hash pattern)
// Used by: N₁, N₃, N₄, N₅, N₁₀ algorithms
//
// NOTE: This is NOT gradient Perlin noise. It is a fast sin-based hash
// that produces coherent-looking layered output. It does not have the
// gradient continuity properties of true Perlin or simplex noise.
// ─────────────────────────────────────────────────────────────────────────────
function WFE_hNoise(x, y) {
    const n = Math.sin((x || 0) * 12.9898 + (y || 0) * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Algorithm Catalog
// IP: UUON Foundation Inc. — catalog design, unified interface, registry
//
// Each entry: { name, desc, formula, fn }
//
// fn(x, y, z, t, p, s) → scalar displacement
//   x, y, z  — original vertex position
//   t        — time in seconds
//   p        — { A: amplitude, k: frequency, w: speed, oct: octaves }
//   s        — surface coordinate from WFE_surfCoord()
//
// The individual wave equations are prior-art mathematics.
// The IP is in the catalog architecture:
//   - the shared fn(x,y,z,t,p,s) signature
//   - the parameterization {A,k,w,oct} applied uniformly
//   - the surface coordinate `s` as the shared input coordinate
//   - the named registry structure enabling algorithm-agnostic rendering
// ─────────────────────────────────────────────────────────────────────────────
const WFE_ALG = {

    // ── Basic Functions ──────────────────────────────────────────────────────
    sine: {
        name:'F₁: SINE-001', desc:'Surface sine waves, distance propagation',
        formula:'F₁(s,t) = A sin(ks + ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.sin(p.k*s + p.w*t)
    },
    cosine: {
        name:'F₂: COSINE-001', desc:'Cosine wave patterns on surface',
        formula:'F₂(s,t) = A cos(ks + ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.cos(p.k*s + p.w*t)
    },
    composite: {
        name:'F₁₀: COMPOSITE-001', desc:'Harmonic superposition — Fourier series on surface',
        formula:'Σᵢ (A/i) sin(ik·s + iωt)',
        fn:(x,y,z,t,p,s)=> {
            let r = 0;
            for (let i = 1; i <= p.oct; i++) r += (p.A/i) * Math.sin(p.k*i*s + p.w*t*i);
            return r;
        }
    },
    modulated: {
        name:'F₁₁: MODULATED-001', desc:'Amplitude-modulated waves — carrier × envelope',
        formula:'A sin(k₁s+ω₁t) · cos(k₂s+ω₂t)',
        fn:(x,y,z,t,p,s)=> p.A * Math.sin(p.k*s + p.w*t) * Math.cos(p.k*0.3*s + p.w*t*0.7)
    },
    harmonic: {
        name:'F₁₂: HARMONIC-001', desc:'Fundamental + 2nd harmonic overtone',
        formula:'A(sin(ks+ωt) + 0.5cos(2ks+2ωt))',
        fn:(x,y,z,t,p,s)=> p.A * (Math.sin(p.k*s + p.w*t) + 0.5*Math.cos(2*p.k*s + 2*p.w*t))
    },

    // ── Damped Waves ─────────────────────────────────────────────────────────
    damped: {
        name:'F₁₈: DAMPED-001', desc:'Exponentially damped oscillations',
        formula:'A e^(−αt) sin(ks+ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.exp(-0.5*t) * Math.sin(p.k*s + p.w*t)
    },
    soliton: {
        name:'F₂₁: SOLITON-001', desc:'Solitary wave — hyperbolic secant envelope',
        formula:'A sech(α(s−vt)) sin(ks+ωt)',
        fn:(x,y,z,t,p,s)=> p.A * (1/Math.cosh(0.5*(s - p.w*t))) * Math.sin(p.k*s + p.w*t)
    },

    // ── Physical Models ───────────────────────────────────────────────────────
    water: {
        name:'G₁: DEEP-WATER-001', desc:'Deep water waves — dispersion ω²=gk',
        formula:'A sin(kλ + √(gk)·t)',
        fn:(x,y,z,t,p,s)=> p.A * Math.sin(p.k*Math.atan2(y,x) + Math.sqrt(9.81*p.k)*t*p.w*0.1)
    },
    shallow: {
        name:'G₂: SHALLOW-WATER-001', desc:'Shallow water — tanh dispersion at h=0.5',
        formula:'A tanh(kh) sin(ks+ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.tanh(p.k*0.5) * Math.sin(p.k*s + p.w*t)
    },
    gerstner: {
        name:'G₃: GERSTNER-001', desc:'Gerstner trochoidal waves — Q·cos form',
        formula:'A·Q cos(ks−ωt)',
        fn:(x,y,z,t,p,s)=> p.A * 0.3 * Math.cos(p.k*s - p.w*t)
    },
    capillary: {
        name:'C₁: CAPILLARY-001', desc:'Surface tension waves — ω²=(σ/ρ)k³+gk',
        formula:'A sin(k·lat + ω_cap·t)',
        fn:(x,y,z,t,p,s)=> {
            const k2 = p.k*5;
            const w2 = Math.sqrt(0.073*k2**3 + 9.81*k2);
            const lat = Math.asin(z / (Math.sqrt(x*x+y*y+z*z) || 1));
            return p.A * Math.sin(k2*lat + w2*t*p.w*0.05);
        }
    },
    faraday: {
        name:'C₄: FARADAY-001', desc:'Faraday parametric resonance',
        formula:'A(1+Q cos(2ωt)) sin(ks+ωt)',
        fn:(x,y,z,t,p,s)=> p.A * (1 + 0.3*Math.cos(2*p.w*t)) * Math.sin(p.k*s + p.w*t)
    },

    // ── Ripples & Interference ────────────────────────────────────────────────
    ripple: {
        name:'R₁: RIPPLE-001', desc:'Circular ripples — 1/√r cylindrical decay',
        formula:'A/√r · sin(kr−ωt)',
        fn:(x,y,z,t,p,s)=> {
            const th = Math.acos(z / (Math.sqrt(x*x+y*y+z*z) || 1));
            const r  = th + 0.1;
            return (p.A / Math.sqrt(r)) * Math.sin(p.k*r - p.w*t);
        }
    },
    bessel: {
        name:'R₂: BESSEL-RIPPLE-001', desc:'Bessel J₀ function ripple modes',
        formula:'A · J₀(kr) cos(ωt)',
        fn:(x,y,z,t,p,s)=> {
            const r = Math.sqrt(x*x + y*y);
            return p.A * (Math.cos(p.k*r) / Math.sqrt(p.k*r + 0.1)) * Math.cos(p.w*t);
        }
    },
    standing: {
        name:'I₃: STANDING-WAVE-001', desc:'Standing wave — sin(ks)cos(ωt)',
        formula:'A sin(ks) cos(ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.sin(p.k*s) * Math.cos(p.w*t)
    },
    beats: {
        name:'I₂: BEAT-PATTERN-001', desc:'Beat interference — two-frequency superposition',
        formula:'A cos(Δk·s/2) sin(k̄s−ω̄t)',
        fn:(x,y,z,t,p,s)=> p.A * Math.cos(p.k*0.1*s) * Math.sin(p.k*s - p.w*t)
    },

    // ── Seismic Waves ─────────────────────────────────────────────────────────
    rayleigh: {
        name:'S₃: RAYLEIGH-001', desc:'Rayleigh surface seismic — exp depth decay',
        formula:'A e^(−αs) sin(ks−ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.exp(-0.1*s) * Math.sin(p.k*s - p.w*t)
    },
    love: {
        name:'S₄: LOVE-001', desc:'Love waves — transverse, layer-guided',
        formula:'A e^(−β|z|) sin(kx−ωt)',
        fn:(x,y,z,t,p,s)=> p.A * Math.exp(-Math.abs(z)*0.5) * Math.sin(p.k*x - p.w*t)
    },

    // ── Noise Functions ───────────────────────────────────────────────────────
    // NOTE: All N-class algorithms use WFE_hNoise() — sin-hash, not gradient Perlin.
    perlin: {
        name:'N₁: LAYERED-HASH-001', desc:'Layered sin-hash noise (coherent approximation)',
        formula:'Σ (A/2ⁱ) hNoise(2ⁱk·θ, φ)',
        fn:(x,y,z,t,p,s)=> {
            const th = Math.atan2(y,x);
            const ph = Math.acos(z / (Math.sqrt(x*x+y*y+z*z) || 1));
            return p.A * (
                WFE_hNoise(th*p.k + t*p.w,   ph*p.k)       +
                0.5 * WFE_hNoise(th*p.k*2 + t*p.w*1.5, ph*p.k*2) +
                0.25* WFE_hNoise(th*p.k*4 + t*p.w*2,   ph*p.k*4)
            ) / 1.75;
        }
    },
    fbm: {
        name:'N₃: FBM-001', desc:'Fractal Brownian Motion — octave-summed hash noise',
        formula:'Σᵢ (1/2ⁱ) hNoise(2ⁱk·θ, φ)',
        fn:(x,y,z,t,p,s)=> {
            const th=Math.atan2(y,x), ph=Math.acos(z/(Math.sqrt(x*x+y*y+z*z)||1));
            let r=0, a=p.A, f=p.k;
            for (let i=0;i<p.oct;i++){r+=a*WFE_hNoise(th*f+t*p.w,ph*f);a*=0.5;f*=2;}
            return r/2;
        }
    },
    ridged: {
        name:'N₄: RIDGED-001', desc:'Ridged multifractal — 1−|noise| per octave',
        formula:'Σ (1/2ⁱ)(1−|hNoise|)',
        fn:(x,y,z,t,p,s)=> {
            const th=Math.atan2(y,x), ph=Math.acos(z/(Math.sqrt(x*x+y*y+z*z)||1));
            let r=0, a=p.A, f=p.k;
            for (let i=0;i<p.oct;i++){r+=a*(1-Math.abs(WFE_hNoise(th*f+t*p.w,ph*f)));a*=0.5;f*=2;}
            return r/2;
        }
    },
    turbulence: {
        name:'N₅: TURBULENCE-001', desc:'Turbulence — absolute-value layered noise',
        formula:'Σ (1/2ⁱ)|hNoise(2ⁱk·θ, φ)|',
        fn:(x,y,z,t,p,s)=> {
            const th=Math.atan2(y,x), ph=Math.acos(z/(Math.sqrt(x*x+y*y+z*z)||1));
            let r=0, a=p.A, f=p.k;
            for (let i=0;i<p.oct;i++){r+=a*Math.abs(WFE_hNoise(th*f+t*p.w,ph*f));a*=0.5;f*=2;}
            return r/2;
        }
    },
    curl: {
        name:'N₁₀: CURL-001', desc:'Curl of hash noise field — divergence-free flow',
        formula:'(∂N/∂θ) · k  ≈ ∇×N',
        fn:(x,y,z,t,p,s)=> {
            const th=Math.atan2(y,x), ph=Math.acos(z/(Math.sqrt(x*x+y*y+z*z)||1)), dx=0.01;
            return p.A * ((WFE_hNoise(th+dx, ph+t*p.w) - WFE_hNoise(th-dx, ph+t*p.w)) / (2*dx)) * p.k;
        }
    },

    // ── Spectral Methods ──────────────────────────────────────────────────────
    fft_ocean: {
        name:'FFT₁: FFT-OCEAN-001', desc:'FFT ocean — cosine superposition with dispersion',
        formula:'Σ (A/i) cos(ik·s − √(gik)·t)',
        fn:(x,y,z,t,p,s)=> {
            let r=0;
            for (let i=1;i<=p.oct;i++){const ki=p.k*i; r+=(p.A/i)*Math.cos(ki*s-Math.sqrt(9.81*ki)*t*p.w*0.1);}
            return r;
        }
    },
    phillips: {
        name:'FFT₃: PHILLIPS-001', desc:'Phillips spectrum ocean energy distribution',
        formula:'P(k)=A/k⁴·exp(−1/(kL)²)',
        fn:(x,y,z,t,p,s)=> p.A * ((1/(p.k*p.k)) * Math.exp(-1/(p.k*p.k))) * Math.sin(p.k*s - p.w*t)
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Deterministic Frame Sampler
// IP: UUON Foundation Inc.
//
// Samples the displacement field at N discrete time steps over a given
// duration. Produces an array of Float32Arrays — one absolute position
// array per frame. These feed directly into buildGLB().
//
// The direct path from any catalog entry → baked frame array → valid GLB
// is the proprietary pipeline. The catalog is the key, not the loop.
// ─────────────────────────────────────────────────────────────────────────────
function WFE_bake(origPositions, shape, algKey, params, frameCount, duration) {
    const alg    = WFE_ALG[algKey];
    const vCount = origPositions.length / 3;
    const frames = [];

    for (let f = 0; f < frameCount; f++) {
        const t   = (f / frameCount) * duration;
        const arr = new Float32Array(origPositions.length);
        for (let i = 0; i < vCount; i++) {
            const x = origPositions[i*3];
            const y = origPositions[i*3+1];
            const z = origPositions[i*3+2];
            const s = WFE_surfCoord(shape, x, y, z);
            const d = alg.fn(x, y, z, t, params, s);
            const len = Math.sqrt(x*x + y*y + z*z) || 1;
            arr[i*3]   = x + (x/len)*d;
            arr[i*3+1] = y + (y/len)*d;
            arr[i*3+2] = z + (z/len)*d;
        }
        frames.push(arr);
    }
    return frames;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: GLB Encoder
// IP: UUON Foundation Inc. — implementation
// Spec: Khronos GLTF 2.0 (open standard — the format is not IP)
//
// What is proprietary:
//   - The direct integration of WFE_bake() output into the GLB binary layout
//   - The delta-position morph target encoding tied to the frame sampler
//   - The weight-track animation construction from the frame index array
//   - The metadata sidecar schema (model_family, algorithm, formula, params)
//
// What is not proprietary:
//   - The GLTF 2.0 binary format (Khronos open standard)
//   - The GLB chunk structure (public spec)
// ─────────────────────────────────────────────────────────────────────────────
function WFE_buildGLB(origPositions, indexArray, bakedFrames, meta) {
    const { frameCount, duration, vCount } = meta;
    const orig = origPositions;
    const idx  = indexArray;

    function mm(arr, stride) {
        const mn=[], mx=[];
        for (let d=0;d<stride;d++){mn.push(Infinity);mx.push(-Infinity);}
        for (let i=0;i<arr.length/stride;i++)
            for (let d=0;d<stride;d++){
                const v=arr[i*stride+d];
                if(v<mn[d])mn[d]=v; if(v>mx[d])mx[d]=v;
            }
        return {min:mn,max:mx};
    }

    const posBytes   = vCount*3*4;
    const idxBytes   = idx ? idx.length*2 : 0;
    const idxPad     = idxBytes%4 ? 4-idxBytes%4 : 0;
    const morphBytes = vCount*3*4;

    const animTimes = new Float32Array(frameCount+1);
    for (let f=0;f<=frameCount;f++) animTimes[f]=(f/frameCount)*duration;

    const animWts = new Float32Array((frameCount+1)*frameCount);
    for (let f=0;f<=frameCount;f++){
        const fi=f%frameCount;
        for (let mt=0;mt<frameCount;mt++) animWts[f*frameCount+mt]=(fi===mt)?1:0;
    }

    const totalBin = posBytes+idxBytes+idxPad+morphBytes*frameCount
                     +animTimes.byteLength+animWts.byteLength;

    const binBuf=new ArrayBuffer(totalBin);
    const dv=new DataView(binBuf);
    const u8=new Uint8Array(binBuf);
    let off=0;

    const posOff=off;
    for(let i=0;i<orig.length;i++){dv.setFloat32(off,orig[i],true);off+=4;}

    const idxOff=idxBytes>0?off:-1;
    if(idx){for(let i=0;i<idx.length;i++){dv.setUint16(off,idx[i],true);off+=2;}off+=idxPad;}

    const morphOffs=[];
    for(let f=0;f<frameCount;f++){
        morphOffs.push(off);
        const fr=bakedFrames[f];
        for(let i=0;i<vCount;i++){
            dv.setFloat32(off,fr[i*3]-orig[i*3],true);     off+=4;
            dv.setFloat32(off,fr[i*3+1]-orig[i*3+1],true); off+=4;
            dv.setFloat32(off,fr[i*3+2]-orig[i*3+2],true); off+=4;
        }
    }

    const animTimeOff=off;
    u8.set(new Uint8Array(animTimes.buffer),off); off+=animTimes.byteLength;
    const animWtOff=off;
    u8.set(new Uint8Array(animWts.buffer),off); off+=animWts.byteLength;

    const bvs=[],accs=[];
    function addBV(byteOffset,byteLength,target){
        const bv={buffer:0,byteOffset,byteLength};if(target)bv.target=target;
        bvs.push(bv);return bvs.length-1;
    }
    function addAcc(bvIdx,compType,type,count,min,max){
        const ac={bufferView:bvIdx,componentType:compType,type,count};
        if(min)ac.min=min;if(max)ac.max=max;
        accs.push(ac);return accs.length-1;
    }

    const posMM=mm(orig,3);
    const posBv=addBV(posOff,posBytes,34962);
    const posAcc=addAcc(posBv,5126,'VEC3',vCount,posMM.min,posMM.max);

    let idxAcc=-1;
    if(idx){
        const idxBv=addBV(idxOff,idxBytes,34963);
        idxAcc=addAcc(idxBv,5123,'SCALAR',idx.length,[0],[Math.max(...idx)]);
    }

    const morphAccs=[];
    for(let f=0;f<frameCount;f++){
        const delta=new Float32Array(vCount*3);
        const fr=bakedFrames[f];
        for(let i=0;i<vCount;i++){
            delta[i*3]=fr[i*3]-orig[i*3];
            delta[i*3+1]=fr[i*3+1]-orig[i*3+1];
            delta[i*3+2]=fr[i*3+2]-orig[i*3+2];
        }
        const dMM=mm(delta,3);
        const bv=addBV(morphOffs[f],morphBytes,34962);
        morphAccs.push(addAcc(bv,5126,'VEC3',vCount,dMM.min,dMM.max));
    }

    const timeMM=mm(animTimes,1);
    const timeBv=addBV(animTimeOff,animTimes.byteLength);
    const timeAcc=addAcc(timeBv,5126,'SCALAR',frameCount+1,timeMM.min,timeMM.max);

    const wtBv=addBV(animWtOff,animWts.byteLength);
    const wtAcc=addAcc(wtBv,5126,'SCALAR',(frameCount+1)*frameCount);

    const prim={attributes:{POSITION:posAcc},targets:morphAccs.map(i=>({POSITION:i}))};
    if(idxAcc>=0)prim.indices=idxAcc;

    const gltf={
        asset:{version:'2.0',
               generator:'UUON Foundation Inc. Wave Field 3D Engine v1.0',
               copyright:'Phillip Aguilar Ruiz III / UUON Foundation Inc. USAL-1.0'},
        scene:0,scenes:[{nodes:[0]}],
        nodes:[{mesh:0,name:'wave_field_mesh'}],
        meshes:[{name:'wave_field',primitives:[prim],weights:new Array(frameCount).fill(0)}],
        buffers:[{byteLength:totalBin}],
        bufferViews:bvs,accessors:accs,
        animations:[{
            name:'wave_loop',
            samplers:[{input:timeAcc,output:wtAcc,interpolation:'LINEAR'}],
            channels:[{sampler:0,target:{node:0,path:'weights'}}]
        }]
    };

    const jsonBytes=new TextEncoder().encode(JSON.stringify(gltf));
    const jsonPad=jsonBytes.length%4?4-jsonBytes.length%4:0;
    const jLen=jsonBytes.length+jsonPad;
    const binPad=totalBin%4?4-totalBin%4:0;
    const bLen=totalBin+binPad;
    const total=12+8+jLen+8+bLen;

    const out=new ArrayBuffer(total);
    const odv=new DataView(out);
    const ou8=new Uint8Array(out);
    let wo=0;

    odv.setUint32(wo,0x46546C67,true);wo+=4;
    odv.setUint32(wo,2,true);wo+=4;
    odv.setUint32(wo,total,true);wo+=4;

    odv.setUint32(wo,jLen,true);wo+=4;
    odv.setUint32(wo,0x4E4F534A,true);wo+=4;
    ou8.set(jsonBytes,wo);wo+=jsonBytes.length;
    for(let i=0;i<jsonPad;i++){odv.setUint8(wo,0x20);wo++;}

    odv.setUint32(wo,bLen,true);wo+=4;
    odv.setUint32(wo,0x004E4942,true);wo+=4;
    ou8.set(new Uint8Array(binBuf),wo);wo+=totalBin;
    for(let i=0;i<binPad;i++){odv.setUint8(wo,0);wo++;}

    return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Public API surface
// What you expose to the renderer (index.html) and to future SDK consumers
// ─────────────────────────────────────────────────────────────────────────────
window.WFE = {
    algorithms:  WFE_ALG,
    surfCoord:   WFE_surfCoord,
    bake:        WFE_bake,
    buildGLB:    WFE_buildGLB
};
