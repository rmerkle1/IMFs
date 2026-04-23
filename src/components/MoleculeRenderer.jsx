import React from 'react';

const POLARITY_COLORS = {
  nonpolar: '#4A90D9',
  weaklyPolar: '#4CAF7D',
  polar: '#FF9800',
  highlyPolar: '#E91E8C',
  ion: '#FFD700',
};

const POLARITY_GLOW = {
  nonpolar: '#4A90D9',
  weaklyPolar: '#4CAF7D',
  polar: '#FF9800',
  highlyPolar: '#E91E8C',
  ion: '#FFD700',
};

function getMolRadius(mol) {
  if (!mol) return 28;
  const mass = mol.mass || 30;
  return Math.round(22 + Math.sqrt(mass) * 1.8);
}

function getAspectRatio(mol) {
  if (!mol) return 1;
  const shape = mol.shape || 'linear';
  if (shape === 'tetrahedral' || shape === 'trigonal' || mol.polarity === 'ion') return 1;
  if (shape === 'bent') return 1.15;
  if (shape === 'linear') {
    // More elongated for larger masses
    const mass = mol.mass || 30;
    return 1.2 + Math.min(0.6, mass / 120);
  }
  return 1;
}

export default function MoleculeRenderer({ molecule, x, y, angle, size, highlight, id }) {
  if (!molecule) return null;

  const mol = molecule;
  const polarity = mol.polarity || 'nonpolar';
  const color = POLARITY_COLORS[polarity] || '#4A90D9';
  const glowColor = POLARITY_GLOW[polarity] || '#4A90D9';
  const baseRadius = getMolRadius(mol);
  const radius = size ? baseRadius * (size / 40) : baseRadius;
  const aspect = getAspectRatio(mol);
  const rx = radius * aspect;
  const ry = radius;

  const isIon = polarity === 'ion';
  const isPolar = polarity === 'polar' || polarity === 'highlyPolar' || polarity === 'weaklyPolar';

  const glowId = `glow-${id || mol.formula.replace(/[^a-zA-Z0-9]/g, '')}`;
  const gradId = `grad-${id || mol.formula.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Glow radius scales with highlight intensity
  const glowRadius = highlight ? radius * 2.2 : radius * 1.5;
  const glowOpacity = highlight ? 0.55 : 0.22;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`}>
      {/* Defs for this molecule */}
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </radialGradient>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={highlight ? '8' : '5'} result="blur" />
          <feFlood floodColor={glowColor} floodOpacity={glowOpacity} result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow halo */}
      <ellipse
        cx={0}
        cy={0}
        rx={rx + glowRadius * 0.4}
        ry={ry + glowRadius * 0.4}
        fill={glowColor}
        opacity={glowOpacity * 0.6}
        style={{ filter: `blur(${radius * 0.4}px)` }}
      />

      {/* Main molecule body */}
      <ellipse
        cx={0}
        cy={0}
        rx={rx}
        ry={ry}
        fill={`url(#${gradId})`}
        stroke={color}
        strokeWidth={highlight ? 2.5 : 1.5}
        strokeOpacity={0.9}
        filter={`url(#${glowId})`}
        style={{ transition: 'stroke-width 0.2s' }}
      />

      {/* Inner highlight */}
      <ellipse
        cx={rx * -0.2}
        cy={ry * -0.3}
        rx={rx * 0.35}
        ry={ry * 0.25}
        fill="white"
        opacity={0.18}
      />

      {/* δ+ and δ- labels for polar molecules */}
      {isPolar && !isIon && (
        <>
          <text
            x={rx * 0.72}
            y={2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={Math.max(9, radius * 0.38)}
            fontWeight="700"
            fill="white"
            opacity={0.9}
            style={{ userSelect: 'none', fontFamily: 'serif' }}
          >
            δ−
          </text>
          <text
            x={rx * -0.72}
            y={2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={Math.max(9, radius * 0.38)}
            fontWeight="700"
            fill="white"
            opacity={0.9}
            style={{ userSelect: 'none', fontFamily: 'serif' }}
          >
            δ+
          </text>
        </>
      )}

      {/* Charge label for ions */}
      {isIon && mol.charge !== undefined && (
        <text
          x={0}
          y={-ry * 0.1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.max(14, radius * 0.55)}
          fontWeight="900"
          fill="white"
          opacity={1}
          style={{ userSelect: 'none' }}
        >
          {mol.charge > 0 ? '+' : '−'}
        </text>
      )}

      {/* Formula label — rendered without rotation so it's always readable */}
      <g transform={`rotate(${-(angle * 180) / Math.PI})`}>
        <text
          x={0}
          y={ry + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.max(10, Math.min(13, radius * 0.42))}
          fontWeight="600"
          fill={color}
          opacity={0.95}
          style={{ userSelect: 'none', letterSpacing: '0.01em' }}
        >
          {mol.formula}
        </text>
      </g>
    </g>
  );
}
