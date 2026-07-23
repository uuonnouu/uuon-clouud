import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { IFSParams } from '../stores/ifsStore';

export interface IFSCanvasHandle {
  captureDataUrl: () => string | null;
}

interface IFSCanvasProps {
  params: IFSParams;
  shapeType: string;
  onCamDvChange?: (dv: number) => void;
}

// ── Vertex shaders ────────────────────────────────────────────────────────────
const VS = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.0,1.0); }`;
const VS_UV = `attribute vec2 p; varying vec2 vUv; void main(){ vUv=p*0.5+0.5; gl_Position=vec4(p,0.0,1.0); }`;

// ── STANDARD IFS shader (Menger, Mandelbox, Kleinian, Lattice, Tetrahedral, Icosahedral, Mandelbulb) ──
const FS_STANDARD = `
precision highp float;

uniform vec2  uR;
uniform float uTime;
uniform int   uMODE;    // 0=IFS, 1=Mandelbulb
uniform int   uMI;
uniform float uSC;
uniform float uOX;
uniform float uOY;
uniform float uOZ;
uniform int   uFT;
uniform int   uFI;
uniform float uFS;
uniform float uFSC;
uniform float uMR;
uniform float uBL;
uniform float uTWIST;
uniform int   uTRAP;
uniform int   uCON;
uniform float uCS;
uniform int   uCM;
uniform int   uPAL;
uniform float uBright;
uniform float uSP;
uniform float uLA;
uniform float uLE;
uniform int   uRS;
uniform float uDV;
uniform float uFOV;
uniform vec2  uCAM;
uniform float uPOW;
uniform int   uMBITER;
uniform float uBAIL;
uniform int   uVARIANT;
uniform float uGLOW;
uniform int   uCUTAXIS;
uniform float uCUTPOS;
uniform int   uANIMATE;  // 1 = Mandelbulb animate mode active

#define PI  3.14159265359
#define TAU 6.28318530718
#define PHI 1.61803398875
#define EPS 0.0007
#define FAR 20.0

// ── Fold functions ──────────────────────────────────────────────

vec3 boxFold(vec3 p, float s) {
  return clamp(p, -s, s) * 2.0 - p;
}

vec3 sphereFold(vec3 p, float minR, float fixR) {
  float r2 = max(dot(p,p), 0.0001);
  if(r2 < minR*minR)      return p * (fixR*fixR)/(minR*minR);
  else if(r2 < fixR*fixR) return p * (fixR*fixR)/r2;
  return p;
}

vec3 latticeFold(vec3 p, float s) {
  return mod(p + vec3(s), 2.0*s) - vec3(s);
}

vec3 tetraFold(vec3 p) {
  if(p.x+p.y < 0.0) p.xy = -p.yx;
  if(p.x+p.z < 0.0) p.xz = -p.zx;
  if(p.y+p.z < 0.0) p.yz = -p.zy;
  if(p.x-p.y < 0.0) p.xy =  p.yx;
  return abs(p);
}

// ICOSAHEDRAL FOLD — Ih symmetry group (120 ops)
// 5-fold axes from golden ratio PHI = 1.618...
// Generates quasicrystalline, virus-capsid, and fullerene attractors
vec3 icosaFold(vec3 p) {
  const float PH = 1.61803398875;
  vec3 n1 = normalize(vec3( 1.0, PH, 0.0));
  vec3 n2 = normalize(vec3(-1.0, PH, 0.0));
  vec3 n3 = normalize(vec3( 0.0, 1.0,  PH));
  vec3 n4 = normalize(vec3( 0.0,-1.0,  PH));
  vec3 n5 = normalize(vec3( PH,  0.0,  1.0));
  vec3 n6 = normalize(vec3(-PH,  0.0,  1.0));
  for(int k=0; k<3; k++) {
    if(dot(p,n1)<0.0) p -= 2.0*dot(p,n1)*n1;
    if(dot(p,n2)<0.0) p -= 2.0*dot(p,n2)*n2;
    if(dot(p,n3)<0.0) p -= 2.0*dot(p,n3)*n3;
    if(dot(p,n4)<0.0) p -= 2.0*dot(p,n4)*n4;
    if(dot(p,n5)<0.0) p -= 2.0*dot(p,n5)*n5;
    if(dot(p,n6)<0.0) p -= 2.0*dot(p,n6)*n6;
  }
  return abs(p);
}

// OCTAHEDRAL FOLD — Oh symmetry group (48 ops)
// Abs-fold + sort descending: fundamental octahedral domain
// Creates cube-octahedral cross attractors
vec3 octaFold(vec3 p) {
  p = abs(p);
  if(p.x < p.y) p.xy = p.yx;
  if(p.x < p.z) p.xz = p.zx;
  if(p.y < p.z) p.yz = p.zy;
  return p;
}

// DODECAHEDRAL FOLD — Ih symmetry group (120 ops)
// Mirror planes from cube+icosahedron normal sets
// Creates pentagonal 5-fold compound forms
vec3 dodecaFold(vec3 p) {
  const float PH = 1.61803398875;
  const float IP = 0.61803398875; // 1/PHI
  vec3 n1 = normalize(vec3( 1.0,  1.0,  1.0));
  vec3 n2 = normalize(vec3(-1.0,  1.0,  1.0));
  vec3 n3 = normalize(vec3( 1.0, -1.0,  1.0));
  vec3 n4 = normalize(vec3( 1.0,  1.0, -1.0));
  vec3 n5 = normalize(vec3( 0.0,  IP,  PH));
  vec3 n6 = normalize(vec3( 0.0, -IP,  PH));
  vec3 n7 = normalize(vec3( PH,  0.0,  IP));
  vec3 n8 = normalize(vec3(-PH,  0.0,  IP));
  for(int k=0; k<3; k++) {
    if(dot(p,n1)<0.0) p -= 2.0*dot(p,n1)*n1;
    if(dot(p,n2)<0.0) p -= 2.0*dot(p,n2)*n2;
    if(dot(p,n3)<0.0) p -= 2.0*dot(p,n3)*n3;
    if(dot(p,n4)<0.0) p -= 2.0*dot(p,n4)*n4;
    if(dot(p,n5)<0.0) p -= 2.0*dot(p,n5)*n5;
    if(dot(p,n6)<0.0) p -= 2.0*dot(p,n6)*n6;
    if(dot(p,n7)<0.0) p -= 2.0*dot(p,n7)*n7;
    if(dot(p,n8)<0.0) p -= 2.0*dot(p,n8)*n8;
  }
  return abs(p);
}

// ── IFS Distance Estimator ──────────────────────────────────────

vec2 ifsDE(vec3 pos) {
  vec3 p = pos;
  float scale = 1.0;
  float trap  = 1e10;

  for(int i=0; i<8; i++){
    if(i >= uFI) break;

    if(uFT == 1) {
      p = boxFold(p, uFS);
      p = sphereFold(p, uMR, 1.0);
      p = p * uFSC;
      scale *= uFSC;
    } else if(uFT == 2) {
      p = boxFold(p, uFS);
      p = sphereFold(p, uMR, uFS);
      p = p * uFSC + pos;
      scale *= uFSC;
    } else if(uFT == 3) {
      p = latticeFold(p, uFS);
      p = p * uFSC;
      scale *= uFSC;
    } else if(uFT == 4) {
      p = tetraFold(p);
      p = p * uFSC - vec3(uFS);
      scale *= uFSC;
    } else if(uFT == 5) {
      // ICOSAHEDRAL — phi-scaled offset
      p = icosaFold(p);
      p = p * uFSC - vec3(uFS * 0.618);
      scale *= uFSC;
    } else if(uFT == 6) {
      // OCTAHEDRAL — identity fold + Menger-style offset
      p = octaFold(p);
      p = p * uFSC - vec3(uFS);
      scale *= uFSC;
    } else if(uFT == 7) {
      // DODECAHEDRAL — cubic+icosahedral mirror offset
      p = dodecaFold(p);
      p = p * uFSC - vec3(uFS * 0.5);
      scale *= uFSC;
    } else break;

    trap = min(trap, length(p));
  }

  vec3 pm = mix(p, pos, uBL);

  vec3 q  = pm;
  float ms = 1.0;

  for(int i=0; i<6; i++){
    if(i >= uMI) break;

    q = abs(q);
    if(q.x < q.y) q.xy = q.yx;
    if(q.x < q.z) q.xz = q.zx;
    if(q.y < q.z) q.yz = q.zy;

    q.x = uSC*q.x - uOX*(uSC-1.0);
    q.y = uSC*q.y - uOY*(uSC-1.0);
    q.z = uSC*q.z - uOZ*(uSC-1.0);

    // Twist: XY-plane torsion per iteration
    if(uTWIST > 0.001) {
      float ca = cos(uTWIST * float(i+1));
      float sa = sin(uTWIST * float(i+1));
      float qx2 = q.x*ca - q.y*sa;
      float qy2 = q.x*sa + q.y*ca;
      q.x = qx2; q.y = qy2;
    }

    ms *= uSC;

    // Orbit trap selection
    float t;
    if(uTRAP == 1)      t = length(q);
    else if(uTRAP == 2) t = min(min(abs(q.x),abs(q.y)),abs(q.z));
    else if(uTRAP == 3) t = length(q - vec3(0.5,0.5,0.5));
    else                t = min(min(length(q.xy),length(q.xz)),length(q.yz));
    trap = min(trap, t / ms);
  }

  float cyl = min(min(length(q.xy), length(q.xz)), length(q.yz));
  float d   = (cyl - 1.0) / ms;

  if(uCON == 1) {
    d = max(d, length(pos) - uCS);
  } else if(uCON == 2) {
    vec3 bp = abs(pos) - vec3(uCS);
    float cubeD = length(max(bp,0.0)) + min(max(bp.x,max(bp.y,bp.z)),0.0);
    d = max(d, cubeD);
  } else {
    float guideR = max(uFS * uFSC * 1.2, 2.0);
    vec3 bp = abs(pos) - vec3(guideR);
    float guideD = length(max(bp,0.0)) + min(max(bp.x,max(bp.y,bp.z)),0.0);
    d = max(d, guideD * 0.12);
  }

  return vec2(d, clamp(trap * 0.5, 0.0, 1.0));
}

// ── Mandelbulb Triplex Power ────────────────────────────────────

