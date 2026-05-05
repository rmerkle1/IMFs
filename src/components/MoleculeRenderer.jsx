import React, { useMemo } from 'react';
import { LEWIS_STRUCTURES } from '../data/lewisStructures';

// Electronegativity (Pauling scale) — used for density cloud coloring
const ELECTRONEGATIVITY = {
  F: 3.98, O: 3.44, Cl: 3.16, N: 3.04,
  S: 2.58, C: 2.55, I: 2.66, H: 2.20, Na: 0.93,
};

// Text color and font size for heteroatoms (no circle, text-only)
const HETEROATOM_TEXT = {
  O:  { color: '#e9177a', fontSize: 14 },
  S:  { color: '#cc9a00', fontSize: 14 },
  N:  { color: '#748ac5', fontSize: 14 },
  F:  { color: '#17b29e', fontSize: 14 },
  Cl: { color: '#17b29e', fontSize: 12 },
  I:  { color: '#748ac5', fontSize: 13 },
  Na: { color: '#4f5b6f', fontSize: 12 },
};


// Map electronegativity to a density cloud color.
// pink=electron-rich → yellow → green → teal → blue → purple → grey=electron-poor
function enToColor(en) {
  if (en >= 3.3) return '#e9177a';  // pink  — O, F  (electron-rich)
  if (en >= 2.9) return '#fdb714';  // yellow — N, Cl
  if (en >= 2.6) return '#85c441';  // green  — I
  if (en >= 2.3) return '#17b29e';  // teal   — S, C
  if (en >= 1.8) return '#00addb';  // blue   — H    (electron-poor)
  if (en >= 1.0) return '#748ac5';  // purple
  return '#4f5b6f';                 // grey   — Na
}

// ── Bond rendering ────────────────────────────────────────────────────────────
function bondClearance(symbol) {
  if (symbol === 'C') return 0;
  if (symbol === 'H') return 5;
  if (symbol === 'Cl' || symbol === 'Na') return 10;
  if (symbol === 'I') return 9;
  return 8;
}

function BondLines({ atoms, bonds }) {
  return (
    <>
      {bonds.map((bond, i) => {
        const a = atoms[bond.from];
        const b = atoms[bond.to];
        if (!a || !b) return null;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        // Perpendicular
        const px = -uy;
        const py = ux;

        // Shorten bond to not overlap atom circles
        const ca = bondClearance(a.symbol);
        const cb = bondClearance(b.symbol);
        const x1 = a.x + ux * ca;
        const y1 = a.y + uy * ca;
        const x2 = b.x - ux * cb;
        const y2 = b.y - uy * cb;

        const base = {
          stroke: bond.ionic ? '#887744' : '#2A3A50',
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeDasharray: bond.ionic ? '5,3' : undefined,
        };

        if (bond.order === 3) {
          const off = 4;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} {...base} />
              <line x1={x1 + px*off} y1={y1 + py*off} x2={x2 + px*off} y2={y2 + py*off} {...base} />
              <line x1={x1 - px*off} y1={y1 - py*off} x2={x2 - px*off} y2={y2 - py*off} {...base} />
            </g>
          );
        }
        if (bond.order === 2) {
          const off = 3;
          return (
            <g key={i}>
              <line x1={x1 + px*off} y1={y1 + py*off} x2={x2 + px*off} y2={y2 + py*off} {...base} />
              <line x1={x1 - px*off} y1={y1 - py*off} x2={x2 - px*off} y2={y2 - py*off} {...base} />
            </g>
          );
        }
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...base} />;
      })}
    </>
  );
}

