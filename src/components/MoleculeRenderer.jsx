import React from 'react';
import { LEWIS_STRUCTURES } from '../data/lewisStructures';

// Electronegativity (Pauling scale) — used for density cloud coloring
const ELECTRONEGATIVITY = {
  F: 3.98, O: 3.44, Cl: 3.16, N: 3.04,
  S: 2.58, C: 2.55, I: 2.66, H: 2.20, Na: 0.93,
};

// Atom circle styles for heteroatoms (C is always implicit in skeletal)
const ATOM_STYLES = {
  O:  { fill: '#CC2200', text: '#FFFFFF', radius: 11 },
  S:  { fill: '#AA8800', text: '#FFFFFF', radius: 12 },
  N:  { fill: '#2244CC', text: '#FFFFFF', radius: 11 },
  F:  { fill: '#117733', text: '#FFFFFF', radius: 10 },
  Cl: { fill: '#1A8844', text: '#FFFFFF', radius: 13 },
  I:  { fill: '#662299', text: '#FFFFFF', radius: 14 },
  Na: { fill: '#7722AA', text: '#FFFFFF', radius: 13 },
};

// Map electronegativity to a cloud color (red=electron-rich, blue=electron-poor)
function enToColor(en) {
  if (en >= 3.5) return '#EE1100';
  if (en >= 3.0) return '#FF5500';
  if (en >= 2.8) return '#FF9900';
  if (en >= 2.5) return '#88BB00';
  if (en >= 2.0) return '#0088FF';
  return '#6600EE';
}

function atomRadius(symbol) {
  return (ATOM_STYLES[symbol] || { radius: 10 }).radius;
}

// ── Bond rendering ────────────────────────────────────────────────────────────
// Bonds are shortened so they don't overlap with heteroatom circles.
// C atoms are implicit (radius 0), H atoms use a small clearance.
function bondClearance(symbol) {
  if (symbol === 'C') return 0;
  if (symbol === 'H') return 5;
  return atomRadius(symbol) + 3;
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
// H = small text label only, no circle
// Heteroatoms = colored circle + symbol text + optional charge badge
function AtomNodes({ atoms }) {
  return (
    <>
      {atoms.map(atom => {
        // C atoms are invisible skeletal vertices
        if (atom.symbol === 'C') return null;

        // H atoms: small dark text, no circle
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

        // Heteroatoms: colored circle with symbol
        const style = ATOM_STYLES[atom.symbol] || { fill: '#555', text: '#fff', radius: 11 };
        const r = style.radius;
        const fontSize = atom.symbol.length > 1 ? 8 : 10;

        return (
          <g key={atom.id}>
            <circle cx={atom.x} cy={atom.y} r={r} fill={style.fill} />
            <text
              x={atom.x}
              y={atom.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight="700"
              fill={style.text}
              style={{ userSelect: 'none', fontFamily: 'sans-serif' }}
            >
              {atom.symbol}
            </text>
            {atom.charge != null && (
              <text
                x={atom.x + r * 0.7}
                y={atom.y - r * 0.7}
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

// ── Lone pair dots ────────────────────────────────────────────────────────────
function LonePairDots({ atoms, lonePairs }) {
  if (!lonePairs || lonePairs.length === 0) return null;
  const dots = [];
  lonePairs.forEach((lp, lpIdx) => {
    const atom = atoms[lp.atomId];
    if (!atom || atom.symbol === 'C') return;
    const clearance = atom.symbol === 'H' ? 8 : atomRadius(atom.symbol) + 7;
    lp.angles.forEach((deg, aIdx) => {
      const rad = (deg * Math.PI) / 180;
      const dx = Math.cos(rad) * clearance;
      const dy = -Math.sin(rad) * clearance; // SVG y-axis flip
      const style = ATOM_STYLES[atom.symbol];
      const dotColor = style ? style.fill : '#444';
      dots.push(
        <circle
          key={`lp-${lpIdx}-${aIdx}`}
          cx={atom.x + dx}
          cy={atom.y + dy}
          r={2.2}
          fill={dotColor}
          opacity={0.85}
        />
      );
    });
  });
  return <>{dots}</>;
}

// ── Continuous electron density cloud ────────────────────────────────────────
// All per-atom blobs are inside ONE <g> that has a single blur filter applied.
// This merges them into one continuous cloud rather than separate per-atom blobs.
function ElectronDensityCloud({ atoms, filterId }) {
  return (
    <g filter={`url(#${filterId})`} opacity={0.6}>
      {atoms.map(atom => {
        const en = ELECTRONEGATIVITY[atom.symbol] || 2.55;
        const color = enToColor(en);
        // Larger blob radius for electronegative atoms to emphasize their density
        const r = atom.symbol === 'H' ? 14 :
                  atom.symbol === 'C' ? 16 : 22;
        return (
          <circle
            key={`cloud-${atom.id}`}
            cx={atom.x}
            cy={atom.y}
            r={r}
            fill={color}
          />
        );
      })}
    </g>
  );
}

// ── Fallback blob renderer (for any molecule not in LEWIS_STRUCTURES) ─────────
function FallbackRenderer({ molecule, x, y, angle }) {
  const POLARITY_COLORS = {
    nonpolar: '#4A90D9', weaklyPolar: '#4CAF7D',
    polar: '#FF9800', highlyPolar: '#E91E8C', ion: '#FFD700',
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

// ── Main renderer ─────────────────────────────────────────────────────────────
export default function MoleculeRenderer({ molecule, x, y, angle, showPolarity, id }) {
  if (!molecule) return null;

  const struct = LEWIS_STRUCTURES[molecule.formula];
  if (!struct) {
    return <FallbackRenderer molecule={molecule} x={x} y={y} angle={angle} />;
  }

  const { atoms, bonds, lonePairs } = struct;
  const rotDeg = (angle * 180) / Math.PI;
  const safeId = (id || molecule.formula).replace(/[^a-zA-Z0-9]/g, '_');
  const cloudFilterId = `ecloud-${safeId}`;

  // Label color by polarity
  const LABEL_COLORS = {
    nonpolar: '#2A6099', weaklyPolar: '#2A7A4A',
    polar: '#AA5500', highlyPolar: '#AA0055', ion: '#886600',
  };
  const labelColor = LABEL_COLORS[molecule.polarity] || '#2A3A50';

  // Compute bottom of structure for label placement
  const maxY = atoms.length > 0 ? Math.max(...atoms.map(a => a.y + (a.symbol === 'C' ? 0 : atomRadius(a.symbol)))) : 0;
  const labelY = maxY + 16;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotDeg})`}>
      <defs>
        {showPolarity && (
          <filter id={cloudFilterId}
            x="-120%" y="-120%" width="340%" height="340%"
            colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="15" />
          </filter>
        )}
      </defs>

      {/* Electron density cloud — rendered first, behind everything */}
      {showPolarity && atoms.length > 0 && (
        <ElectronDensityCloud atoms={atoms} filterId={cloudFilterId} />
      )}

      {/* Bond lines */}
      <BondLines atoms={atoms} bonds={bonds} />

      {/* Lone pair dots */}
      <LonePairDots atoms={atoms} lonePairs={lonePairs} />

      {/* Atom nodes */}
      <AtomNodes atoms={atoms} />

      {/* Formula label — counter-rotated so it's always horizontal */}
      <g transform={`rotate(${-rotDeg})`}>
        <text
          x={0}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="700"
          fill={labelColor}
          style={{ userSelect: 'none', letterSpacing: '0.01em' }}
        >
          {molecule.formula}
        </text>
      </g>
    </g>
  );
}
