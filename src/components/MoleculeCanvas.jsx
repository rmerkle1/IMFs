import React, { useRef, useEffect, useState, useCallback } from 'react';
import MoleculeRenderer from './MoleculeRenderer';
import { useMoleculePhysics } from '../hooks/useMoleculePhysics';
import { getIMFs, getIMFStrength } from '../data/molecules';
import { getDipoleAngle, getChargeFacePositions } from '../data/lewisStructures';

// Transform local SVG coords (before scale 1.6) into world canvas coords
function localToWorld(localX, localY, pos) {
  const cos = Math.cos(pos.angle), sin = Math.sin(pos.angle);
  return {
    x: pos.x + (localX * cos - localY * sin) * 1.6,
    y: pos.y + (localX * sin + localY * cos) * 1.6,
  };
}

const CANVAS_HEIGHT = 480;

function molBoundRadius(mol) {
  if (!mol) return 45;
  return (24 + Math.sqrt(mol.mass || 30) * 1.4) * 1.6;
}

function IMFLines({ pos1, pos2, mol1, mol2, imfUnlocked }) {
  // Hooks must come before any conditional returns
  const [ldFlashes, setLdFlashes] = useState([]);

  const imfs = mol1 && mol2 ? getIMFs(mol1.polarity, mol2.polarity) : [];
  const hasLD   = imfs.includes('London dispersion');
  const hasDIID = imfs.includes('dipole-induced dipole');
  // LD-only means no stronger persistent IMF — flashes are the sole visual
  const isLDOnly = imfs.length === 1 && hasLD;

  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const INTERACT_RANGE = 260;

  // Half-extent along each molecule's long axis in world coords (after scale)
  const halfLen1 = Math.max(18, Math.sqrt(mol1?.mass || 30) * 2.8);
  const halfLen2 = Math.max(18, Math.sqrt(mol2?.mass || 30) * 2.8);

  // Animate random temporary-dipole flashes for LD and DIID
  const inFlashRange = imfUnlocked && (hasLD || hasDIID) && !!mol1 && !!mol2 && dist < INTERACT_RANGE * 0.85;
  useEffect(() => {
    if (!inFlashRange) { setLdFlashes([]); return; }
    const maxFlashes = isLDOnly ? 3 : 1;
    const id = setInterval(() => {
      setLdFlashes(prev => {
        const alive = prev
          .map(f => ({ ...f, age: f.age + 1 }))
          .filter(f => f.age < f.maxAge);
        while (alive.length < maxFlashes) {
          alive.push({
            id: Math.random(),
            t1: (Math.random() - 0.5) * 2,   // −1..1 along mol1 axis
            t2: (Math.random() - 0.5) * 2,   // −1..1 along mol2 axis
            negative1: Math.random() < 0.5,  // which end is δ−
            age: 0,
            maxAge: 2 + Math.floor(Math.random() * 3),
          });
        }
        return alive;
      });
    }, 220);
    return () => clearInterval(id);
  }, [inFlashRange, isLDOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mol1 || !mol2 || !imfUnlocked) return null;
  if (dist > INTERACT_RANGE) return null;

  const proximityFactor = Math.max(0, 1 - dist / INTERACT_RANGE);
  const opacity = Math.pow(proximityFactor, 0.6) * 0.85;

  const ux = dx / dist;
  const uy = dy / dist;
  const px = -uy;
  const py = ux;

  const r1 = molBoundRadius(mol1);
  const r2 = molBoundRadius(mol2);

  const isPolar1 = mol1.polarity !== 'nonpolar';
  const isPolar2 = mol2.polarity !== 'nonpolar';

  // Use actual δ- / δ+ atom positions for polar molecules; bounding radius otherwise
  const chargeFaces1 = isPolar1 ? getChargeFacePositions(mol1.formula) : null;
  const chargeFaces2 = isPolar2 ? getChargeFacePositions(mol2.formula) : null;

  let lx1, ly1, lx2, ly2;
  if (chargeFaces1) {
    // mol1's δ- face points toward mol2 (physics orients it that way)
    const w = localToWorld(chargeFaces1.negX, chargeFaces1.negY, pos1);
    lx1 = w.x; ly1 = w.y;
  } else {
    lx1 = pos1.x + ux * r1;
    ly1 = pos1.y + uy * r1;
  }

  if (chargeFaces2) {
    // mol2's δ+ face points toward mol1
    const w = localToWorld(chargeFaces2.posX, chargeFaces2.posY, pos2);
    lx2 = w.x; ly2 = w.y;
  } else {
    lx2 = pos2.x - ux * r2;
    ly2 = pos2.y - uy * r2;
  }

  const ldx = lx2 - lx1, ldy = ly2 - ly1;
  if (ldx * ldx + ldy * ldy < 100) return null;

  const mx = (lx1 + lx2) / 2;
  const my = (ly1 + ly2) / 2;
  const lineOffset = 8;
  const lines = [];

  const IMF_COLORS = {
    'ion-ion':              '#748ac5',
    'ion-dipole':           '#00addb',
    'ion-induced dipole':   '#00addb',
    'hydrogen bonding':     '#e9177a',
    'dipole-dipole':        '#fdb714',
    'dipole-dipole (weak)': '#85c441',
    'dipole-induced dipole':'#85c441',
    'London dispersion':    '#17b29e',
  };

  // ── Persistent lines for directional / fixed-charge IMFs ──────────────────
  if (imfs.includes('ion-ion')) {
    lines.push(
      <line key="ionion1"
        x1={lx1 + px * lineOffset} y1={ly1 + py * lineOffset}
        x2={lx2 + px * lineOffset} y2={ly2 + py * lineOffset}
        stroke="#748ac5" strokeWidth={2.5} opacity={opacity} strokeLinecap="round"
      />,
      <line key="ionion2"
        x1={lx1 - px * lineOffset} y1={ly1 - py * lineOffset}
        x2={lx2 - px * lineOffset} y2={ly2 - py * lineOffset}
        stroke="#748ac5" strokeWidth={2.5} opacity={opacity} strokeLinecap="round"
      />
    );
  } else if (imfs.includes('ion-dipole')) {
    lines.push(
      <line key="iondipole"
        x1={lx1} y1={ly1} x2={lx2} y2={ly2}
        stroke="#00addb" strokeWidth={2.5} opacity={opacity}
        strokeDasharray="10,5" strokeLinecap="round"
      />
    );
  } else if (imfs.includes('hydrogen bonding')) {
    lines.push(
      <line key="hbond"
        x1={lx1} y1={ly1} x2={lx2} y2={ly2}
        stroke="#e9177a" strokeWidth={2.2} opacity={opacity}
        strokeDasharray="4,4" strokeLinecap="round"
      />,
      <text key="hbondlabel" x={mx} y={my - 10} textAnchor="middle"
        fontSize={11} fontWeight="700" fill="#e9177a" opacity={opacity * 0.95}
        style={{ userSelect: 'none', fontFamily: 'serif' }}>
        H···
      </text>
    );
    if (imfs.includes('dipole-dipole')) {
      lines.push(
        <line key="dd"
          x1={lx1 + px * lineOffset} y1={ly1 + py * lineOffset}
          x2={lx2 + px * lineOffset} y2={ly2 + py * lineOffset}
          stroke="#e9177a" strokeWidth={1.5} opacity={opacity * 0.6} strokeLinecap="round"
        />
      );
    }
  } else if (imfs.includes('dipole-dipole')) {
    const ddColor = imfs.includes('dipole-dipole (weak)') ? '#85c441' : '#fdb714';
    lines.push(
      <line key="dd"
        x1={lx1} y1={ly1} x2={lx2} y2={ly2}
        stroke={ddColor} strokeWidth={2} opacity={opacity} strokeLinecap="round"
      />,
      <polygon key="ddarrow"
        points={`${mx - ux*10 + px*6},${my - uy*10 + py*6} ${mx + ux*10},${my + uy*10} ${mx - ux*10 - px*6},${my - uy*10 - py*6}`}
        fill={ddColor} opacity={opacity * 0.9}
      />
    );
  } else if (imfs.includes('dipole-induced dipole')) {
    lines.push(
      <line key="diid"
        x1={lx1} y1={ly1} x2={lx2} y2={ly2}
        stroke="#85c441" strokeWidth={1.5} opacity={opacity * 0.7}
        strokeDasharray="8,6" strokeLinecap="round"
      />
    );
  } else if (imfs.includes('ion-induced dipole')) {
    lines.push(
      <line key="iiid"
        x1={lx1} y1={ly1} x2={lx2} y2={ly2}
        stroke="#00addb" strokeWidth={1.5} opacity={opacity * 0.7}
        strokeDasharray="6,8" strokeLinecap="round"
      />
    );
  }
  // London dispersion has no persistent line — animated flashes only (below)

  const primaryIMF = imfs[0];
  const labelColor = IMF_COLORS[primaryIMF] || '#17b29e';
  const strength = getIMFStrength(mol1, mol2);
  const barLen = 60;
  const barFill = strength * barLen;

  lines.push(
    <g key="strengthIndicator" transform={`translate(${mx}, ${my + 20})`}>
      <rect x={-barLen / 2} y={0} width={barLen} height={5} rx={2.5}
        fill="#D8E4EE" opacity={opacity * 0.9} />
      <rect x={-barLen / 2} y={0} width={barFill} height={5} rx={2.5}
        fill={labelColor} opacity={opacity * 0.9} />
      <text x={0} y={-6} textAnchor="middle" fontSize={9.5} fontWeight="700"
        fill={labelColor} opacity={opacity}
        style={{ userSelect: 'none', letterSpacing: '0.02em', textTransform: 'capitalize' }}>
        {primaryIMF}
      </text>
    </g>
  );

  // ── Animated temporary-dipole flashes (London dispersion + dipole-induced dipole) ──
  // Each flash represents an instantaneous induced-dipole pair anywhere on the
  // molecular surface. Opacity scales down when stronger IMFs are also present.
  const flashOpacityScale = isLDOnly ? 0.85 : 0.45;
  const flashElements = inFlashRange
    ? ldFlashes.map(f => {
        const fadeOut = 1 - f.age / f.maxAge;
        const fOpacity = opacity * flashOpacityScale * fadeOut;
        // Sample a random point along each molecule's long axis
        const fx1 = pos1.x + Math.cos(pos1.angle) * f.t1 * halfLen1;
        const fy1 = pos1.y + Math.sin(pos1.angle) * f.t1 * halfLen1;
        const fx2 = pos2.x + Math.cos(pos2.angle) * f.t2 * halfLen2;
        const fy2 = pos2.y + Math.sin(pos2.angle) * f.t2 * halfLen2;
        const sign1 = f.negative1 ? '−' : '+';
        const sign2 = f.negative1 ? '+' : '−';
        return (
          <g key={f.id} opacity={fOpacity}>
            <line x1={fx1} y1={fy1} x2={fx2} y2={fy2}
              stroke="#17b29e" strokeWidth={1}
              strokeDasharray="2,4" strokeLinecap="round" />
            <text x={fx1} y={fy1 - 6} textAnchor="middle"
              fontSize={7} fontWeight="700" fill="#17b29e"
              style={{ userSelect: 'none' }}>δ{sign1}</text>
            <text x={fx2} y={fy2 - 6} textAnchor="middle"
              fontSize={7} fontWeight="700" fill="#17b29e"
              style={{ userSelect: 'none' }}>δ{sign2}</text>
          </g>
        );
      })
    : [];

  return <g>{lines}{flashElements}</g>;
}

function GridBackground({ width, height }) {
  const lines = [];
  const spacing = 40;
  for (let x = 0; x <= width; x += spacing) {
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height}
        stroke="#C8D8E8" strokeWidth={0.7} opacity={0.7} />
    );
  }
  for (let y = 0; y <= height; y += spacing) {
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y}
        stroke="#C8D8E8" strokeWidth={0.7} opacity={0.7} />
    );
  }
  return <g>{lines}</g>;
}

