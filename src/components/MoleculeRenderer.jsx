import React from 'react';
import { LEWIS_STRUCTURES } from '../data/lewisStructures';

const ATOM_STYLES = {
  C:  { color: '#888888', radius: 10, textColor: '#E0E0E0' },
  H:  { color: '#CCCCCC', radius: 5,  textColor: '#666666' },
  O:  { color: '#DD3311', radius: 10, textColor: 'white'   },
  S:  { color: '#CCAA00', radius: 11, textColor: 'white'   },
  N:  { color: '#3355CC', radius: 10, textColor: 'white'   },
  F:  { color: '#22BB44', radius: 9,  textColor: 'white'   },
  Cl: { color: '#339944', radius: 12, textColor: 'white'   },
  I:  { color: '#8844BB', radius: 13, textColor: 'white'   },
  Na: { color: '#9933CC', radius: 12, textColor: 'white'   },
};

const ELECTRONEGATIVITY = {
  F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, S: 2.58,
  C: 2.55, H: 2.20, I: 2.66, Na: 0.93,
};

function enToColor(en) {
  if (en >= 3.5) return '#FF1100';
  if (en >= 3.0) return '#FF6600';
  if (en >= 2.8) return '#FFAA00';
  if (en >= 2.5) return '#AACC00';
  if (en >= 2.0) return '#0099FF';
  return '#6600FF';
}

function getAtomRadius(atom) {
  if (atom.radius != null) return atom.radius;
  return (ATOM_STYLES[atom.symbol] || ATOM_STYLES['C']).radius;
}

function getAtomColor(atom) {
  return (ATOM_STYLES[atom.symbol] || ATOM_STYLES['C']).color;
}

function getAtomTextColor(atom) {
  return (ATOM_STYLES[atom.symbol] || ATOM_STYLES['C']).textColor;
}

// Render bonds between atoms
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
        // Perpendicular unit vector
        const px = -dy / len;
        const py = dx / len;

        const strokeProps = {
          stroke: '#AAAAAA',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        };
        if (bond.ionic) {
          Object.assign(strokeProps, { strokeDasharray: '4,3', stroke: '#DDDDAA' });
        }

        if (bond.order === 1 || bond.order == null) {
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              {...strokeProps}
            />
          );
        } else if (bond.order === 2) {
          const off = 3;
          return (
            <g key={i}>
              <line
                x1={a.x + px * off} y1={a.y + py * off}
                x2={b.x + px * off} y2={b.y + py * off}
                {...strokeProps}
              />
              <line
                x1={a.x - px * off} y1={a.y - py * off}
                x2={b.x - px * off} y2={b.y - py * off}
                {...strokeProps}
              />
            </g>
          );
        } else if (bond.order === 3) {
          const off = 5;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} {...strokeProps} />
              <line
                x1={a.x + px * off} y1={a.y + py * off}
                x2={b.x + px * off} y2={b.y + py * off}
                {...strokeProps}
              />
              <line
                x1={a.x - px * off} y1={a.y - py * off}
                x2={b.x - px * off} y2={b.y - py * off}
                {...strokeProps}
              />
            </g>
          );
        }
        return null;
      })}
    </>
  );
}

// Render lone pair dots around atoms
function LonePairDots({ atoms, lonePairs }) {
  if (!lonePairs || lonePairs.length === 0) return null;
  const dots = [];
  lonePairs.forEach((lp, lpIdx) => {
    const atom = atoms[lp.atomId];
    if (!atom) return;
    const r = getAtomRadius(atom) + 8;
    const color = getAtomColor(atom);
    lp.angles.forEach((angleDeg, aIdx) => {
      const rad = (angleDeg * Math.PI) / 180;
      const dx = Math.cos(rad) * r;
      const dy = -Math.sin(rad) * r; // SVG y-axis is flipped
      dots.push(
        <circle
          key={`lp-${lpIdx}-${aIdx}`}
          cx={atom.x + dx}
          cy={atom.y + dy}
          r={2.5}
          fill={color}
          opacity={0.85}
        />
      );
    });
  });
  return <>{dots}</>;
}