vec3 triplexPow(vec3 z, float n) {
  float r = length(z);
  if(r < 0.0001) return z;
  float theta = acos(clamp(z.z/r, -1.0, 1.0));
  float phi   = atan(z.y, z.x);
  float nt = n*theta, np = n*phi;

  if(uVARIANT == 1) {
    // SPIKEY: cos(theta) for x
    float rn = pow(r, n);
    return rn * vec3(cos(nt)*cos(np), sin(nt)*sin(np), cos(nt));
  } else if(uVARIANT == 2) {
    // SLICEY: tan(phi) for y
    float rn = pow(r, n);
    return rn * vec3(sin(nt)*cos(np), sin(nt)*tan(np), cos(nt));
  } else if(uVARIANT == 3) {
    // HILLY: lower radius exponent
    float rh = pow(r, n * 0.6);
    return rh * vec3(sin(nt)*cos(np), sin(nt)*sin(np), cos(nt));
  } else if(uVARIANT == 4) {
    // SMOOTH: higher radius exponent
    float rs2 = pow(r, n * 1.4);
    return rs2 * vec3(sin(nt)*cos(np), sin(nt)*sin(np), cos(nt));
  } else {
    // STANDARD (Nylander/White)
    float rn = pow(r, n);
    return rn * vec3(sin(nt)*cos(np), sin(nt)*sin(np), cos(nt));
  }
}

// ── Mandelbulb Distance Estimator (David Makin) ─────────────────

vec2 mandelbulbDE(vec3 pos) {
  // Cross-section clip
  if(uCUTAXIS == 1 && pos.x > uCUTPOS) return vec2(FAR, 0.0);
  if(uCUTAXIS == 2 && pos.y > uCUTPOS) return vec2(FAR, 0.0);
  if(uCUTAXIS == 3 && pos.z > uCUTPOS) return vec2(FAR, 0.0);

  vec3 z  = pos;
  float dr   = 1.0;
  float r    = 0.0;
  float trap = 1e10;

  for(int i=0; i<14; i++) {
    if(i >= uMBITER) break;
    r = length(z);
    if(r > uBAIL) break;
    float t1 = length(z);
    float t2 = abs(z.x);
    float t3 = abs(z.y) + abs(z.z);
    trap = min(trap, min(t1, min(t2*1.5, t3)));
    dr = pow(r, uPOW - 1.0) * uPOW * dr + 1.0;
    z = triplexPow(z, uPOW) + pos;
  }

  float d = (r > 0.0001) ? 0.5 * log(r) * r / dr : 0.0;
  return vec2(d, clamp(trap * 0.5, 0.0, 1.0));
}

// ── Unified scene distance ──────────────────────────────────────

float sd(vec3 p) {
  if(uMODE == 1) return mandelbulbDE(p).x;
  return ifsDE(p).x;
}

vec2 sdFull(vec3 p) {
  if(uMODE == 1) return mandelbulbDE(p);
  return ifsDE(p);
}

// ── Normal & AO ────────────────────────────────────────────────

vec3 calcNormal(vec3 p){
  vec2 e=vec2(EPS*3.0,0.0);
  return normalize(vec3(sd(p+e.xyy)-sd(p-e.xyy),sd(p+e.yxy)-sd(p-e.yxy),sd(p+e.yyx)-sd(p-e.yyx)));
}

float calcAO(vec3 p,vec3 n){
  float occ=0.0,w=1.0;
  for(int i=1;i<=8;i++){float h=0.015+0.22*float(i)/8.0;occ+=max(0.0,h-sd(p+n*h))*w;w*=0.45;}
  return clamp(1.0-5.0*occ,0.0,1.0);
}

mat3 camMat(vec3 ro,vec3 ta){
  vec3 f=normalize(ta-ro),r=normalize(cross(vec3(0,1,0),f));
  return mat3(r,cross(f,r),f);
}

// ── Color helpers ───────────────────────────────────────────────

vec3 iridColor(float trap,float NdotV,vec3 p){
  float fresnel=pow(1.0-NdotV,2.5);
  float phase=NdotV*3.4+trap*2.1+p.x*0.5+p.z*0.35+uTime*0.035;
  vec3 ir;
  ir.r=0.55+0.55*cos(TAU*(phase+0.0));
  ir.g=0.55+0.55*cos(TAU*(phase+0.333));
  ir.b=0.55+0.55*cos(TAU*(phase+0.667));
  ir=clamp(ir*1.3,0.0,1.0);
  float sh=0.5+0.5*sin(trap*18.0+phase*3.2);
  ir=mix(ir,ir*vec3(1.4,0.8,1.6),sh*0.4);
  vec3 dark=vec3(0.02,0.03,0.055);
  vec3 under=mix(vec3(0.0,0.9,0.8),vec3(0.9,0.72,0.2),trap);
  return mix(mix(dark,ir,0.72+0.28*fresnel),under*1.2,(1.0-fresnel)*0.22);
}

// Palette for Mandelbulb (4 palettes)
// When uANIMATE==1 a slow time-based phase shift cycles the colour blend.
vec3 mbPalette(float trap, int pal) {
  // Phase offset: 0 when static, oscillates ±0.35 when animated
  float phase = (uANIMATE == 1) ? sin(uTime * 0.35) * 0.35 : 0.0;
  float t = trap + phase;

  vec3 teal   = vec3(0.0, 0.898, 0.8);
  vec3 gold   = vec3(0.788, 0.659, 0.298);
  vec3 violet = vec3(0.48, 0.37, 0.66);
  if(pal == 0) { // UUON
    vec3 c = mix(teal, gold, smoothstep(0.3, 1.4, t));
    return mix(c, violet, pow(sin(t*2.1)*0.5+0.5, 2.0)*0.6);
  } else if(pal == 1) { // EMBER
    vec3 deep = vec3(0.08, 0.02, 0.0);
    vec3 fire = vec3(1.0, 0.45, 0.05);
    vec3 lava = vec3(1.0, 0.9, 0.2);
    vec3 c = mix(deep, fire, smoothstep(0.0, 0.8, t));
    return mix(c, lava, smoothstep(0.6, 1.4, t));
  } else if(pal == 2) { // ICE
    vec3 dark = vec3(0.0, 0.02, 0.05);
    vec3 ice  = vec3(0.4, 0.85, 1.0);
    vec3 wht  = vec3(0.9, 0.97, 1.0);
    vec3 c = mix(dark, ice, smoothstep(0.0, 1.0, t));
    return mix(c, wht, pow(smoothstep(0.7, 1.5, t), 1.5));
  } else { // VOID
    return vec3(0.01, 0.02, 0.04);
  }
}

// ── Main ───────────────────────────────────────────────────────

void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uR)/uR.y;
  float ct=uCAM.x,cp2=uCAM.y;
  vec3 ro=vec3(uDV*sin(cp2)*cos(ct),uDV*sin(ct),uDV*cos(cp2)*cos(ct));
  mat3 cam=camMat(ro,vec3(0.0));
  vec3 rd=normalize(cam*vec3(uv*tan(radians(uFOV*0.5)),1.0));
  float la=radians(uLA),le=radians(uLE);
  vec3 ld=normalize(vec3(cos(le)*cos(la),sin(le),cos(le)*sin(la)));

  float t = (uMODE==1) ? 0.02 : 0.01;
  float trap=0.0;
  bool hit=false;
  float eps = (uMODE==1) ? 0.0003 : EPS;

  for(int s=0;s<220;s++){
    if(float(s)>=float(uRS)) break;
    vec3 p=ro+rd*t;
    vec2 res=sdFull(p);
    float d=res.x; trap=res.y;
    if(d<eps*(1.0+t*0.25)){hit=true;break;}
    if(t>FAR) break;
    float step = (uMODE==1) ? max(d*0.65, eps) : max(d*0.45,eps*2.0);
    t += step;
  }

  vec3 bg=vec3(0.008,0.012,0.025);
  if(uMODE==1) bg=vec3(0.013, 0.025, 0.05);
  bg*=1.0-dot(uv,uv)*0.28;
  vec3 col=bg;

  if(hit){
    vec3 p=ro+rd*t;
    vec3 n=calcNormal(p);
    float occ=calcAO(p,n);
    float NdotV=max(0.0,dot(n,-rd));
    float diff=max(0.0,dot(n,ld));
    float back=max(0.0,dot(n,-ld))*0.07;
    float rim=pow(1.0-max(0.0,dot(n,-rd)),3.5)*0.12;
    vec3 h2=normalize(ld-rd);
    float spec=pow(max(0.0,dot(n,h2)),90.0)*uSP;
    float glow=pow(max(0.0,dot(n,normalize(ld-rd))),8.0)*uSP*0.3;

    vec3 base;
    if(uMODE==1) {
      // Mandelbulb coloring
      if(uCM==0)      base=iridColor(trap,NdotV,p);
      else if(uCM==1) base=mbPalette(trap, uPAL);
      else if(uCM==2) base=n*0.5+0.5;
      else            base=mix(vec3(0.0,0.9,0.8),vec3(0.9,0.72,0.2),clamp(t/5.0,0.0,1.0));
    } else {
      // IFS coloring
      if(uCM==0)      base=iridColor(trap,NdotV,p);
      else if(uCM==1) base=mix(vec3(0.0,0.9,0.8),vec3(0.9,0.72,0.2),smoothstep(0.1,0.8,trap));
      else if(uCM==2) base=n*0.5+0.5;
      else            base=mix(vec3(0.0,0.9,0.8),vec3(0.9,0.72,0.2),clamp(t/6.0,0.0,1.0));
    }

    col  = base*0.11*occ;
    col += base*diff*occ*0.92;
    col += base*back*occ;
    col += base*rim*occ;
    col += base*glow;
    col += vec3(1.0,0.97,0.88)*spec;
    float sh=clamp(sd(p+ld*0.04)*22.0,0.0,1.0);
    col*=mix(0.45,1.0,sh);
    float fogAmt=(uMODE==1) ? clamp((t-2.0)/FAR,0.0,0.35) : clamp((t-3.0)/FAR,0.0,0.18);
    col=mix(col,bg,fogAmt);
  } else if(uMODE==1 && uGLOW > 0.0) {
    // Mandelbulb glow halo on near-misses
    float minD = 1e10;
    float gt = 0.02;
    for(int gs=0; gs<30; gs++) {
      vec3 gp = ro + rd * gt;
      float gd = mandelbulbDE(gp).x;
      minD = min(minD, gd);
      gt += gd * 0.7 + 0.01;
      if(gt > FAR*0.5) break;
    }
    float glowV = exp(-minD * 8.0) * uGLOW;
    col += vec3(0.0, 0.898, 0.8) * 0.6 * glowV;
  }

  col*=uBright;
  col=pow(max(col,0.0),vec3(0.42));
  col*=1.0-dot(uv,uv)*0.48;
  gl_FragColor=vec4(col,1.0);
}
`;

// ── FRACTAL WEAVE shader ──────────────────────────────────────────────────────
// Distinct engine: 6 weave fold types drive a thread-cylinder IFS
// Warp/weft asymmetry creates anisotropic attractor — clearly unlike Menger
const FS_WEAVE = `
precision highp float;
uniform vec2  uR; uniform float uTime;
uniform int   uWT;    // weave type 0=plain 1=twill 2=sateen 3=honeycomb 4=leno 5=jacquard
uniform float uWP;    // warp count (threads per unit)
uniform float uWF;    // weft count
uniform float uTR;    // thread radius
uniform float uFL;    // float length
uniform float uTW;    // twist 0-1
uniform int   uDPT;   // weave depth (IFS iterations)
uniform float uSR;    // scale ratio
uniform float uBL;    // blend
uniform int   uAX;    // section axis 0=off 1=warp 2=weft 3=fill 4=bias
uniform float uCP;    // cut plane position
uniform int   uCON;   // container 0=cube 1=sphere 2=open
uniform int   uCM;    // color mode 0=fiber 1=depth 2=tension 3=normal
uniform float uBright; uniform float uSP;
uniform float uLA;    // light azimuth (degrees)
uniform float uRS;    // march steps
uniform float uDV;    // camera distance
uniform float uFOV;   // FOV
uniform vec2  uCAM;
#define PI   3.14159265359
#define TAU  6.28318530718
#define PHI  1.61803398875
#define EPS  0.0007
#define FAR  18.0
// ── 6 weave fold functions ────────────────────────────────────────────────────
vec3 plainFold(vec3 p,float wp,float wf){
  p=abs(p);float tx=wp/(wp+wf);
  if(p.x<tx)p.xy=p.yx;if(p.x<p.z)p.xz=p.zx;if(p.y<p.z)p.yz=p.zy;return p;}
