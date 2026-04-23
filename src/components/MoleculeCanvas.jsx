import React, { useRef, useEffect, useState, useCallback } from 'react';
import MoleculeRenderer from './MoleculeRenderer';
import { useMoleculePhysics } from '../hooks/useMoleculePhysics';
import { getIMFs, getIMFStrength } from '../data/molecules';

const CANVAS_HEIGHT = 480;

function IMFLines({ pos1, pos2, mol1, mol2 }) {
  if (!mol1 || !mol2) return null;

  const imfs = getIMFs(mol1.polarity, mol2.polarity);
  const strength = getIMFStrength(mol1, mol2);

  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;

  // Interaction range: show IMF lines when within this distance
  const interactRange = 260;
  if (dist > interactRange) return null;

  const proximityFactor = Math.max(0, 1 - dist / interactRange);
  const opacity = Math.pow(proximityFactor, 0.6) * 0.85;

  // Midpoint
  const mx = (pos1.x + pos2.x) / 2;
  const my = (pos1.y + pos2.y) / 2;

  // Unit vector
  const ux = dx / dist;
  const uy = dy / dist;

  // Perpendicular
  const px = -uy;
  const py = ux;

  const lineOffset = 8;

  const lines = [];

  if (imfs.includes('ion-ion')) {
    // Double lines
    lines.push(
      <line
        key="ionion1"
        x1={pos1.x + px * lineOffset} y1={pos1.y + py * lineOffset}
        x2={pos2.x + px * lineOffset} y2={pos2.y + py * lineOffset}
        stroke="#FFD700" strokeWidth={2.5} opacity={opacity}
        strokeLinecap="round"
      />,
      <line
        key="ionion2"
        x1={pos1.x - px * lineOffset} y1={pos1.y - py * lineOffset}
        x2={pos2.x - px * lineOffset} y2={pos2.y - py * lineOffset}
        stroke="#FFD700" strokeWidth={2.5} opacity={opacity}
        strokeLinecap="round"
      />
    );
  } else if (imfs.includes('ion-dipole')) {
    lines.push(
      <line
        key="iondipole"
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke="#FFD700" strokeWidth={2.5} opacity={opacity}
        strokeDasharray="10,5"
        strokeLinecap="round"
      />
    );
  } else if (imfs.includes('hydrogen bonding')) {
    // Dotted line with H··· label
    lines.push(
      <line
        key="hbond"
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke="#E91E8C" strokeWidth={2.2} opacity={opacity}
        strokeDasharray="4,4"
        strokeLinecap="round"
      />,
      <text
        key="hbondlabel"
        x={mx} y={my - 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight="700"
        fill="#E91E8C"
        opacity={opacity * 0.95}
        style={{ userSelect: 'none', fontFamily: 'serif' }}
      >
        H···
      </text>
    );
    if (imfs.includes('dipole-dipole')) {
      lines.push(
        <line
          key="dd"
          x1={pos1.x + px * lineOffset} y1={pos1.y + py * lineOffset}
          x2={pos2.x + px * lineOffset} y2={pos2.y + py * lineOffset}
          stroke="#E91E8C" strokeWidth={1.5} opacity={opacity * 0.6}
          strokeLinecap="round"
          markerEnd="url(#arrowPink)"
        />
      );
    }
  } else if (imfs.includes('dipole-dipole')) {
    const ddColor = imfs.includes('dipole-dipole (weak)') ? '#4CAF7D' : '#FF9800';
    lines.push(
      <line
        key="dd"
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke={ddColor} strokeWidth={2} opacity={opacity}
        strokeLinecap="round"
      />,
      // Arrow showing dipole alignment
      <polygon
        key="ddarrow"
        points={`${mx - ux * 10 + px * 6},${my - uy * 10 + py * 6} ${mx + ux * 10},${my + uy * 10} ${mx - ux * 10 - px * 6},${my - uy * 10 - py * 6}`}
        fill={ddColor}
        opacity={opacity * 0.9}
      />
    );
  } else if (imfs.includes('dipole-induced dipole')) {
    lines.push(
      <line
        key="diid"
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke="#FF9800" strokeWidth={1.5} opacity={opacity * 0.7}
        strokeDasharray="8,6"
        strokeLinecap="round"
      />
    );
  } else if (imfs.includes('ion-induced dipole')) {
    lines.push(
      <line
        key="iiid"
        x1={pos1.x} y1={pos1.y}
        x2={pos2.x} y2={pos2.y}
        stroke="#FFD700" strokeWidth={1.5} opacity={opacity * 0.7}
        strokeDasharray="6,8"
        strokeLinecap="round"
      />
    );
  }

  // London dispersion: always shown as background dashes
  if (imfs.includes('London dispersion') && dist < interactRange * 0.85) {
    const ldOpacity = Math.min(opacity * 0.4, 0.35);
    lines.push(
      <line
        key="ld"
        x1={pos1.x - px * lineOffset * (imfs.length > 1 ? 1 : 0)}
        y1={pos1.y - py * lineOffset * (imfs.length > 1 ? 1 : 0)}
        x2={pos2.x - px * lineOffset * (imfs.length > 1 ? 1 : 0)}
        y2={pos2.y - py * lineOffset * (imfs.length > 1 ? 1 : 0)}
        stroke="#4A90D9" strokeWidth={1.2} opacity={ldOpacity}
        strokeDasharray="3,7"
        strokeLinecap="round"
      />
    );
  }

  // IMF label at midpoint
  const primaryIMF = imfs[0];
  const labelColors = {
    'ion-ion': '#FFD700',
    'ion-dipole': '#FFD700',
    'ion-induced dipole': '#FFD700',
    'hydrogen bonding': '#E91E8C',
    'dipole-dipole': '#FF9800',
    'dipole-dipole (weak)': '#4CAF7D',
    'dipole-induced dipole': '#FF9800',
    'London dispersion': '#4A90D9',
  };
  const labelColor = labelColors[primaryIMF] || '#4A90D9';

  // Strength bar
  const barLen = 60;
  const barFill = strength * barLen;

  lines.push(
    <g key="strengthIndicator" transform={`translate(${mx}, ${my + 20})`}>
      <rect x={-barLen / 2} y={0} width={barLen} height={5} rx={2.5}
        fill="#1E2940" opacity={opacity * 0.8} />
      <rect x={-barLen / 2} y={0} width={barFill} height={5} rx={2.5}
        fill={labelColor} opacity={opacity * 0.9} />
      <text x={0} y={-6} textAnchor="middle" fontSize={9.5} fontWeight="600"
        fill={labelColor} opacity={opacity * 0.9}
        style={{ userSelect: 'none', letterSpacing: '0.02em', textTransform: 'capitalize' }}>
        {primaryIMF}
      </text>
    </g>
  );

  return <g>{lines}</g>;
}

function GridBackground({ width, height }) {
  const lines = [];
  const spacing = 40;
  for (let x = 0; x <= width; x += spacing) {
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height}
        stroke="#1E2940" strokeWidth={0.8} opacity={0.5} />
    );
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y}
        stroke="#1E2940" strokeWidth={0.8} opacity={0.5} />
    );
  }
  return <g>{lines}</g>;
}

