/**
 * UUON Compression Field Engine — Core
 * AI Information Black Hole // core/engine.js
 *
 * Author:  Phillip Aguilar Ruiz III
 * Org:     UUON Foundation Inc.
 * License: USAL-1.0
 * Contact: phi1@uuonfoundation.com
 *
 * PROPRIETARY — excluded from public GitHub repo via .gitignore
 * Served from: uuon.world/engine/compression-field/core.js
 *
 * Exposes window.AIBH — called by index.html.
 * Without this file the shell renders but the field does not run.
 *
 * F = (P, E, M, R, C)
 *   P  Parameters:    { compressionK, diskTilt, fieldDepth, particleCount }
 *   E  Encoding:      infall dynamics — gravitational acceleration, angular momentum conservation
 *   M  Mapping:       zone threshold ratios → glyph class, opacity curve, angular boost, entropy bin
 *   R  Representation: canvas 2D frame — particle field, geodesics, leakage, zone geometry
 *   C  Compression:   P(~32B) → R(~200KB @1080p) ≈ 6,250:1
 */

(function (global) {

  'use strict';

  // ─── Section 1: AIBH_zoneMap  [IP — UUON Foundation Inc.] ───────────────────
  //
  // M-layer. Maps compression field geometry into behavioral zones.
  // Each zone carries: glyphs, opacity curve, angular boost, entropy bin.
  //
  // Glyph registers encode information class — not decorative:
  //   OUTER:  binary substrate — raw possibility space
  //   STREAM: semantic tokens — structured incoming data
  //   FTZ:    transformation operators — feature extraction boundary
  //   BOUND:  compressed residuals — post-encoding symbolic trace
  //
  // Ratio set { 1.0, 1.5, 3.0, 8.0 } and boost coefficient 3.5 at FTZ
  // are calibrated values. They produce the reentrant circulation pattern
  // where particles complete partial orbits before compression.

  function AIBH_zoneMap(rs) {
    return {
      bound:  { r: rs * 1.0, glyphs: ['.','_','=','|','-','.'],                  opacity: [0.08, 0.28], boost: 1.0, bin: 0 },
      ftz:    { r: rs * 1.5, glyphs: ['x','o','^','v','+','=','~','*'],           opacity: [0.10, 0.45], boost: 3.5, bin: 1 },
      isco:   { r: rs * 3.0, glyphs: ['d','S','G','L','f','e','n','u','m','s'],   opacity: [0.10, 0.55], boost: 1.0, bin: 2 },
      stream: { r: rs * 8.0, glyphs: ['0','1','0','1','0','1','1','0','0','1'],   opacity: [0.10, 0.65], boost: 1.0, bin: 3 },
    };
  }

  // ─── Section 2: AIBH_classify  [IP — UUON Foundation Inc.] ──────────────────

  function AIBH_classify(r, zones) {
    if (r <= zones.bound.r)  return 'bound';
    if (r <= zones.ftz.r)    return 'ftz';
    if (r <= zones.isco.r)   return 'isco';
    return 'stream';
  }

  // ─── Section 3: AIBH_infall  [IP — UUON Foundation Inc.] ───────────────────
  //
  // E-layer. Infall dynamics per particle step.
  // Angular momentum L conserved: omega = L / r²
  // Gravitational acceleration scales as (rs/r)² — deepens as r → rs.
  // FTZ boost produces reentrant circulation — visible stream structure.

  function AIBH_infall(r, theta, L, dr, rs, zones) {
    var omega = L / (r * r);
    var zone  = AIBH_classify(r, zones);
    if (zone === 'ftz') omega *= zones.ftz.boost;
    theta += omega;
    var safeR = Math.max(r, rs * 1.01);
    var grav  = 1.0 + Math.pow(rs / safeR, 2) * 2.5;
    r += dr * grav;
    return { r: r, theta: theta };
  }

  // ─── Section 4: AIBH_entropy  [IP — UUON Foundation Inc.] ──────────────────
  //
  // Shannon entropy H over zone-classified particle population.
  // H = -Σ p(i) · log₂(p(i))
  // Measures entropy of information state distribution, not spatial position.
  // Max 2.0 bits for 4 zones at uniform distribution.

  function AIBH_entropy(particles, zones) {
    var counts = { bound: 0, ftz: 0, isco: 0, stream: 0 };
    var total  = particles.length;
    for (var i = 0; i < total; i++) {
      counts[AIBH_classify(particles[i].r, zones)]++;
    }
    var H = 0;
    var keys = Object.keys(counts);
    for (var j = 0; j < keys.length; j++) {
      var c = counts[keys[j]];
      if (c > 0) { var p = c / total; H -= p * Math.log2(p); }
    }
    return { H: H, bits: H.toFixed(3), counts: counts };
  }

  // ─── Section 5: AIBH_leakSpawn  [IP — UUON Foundation Inc.] ────────────────
  //
  // Compression event → leakage emission coupling.
  // Particle crossing rs transforms — not destroyed.
  // Isotropic emission from compression boundary, not polar jets.
  // Models holographic boundary emission, not astrophysical radiation.

  function AIBH_leakSpawn(cx, cy, rs, diskTilt) {
    var angle  = Math.random() * Math.PI * 2;
    var edgeR  = rs * (1.02 + Math.random() * 0.25);
    var glyphs = ['.','_','=','|','-','.'];
    return {
      x:     cx + Math.cos(angle) * edgeR,
      y:     cy + Math.sin(angle) * edgeR * diskTilt,
      vx:    Math.cos(angle) * (0.4 + Math.random() * 1.2),
      vy:    Math.sin(angle) * (0.4 + Math.random() * 1.2) * diskTilt,
      life:  1.0,
      decay: 0.005 + Math.random() * 0.015,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      size:  7 + Math.random() * 4
    };
  }

  // ─── Section 6: AIBH_particleInit  [IP — UUON Foundation Inc.] ─────────────
  //
  // Particle initialization into disk or outer field.
  // L set proportional to r — stable inspiral, not radial freefall.
  // This produces the stream geometry rather than a symmetric collapse.

  function AIBH_particleInit(zone, rs, zones, fieldRadius) {
    var rMin, rMax;
    if (zone === 'disk') {
      rMin = zones.isco.r; rMax = zones.stream.r;
    } else {
      rMin = zones.stream.r * 0.65; rMax = fieldRadius;
    }
    if (rMax <= rMin) rMax = rMin + 10;
    var r = rMin + Math.random() * (rMax - rMin);
    return {
      r: r, theta: Math.random() * Math.PI * 2,
      L: r * (0.003 + Math.random() * 0.009),
      dr: -(0.10 + Math.random() * 0.28),
      size: 8 + Math.random() * 5,
      opacity: 0.10 + Math.random() * 0.55,
      glyphTimer: 0, glyph: '0'
    };
  }

  // ─── Section 7: window.AIBH — Public API Surface ────────────────────────────

  global.AIBH = {
    zoneMap:      AIBH_zoneMap,
    classify:     AIBH_classify,
    infall:       AIBH_infall,
    entropy:      AIBH_entropy,
    leakSpawn:    AIBH_leakSpawn,
    particleInit: AIBH_particleInit,
    VERSION:      '1.0.0'
  };

}(window));