vec3 twillFold(vec3 p,float fl,float twist){
  p=abs(p);float ang=fl*PI/8.0+twist*TAU;float ca=cos(ang),sa=sin(ang);
  float px2=p.x*ca-p.y*sa;float py2=p.x*sa+p.y*ca;p.x=abs(px2);p.y=abs(py2);
  if(p.x<p.y)p.xy=p.yx;if(p.x<p.z)p.xz=p.zx;if(p.y<p.z)p.yz=p.zy;return p;}
vec3 sateenFold(vec3 p,float fl,float tr){
  p=clamp(p,-1.0,1.0)*2.0-p;float r2=max(dot(p,p),0.0001);
  float floatR=tr*fl;float fixR=floatR*1.5;
  if(r2<floatR*floatR)p*=(fixR*fixR)/(floatR*floatR);else if(r2<fixR*fixR)p*=(fixR*fixR)/r2;
  p=abs(p);if(p.x<p.y)p.xy=p.yx;if(p.x<p.z)p.xz=p.zx;return p;}
vec3 honeycombFold(vec3 p){
  p=abs(p);vec2 h=p.xy;float s3=sqrt(3.0);
  if(h.x+h.y*s3>2.0)h-=vec2(1.0,s3)*(h.x+h.y*s3-2.0);
  if(h.x*2.0<h.y*s3-1.0){float t=h.x;h.x=0.5*(h.x+h.y*s3);h.y=0.5*(h.y-t*s3/3.0);}
  p.xy=abs(h);if(p.x<p.y)p.xy=p.yx;if(p.x<p.z)p.xz=p.zx;return p;}
vec3 lenoFold(vec3 p,float twist){
  float ang=twist*PI*0.5;float ca=cos(ang),sa=sin(ang);
  float px2=p.x*ca+p.z*sa;float pz2=-p.x*sa+p.z*ca;p.x=px2;p.z=pz2;
  if(p.x+p.y<0.0)p.xy=-p.yx;if(p.x+p.z<0.0)p.xz=-p.zx;if(p.y+p.z<0.0)p.yz=-p.zy;if(p.x-p.y<0.0)p.xy=p.yx;return abs(p);}
vec3 jacquardFold(vec3 p,float fl){
  p=abs(p);float phi=PHI;
  vec3 n1=normalize(vec3(1.0,phi,0.0));vec3 n2=normalize(vec3(phi,0.0,1.0));vec3 n3=normalize(vec3(0.0,1.0,phi));
  if(dot(p,n1)<0.0)p-=2.0*dot(p,n1)*n1;p=abs(p);if(dot(p,n2)<0.0)p-=2.0*dot(p,n2)*n2;p=abs(p);if(dot(p,n3)<0.0)p-=2.0*dot(p,n3)*n3;p=abs(p);
  float phiScale=1.0+(fl-1.0)*(phi-1.0)/7.0;p*=phiScale;if(p.x<p.y)p.xy=p.yx;if(p.x<p.z)p.xz=p.zx;return p;}
vec3 applyWeaveFold(vec3 p){
  if(uWT==0)return plainFold(p,uWP,uWF);
  if(uWT==1)return twillFold(p,uFL,uTW);
  if(uWT==2)return sateenFold(p,uFL,uTR);
  if(uWT==3)return honeycombFold(p);
  if(uWT==4)return lenoFold(p,uTW);
  return jacquardFold(p,uFL);}
// ── Weave distance estimator ──────────────────────────────────────────────────
vec2 weaveDE(vec3 pos){
  vec3 p=pos;float trap=1e10;float sc=uSR;
  float ox=uWP/(uWP+uWF);float oy=uWF/(uWP+uWF);
  for(int i=0;i<3;i++){if(i>=2)break;p=applyWeaveFold(p);p*=sc;trap=min(trap,length(p));}
  vec3 pm=mix(p,pos,uBL);vec3 q=pm;float ms=1.0;
  for(int i=0;i<6;i++){if(i>=uDPT)break;
    q=abs(q);if(q.x<q.y)q.xy=q.yx;if(q.x<q.z)q.xz=q.zx;if(q.y<q.z)q.yz=q.zy;
    q.x=sc*q.x-ox*(sc-1.0);q.y=sc*q.y-oy*(sc-1.0);q.z=sc*q.z-ox*(sc-1.0);ms*=sc;
    trap=min(trap,min(length(q.xy),length(q.xz))/ms);}
  float tr=uTR;
  float warpD=(length(q.xy)-tr)/ms;float weftD=(length(q.xz)-tr)/ms;float fillD=(length(q.yz)-tr)/ms;
  float d;if(uWT==3)d=min(warpD,weftD);else d=min(min(warpD,weftD),fillD);
  float cDE;
  if(uCON==1){cDE=length(pos)-1.5;}
  else if(uCON==2){vec3 bp=abs(pos)-vec3(1.2);cDE=length(max(bp,0.0))+min(max(bp.x,max(bp.y,bp.z)),0.0);}
  else{vec3 bp=abs(pos)-vec3(3.0);cDE=(length(max(bp,0.0))+min(max(bp.x,max(bp.y,bp.z)),0.0))*0.12;}
  d=max(d,cDE);return vec2(d,clamp(trap*0.4,0.0,1.0));}
bool clipped(vec3 p){
  if(uAX==0)return false;if(uAX==1)return p.z>uCP;if(uAX==2)return p.x>uCP;if(uAX==3)return p.y>uCP;
  return (p.x+p.z)/sqrt(2.0)>uCP;}
float sd(vec3 p){if(clipped(p))return FAR;return weaveDE(p).x;}
vec3 wNormal(vec3 p){vec2 e=vec2(EPS*3.0,0.0);return normalize(vec3(sd(p+e.xyy)-sd(p-e.xyy),sd(p+e.yxy)-sd(p-e.yxy),sd(p+e.yyx)-sd(p-e.yyx)));}
float wAO(vec3 p,vec3 n){float o=0.0,w=1.0;for(int i=1;i<=6;i++){float h=0.02+0.2*float(i)/6.0;o+=max(0.0,h-sd(p+n*h))*w;w*=0.5;}return clamp(1.0-4.0*o,0.0,1.0);}
mat3 camMat(vec3 ro,vec3 ta){vec3 f=normalize(ta-ro),r=normalize(cross(vec3(0,1,0),f));return mat3(r,cross(f,r),f);}
vec3 fiberColor(float trap,float NdotV,vec3 p){
  if(uCM==3)return wNormal(p)*0.5+0.5;
  float fresnel=pow(1.0-NdotV,2.5);
  if(uCM==0){
    float phase=NdotV*2.8+trap*2.4+p.x*0.6+p.z*0.4+uTime*0.03;
    vec3 ir;ir.r=0.55+0.55*cos(TAU*(phase+0.0));ir.g=0.55+0.55*cos(TAU*(phase+0.333));ir.b=0.55+0.55*cos(TAU*(phase+0.667));ir=clamp(ir*1.25,0.0,1.0);
    vec3 warp_col=vec3(0.0,0.9,0.8);vec3 weft_col=vec3(0.9,0.72,0.2);float ww=abs(sin(p.z*TAU*uWP*0.5));
    vec3 base=mix(weft_col,warp_col,ww);return mix(base*0.6,ir,0.5+0.5*fresnel);}
  if(uCM==1){float depth=clamp(trap*2.0,0.0,1.0);return mix(vec3(0.0,0.45,0.4),vec3(0.9,0.72,0.2),depth);}
  float tension=1.0-clamp(trap*3.0,0.0,1.0);return mix(vec3(0.0,0.9,0.8),vec3(0.9,0.2,0.1),tension*tension);}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uR)/uR.y;
  float ct=uCAM.x,cp2=uCAM.y;
  vec3 ro=vec3(uDV*sin(cp2)*cos(ct),uDV*sin(ct),uDV*cos(cp2)*cos(ct));
  mat3 cam=camMat(ro,vec3(0.0));
  vec3 rd=normalize(cam*vec3(uv*tan(radians(uFOV*0.5)),1.0));
  float la=radians(uLA);vec3 ld=normalize(vec3(cos(la)*0.7,0.7,sin(la)*0.7));
  float t=0.01,trap=0.0;bool hit=false;
  for(int s=0;s<220;s++){if(float(s)>=uRS)break;vec3 p=ro+rd*t;
    if(clipped(p)){t+=0.02;continue;}
    vec2 res=weaveDE(p);float d=res.x;trap=res.y;
    if(d<EPS*(1.0+t*0.2)){hit=true;break;}if(t>FAR)break;t+=max(d*0.45,EPS*2.0);}
  vec3 bg=vec3(0.008,0.012,0.025);bg*=1.0-dot(uv,uv)*0.25;vec3 col=bg;
  if(hit){vec3 p=ro+rd*t;vec3 n=wNormal(p);float occ=wAO(p,n);float NdotV=max(0.0,dot(n,-rd));float diff=max(0.0,dot(n,ld));vec3 h2=normalize(ld-rd);float spec=pow(max(0.0,dot(n,h2)),90.0)*uSP;
    vec3 base=fiberColor(trap,NdotV,p);
    col=base*0.12*occ+base*diff*occ*0.90+vec3(1.0,0.97,0.88)*spec;float sh=clamp(sd(p+ld*0.04)*22.0,0.0,1.0);col*=mix(0.45,1.0,sh);}
  col*=uBright;col=pow(max(col,0.0),vec3(0.42));col*=1.0-dot(uv,uv)*0.45;gl_FragColor=vec4(col,1.0);}