export default function MoleculeCanvas({ mol1, mol2, temperature, onDataUpdate }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 700, height: CANVAS_HEIGHT });
  const [showPolarity, setShowPolarity] = useState(false);

  useEffect(() => {
    function updateDims() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDims({ width: rect.width || 700, height: CANVAS_HEIGHT });
      }
    }
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  const { pos1, pos2, resetPositions } = useMoleculePhysics({
    mol1,
    mol2,
    temperature,
    canvasWidth: dims.width,
    canvasHeight: dims.height,
  });

  // Report data upstream
  useEffect(() => {
    if (onDataUpdate) {
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      onDataUpdate({ dist });
    }
  }, [pos1, pos2, onDataUpdate]);

  const imfs = mol1 && mol2 ? getIMFs(mol1.polarity, mol2.polarity) : [];
  const strength = mol1 && mol2 ? getIMFStrength(mol1, mol2) : 0;

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', background: '#0F1729', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
      <svg
        width={dims.width}
        height={dims.height}
        style={{ display: 'block' }}
      >
        <GridBackground width={dims.width} height={dims.height} />

        {/* Subtle radial gradient overlay */}
        <defs>
          <radialGradient id="canvasBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#162040" stopOpacity="0" />
            <stop offset="100%" stopColor="#0A0E1A" stopOpacity="0.4" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={dims.width} height={dims.height}
          fill="url(#canvasBg)" />

        {/* IMF force lines between molecules */}
        <IMFLines pos1={pos1} pos2={pos2} mol1={mol1} mol2={mol2} />

        {/* Molecules */}
        <MoleculeRenderer
          molecule={mol1}
          x={pos1.x}
          y={pos1.y}
          angle={pos1.angle}
          id="mol1"
          highlight={strength > 0.6}
          showPolarity={showPolarity}
        />
        <MoleculeRenderer
          molecule={mol2}
          x={pos2.x}
          y={pos2.y}
          angle={pos2.angle}
          id="mol2"
          highlight={strength > 0.6}
          showPolarity={showPolarity}
        />

        {/* IMF type legend top-left */}
        <g transform="translate(14, 14)">
          {imfs.map((imf, i) => {
            const colors = {
              'ion-ion': '#FFD700',
              'ion-dipole': '#FFD700',
              'ion-induced dipole': '#FFAA00',
              'hydrogen bonding': '#E91E8C',
              'dipole-dipole': '#FF9800',
              'dipole-dipole (weak)': '#4CAF7D',
              'dipole-induced dipole': '#FF9800',
              'London dispersion': '#4A90D9',
            };
            const c = colors[imf] || '#4A90D9';
            return (
              <g key={imf} transform={`translate(0, ${i * 20})`}>
                <rect x={0} y={0} width={10} height={10} rx={2} fill={c} opacity={0.85} />
                <text x={14} y={9} fontSize={10.5} fill={c} fontWeight="600"
                  opacity={0.9} style={{ userSelect: 'none' }}>
                  {imf.charAt(0).toUpperCase() + imf.slice(1)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Electron density toggle button */}
        <g transform={`translate(${dims.width - 180}, 14)`}
           style={{ cursor: 'pointer' }}
           onClick={() => setShowPolarity(p => !p)}>
          <rect x={0} y={0} width={82} height={24} rx={5}
            fill={showPolarity ? '#2A1A4A' : '#1E2940'}
            stroke={showPolarity ? '#8844BB' : '#3A4F70'} strokeWidth={1} />
          <circle cx={12} cy={12} r={5} fill={showPolarity ? '#8844BB' : '#445566'} />
          <text x={47} y={12} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill={showPolarity ? '#CC88FF' : '#8BAFD4'} fontWeight="600"
            style={{ userSelect: 'none' }}>
            e⁻ Density
          </text>
        </g>

        {/* Reset button */}
        <g
          transform={`translate(${dims.width - 90}, 14)`}
          style={{ cursor: 'pointer' }}
          onClick={resetPositions}
        >
          <rect x={0} y={0} width={78} height={24} rx={5}
            fill="#1E2940" stroke="#3A4F70" strokeWidth={1} />
          <text x={39} y={12} textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fill="#8BAFD4" fontWeight="600"
            style={{ userSelect: 'none' }}>
            ↺ Reset
          </text>
        </g>
      </svg>
    </div>
  );
}
