/**
 * UUON Foundation — MultidimensionalShapeEngine  v2
 * FIX: Expands from 4-parameter stub to full 26-parameter (a-z) shader bridge.
 *
 * Parameter groups:
 *   Geometry  (a,b,c,d)   — scale / radius / depth / 4th dimension
 *   Rotation  (e,f,g)     — roll / pitch / yaw
 *   Position  (h,i,j)     — x/y/z translation offset
 *   Frequency (k,l,m)     — wave / lattice / resonance frequencies
 *   Amplitude (n,o,p)     — morph / twist / fold amplitudes
 *   Phase     (q,r,s)     — angular offsets per axis
 *   Color     (t,u,v)     — hue shift / saturation / brightness
 *   Special   (w,x,y,z)   — chaos / entropy / quantum / time-dilation
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import * as THREE from "three";

// ── Vertex Shader — full 26-uniform morph matrix ──────────────────────────────
const vertexShaderCode = `
  uniform float uTime;

  // GROUP A — Geometry
  uniform float pa;   // scale X
  uniform float pb;   // scale Y
  uniform float pc;   // scale Z
  uniform float pd;   // 4D depth factor

  // GROUP B — Rotation offsets (radians)
  uniform float pe;   // roll  offset
  uniform float pf;   // pitch offset
  uniform float pg;   // yaw   offset

  // GROUP C — Translation
  uniform float ph;   // x translate
  uniform float pi;   // y translate
  uniform float pj;   // z translate

  // GROUP D — Frequencies
  uniform float pk;   // wave frequency X
  uniform float pl;   // wave frequency Y
  uniform float pm;   // resonance frequency

  // GROUP E — Amplitudes
  uniform float pn;   // morph amplitude
  uniform float po;   // twist amplitude
  uniform float pp;   // fold amplitude

  // GROUP F — Phase
  uniform float pq;   // phase X
  uniform float pr;   // phase Y
  uniform float ps;   // phase Z

  // GROUP G — Color influence on geometry
  uniform float pt;   // hue-driven geometry offset
  uniform float pu;   // saturation-driven displacement
  uniform float pv;   // brightness-driven normal shift

  // GROUP H — Special / chaos
  uniform float pw;   // chaos factor
  uniform float px;   // entropy seed
  uniform float py;   // quantum jitter
  uniform float pz;   // time-dilation scalar

  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vDisplacement;

  // Pseudo-random for chaos / quantum jitter
  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vNormal = normal;
    vUv     = uv;

    vec3 pos = position;

    // ── Geometry scaling ───────────────────────────────────────────────────
    pos *= vec3(max(pa, 0.001), max(pb, 0.001), max(pc, 0.001));

    // ── Primary wave deformation ───────────────────────────────────────────
    float waveX = sin(pos.y * pk + uTime * pz + pq) * pn;
    float waveY = sin(pos.z * pl + uTime * pz + pr) * po;
    float waveZ = cos(pos.x * pm + uTime * pz + ps) * pp;

    // ── 4D depth fold (pd drives w-axis projection) ────────────────────────
    float wCoord = pd * sin(pos.x * 0.5 + uTime * 0.3);
    float proj   = 2.0 / (2.0 - wCoord * 0.4);
    pos         *= proj;

    // ── Twist (rotation that scales with height) ───────────────────────────
    float twist  = po * pos.y * 0.01;
    float cx     = cos(twist + pg);
    float sx     = sin(twist + pg);
    pos.xz       = vec2(pos.x * cx - pos.z * sx, pos.x * sx + pos.z * cx);

    // ── Normal displacement (frequency-based) ──────────────────────────────
    float normalDisp = waveX + waveY + waveZ;
    normalDisp      += pu * sin(pos.y * pk * 2.0 + uTime);   // saturation layer
    normalDisp      += pv * cos(pos.x * pl * 2.0 + uTime);   // brightness layer
    pos             += normal * normalDisp;

    // ── Translation ────────────────────────────────────────────────────────
    pos += vec3(ph, pi, pj);

    // ── Chaos / quantum jitter ─────────────────────────────────────────────
    float jitter = py * rand(vUv + vec2(uTime * 0.01, px));
    pos         += normal * jitter * pw;

    // ── Color influence (geometry feedback) ────────────────────────────────
    pos.y += pt * sin(pos.x * 3.0 + uTime * 0.5) * 0.05;

    vDisplacement = normalDisp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ── Fragment Shader — displacement-driven spectrum + hue shift ────────────────
const fragmentShaderCode = `
  varying vec3  vNormal;
  varying vec2  vUv;
  varying float vDisplacement;

  uniform float uTime;
  uniform float pt;   // hue shift
  uniform float pu;   // saturation
  uniform float pv;   // brightness
  uniform float pw;   // chaos (affects color variance)

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // Base hue from normal vector + time + hue-shift param
    float hue  = 0.5 + 0.5 * cos(uTime * 0.3 + vNormal.x * 2.0 + pt * 6.28318);
    float sat  = clamp(0.6 + pu * 0.4, 0.0, 1.0);
    float bri  = clamp(0.5 + pv * 0.5 + vDisplacement * 0.2, 0.0, 1.0);

    // Chaos tints the colour slightly per fragment
    hue += pw * 0.02 * sin(vUv.x * 17.0 + vUv.y * 13.0 + uTime);

    vec3 color = hsv2rgb(vec3(hue, sat, bri));
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ── Parameter defaults (mirrors 26-param system) ──────────────────────────────
const DEFAULT_PARAMS: Record<string, number> = {
  pa: 1.0,  pb: 1.0,  pc: 1.0,  pd: 0.0,   // geometry
  pe: 0.0,  pf: 0.0,  pg: 0.0,              // rotation offset
  ph: 0.0,  pi: 0.0,  pj: 0.0,              // translation
  pk: 1.11, pl: 1.11, pm: 1.11,             // frequencies
  pn: 0.15, po: 0.05, pp: 0.05,             // amplitudes
  pq: 0.0,  pr: 0.0,  ps: 0.0,              // phase
  pt: 0.0,  pu: 0.0,  pv: 0.0,              // colour influence
  pw: 0.0,  px: 0.0,  py: 0.0,  pz: 0.333, // special/chaos
};

// ── Engine ────────────────────────────────────────────────────────────────────

export class MultidimensionalShapeEngine {
  private scene:          THREE.Scene;
  private camera:         THREE.PerspectiveCamera;
  private renderer:       THREE.WebGLRenderer;
  private mesh:           THREE.Mesh;
  private shaderMaterial: THREE.ShaderMaterial;
  private animFrameId:    number | null = null;

  constructor(canvasContainerId: string) {
    const container = document.getElementById(canvasContainerId);
    if (!container) throw new Error(`Canvas container "${canvasContainerId}" not found.`);

    this.scene    = new THREE.Scene();
    this.camera   = new THREE.PerspectiveCamera(
      75, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Build uniforms from defaults — one entry per parameter
    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0.0 },
    };
    for (const [key, val] of Object.entries(DEFAULT_PARAMS)) {
      uniforms[key] = { value: val };
    }

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader:   vertexShaderCode,
      fragmentShader: fragmentShaderCode,
      uniforms,
      side: THREE.DoubleSide,
    });

    const geometry = new THREE.IcosahedronGeometry(2, 64);
    this.mesh      = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(this.mesh);

    this.camera.position.z = 5;

    // Resize handler
    window.addEventListener("resize", this.onResize);

    this.animate();
  }

  /**
   * Synchronise all 26 parameters from DB morph-parameter record.
   * Accepts both "pa"/"pb" keys and legacy "p1_freq"/"p2_amp" keys.
   */
  public synchronizeMatrixParameters(dbParams: Record<string, any>): void {
    if (!dbParams) return;

    const u = this.shaderMaterial.uniforms;

    // Accept new-style keys (pa, pb … pz)
    for (const key of Object.keys(DEFAULT_PARAMS)) {
      if (dbParams[key] !== undefined) {
        u[key].value = parseFloat(dbParams[key]);
      }
    }

    // Legacy key shim (p1_freq → pk, p2_amp → pn, p3_spin → pg, p4_res → pm)
    if (dbParams.p1_freq !== undefined) u.pk.value = parseFloat(dbParams.p1_freq);
    if (dbParams.p2_amp  !== undefined) u.pn.value = parseFloat(dbParams.p2_amp) * 0.01;
    if (dbParams.p3_spin !== undefined) u.pz.value = parseFloat(dbParams.p3_spin);
    if (dbParams.p4_res  !== undefined) u.pm.value = parseFloat(dbParams.p4_res);
  }

  /** Animate a single parameter change with linear interpolation. */
  public tweenParameter(key: string, targetValue: number, durationMs = 500): void {
    const u = this.shaderMaterial.uniforms[key];
    if (!u) return;
    const start      = u.value as number;
    const startTime  = performance.now();
    const step = () => {
      const t = Math.min((performance.now() - startTime) / durationMs, 1);
      u.value = start + (targetValue - start) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Swap geometry while keeping material / uniforms intact. */
  public setGeometry(geometry: THREE.BufferGeometry): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
  }

  public dispose(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener("resize", this.onResize);
    this.mesh.geometry.dispose();
    this.shaderMaterial.dispose();
    this.renderer.dispose();
  }

  private onResize = (): void => {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  };

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    this.shaderMaterial.uniforms.uTime.value += 0.01;
    this.mesh.rotation.y += 0.004;
    this.mesh.rotation.x += 0.001;
    this.renderer.render(this.scene, this.camera);
  };
}