// ── Atom rendering ────────────────────────────────────────────────────────────
// C = invisible vertex (nothing rendered)
// H = small dark text label
// Heteroatoms = bold colored text only, no circle
function AtomNodes({ atoms }) {
  return (
    <>
      {atoms.map(atom => {
        if (atom.symbol === 'C') return null;

        if (atom.symbol === 'H') {
          return (
            <text
              key={atom.id}
              x={atom.x}
              y={atom.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight="600"
              fill="#2A3A50"
              style={{ userSelect: 'none', fontFamily: 'sans-serif' }}
            >
              H
            </text>
          );
        }

        // Heteroatoms: bold colored text, no circle
        const style = HETEROATOM_TEXT[atom.symbol] || { color: '#2A3A50', fontSize: 13 };
        const { color, fontSize } = style;

        return (
          <g key={atom.id}>
            <text
              x={atom.x}
              y={atom.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight="800"
              fill={color}
              style={{ userSelect: 'none', fontFamily: 'sans-serif' }}
            >
              {atom.symbol}
            </text>
            {atom.charge != null && (
              <text
                x={atom.x + fontSize * 0.65}
                y={atom.y - fontSize * 0.65}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7}
                fontWeight="800"
                fill={atom.charge < 0 ? '#FF6666' : '#66AAFF'}
                style={{ userSelect: 'none' }}
              >
                {atom.charge > 0 ? '+' : '−'}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}


// ── Canvas-based electron density metaball field ──────────────────────────────
// Partial charge per atom is accumulated from bond dipoles:
//   diff = (EN_to - EN_from) × bond.order
//   charges[from] += diff  (the "poorer" end loses density → δ+)
//   charges[to]   -= diff  (the richer end gains density → δ-)
// A 56×56 Gaussian scalar field is computed over the molecule bounding box.
// Each pixel's color = density-weighted average partial charge, mapped through
// a perceptually-motivated color ramp (pink=δ- / blue-purple=δ+).

const DENSITY_COLOR_STOPS = [
  [-1.0, [233, 23,  122]], // pink   #e9177a  strong δ-
  [-0.4, [253, 183,  20]], // yellow #fdb714
  [ 0.0, [ 23, 178, 158]], // teal   #17b29e  neutral
  [ 0.4, [  0, 173, 219]], // blue   #00addb
  [ 1.0, [116, 138, 197]], // purple #748ac5  strong δ+
];

function densityChargeToColor(t) {
  const stops = DENSITY_COLOR_STOPS;
  const clamped = Math.max(-1, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (clamped <= t1) {
      const f = (clamped - t0) / (t1 - t0);
      return [
        Math.round(c0[0] + (c1[0] - c0[0]) * f),
        Math.round(c0[1] + (c1[1] - c0[1]) * f),
        Math.round(c0[2] + (c1[2] - c0[2]) * f),
      ];
    }
  }
  return stops[stops.length - 1][1];
}

// Charge is derived purely from absolute electronegativity on a fixed scale
// centered at carbon (EN 2.55).  This means CH₄ shows near-neutral teal, and
// two atoms with similar EN (e.g. S vs C) get nearly the same color regardless
// of how many bonds each has.  The Gaussian field then blends continuously
// between atom values to produce the gradient across bonds.
function computeAtomCharges(atoms) {
  // Negative charge = δ- = electron rich = pink end of the ramp.
  // Positive charge = δ+ = electron poor = purple end.
  const EN_REF   = 2.55;  // carbon — maps to 0 (teal / neutral)
  const EN_SCALE = 1.4;   // EN units to reach ±1; F (3.98) → −1.02 → clamped pink
  const POWER    = 0.65;  // mild compression so mid-range atoms show more contrast
  const charges  = {};
  atoms.forEach(a => {
    const en = ELECTRONEGATIVITY[a.symbol] ?? EN_REF;
    // Higher EN → more negative → pink; lower EN → more positive → purple
    const raw     = -(en - EN_REF) / EN_SCALE;
    const clamped = Math.max(-1, Math.min(1, raw));
    const sign    = clamped < 0 ? -1 : 1;
    charges[a.id] = sign * Math.pow(Math.abs(clamped), POWER);
  });
  return charges;
}

function ElectronDensityCloud({ atoms, bonds }) {
  const url = useMemo(() => {
    if (!atoms || atoms.length === 0) return null;

    const normCharges = computeAtomCharges(atoms);

    const PAD = 32;
    const GRID = 56;
    const THRESH = 0.015;

    const xs = atoms.map(a => a.x);
    const ys = atoms.map(a => a.y);
    const minX = Math.min(...xs) - PAD;
    const minY = Math.min(...ys) - PAD;
    const maxX = Math.max(...xs) + PAD;
    const maxY = Math.max(...ys) + PAD;
    const W = maxX - minX;
    const H = maxY - minY;

    // SIGMA must be large enough that adjacent atoms' Gaussians overlap and
    // merge into one continuous cloud.  Typical bond length ~26 world units,
    // so floor at 12 (≈ half a bond) to guarantee continuity on small molecules,
    // and scale up proportionally for larger structures.
    const SIGMA = Math.max(12, Math.max(W, H) / GRID * 5);

    const canvas = document.createElement('canvas');
    canvas.width  = GRID;
    canvas.height = GRID;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(GRID, GRID);
    const data = imgData.data;

    for (let py = 0; py < GRID; py++) {
      for (let px = 0; px < GRID; px++) {
        // World coords of this pixel
        const wx = minX + (px / (GRID - 1)) * W;
        const wy = minY + (py / (GRID - 1)) * H;

        let density = 0;
        let chargeWt = 0;
        atoms.forEach(atom => {
          const dx = wx - atom.x;
          const dy = wy - atom.y;
          const d2 = dx * dx + dy * dy;
          const atomR = atom.symbol === 'H' ? 0.75 : atom.symbol === 'C' ? 1.0 : 1.2;
          const sig = SIGMA * atomR;
          const g = Math.exp(-d2 / (2 * sig * sig));
          density  += g;
          chargeWt += g * (normCharges[atom.id] || 0);
        });

        if (density < THRESH) {
          data[(py * GRID + px) * 4 + 3] = 0;
          continue;
        }

        // Quadratic alpha: low-density edge pixels fade to near-zero naturally,
        // avoiding a hard rectangular boundary without forcing an extra vignette.
        const avgCharge = chargeWt / density;
        const [r, g, b] = densityChargeToColor(avgCharge);
        const alpha = Math.round(Math.min(density * density * 300, 205));
        const idx = (py * GRID + px) * 4;
        data[idx]     = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = alpha;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return { url: canvas.toDataURL(), minX, minY, W, H };
  }, [atoms, bonds]);

  if (!url) return null;
  const { url: href, minX, minY, W, H } = url;

  return (
    <image
      href={href}
      x={minX}
      y={minY}
      width={W}
      height={H}
      opacity={0.82}
      preserveAspectRatio="none"
    />
  );
}

// ── Fallback blob renderer (for any molecule not in LEWIS_STRUCTURES) ─────────
function FallbackRenderer({ molecule, x, y, angle }) {
  const POLARITY_COLORS = {
    nonpolar: '#17b29e', weaklyPolar: '#85c441',
    polar: '#fdb714', highlyPolar: '#e9177a', ion: '#748ac5',
  };
  const color = POLARITY_COLORS[molecule.polarity] || '#4A90D9';
  const mass = molecule.mass || 30;
  const baseR = Math.round(22 + Math.sqrt(mass) * 1.6);
  const rotDeg = (angle * 180) / Math.PI;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotDeg})`}>
      <ellipse cx={0} cy={0} rx={baseR * 1.3} ry={baseR}
        fill={color} fillOpacity={0.25} stroke={color} strokeWidth={1.5} />
      <g transform={`rotate(${-rotDeg})`}>
        <text x={0} y={baseR + 14} textAnchor="middle" dominantBaseline="middle"
          fontSize={11} fontWeight="600" fill={color}
          style={{ userSelect: 'none' }}>
          {molecule.formula}
        </text>
      </g>
    </g>
  );
}

// ── Flex: rotate atoms "after" the pivot around the pivot point ───────────────
function applyFlex(atoms, flexAngle) {
  if (!flexAngle || Math.abs(flexAngle) < 0.002 || atoms.length < 2) return atoms;

  // Pivot = non-H atom whose x is nearest the midpoint of the heavy-atom x-range
  const heavy = atoms.filter(a => a.symbol !== 'H');
  if (heavy.length < 2) return atoms;
  const xs  = heavy.map(a => a.x);
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2;
  const pivot = heavy.reduce((b, a) => Math.abs(a.x - mid) < Math.abs(b.x - mid) ? a : b);

  const px = pivot.x, py = pivot.y;
  const cos = Math.cos(flexAngle), sin = Math.sin(flexAngle);

  return atoms.map(atom => {
    if (atom.x <= px + 1) return atom;   // left side stays fixed
    const dx = atom.x - px, dy = atom.y - py;
    return { ...atom,
      x: px + dx * cos - dy * sin,
      y: py + dx * sin + dy * cos,
    };
  });
}

// ── Main renderer ─────────────────────────────────────────────────────────────
export default function MoleculeRenderer({ molecule, x, y, angle, flexAngle = 0, showPolarity, id }) {
  if (!molecule) return null;

  const struct = LEWIS_STRUCTURES[molecule.formula];
  if (!struct) {
    return <FallbackRenderer molecule={molecule} x={x} y={y} angle={angle} />;
  }

  const rawAtoms        = struct.atoms;
  const atoms           = applyFlex(rawAtoms, flexAngle);
  const { bonds, lonePairs } = struct;
  const rotDeg = (angle * 180) / Math.PI;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotDeg}) scale(1.6)`}>
      {/* Electron density cloud — rendered first, behind everything */}
      {showPolarity && atoms.length > 0 && (
        <ElectronDensityCloud atoms={atoms} bonds={bonds} />
      )}

      {/* Bond lines */}
      <BondLines atoms={atoms} bonds={bonds} />

      {/* Atom nodes */}
      <AtomNodes atoms={atoms} />

    </g>
  );
}