// Render atom circles with labels
function AtomCircles({ atoms }) {
  return (
    <>
      {atoms.map(atom => {
        const r = getAtomRadius(atom);
        const color = getAtomColor(atom);
        const textColor = getAtomTextColor(atom);
        const isSmallH = atom.symbol === 'H' && r <= 4;

        return (
          <g key={atom.id}>
            <circle
              cx={atom.x}
              cy={atom.y}
              r={r}
              fill={color}
              stroke={color}
              strokeWidth={0.5}
              opacity={0.92}
            />
            {!isSmallH && (
              <text
                x={atom.x}
                y={atom.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={r >= 10 ? (atom.symbol.length > 1 ? 7.5 : 9) : 7}
                fontWeight="700"
                fill={textColor}
                style={{ userSelect: 'none', fontFamily: 'sans-serif' }}
              >
                {atom.symbol}
              </text>
            )}
            {/* Formal charge badge */}
            {atom.charge != null && (
              <text
                x={atom.x + r * 0.65}
                y={atom.y - r * 0.65}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7}
                fontWeight="800"
                fill={atom.charge < 0 ? '#FF8888' : '#88CCFF'}
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

// Electron density cloud overlay
function ElectronDensityCloud({ atoms, filterId }) {
  return (
    <>
      {atoms.map(atom => {
        const en = ELECTRONEGATIVITY[atom.symbol] || 2.5;
        const color = enToColor(en);
        const r = getAtomRadius(atom) * 2.8;
        return (
          <circle
            key={`cloud-${atom.id}`}
            cx={atom.x}
            cy={atom.y}
            r={r}
            fill={color}
            opacity={0.45}
            filter={`url(#${filterId})`}
          />
        );
      })}
    </>
  );
}

// Fallback renderer: the original blob ellipse style
function FallbackRenderer({ molecule, x, y, angle }) {
  const POLARITY_COLORS = {
    nonpolar: '#4A90D9',
    weaklyPolar: '#4CAF7D',
    polar: '#FF9800',
    highlyPolar: '#E91E8C',
    ion: '#FFD700',
  };
  const mol = molecule;
  const polarity = mol.polarity || 'nonpolar';
  const color = POLARITY_COLORS[polarity] || '#4A90D9';
  const mass = mol.mass || 30;
  const baseRadius = Math.round(22 + Math.sqrt(mass) * 1.8);
  const shape = mol.shape || 'linear';
  const aspect = (shape === 'tetrahedral' || shape === 'trigonal' || polarity === 'ion')
    ? 1
    : shape === 'bent'
      ? 1.15
      : 1.2 + Math.min(0.6, mass / 120);
  const rx = baseRadius * aspect;
  const ry = baseRadius;
  const isIon = polarity === 'ion';

  return (
    <g transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`}>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={color} opacity={0.7}
        stroke={color} strokeWidth={1.5} />
      {isIon && mol.charge !== undefined && (
        <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
          fontSize={Math.max(14, baseRadius * 0.55)} fontWeight="900"
          fill="white" style={{ userSelect: 'none' }}>
          {mol.charge > 0 ? '+' : '−'}
        </text>
      )}
      <g transform={`rotate(${-(angle * 180) / Math.PI})`}>
        <text x={0} y={ry + 14} textAnchor="middle" dominantBaseline="middle"
          fontSize={Math.max(10, Math.min(13, baseRadius * 0.42))} fontWeight="600"
          fill={color} opacity={0.95} style={{ userSelect: 'none' }}>
          {mol.formula}
        </text>
      </g>
    </g>
  );
}

export default function MoleculeRenderer({ molecule, x, y, angle, showPolarity, id }) {
  if (!molecule) return null;

  const struct = LEWIS_STRUCTURES[molecule.formula];
  if (!struct) {
    return <FallbackRenderer molecule={molecule} x={x} y={y} angle={angle} />;
  }

  const { atoms, bonds, lonePairs } = struct;
  const rotDeg = (angle * 180) / Math.PI;

  // Build a unique filter ID per molecule instance
  const safeId = (id || molecule.formula).replace(/[^a-zA-Z0-9]/g, '_');
  const blurFilterId = `blur-${safeId}`;

  // Color for the formula label (based on polarity)
  const POLARITY_COLORS = {
    nonpolar: '#4A90D9',
    weaklyPolar: '#4CAF7D',
    polar: '#FF9800',
    highlyPolar: '#E91E8C',
    ion: '#FFD700',
  };
  const labelColor = POLARITY_COLORS[molecule.polarity] || '#8BAFD4';

  // Compute bounding box for the label offset
  const ys = atoms.map(a => a.y + getAtomRadius(a));
  const maxY = Math.max(...ys);

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotDeg})`}>
      <defs>
        {showPolarity && (
          <filter id={blurFilterId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        )}
      </defs>

      {/* Electron density cloud — rendered first (behind everything) */}
      {showPolarity && (
        <ElectronDensityCloud atoms={atoms} filterId={blurFilterId} />
      )}

      {/* Bonds */}
      <BondLines atoms={atoms} bonds={bonds} />

      {/* Lone pair dots */}
      <LonePairDots atoms={atoms} lonePairs={lonePairs} />

      {/* Atoms */}
      <AtomCircles atoms={atoms} />

      {/* Formula label — counter-rotated so it stays readable */}
      <g transform={`rotate(${-rotDeg})`}>
        <text
          x={0}
          y={maxY + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight="600"
          fill={labelColor}
          opacity={0.9}
          style={{ userSelect: 'none', letterSpacing: '0.01em' }}
        >
          {molecule.formula}
        </text>
      </g>
    </g>
  );
}