`;

// ── L-SYSTEM + IFS shader ─────────────────────────────────────────────────────
// Distinct engine: capsule-SDF branching tree blended with IFS via smin()
// 4 growth modes (vascular/neural/mycelium/crystal) — non-recursive unrolled tree
const FS_LSYSTEM = `
precision highp float;
uniform vec2  uR; uniform float uTime;
uniform int   uMI; uniform float uSC; uniform float uOX;
uniform int   uFT; uniform float uFSC; uniform float uBL;
uniform int   uLS;    // growth type 0=vascular 1=neural 2=mycelium 3=crystal
uniform int   uLD;    // tree depth 1-3
uniform float uLR;    // branch radius (root)
uniform float uLANG;  // branch angle (radians)
uniform float uLT;    // tropism 0-1
uniform float uLG;    // growth scale per level
uniform float uLBL;   // IFS / L-system blend 0=IFS only 1=lsystem only
uniform int   uCM; uniform float uBright; uniform float uSP;
uniform float uLA; uniform float uRS; uniform float uDV; uniform float uFOV;
uniform vec2  uCAM;
#define PI   3.14159265359
#define TAU  6.28318530718
#define PHI  1.61803398875
#define EPS  0.0007
#define FAR  20.0
// ── IFS fold helpers (for background attractor) ───────────────────────────────
vec3 boxFold(vec3 p){return clamp(p,-1.0,1.0)*2.0-p;}
vec3 sphereFold(vec3 p,float mr){float r2=max(dot(p,p),0.0001);if(r2<mr*mr)return p*(1.0/(mr*mr));else if(r2<1.0)return p/r2;return p;}
vec3 latticeFold(vec3 p){return mod(p+vec3(0.8),1.6)-vec3(0.8);}
vec3 tetraFold(vec3 p){if(p.x+p.y<0.0)p.xy=-p.yx;if(p.x+p.z<0.0)p.xz=-p.zx;if(p.y+p.z<0.0)p.yz=-p.zy;if(p.x-p.y<0.0)p.xy=p.yx;return abs(p);}
vec3 icosaFold(vec3 p){float inv=0.52573111882;for(int k=0;k<3;k++){p=abs(p);float t;t=(p.x*PHI+p.y)*inv;if(t>0.0){p.x-=2.0*t*PHI*inv;p.y-=2.0*t*inv;}t=(p.y*PHI+p.z)*inv;if(t>0.0){p.y-=2.0*t*PHI*inv;p.z-=2.0*t*inv;}t=(p.z*PHI+p.x)*inv;if(t>0.0){p.z-=2.0*t*PHI*inv;p.x-=2.0*t*inv;}}return abs(p);}
vec2 ifsDE(vec3 pos){
  vec3 p=pos;float trap=1e10;
  if(uFT==1){for(int i=0;i<4;i++){if(i>=2)break;p=boxFold(p);p=sphereFold(p,0.5);p*=uFSC;trap=min(trap,length(p));}}
  else if(uFT==2){for(int i=0;i<4;i++){if(i>=2)break;p=boxFold(p);p=sphereFold(p,0.5);p=p*uFSC+pos;trap=min(trap,length(p));}}
  else if(uFT==3){for(int i=0;i<3;i++){if(i>=2)break;p=latticeFold(p);p*=uFSC;trap=min(trap,length(p));}}
  else if(uFT==4){for(int i=0;i<3;i++){if(i>=2)break;p=tetraFold(p);p=p*uFSC-vec3(0.8);trap=min(trap,length(p));}}
  else if(uFT==5){for(int i=0;i<3;i++){if(i>=2)break;p=icosaFold(p);p=p*uFSC-vec3(0.618);trap=min(trap,length(p));}}
  vec3 pm=mix(p,pos,uBL);vec3 q=pm;float ms=1.0;
  for(int i=0;i<6;i++){if(i>=uMI)break;q=abs(q);if(q.x<q.y)q.xy=q.yx;if(q.x<q.z)q.xz=q.zx;if(q.y<q.z)q.yz=q.zy;q=uSC*q-vec3(uOX)*(uSC-1.0);ms*=uSC;trap=min(trap,min(length(q.xy),length(q.xz))/ms);}
  float d=(min(min(length(q.xy),length(q.xz)),length(q.yz))-1.0)/ms;
  vec3 bp=abs(pos)-vec3(max(uFSC,2.0));d=max(d,(length(max(bp,0.0))+min(max(bp.x,max(bp.y,bp.z)),0.0))*0.12);
  return vec2(d,clamp(trap*0.5,0.0,1.0));}