export default function MoleculeCanvas({ mol1, mol2, temperature, onDataUpdate }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 700, height: CANVAS_HEIGHT });
  const [showPolarity, setShowPolarity] = useState(false);
  const [simState, setSimState] = useState('idle'); // 'idle' | 'playing' | 'paused'
  const [imfUnlocked, setImfUnlocked] = useState(false);

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

  const { pos1, pos2, flex1, flex2, resetPositions } = useMoleculePhysics({
    mol1,
    mol2,
    temperature,
    canvasWidth: dims.width,
    canvasHeight: dims.height,
    simState,
  });

  // Reset to idle when molecules change
  useEffect(() => {
    setSimState('idle');
    setImfUnlocked(false);
  }, [mol1?.formula, mol2?.formula]); // eslint-disable-line react-hooks/exhaustive-deps

  // Unlock IMF display the first time molecules come within interaction range
  useEffect(() => {
    if (simState !== 'playing' || imfUnlocked) return;
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    if (Math.sqrt(dx * dx + dy * dy) < 220) setImfUnlocked(true);
  }, [pos1, pos2, simState, imfUnlocked]);

  const handlePlay  = () => setSimState('playing');
  const handlePause = () => setSimState('paused');
  const handleReset = () => {
    setSimState('idle');
    setImfUnlocked(false);
    resetPositions();
  };

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
    <div data-tutorial="canvas" ref={containerRef} style={{ width: '100%', position: 'relative', background: '#F5F8FC', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
      <svg
        width={dims.width}
        height={dims.height}
        style={{ display: 'block' }}
      >
        <GridBackground width={dims.width} height={dims.height} />

        {/* Subtle vignette overlay */}
        <defs>
          <radialGradient id="canvasBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#F5F8FC" stopOpacity="0" />
            <stop offset="100%" stopColor="#D8E4F0" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={dims.width} height={dims.height}
          fill="url(#canvasBg)" />

        {/* Molecules */}
        <MoleculeRenderer
          molecule={mol1}
          x={pos1.x}
          y={pos1.y}
          angle={pos1.angle}
          flexAngle={flex1}
          id="mol1"
          highlight={strength > 0.6}
          showPolarity={showPolarity}
        />
        <MoleculeRenderer
          molecule={mol2}
          x={pos2.x}
          y={pos2.y}
          angle={pos2.angle}
          flexAngle={flex2}
          id="mol2"
          highlight={strength > 0.6}
          showPolarity={showPolarity}
        />

        {/* IMF force lines — only shown after first close approach */}
        <IMFLines pos1={pos1} pos2={pos2} mol1={mol1} mol2={mol2} imfUnlocked={imfUnlocked} />

        {/* IMF type legend top-left — hidden until unlocked */}
        {imfUnlocked && (
          <g transform="translate(14, 14)">
            {imfs.map((imf, i) => {
              const IMF_LEGEND_COLORS = {
                'ion-ion':              '#748ac5',
                'ion-dipole':           '#00addb',
                'ion-induced dipole':   '#00addb',
                'hydrogen bonding':     '#e9177a',
                'dipole-dipole':        '#fdb714',
                'dipole-dipole (weak)': '#85c441',
                'dipole-induced dipole':'#85c441',
                'London dispersion':    '#17b29e',
              };
              const c = IMF_LEGEND_COLORS[imf] || '#17b29e';
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
        )}

        {/* Electron density toggle button */}
        <g data-tutorial="density-toggle"
           transform={`translate(${dims.width - 100}, 14)`}
           style={{ cursor: 'pointer' }}
           onClick={() => setShowPolarity(p => !p)}>
          <rect x={0} y={0} width={82} height={24} rx={5}
            fill={showPolarity ? '#e9177a22' : '#FFFFFF'}
            stroke={showPolarity ? '#e9177a' : '#C8D8E8'} strokeWidth={1} />
          <circle cx={12} cy={12} r={5} fill={showPolarity ? '#e9177a' : '#B0C8DA'} />
          <text x={47} y={12} textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill={showPolarity ? '#e9177a' : '#6A8FAA'} fontWeight="600"
            style={{ userSelect: 'none' }}>
            e⁻ Density
          </text>
        </g>

        {/* Play / Pause / Reset controls — bottom center */}
        <g data-tutorial="play-button" transform={`translate(${dims.width / 2}, ${dims.height - 28})`}>
          {/* Reset */}
          <g transform="translate(-68, 0)" style={{ cursor: 'pointer' }} onClick={handleReset}>
            <rect x={-30} y={-13} width={60} height={26} rx={5}
              fill="#FFFFFF" stroke="#C8D8E8" strokeWidth={1} />
            <text x={0} y={1} textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fill="#6A8FAA" fontWeight="600" style={{ userSelect: 'none' }}>
              ↺ Reset
            </text>
          </g>
          {/* Play / Pause toggle */}
          <g style={{ cursor: 'pointer' }}
             onClick={simState === 'playing' ? handlePause : handlePlay}>
            <rect x={-38} y={-14} width={76} height={28} rx={5}
              fill={simState === 'playing' ? '#e9177a18' : '#17b29e18'}
              stroke={simState === 'playing' ? '#e9177a' : '#17b29e'}
              strokeWidth={1.3} />
            <text x={0} y={1} textAnchor="middle" dominantBaseline="middle"
              fontSize={12} fontWeight="700"
              fill={simState === 'playing' ? '#e9177a' : '#17b29e'}
              style={{ userSelect: 'none' }}>
              {simState === 'playing' ? '⏸ Pause' : '▶ Play'}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