// ── Capsule SDF ───────────────────────────────────────────────────────────────
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 ab=b-a,ap=p-a;float t=clamp(dot(ap,ab)/dot(ab,ab),0.0,1.0);return length(ap-ab*t)-r;}
// ── L-system branching (non-recursive unrolled binary tree, depth 1-3) ────────
float lsystemDE(vec3 p){
  float d=FAR;
  float ang=uLANG;
  float grow=uLG;
  float r0=uLR;
  // Trunk
  vec3 o0=vec3(0.0,-1.0,0.0);
  vec3 up=vec3(0.0,1.0,0.0);
  float len0=r0*16.0*grow;
  vec3 e0=o0+up*len0;
  d=min(d,sdCap(p,o0,e0,r0));
  // Level 1 directions (vary by mode)
  float r1=r0*0.794;float len1=r1*16.0*grow;
  vec3 side=vec3(1.0,0.0,0.0);
  vec3 d1a,d1b;
  if(uLS==0){// VASCULAR: symmetric binary, Murray's law radii, gravity tropism
    d1a=normalize(up*cos(ang)+side*sin(ang));d1b=normalize(up*cos(ang)-side*sin(ang));
    d1a=normalize(d1a-vec3(0.0,uLT*0.3,0.0));d1b=normalize(d1b-vec3(0.0,uLT*0.3,0.0));
  }else if(uLS==1){// NEURAL: phi-ratio angle asymmetry, sinusoidal drift
    float phiAng=ang*PHI;
    d1a=normalize(up*cos(ang)+side*sin(ang));
    d1b=normalize(up*cos(phiAng)-side*sin(phiAng)+vec3(0.0,0.0,sin(phiAng)*0.4));
    d1a=normalize(d1a+vec3(sin(uTime*0.08)*0.04,-uLT*0.15,cos(uTime*0.06)*0.04));
    d1b=normalize(d1b+vec3(cos(uTime*0.11)*0.04,-uLT*0.1,sin(uTime*0.09)*0.05));
  }else if(uLS==2){// MYCELIUM: ternary (3 children at 120deg), flat spread, anastomosis
    float a120=TAU/3.0;
    d1a=normalize(up*cos(ang)+side*sin(ang));
    d1b=normalize(up*cos(ang)+(side*cos(a120)+vec3(0,0,1)*sin(a120))*sin(ang));
    vec3 d1c=normalize(up*cos(ang)+(side*cos(2.0*a120)+vec3(0,0,1)*sin(2.0*a120))*sin(ang));
    // Add third mycelium branch
    vec3 e1c=e0+d1c*len1;d=min(d,sdCap(p,e0,e1c,r1));
    // Anastomosis loop (approximated as thin connector)
    d=min(d,sdCap(p,e1c,e1c+normalize(-d1c+vec3(0.3,0,0.3))*r1*6.0,r1*0.35));
  }else{// CRYSTAL: axis-snapped branching along crystallographic directions
    d1a=vec3(1.0,0.0,0.0);d1b=vec3(0.0,0.0,1.0);
    // Add extra crystallographic branches
    vec3 d1c=normalize(vec3(1.0,0.5,1.0));vec3 d1d=normalize(vec3(-1.0,0.5,1.0));
    vec3 e1c=e0+d1c*len1;vec3 e1d=e0+d1d*len1;
    d=min(d,sdCap(p,e0,e1c,r1));d=min(d,sdCap(p,e0,e1d,r1));}
  vec3 e1a=e0+d1a*len1;vec3 e1b=e0+d1b*len1;
  d=min(d,sdCap(p,e0,e1a,r1));d=min(d,sdCap(p,e0,e1b,r1));
  // Level 2
  if(uLD>=2){
    float r2=r1*0.794;float len2=r2*16.0*grow;
    vec3 perp2a=normalize(cross(d1a,vec3(0.01,1.0,0.01)));
    vec3 perp2b=normalize(cross(d1b,vec3(0.01,1.0,0.01)));
    vec3 d2aa=normalize(d1a*cos(ang)+perp2a*sin(ang));
    vec3 d2ab=normalize(d1a*cos(ang)-perp2a*sin(ang));
    vec3 d2ba=normalize(d1b*cos(ang)+perp2b*sin(ang));
    vec3 d2bb=normalize(d1b*cos(ang)-perp2b*sin(ang));
    if(uLS==0||uLS==1){// gravity tropism
      float tr2=uLT*0.12;
      d2aa=normalize(d2aa-vec3(0.0,tr2,0.0));d2ab=normalize(d2ab-vec3(0.0,tr2,0.0));
      d2ba=normalize(d2ba-vec3(0.0,tr2,0.0));d2bb=normalize(d2bb-vec3(0.0,tr2,0.0));}
    vec3 e2aa=e1a+d2aa*len2;vec3 e2ab=e1a+d2ab*len2;
    vec3 e2ba=e1b+d2ba*len2;vec3 e2bb=e1b+d2bb*len2;
    d=min(d,sdCap(p,e1a,e2aa,r2));d=min(d,sdCap(p,e1a,e2ab,r2));
    d=min(d,sdCap(p,e1b,e2ba,r2));d=min(d,sdCap(p,e1b,e2bb,r2));
    // Level 3
    if(uLD>=3){
      float r3=r2*0.794;float len3=r3*16.0*grow;
      vec3 pa=normalize(cross(d2aa,vec3(0.01,1.0,0.01)));
      vec3 pb=normalize(cross(d2ab,vec3(0.01,1.0,0.01)));
      vec3 pc=normalize(cross(d2ba,vec3(0.01,1.0,0.01)));
      vec3 pd2=normalize(cross(d2bb,vec3(0.01,1.0,0.01)));
      d=min(d,sdCap(p,e2aa,e2aa+normalize(d2aa*cos(ang)+pa*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2aa,e2aa+normalize(d2aa*cos(ang)-pa*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2ab,e2ab+normalize(d2ab*cos(ang)+pb*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2ab,e2ab+normalize(d2ab*cos(ang)-pb*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2ba,e2ba+normalize(d2ba*cos(ang)+pc*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2ba,e2ba+normalize(d2ba*cos(ang)-pc*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2bb,e2bb+normalize(d2bb*cos(ang)+pd2*sin(ang))*len3,r3));
      d=min(d,sdCap(p,e2bb,e2bb+normalize(d2bb*cos(ang)-pd2*sin(ang))*len3,r3));}}
  return d;}
// ── Smooth union ───────────────────────────────────────────────────────────────
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.0)/k;return min(a,b)-h*h*k/4.0;}
// ── Combined scene ─────────────────────────────────────────────────────────────
vec2 sceneDE(vec3 pos){
  vec2 ifs=ifsDE(pos);float ls=lsystemDE(pos);
  float d;
  if(uLBL<0.05)d=ifs.x;
  else if(uLBL>0.95)d=ls;
  else{float k=0.15*(1.0-uLBL)*uLBL*4.0;d=smin(ifs.x,ls,k);}
  return vec2(d,ifs.y);}
float sd(vec3 p){return sceneDE(p).x;}
vec3 calcNormal(vec3 p){vec2 e=vec2(EPS*3.0,0.0);return normalize(vec3(sd(p+e.xyy)-sd(p-e.xyy),sd(p+e.yxy)-sd(p-e.yxy),sd(p+e.yyx)-sd(p-e.yyx)));}
float calcAO(vec3 p,vec3 n){float o=0.0,w=1.0;for(int i=1;i<=6;i++){float h=0.02+0.18*float(i)/6.0;o+=max(0.0,h-sd(p+n*h))*w;w*=0.5;}return clamp(1.0-4.0*o,0.0,1.0);}
mat3 camMat(vec3 ro,vec3 ta){vec3 f=normalize(ta-ro),r=normalize(cross(vec3(0,1,0),f));return mat3(r,cross(f,r),f);}
// ── Color modes ────────────────────────────────────────────────────────────────
vec3 biofilmColor(float trap,vec3 p,float ls,float NdotV){
  vec3 membrane=vec3(0.0,0.55,0.5)+vec3(0.0,0.3,0.2)*sin(trap*12.0+p.x*3.0);
  vec3 branch=mix(vec3(0.1,0.7,0.2),vec3(0.9,0.3,0.2),clamp(1.0-ls*15.0,0.0,1.0));
  float inBranch=clamp(1.0-ls*20.0,0.0,1.0);vec3 col=mix(membrane,branch,inBranch*0.8);
  float fresnel=pow(1.0-NdotV,2.5);col*=0.7+0.5*fresnel;col+=vec3(0.0,0.1,0.08)*sin(uTime*0.5+trap*8.0);return col;}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uR)/uR.y;
  float ct=uCAM.x,cp2=uCAM.y;
  vec3 ro=vec3(uDV*sin(cp2)*cos(ct),uDV*sin(ct),uDV*cos(cp2)*cos(ct));
  mat3 cam=camMat(ro,vec3(0.0));
  vec3 rd=normalize(cam*vec3(uv*tan(radians(uFOV*0.5)),1.0));
  float la=radians(uLA);vec3 ld=normalize(vec3(cos(la)*0.7,0.7,sin(la)*0.7));
  float t=0.01,trap=0.0;bool hit=false;
  for(int s=0;s<220;s++){if(float(s)>=uRS)break;vec3 p=ro+rd*t;vec2 res=sceneDE(p);float d=res.x;trap=res.y;
    if(d<EPS*(1.0+t*0.2)){hit=true;break;}if(t>FAR)break;t+=max(d*0.45,EPS*2.0);}
  vec3 bg=vec3(0.008,0.012,0.025);bg*=1.0-dot(uv,uv)*0.28;vec3 col=bg;
  if(hit){vec3 p=ro+rd*t;vec3 n=calcNormal(p);float occ=calcAO(p,n);float NdotV=max(0.0,dot(n,-rd));float diff=max(0.0,dot(n,ld));vec3 h2=normalize(ld-rd);float spec=pow(max(0.0,dot(n,h2)),80.0)*uSP;
    float lsDist=lsystemDE(p);
    vec3 base;
    if(uCM==0)base=biofilmColor(trap,p,lsDist,NdotV);
    else if(uCM==1)base=mix(vec3(0.0,0.3,0.8),vec3(0.9,0.5,0.1),clamp(t/6.0,0.0,1.0));
    else if(uCM==2){float stress=1.0-trap;base=mix(vec3(0.0,0.5,0.9),vec3(0.9,0.1,0.1),stress*stress);}
    else{float fresnel=pow(1.0-NdotV,2.5);float phase=NdotV*3.4+trap*2.1+p.x*0.5+p.z*0.35+uTime*0.035;vec3 ir;ir.r=0.55+0.55*cos(TAU*(phase+0.0));ir.g=0.55+0.55*cos(TAU*(phase+0.333));ir.b=0.55+0.55*cos(TAU*(phase+0.667));base=clamp(ir*1.3,0.0,1.0);}
    col=base*0.11*occ+base*diff*occ*0.90+vec3(1.0,0.97,0.88)*spec;float sh=clamp(sd(p+ld*0.04)*20.0,0.0,1.0);col*=mix(0.45,1.0,sh);col=mix(col,bg,clamp((t-3.0)/FAR,0.0,0.18));}
  col*=uBright;col=pow(max(col,0.0),vec3(0.42));col*=1.0-dot(uv,uv)*0.45;gl_FragColor=vec4(col,1.0);}
`;

// ── REACTION-DIFFUSION IFS: seed shader ───────────────────────────────────────
// Seeds the Gray-Scott field from the IFS orbit trap topology
const FS_RD_SEED = `
precision highp float;
uniform vec2 uRes; uniform float uTime;
uniform float uSC; uniform float uBL; uniform int uMI; uniform int uFT; uniform float uFSC;
varying vec2 vUv;
#define PHI 1.61803398875
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}
vec3 bF(vec3 p){return clamp(p,-1.0,1.0)*2.0-p;}
vec3 sF(vec3 p,float mr){float r2=max(dot(p,p),0.0001);if(r2<mr*mr)return p*(1.0/(mr*mr));else if(r2<1.0)return p/r2;return p;}
vec3 lF(vec3 p){return mod(p+vec3(0.8),1.6)-vec3(0.8);}
vec3 tF(vec3 p){if(p.x+p.y<0.0)p.xy=-p.yx;if(p.x+p.z<0.0)p.xz=-p.zx;if(p.y+p.z<0.0)p.yz=-p.zy;if(p.x-p.y<0.0)p.xy=p.yx;return abs(p);}
vec3 iF(vec3 p){float inv=0.52573111882;for(int k=0;k<3;k++){p=abs(p);float t;t=(p.x*PHI+p.y)*inv;if(t>0.0){p.x-=2.0*t*PHI*inv;p.y-=2.0*t*inv;}t=(p.y*PHI+p.z)*inv;if(t>0.0){p.y-=2.0*t*PHI*inv;p.z-=2.0*t*inv;}t=(p.z*PHI+p.x)*inv;if(t>0.0){p.z-=2.0*t*PHI*inv;p.x-=2.0*t*inv;}}return abs(p);}
float getOrbitTrap(vec2 uv){
  vec3 pos=vec3(uv*3.0-1.5,0.5);vec3 q=pos;float ms=1.0,trap=1e10;
  if(uFT==1){q=bF(q);q=sF(q,0.5);q*=uFSC;}
  else if(uFT==2){q=bF(q);q=sF(q,0.5);q=q*uFSC+pos;}
  else if(uFT==3){q=lF(q);q*=uFSC;}
  else if(uFT==4){q=tF(q);q=q*uFSC-vec3(0.8);}
  else if(uFT==5){q=iF(q);q=q*uFSC-vec3(0.618);}
  vec3 pm=mix(q,pos,uBL);q=pm;
  for(int i=0;i<6;i++){if(i>=uMI)break;q=abs(q);if(q.x<q.y)q.xy=q.yx;if(q.x<q.z)q.xz=q.zx;if(q.y<q.z)q.yz=q.zy;q=uSC*q-vec3(1.0)*(uSC-1.0);ms*=uSC;trap=min(trap,min(length(q.xy),length(q.xz))/ms);}
  return clamp(trap*0.5,0.0,1.0);}
void main(){
  float trap=getOrbitTrap(vUv);float noise=(hash(vUv+uTime)-0.5)*0.15;
  float A,B;
  if(trap>0.35+noise){A=1.0;B=0.0;}else{A=0.0;B=1.0;}
  if(abs(trap-0.35)<0.08){A=0.5+noise;B=0.5-noise;}
  gl_FragColor=vec4(clamp(A,0.0,1.0),clamp(B,0.0,1.0),trap,1.0);}
`;

// ── REACTION-DIFFUSION IFS: Gray-Scott step shader ────────────────────────────
const FS_RD_STEP = `
precision highp float;
uniform sampler2D uTex; uniform vec2 uRes;
uniform float uF; uniform float uK;
varying vec2 vUv;
void main(){
  vec2 px=1.0/uRes;vec4 c=texture2D(uTex,vUv);float A=c.r,B=c.g;
  float lapA=texture2D(uTex,vUv+vec2(px.x,0)).r+texture2D(uTex,vUv+vec2(-px.x,0)).r+texture2D(uTex,vUv+vec2(0,px.y)).r+texture2D(uTex,vUv+vec2(0,-px.y)).r+0.05*(texture2D(uTex,vUv+vec2(px.x,px.y)).r+texture2D(uTex,vUv+vec2(-px.x,px.y)).r+texture2D(uTex,vUv+vec2(px.x,-px.y)).r+texture2D(uTex,vUv+vec2(-px.x,-px.y)).r)-4.2*A;
  float lapB=texture2D(uTex,vUv+vec2(px.x,0)).g+texture2D(uTex,vUv+vec2(-px.x,0)).g+texture2D(uTex,vUv+vec2(0,px.y)).g+texture2D(uTex,vUv+vec2(0,-px.y)).g+0.05*(texture2D(uTex,vUv+vec2(px.x,px.y)).g+texture2D(uTex,vUv+vec2(-px.x,px.y)).g+texture2D(uTex,vUv+vec2(px.x,-px.y)).g+texture2D(uTex,vUv+vec2(-px.x,-px.y)).g)-4.2*B;
  float ABB=A*B*B;float dA=1.0*lapA-ABB+uF*(1.0-A);float dB=0.5*lapB+ABB-(uF+uK)*B;
  gl_FragColor=vec4(clamp(A+dA,0.0,1.0),clamp(B+dB,0.0,1.0),c.b,1.0);}
`;

// ── REACTION-DIFFUSION IFS: render shader ─────────────────────────────────────
// Raymarches the IFS, samples RD texture at surface hit via triplanar projection
const FS_RD_RENDER = `
precision highp float;
uniform vec2  uR; uniform float uTime;
uniform int   uMI; uniform float uSC;
uniform int   uFT; uniform float uFSC; uniform float uBL;
uniform int   uCM; uniform float uBright; uniform float uContrast;
uniform float uRS; uniform float uDV; uniform float uFOV; uniform vec2 uCAM;
uniform sampler2D uRDTex;
#define EPS 0.0007
#define FAR 18.0
#define TAU 6.28318530718
#define PHI 1.61803398875
vec3 bF(vec3 p){return clamp(p,-1.0,1.0)*2.0-p;}
vec3 sF(vec3 p,float mr){float r2=max(dot(p,p),0.0001);if(r2<mr*mr)return p*(1.0/(mr*mr));else if(r2<1.0)return p/r2;return p;}
vec3 lF(vec3 p){return mod(p+vec3(0.8),1.6)-vec3(0.8);}
vec3 tF(vec3 p){if(p.x+p.y<0.0)p.xy=-p.yx;if(p.x+p.z<0.0)p.xz=-p.zx;if(p.y+p.z<0.0)p.yz=-p.zy;if(p.x-p.y<0.0)p.xy=p.yx;return abs(p);}
vec3 iF(vec3 p){float inv=0.52573111882;for(int k=0;k<3;k++){p=abs(p);float t;t=(p.x*PHI+p.y)*inv;if(t>0.0){p.x-=2.0*t*PHI*inv;p.y-=2.0*t*inv;}t=(p.y*PHI+p.z)*inv;if(t>0.0){p.y-=2.0*t*PHI*inv;p.z-=2.0*t*inv;}t=(p.z*PHI+p.x)*inv;if(t>0.0){p.z-=2.0*t*PHI*inv;p.x-=2.0*t*inv;}}return abs(p);}
vec2 ifsDE(vec3 pos){
  vec3 p=pos;float trap=1e10;
  if(uFT==1){p=bF(p);p=sF(p,0.5);p*=uFSC;}
  else if(uFT==2){p=bF(p);p=sF(p,0.5);p=p*uFSC+pos;}
  else if(uFT==3){p=lF(p);p*=uFSC;}
  else if(uFT==4){p=tF(p);p=p*uFSC-vec3(0.8);}
  else if(uFT==5){p=iF(p);p=p*uFSC-vec3(0.618);}
  vec3 pm=mix(p,pos,uBL);vec3 q=pm;float ms=1.0;
  for(int i=0;i<6;i++){if(i>=uMI)break;q=abs(q);if(q.x<q.y)q.xy=q.yx;if(q.x<q.z)q.xz=q.zx;if(q.y<q.z)q.yz=q.zy;q=uSC*q-vec3(1.0)*(uSC-1.0);ms*=uSC;trap=min(trap,min(length(q.xy),length(q.xz))/ms);}
  float d=(min(min(length(q.xy),length(q.xz)),length(q.yz))-1.0)/ms;
  vec3 bp=abs(pos)-vec3(max(uFSC,2.0));d=max(d,(length(max(bp,0.0))+min(max(bp.x,max(bp.y,bp.z)),0.0))*0.12);
  return vec2(d,clamp(trap*0.5,0.0,1.0));}
float sd(vec3 p){return ifsDE(p).x;}
vec3 calcNormal(vec3 p){vec2 e=vec2(EPS*3.0,0.0);return normalize(vec3(sd(p+e.xyy)-sd(p-e.xyy),sd(p+e.yxy)-sd(p-e.yxy),sd(p+e.yyx)-sd(p-e.yyx)));}
float calcAO(vec3 p,vec3 n){float o=0.0,w=1.0;for(int i=1;i<=6;i++){float h=0.02+0.2*float(i)/6.0;o+=max(0.0,h-sd(p+n*h))*w;w*=0.5;}return clamp(1.0-4.0*o,0.0,1.0);}
mat3 camMat(vec3 ro,vec3 ta){vec3 f=normalize(ta-ro),r=normalize(cross(vec3(0,1,0),f));return mat3(r,cross(f,r),f);}
vec2 surfaceToUV(vec3 p,vec3 n){
  float scale=0.8;vec2 uvX=fract(p.yz*scale);vec2 uvY=fract(p.xz*scale);vec2 uvZ=fract(p.xy*scale);
  vec3 w=abs(n);w=pow(w,vec3(4.0));w/=(w.x+w.y+w.z+0.001);return uvX*w.x+uvY*w.y+uvZ*w.z;}
vec3 rdColor(vec2 uv,int cm){
  vec4 rd=texture2D(uRDTex,uv);float A=rd.r,B=rd.g;
  float pat=clamp(B*uContrast,0.0,1.0);float edge=clamp(abs(B-0.4)*uContrast*2.0,0.0,1.0);
  if(cm==0){vec3 gap=vec3(0.01,0.02,0.04);vec3 spot=vec3(0.0,0.85,0.75);vec3 ring=vec3(0.75,0.52,0.08);vec3 c=mix(gap,spot,smoothstep(0.25,0.75,pat));return mix(c,ring,edge*0.5);}
  if(cm==1){float phase=pat*3.14159+B*2.1+uTime*0.035;vec3 ir;ir.r=0.5+0.5*cos(TAU*(phase+0.0));ir.g=0.5+0.5*cos(TAU*(phase+0.333));ir.b=0.5+0.5*cos(TAU*(phase+0.667));return clamp(ir*(0.3+pat*0.7)*1.3,0.0,1.0);}
  if(cm==2){vec3 cold=vec3(0.0,0.05,0.2);vec3 warm=vec3(0.7,0.2,0.0);vec3 hot=vec3(1.0,0.85,0.0);if(pat<0.5)return mix(cold,warm,pat*2.0);return mix(warm,hot,(pat-0.5)*2.0);}
  return vec3(0.0,pat*0.5,pat*0.35);}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uR)/uR.y;
  float ct=uCAM.x,cp=uCAM.y;
  vec3 ro=vec3(uDV*sin(cp)*cos(ct),uDV*sin(ct),uDV*cos(cp)*cos(ct));
  mat3 cam=camMat(ro,vec3(0.0));vec3 rd=normalize(cam*vec3(uv*tan(radians(uFOV*0.5)),1.0));
  vec3 ld=normalize(vec3(0.6,0.8,0.4));
  float t=0.01,trap=0.0;bool hit=false;
  for(int s=0;s<200;s++){if(float(s)>=uRS)break;vec3 p=ro+rd*t;vec2 res=ifsDE(p);float d=res.x;trap=res.y;
    if(d<EPS*(1.0+t*0.2)){hit=true;break;}if(t>FAR)break;t+=max(d*0.45,EPS*2.0);}
  vec3 bg=vec3(0.008,0.012,0.025);bg*=1.0-dot(uv,uv)*0.3;vec3 col=bg;
  if(hit){vec3 p=ro+rd*t;vec3 n=calcNormal(p);float occ=calcAO(p,n);float NdotV=max(0.0,dot(n,-rd));float diff=max(0.0,dot(n,ld));vec3 h2=normalize(ld-rd);float spec=pow(max(0.0,dot(n,h2)),80.0)*0.7;
    vec2 rdUV=surfaceToUV(p,n);vec3 base=rdColor(rdUV,uCM);
    col=base*0.12*occ+base*diff*occ*0.88+vec3(1.0,0.97,0.88)*spec;
    float sh=clamp(sd(p+ld*0.04)*20.0,0.0,1.0);col*=mix(0.5,1.0,sh);}
  col*=uBright;col=pow(max(col,0.0),vec3(0.42));col*=1.0-dot(uv,uv)*0.45;gl_FragColor=vec4(col,1.0);}
`;

// ── GL helpers ─────────────────────────────────────────────────────────────────
function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('IFS shader compile error:', gl.getShaderInfoLog(s));
  return s;
}

function linkProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    console.error('IFS program link error:', gl.getProgramInfoLog(prog));
  return prog;
}

function getUniforms(gl: WebGLRenderingContext, prog: WebGLProgram, names: string[]) {
  const u: Record<string, WebGLUniformLocation | null> = {};
  names.forEach(n => { u[n] = gl.getUniformLocation(prog, n); });
  return u;
}

function getMode(shapeType: string): 'standard' | 'weave' | 'lsystem' | 'rd' {
  if (shapeType === 'fractal_weave') return 'weave';
  if (shapeType === 'lsystem_ifs') return 'lsystem';
  if (shapeType === 'reaction_diffusion_ifs') return 'rd';
  return 'standard';
}

const RD_SIZE = 256; // RD simulation texture resolution

// ── Component ─────────────────────────────────────────────────────────────────
const IFSCanvas = forwardRef<IFSCanvasHandle, IFSCanvasProps>(
  ({ params, shapeType, onCamDvChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);

  // Expose captureDataUrl to parent via ref
  useImperativeHandle(ref, () => ({
    captureDataUrl: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      // Force one render cycle to ensure current frame is visible
      const gl = glRef.current;
      if (gl) gl.flush();
      return canvas.toDataURL('image/png');
    },
  }), []);

  // Compiled shader state (replaced when shapeType changes)
  const shaderRef = useRef<{
    mode: string;
    prog?: WebGLProgram;
    u?: Record<string, WebGLUniformLocation | null>;
    // RD multi-pass state
    rdProgs?: { seed: WebGLProgram; step: WebGLProgram; render: WebGLProgram };
    rdUs?: { seed: Record<string, WebGLUniformLocation | null>; step: Record<string, WebGLUniformLocation | null>; render: Record<string, WebGLUniformLocation | null> };
    rdFBOs?: [WebGLFramebuffer, WebGLFramebuffer];
    rdTexs?: [WebGLTexture, WebGLTexture];
    rdRead: number;
    rdNeedsSeed: boolean;
  } | null>(null);

  const paramsRef = useRef(params);
  const shapeTypeRef = useRef(shapeType);
  const camRef = useRef({ theta: 0.3, phi: 0.0 });
  const timeRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef(0);
  const dragRef = useRef({ active: false, shift: false, lx: 0, ly: 0 });

  useEffect(() => { paramsRef.current = params; }, [params]);

  // Reset time to 0 whenever the Mandelbulb animate toggle is turned on
  useEffect(() => {
    if (params.animate) {
      timeRef.current = 0;
    }
  }, [params.animate]);

  // ── Setup vertex buffer (shared by all modes) ────────────────────────────────
  const setupVertexBuffer = useCallback((gl: WebGLRenderingContext, prog: WebGLProgram) => {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1,-1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);
    return buf;
  }, []);

  // ── Compile shaders for current shapeType ────────────────────────────────────
  const compileForShape = useCallback((gl: WebGLRenderingContext, st: string) => {
    const mode = getMode(st);

    if (mode === 'weave') {
      const prog = linkProgram(gl, VS, FS_WEAVE);
      gl.useProgram(prog);
      setupVertexBuffer(gl, prog);
      const u = getUniforms(gl, prog, ['uR','uTime','uWT','uWP','uWF','uTR','uFL','uTW','uDPT','uSR','uBL','uAX','uCP','uCON','uCM','uBright','uSP','uLA','uRS','uDV','uFOV','uCAM']);
      shaderRef.current = { mode, prog, u, rdRead: 0, rdNeedsSeed: false };

    } else if (mode === 'lsystem') {
      const prog = linkProgram(gl, VS, FS_LSYSTEM);
      gl.useProgram(prog);
      setupVertexBuffer(gl, prog);
      const u = getUniforms(gl, prog, ['uR','uTime','uMI','uSC','uOX','uFT','uFSC','uBL','uLS','uLD','uLR','uLANG','uLT','uLG','uLBL','uCM','uBright','uSP','uLA','uRS','uDV','uFOV','uCAM']);
      shaderRef.current = { mode, prog, u, rdRead: 0, rdNeedsSeed: false };

    } else if (mode === 'rd') {
      // Check for float texture support
      const extFloat = gl.getExtension('OES_texture_float');
      if (!extFloat) {
        console.warn('IFS RD: OES_texture_float not available, falling back to standard');
        const prog = linkProgram(gl, VS, FS_STANDARD);
        gl.useProgram(prog);
        setupVertexBuffer(gl, prog);
        const u = getUniforms(gl, prog, ['uR','uTime','uMI','uSC','uOX','uOY','uFT','uFI','uFS','uFSC','uMR','uBL','uCON','uCS','uCM','uBright','uSP','uLA','uLE','uRS','uDV','uFOV','uCAM']);
        shaderRef.current = { mode: 'standard', prog, u, rdRead: 0, rdNeedsSeed: false };
        return;
      }

      // Create 3 shader programs for multi-pass RD
      const seedProg   = linkProgram(gl, VS_UV, FS_RD_SEED);
      const stepProg   = linkProgram(gl, VS_UV, FS_RD_STEP);
      const renderProg = linkProgram(gl, VS, FS_RD_RENDER);

      // Set up vertex buffer for render pass
      gl.useProgram(renderProg);
      setupVertexBuffer(gl, renderProg);

      // Create 2 float textures for ping-pong
      const mkFloatTex = (): WebGLTexture => {
        const tex = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, RD_SIZE, RD_SIZE, 0, gl.RGBA, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        return tex;
      };
      const tex0 = mkFloatTex();
      const tex1 = mkFloatTex();

      const mkFBO = (tex: WebGLTexture): WebGLFramebuffer => {
        const fbo = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        return fbo;
      };
      const fbo0 = mkFBO(tex0);
      const fbo1 = mkFBO(tex1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      const rdUs = {
        seed:   getUniforms(gl, seedProg,   ['uRes','uTime','uSC','uBL','uMI','uFT','uFSC']),
        step:   getUniforms(gl, stepProg,   ['uTex','uRes','uF','uK']),
        render: getUniforms(gl, renderProg, ['uR','uTime','uMI','uSC','uFT','uFSC','uBL','uCM','uBright','uContrast','uRS','uDV','uFOV','uCAM','uRDTex']),
      };

      shaderRef.current = {
        mode,
        rdProgs: { seed: seedProg, step: stepProg, render: renderProg },
        rdUs,
        rdFBOs: [fbo0, fbo1],
        rdTexs: [tex0, tex1],
        rdRead: 0,
        rdNeedsSeed: true,
      };

    } else {
      // Standard IFS
      const prog = linkProgram(gl, VS, FS_STANDARD);
      gl.useProgram(prog);
      setupVertexBuffer(gl, prog);
      const u = getUniforms(gl, prog, ['uR','uTime','uMODE','uMI','uSC','uOX','uOY','uOZ','uFT','uFI','uFS','uFSC','uMR','uBL','uTWIST','uTRAP','uCON','uCS','uCM','uPAL','uBright','uSP','uLA','uLE','uRS','uDV','uFOV','uCAM','uPOW','uMBITER','uBAIL','uVARIANT','uGLOW','uCUTAXIS','uCUTPOS','uANIMATE']);
      shaderRef.current = { mode, prog, u, rdRead: 0, rdNeedsSeed: false };
    }
  }, [setupVertexBuffer]);

  // ── WebGL init (runs once on mount) ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
    if (!gl) { console.error('IFSCanvas: WebGL not available'); return; }
    glRef.current = gl;

    // Compile initial shaders
    compileForShape(gl, shapeTypeRef.current);

    const frame = (ts: number) => {
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      timeRef.current += dt;

      const cv = canvasRef.current;
      if (!cv) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = (cv.clientWidth * dpr) | 0;
      const h = (cv.clientHeight * dpr) | 0;
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }

      const p = paramsRef.current;
      const cam = camRef.current;
      if (p.autoRot) cam.phi += dt * p.rotSpeed * 0.4;

      const sh = shaderRef.current;
      if (!sh) { rafRef.current = requestAnimationFrame(frame); return; }

      if (sh.mode === 'weave' && sh.prog && sh.u) {
        gl.viewport(0, 0, w, h);
        gl.useProgram(sh.prog);
        const U = sh.u;
        gl.uniform2f(U.uR, w, h);
        gl.uniform1f(U.uTime, timeRef.current);
        gl.uniform1i(U.uWT, p.ft);                           // ft = weave type 0-5
        gl.uniform1f(U.uWP, Math.max(1.0, p.ox * 6.0));     // ox → warp count
        gl.uniform1f(U.uWF, Math.max(1.0, p.oy * 6.0));     // oy → weft count
        gl.uniform1f(U.uTR, p.mr);                           // mr → thread radius
        gl.uniform1f(U.uFL, Math.max(1.0, p.fs));            // fs → float length
        gl.uniform1f(U.uTW, Math.max(0.0, (p.fsc - 1.0) / 3.0)); // fsc → twist
        gl.uniform1i(U.uDPT, p.mi);                          // mi → weave depth
        gl.uniform1f(U.uSR, p.sc);                           // sc → scale ratio
        gl.uniform1f(U.uBL, p.bl);
        gl.uniform1i(U.uAX, Math.min(4, Math.max(0, p.fi - 1))); // fi-1 → section axis
        gl.uniform1f(U.uCP, 0.0);
        gl.uniform1i(U.uCON, p.con);
        gl.uniform1i(U.uCM, p.cm);
        gl.uniform1f(U.uBright, p.bright);
        gl.uniform1f(U.uSP, p.sp);
        gl.uniform1f(U.uLA, p.la);
        gl.uniform1f(U.uRS, p.rs);
        gl.uniform1f(U.uDV, p.dv);
        gl.uniform1f(U.uFOV, p.fov);
        gl.uniform2f(U.uCAM, cam.theta, cam.phi);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      } else if (sh.mode === 'lsystem' && sh.prog && sh.u) {
        gl.viewport(0, 0, w, h);
        gl.useProgram(sh.prog);
        const U = sh.u;
        gl.uniform2f(U.uR, w, h);
        gl.uniform1f(U.uTime, timeRef.current);
        gl.uniform1i(U.uMI, p.mi);
        gl.uniform1f(U.uSC, p.sc);
        gl.uniform1f(U.uOX, p.ox);
        gl.uniform1i(U.uFT, p.ft);
        gl.uniform1f(U.uFSC, p.fsc);
        gl.uniform1f(U.uBL, p.bl);
        gl.uniform1i(U.uLS, p.ls);                            // ls → growth type
        gl.uniform1i(U.uLD, Math.min(3, p.mi));               // mi → tree depth (cap at 3)
        gl.uniform1f(U.uLR, Math.max(0.02, p.mr));            // mr → branch radius
        gl.uniform1f(U.uLANG, p.fs * 0.6);                   // fs → branch angle (radians)
        gl.uniform1f(U.uLT, p.lt);                            // lt → tropism
        gl.uniform1f(U.uLG, Math.min(1.1, p.lg));             // lg → growth scale
        gl.uniform1f(U.uLBL, p.bl);                           // bl → IFS/lsystem blend
        gl.uniform1i(U.uCM, p.cm);
        gl.uniform1f(U.uBright, p.bright);
        gl.uniform1f(U.uSP, p.sp);
        gl.uniform1f(U.uLA, p.la);
        gl.uniform1f(U.uRS, p.rs);
        gl.uniform1f(U.uDV, p.dv);
        gl.uniform1f(U.uFOV, p.fov);
        gl.uniform2f(U.uCAM, cam.theta, cam.phi);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      } else if (sh.mode === 'rd' && sh.rdProgs && sh.rdUs && sh.rdFBOs && sh.rdTexs) {
        const { seed, step, render } = sh.rdProgs;
        const Us = sh.rdUs;
        const [fbo0, fbo1] = sh.rdFBOs;
        const [tex0, tex1] = sh.rdTexs;
        let rdRead = sh.rdRead;
        const getFBO = (i: number) => i === 0 ? fbo0 : fbo1;
        const getTex = (i: number) => i === 0 ? tex0 : tex1;

        // Re-seed when needed (first frame or param change)
        if (sh.rdNeedsSeed) {
          gl.viewport(0, 0, RD_SIZE, RD_SIZE);
          gl.useProgram(seed);
          const U = Us.seed;
          gl.bindFramebuffer(gl.FRAMEBUFFER, getFBO(1 - rdRead));
          gl.uniform2f(U.uRes, RD_SIZE, RD_SIZE);
          gl.uniform1f(U.uTime, timeRef.current);
          gl.uniform1f(U.uSC, p.sc);
          gl.uniform1f(U.uBL, p.bl);
          gl.uniform1i(U.uMI, p.mi);
          gl.uniform1i(U.uFT, p.ft);
          gl.uniform1f(U.uFSC, p.fsc);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          sh.rdRead = 1 - rdRead;
          rdRead = sh.rdRead;
          sh.rdNeedsSeed = false;
        }

        // Run 8 RD steps per frame
        gl.viewport(0, 0, RD_SIZE, RD_SIZE);
        gl.useProgram(step);
        const SU = Us.step;
        for (let i = 0; i < 8; i++) {
          const rdWrite = 1 - rdRead;
          gl.bindFramebuffer(gl.FRAMEBUFFER, getFBO(rdWrite));
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, getTex(rdRead));
          gl.uniform1i(SU.uTex, 0);
          gl.uniform2f(SU.uRes, RD_SIZE, RD_SIZE);
          gl.uniform1f(SU.uF, p.rdF);
          gl.uniform1f(SU.uK, p.rdK);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          rdRead = rdWrite;
        }
        sh.rdRead = rdRead;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // Render pass
        gl.viewport(0, 0, w, h);
        gl.useProgram(render);
        const RU = Us.render;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, getTex(rdRead));
        gl.uniform1i(RU.uRDTex, 0);
        gl.uniform2f(RU.uR, w, h);
        gl.uniform1f(RU.uTime, timeRef.current);
        gl.uniform1i(RU.uMI, p.mi);
        gl.uniform1f(RU.uSC, p.sc);
        gl.uniform1i(RU.uFT, p.ft);
        gl.uniform1f(RU.uFSC, p.fsc);
        gl.uniform1f(RU.uBL, p.bl);
        gl.uniform1i(RU.uCM, p.cm);
        gl.uniform1f(RU.uBright, p.bright);
        gl.uniform1f(RU.uContrast, p.bright * 1.5);
        gl.uniform1f(RU.uRS, p.rs);
        gl.uniform1f(RU.uDV, p.dv);
        gl.uniform1f(RU.uFOV, p.fov);
        gl.uniform2f(RU.uCAM, cam.theta, cam.phi);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

      } else if (sh.mode === 'standard' && sh.prog && sh.u) {
        // Mandelbulb animate: drive camera orbit + power oscillation + palette shift via uTime
        const isMB = (p.mode ?? 0) === 1;
        if (isMB && p.animate) {
          // Slow Y-axis orbit (0.18 rad/s)
          cam.phi += dt * 0.18;
        }
        const animPow = (isMB && p.animate)
          ? (p.pow ?? 8) + 0.5 * Math.sin(timeRef.current * 0.7)
          : (p.pow ?? 8);

        gl.viewport(0, 0, w, h);
        gl.useProgram(sh.prog);
        const U = sh.u;
        gl.uniform2f(U.uR, w, h);
        gl.uniform1f(U.uTime, timeRef.current);
        gl.uniform1i(U.uMODE, p.mode ?? 0);
        gl.uniform1i(U.uMI, p.mi);   gl.uniform1f(U.uSC, p.sc);
        gl.uniform1f(U.uOX, p.ox);   gl.uniform1f(U.uOY, p.oy);
        gl.uniform1f(U.uOZ, p.oz ?? p.ox);
        gl.uniform1i(U.uFT, p.ft);   gl.uniform1i(U.uFI, p.fi);
        gl.uniform1f(U.uFS, p.fs);   gl.uniform1f(U.uFSC, p.fsc);
        gl.uniform1f(U.uMR, p.mr);   gl.uniform1f(U.uBL, p.bl);
        gl.uniform1f(U.uTWIST, p.twist ?? 0); gl.uniform1i(U.uTRAP, p.trap ?? 0);
        gl.uniform1i(U.uCON, p.con); gl.uniform1f(U.uCS, p.cs);
        gl.uniform1i(U.uCM, p.cm);   gl.uniform1i(U.uPAL, p.pal ?? 0);
        gl.uniform1f(U.uBright, p.bright);
        gl.uniform1f(U.uSP, p.sp);   gl.uniform1f(U.uLA, p.la);
        gl.uniform1f(U.uLE, p.le);   gl.uniform1i(U.uRS, p.rs);
        gl.uniform1f(U.uDV, p.dv);   gl.uniform1f(U.uFOV, p.fov);
        gl.uniform2f(U.uCAM, cam.theta, cam.phi);
        gl.uniform1f(U.uPOW, animPow);
        gl.uniform1i(U.uMBITER, p.mbIter ?? 7);
        gl.uniform1f(U.uBAIL, p.bail ?? 2.0);
        gl.uniform1i(U.uVARIANT, p.variant ?? 0);
        gl.uniform1f(U.uGLOW, p.glow ?? 0.3);
        gl.uniform1i(U.uCUTAXIS, p.cutAxis ?? 0);
        gl.uniform1f(U.uCUTPOS, p.cutPos ?? 0);
        gl.uniform1i(U.uANIMATE, p.animate ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Recompile shaders when shapeType changes ─────────────────────────────────
  useEffect(() => {
    shapeTypeRef.current = shapeType;
    const gl = glRef.current;
    if (!gl) return;
    compileForShape(gl, shapeType);
  }, [shapeType, compileForShape]);

  // ── Mouse / touch / wheel handlers ──────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = { active: true, shift: e.shiftKey, lx: e.clientX, ly: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current.active) return;
    const dx = (e.clientX - dragRef.current.lx) * 0.006;
    const dy = (e.clientY - dragRef.current.ly) * 0.006;
    dragRef.current.lx = e.clientX; dragRef.current.ly = e.clientY;
    const cam = camRef.current;
    if (dragRef.current.shift) {
      paramsRef.current = { ...paramsRef.current, la: (paramsRef.current.la + dx * 40 + 360) % 360 };
    } else {
      cam.phi += dx;
      cam.theta = Math.max(-1.3, Math.min(1.3, cam.theta + dy));
    }
  }, []);

  const handleMouseUp = useCallback(() => { dragRef.current.active = false; }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const newDv = Math.max(1.0, Math.min(14.0, paramsRef.current.dv + e.deltaY * 0.006));
    paramsRef.current = { ...paramsRef.current, dv: newDv };
    onCamDvChange?.(newDv);
  }, [onCamDvChange]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    dragRef.current = { active: true, shift: false, lx: e.touches[0].clientX, ly: e.touches[0].clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragRef.current.active) return;
    const dx = (e.touches[0].clientX - dragRef.current.lx) * 0.006;
    const dy = (e.touches[0].clientY - dragRef.current.ly) * 0.006;
    dragRef.current.lx = e.touches[0].clientX; dragRef.current.ly = e.touches[0].clientY;
    const cam = camRef.current;
    cam.phi += dx;
    cam.theta = Math.max(-1.3, Math.min(1.3, cam.theta + dy));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleWheel, handleTouchStart, handleTouchMove]);

  const engineLabel = params.mode === 1
    ? `MANDELBULB P${params.pow ?? 8} v${['STD','SPIKEY','SLICEY','HILLY','SMOOTH'][params.variant ?? 0]}`
    : `MENGER IFS ft${params.ft} mi${params.mi} sc${params.sc?.toFixed(1)}`;

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ cursor: 'crosshair', touchAction: 'none', background: '#000' }}
        onMouseDown={handleMouseDown}
      />

      {/* Algorithm DNA bar — captures engine state in every screenshot */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          background: 'rgba(4,8,15,0.82)',
          borderTop: '1px solid rgba(0,229,204,0.18)',
          padding: '4px 10px 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <div className="flex justify-between items-center">
          <span style={{ fontFamily: 'monospace', fontSize: '8px', letterSpacing: '3px', color: '#C9A84C', fontWeight: 700 }}>
            UUON ΔMENSION ENGINE
          </span>
          <span style={{ fontSize: '7px', color: 'rgba(0,229,204,0.4)', letterSpacing: '1px' }}>
            {engineLabel}
          </span>
          <span style={{ fontSize: '7px', color: 'rgba(123,94,167,0.6)', letterSpacing: '2px' }}>
            zoom {params.dv?.toFixed(1)}x
          </span>
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: '8px',
          color: 'rgba(0,229,204,0.65)', letterSpacing: '0.3px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {params.mode === 1
            ? `pw:${params.pow} var:${params.variant} iter:${params.mbIter} bail:${params.bail?.toFixed(1)} glow:${params.glow?.toFixed(2)} cm:${params.cm} pal:${params.pal}`
            : `ft:${params.ft} mi:${params.mi} sc:${params.sc?.toFixed(2)} ox:${params.ox?.toFixed(2)} oy:${params.oy?.toFixed(2)} oz:${params.oz?.toFixed(2)} tw:${params.twist?.toFixed(3)} tp:${params.trap} fi:${params.fi} fs:${params.fs?.toFixed(2)} fsc:${params.fsc?.toFixed(2)} bl:${params.bl?.toFixed(3)}`
          }
        </div>
      </div>
    </div>
  );
});

IFSCanvas.displayName = 'IFSCanvas';
export default IFSCanvas;
