// Lewis / skeletal structure data for all molecules in the IMF app.
//
// All H atoms are shown explicitly (including H on carbon).
// Lone pairs on O and S are omitted. Lone pairs on N, F, Cl, I kept.

const EN = { F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, S: 2.58, C: 2.55, I: 2.66, H: 2.20, Na: 0.93 };

// Returns the angle (radians, in local SVG frame) of the molecular dipole,
// pointing from δ+ toward δ- (i.e. toward the electron-rich end).
// Returns 0 for symmetric / nonpolar molecules.
//
// Method: vector sum of bond dipoles + lone-pair contributions.
// Bond dipole of A→B = (EN_B - EN_A) × unit_vector(A→B).
//   Positive dEN means B is more electronegative → vector points toward δ-.
// Lone pairs concentrate δ- density; each pair adds a unit vector in its
// rendered direction (same SVG y-flip used in LonePairDots).
// This correctly handles NH₃, where the EN-weighted-centroid approach fails
// because N sits at the geometric centre and the lone pair dominates the dipole.
export function getDipoleAngle(formula) {
  const struct = LEWIS_STRUCTURES[formula];
  if (!struct || struct.atoms.length < 2) return 0;
  const { atoms, bonds, lonePairs } = struct;

  let dipoleX = 0, dipoleY = 0;

  // Bond dipole contributions
  for (const bond of (bonds || [])) {
    const fromAtom = atoms.find(a => a.id === bond.from);
    const toAtom   = atoms.find(a => a.id === bond.to);
    if (!fromAtom || !toAtom) continue;
    const enFrom = EN[fromAtom.symbol] || 2.55;
    const enTo   = EN[toAtom.symbol]   || 2.55;
    const dEN = enTo - enFrom;
    if (Math.abs(dEN) < 0.05) continue;      // skip essentially nonpolar bonds
    const bx = toAtom.x - fromAtom.x;
    const by = toAtom.y - fromAtom.y;
    const len = Math.sqrt(bx * bx + by * by) || 1;
    dipoleX += dEN * bx / len;
    dipoleY += dEN * by / len;
  }

  // Lone-pair contributions (each pair is a local δ- concentration)
  const LP_WEIGHT = 1.2;
  for (const lp of (lonePairs || [])) {
    for (const deg of lp.angles) {
      const rad = (deg * Math.PI) / 180;
      dipoleX += LP_WEIGHT * Math.cos(rad);
      dipoleY += LP_WEIGHT * -Math.sin(rad); // SVG y-axis flip (matches renderer)
    }
  }

  if (Math.abs(dipoleX) < 0.1 && Math.abs(dipoleY) < 0.1) return 0;
  return Math.atan2(dipoleY, dipoleX);
}

// Returns the local (pre-transform) SVG positions of the δ- and δ+ "charge faces"
// of a polar molecule — used to anchor IMF attraction lines to the actual charged atoms.
//
// negX/negY: position of the δ- atom (most electronegative, projected along dipole)
// posX/posY: position of the δ+ atom (H atom preferred; or least EN atom)
//
// Returns null for nonpolar molecules or those without a lewis structure.
// Caller transforms to world coords via: translate(pos) rotate(angle) scale(1.6)
export function getChargeFacePositions(formula) {
  const struct = LEWIS_STRUCTURES[formula];
  if (!struct) return null;

  const dipoleAngle = getDipoleAngle(formula);
  if (dipoleAngle === 0) return null;

  const { atoms, bonds } = struct;
  const cosD = Math.cos(dipoleAngle);
  const sinD = Math.sin(dipoleAngle);

  // Find H atoms bonded to O, N, or F — these are hydrogen-bond donor H atoms
  // and are always preferred as the δ+ endpoint over C-H hydrogens.
  const HB_ELECTRONEGATIVE = new Set(['O', 'N', 'F']);
  const hbDonorHIds = new Set();
  for (const bond of (bonds || [])) {
    const a = atoms.find(at => at.id === bond.from);
    const b = atoms.find(at => at.id === bond.to);
    if (!a || !b) continue;
    if (a.symbol === 'H' && HB_ELECTRONEGATIVE.has(b.symbol)) hbDonorHIds.add(a.id);
    if (b.symbol === 'H' && HB_ELECTRONEGATIVE.has(a.symbol)) hbDonorHIds.add(b.id);
  }

  let bestNegProj       = -Infinity;
  let bestPosAnyProj    =  Infinity;
  let bestPosHProj      =  Infinity;
  let bestPosHBProj     =  Infinity;
  let negAtom     = atoms[0];
  let posAtomAny  = atoms[0];
  let posAtomH    = null;
  let posAtomHB   = null;  // H bonded to O/N/F (highest priority)

  atoms.forEach(a => {
    const proj = a.x * cosD + a.y * sinD;
    if (proj > bestNegProj)   { bestNegProj = proj;    negAtom    = a; }
    if (proj < bestPosAnyProj){ bestPosAnyProj = proj; posAtomAny = a; }
    if (a.symbol === 'H' && proj < bestPosHProj)   { bestPosHProj  = proj; posAtomH  = a; }
    if (hbDonorHIds.has(a.id) && proj < bestPosHBProj) { bestPosHBProj = proj; posAtomHB = a; }
  });

  // Priority: HB-donor H (O/N/F–H) > any H > any atom
  const posAtom = posAtomHB || posAtomH || posAtomAny;
  return {
    negX: negAtom.x, negY: negAtom.y,
    posX: posAtom.x,  posY: posAtom.y,
  };
}

export const LEWIS_STRUCTURES = {

  // ─── NONPOLAR ALKANES ──────────────────────────────────────────────────────

  'CH₄': {
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: 0   },
      { id: 1, symbol: 'H', x: 24,  y: 0   },
      { id: 2, symbol: 'H', x: 0,   y: 24  },
      { id: 3, symbol: 'H', x: -24, y: 0   },
      { id: 4, symbol: 'H', x: 0,   y: -24 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairs: [],
  },

  'C₂H₆': {
    atoms: [
      { id: 0, symbol: 'C', x: -14, y: 0   },
      { id: 1, symbol: 'C', x: 14,  y: 0   },
      { id: 2, symbol: 'H', x: -26, y: -20 },
      { id: 3, symbol: 'H', x: -36, y: 0   },
      { id: 4, symbol: 'H', x: -26, y: 20  },
      { id: 5, symbol: 'H', x: 26,  y: -20 },
      { id: 6, symbol: 'H', x: 36,  y: 0   },
      { id: 7, symbol: 'H', x: 26,  y: 20  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 1, to: 5, order: 1 },
      { from: 1, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₈': {
    atoms: [
      { id: 0,  symbol: 'C', x: -28, y: 8   },
      { id: 1,  symbol: 'C', x: 0,   y: -8  },
      { id: 2,  symbol: 'C', x: 28,  y: 8   },
      { id: 3,  symbol: 'H', x: -40, y: -12 },
      { id: 4,  symbol: 'H', x: -50, y: 8   },
      { id: 5,  symbol: 'H', x: -40, y: 28  },
      { id: 6,  symbol: 'H', x: -8,  y: -28 },
      { id: 7,  symbol: 'H', x: 8,   y: -28 },
      { id: 8,  symbol: 'H', x: 40,  y: -12 },
      { id: 9,  symbol: 'H', x: 50,  y: 8   },
      { id: 10, symbol: 'H', x: 40,  y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 1, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 2, to: 8, order: 1 },
      { from: 2, to: 9, order: 1 },
      { from: 2, to: 10, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₁₀': {
    atoms: [
      { id: 0,  symbol: 'C', x: -42, y: 8   },
      { id: 1,  symbol: 'C', x: -14, y: -8  },
      { id: 2,  symbol: 'C', x: 14,  y: 8   },
      { id: 3,  symbol: 'C', x: 42,  y: -8  },
      { id: 4,  symbol: 'H', x: -54, y: -12 },
      { id: 5,  symbol: 'H', x: -62, y: 8   },
      { id: 6,  symbol: 'H', x: -54, y: 28  },
      { id: 7,  symbol: 'H', x: -22, y: -28 },
      { id: 8,  symbol: 'H', x: -6,  y: -28 },
      { id: 9,  symbol: 'H', x: 6,   y: 28  },
      { id: 10, symbol: 'H', x: 22,  y: 28  },
      { id: 11, symbol: 'H', x: 54,  y: -28 },
      { id: 12, symbol: 'H', x: 62,  y: -8  },
      { id: 13, symbol: 'H', x: 54,  y: 12  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 2, to: 9, order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 3, to: 11, order: 1 },
      { from: 3, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₂': {
    atoms: [
      { id: 0,  symbol: 'C', x: -56, y: 8   },
      { id: 1,  symbol: 'C', x: -28, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'C', x: 28,  y: -8  },
      { id: 4,  symbol: 'C', x: 56,  y: 8   },
      { id: 5,  symbol: 'H', x: -68, y: -12 },
      { id: 6,  symbol: 'H', x: -76, y: 8   },
      { id: 7,  symbol: 'H', x: -68, y: 28  },
      { id: 8,  symbol: 'H', x: -36, y: -28 },
      { id: 9,  symbol: 'H', x: -20, y: -28 },
      { id: 10, symbol: 'H', x: -8,  y: 28  },
      { id: 11, symbol: 'H', x: 8,   y: 28  },
      { id: 12, symbol: 'H', x: 20,  y: -28 },
      { id: 13, symbol: 'H', x: 36,  y: -28 },
      { id: 14, symbol: 'H', x: 68,  y: -12 },
      { id: 15, symbol: 'H', x: 76,  y: 8   },
      { id: 16, symbol: 'H', x: 68,  y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 3, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 4, to: 14, order: 1 },
      { from: 4, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── WEAKLY POLAR THIOLS ───────────────────────────────────────────────────
  // Bent S-H geometry; H on C shown; no lonePairs on S.

  'CH₃SH': {
    // Zigzag C-S-H so the sp3 bend at S is clearly visible
    atoms: [
      { id: 0, symbol: 'C', x: -26, y: 8   },
      { id: 1, symbol: 'S', x: 4,   y: -8  },
      { id: 2, symbol: 'H', x: 22,  y: 14  },
      { id: 3, symbol: 'H', x: -38, y: -12 },
      { id: 4, symbol: 'H', x: -48, y: 8   },
      { id: 5, symbol: 'H', x: -38, y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
    ],
    lonePairs: [],
  },

  'C₂H₅SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 8   },
      { id: 1, symbol: 'C', x: -8,  y: -8  },
      { id: 2, symbol: 'S', x: 24,  y: 8   },
      { id: 3, symbol: 'H', x: 42,  y: -14 },
      { id: 4, symbol: 'H', x: -48, y: -12 },
      { id: 5, symbol: 'H', x: -56, y: 8   },
      { id: 6, symbol: 'H', x: -48, y: 28  },
      { id: 7, symbol: 'H', x: -16, y: -28 },
      { id: 8, symbol: 'H', x: 0,   y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₇SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8   },
      { id: 1,  symbol: 'C', x: -26, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'S', x: 30,  y: -8  },
      { id: 4,  symbol: 'H', x: 46,  y: 16  },
      { id: 5,  symbol: 'H', x: -64, y: -12 },
      { id: 6,  symbol: 'H', x: -72, y: 8   },
      { id: 7,  symbol: 'H', x: -64, y: 28  },
      { id: 8,  symbol: 'H', x: -34, y: -28 },
      { id: 9,  symbol: 'H', x: -18, y: -28 },
      { id: 10, symbol: 'H', x: -8,  y: 28  },
      { id: 11, symbol: 'H', x: 8,   y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₉SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8   },
      { id: 1,  symbol: 'C', x: -38, y: -8  },
      { id: 2,  symbol: 'C', x: -12, y: 8   },
      { id: 3,  symbol: 'C', x: 14,  y: -8  },
      { id: 4,  symbol: 'S', x: 44,  y: 8   },
      { id: 5,  symbol: 'H', x: 64,  y: -14 },
      { id: 6,  symbol: 'H', x: -76, y: -12 },
      { id: 7,  symbol: 'H', x: -84, y: 8   },
      { id: 8,  symbol: 'H', x: -76, y: 28  },
      { id: 9,  symbol: 'H', x: -46, y: -28 },
      { id: 10, symbol: 'H', x: -30, y: -28 },
      { id: 11, symbol: 'H', x: -20, y: 28  },
      { id: 12, symbol: 'H', x: -4,  y: 28  },
      { id: 13, symbol: 'H', x: 6,   y: -28 },
      { id: 14, symbol: 'H', x: 22,  y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₁SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -70, y: 8   },
      { id: 1,  symbol: 'C', x: -46, y: -8  },
      { id: 2,  symbol: 'C', x: -22, y: 8   },
      { id: 3,  symbol: 'C', x: 2,   y: -8  },
      { id: 4,  symbol: 'C', x: 26,  y: 8   },
      { id: 5,  symbol: 'S', x: 54,  y: -8  },
      { id: 6,  symbol: 'H', x: 70,  y: 16  },
      { id: 7,  symbol: 'H', x: -82, y: -12 },
      { id: 8,  symbol: 'H', x: -90, y: 8   },
      { id: 9,  symbol: 'H', x: -82, y: 28  },
      { id: 10, symbol: 'H', x: -54, y: -28 },
      { id: 11, symbol: 'H', x: -38, y: -28 },
      { id: 12, symbol: 'H', x: -30, y: 28  },
      { id: 13, symbol: 'H', x: -14, y: 28  },
      { id: 14, symbol: 'H', x: -6,  y: -28 },
      { id: 15, symbol: 'H', x: 10,  y: -28 },
      { id: 16, symbol: 'H', x: 18,  y: 28  },
      { id: 17, symbol: 'H', x: 34,  y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5,  order: 1 },
      { from: 5, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 0, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 1, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 2, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 3, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
      { from: 4, to: 17, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── POLAR CARBONYLS ───────────────────────────────────────────────────────
  // C=O double bond; H on C shown; no lonePairs on O.

  'CH₂O': {
    // Formaldehyde: trigonal planar — O right, 2H on C left
    atoms: [
      { id: 0, symbol: 'C', x: -8,  y: 0   },
      { id: 1, symbol: 'O', x: 22,  y: 0   },
      { id: 2, symbol: 'H', x: -26, y: -20 },
      { id: 3, symbol: 'H', x: -26, y: 20  },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    lonePairs: [],
  },

  'C₂H₄O': {
    // Acetaldehyde: CH₃-CH=O — zigzag backbone, carbonyl C at lower position
    atoms: [
      { id: 0, symbol: 'C', x: -24, y: -8  },
      { id: 1, symbol: 'C', x:   6, y:  8  },
      { id: 2, symbol: 'O', x:   6, y: 34  },
      { id: 3, symbol: 'H', x:  24, y: -2  },
      { id: 4, symbol: 'H', x: -36, y: -26 },
      { id: 5, symbol: 'H', x: -46, y:  -8 },
      { id: 6, symbol: 'H', x: -36, y:  10 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 1, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₆O': {
    // Acetone: CH₃-C(=O)-CH₃ — zigzag, carbonyl C at lower position
    atoms: [
      { id: 0, symbol: 'C', x: -26, y: -8  },
      { id: 1, symbol: 'C', x:   0, y:  8  },
      { id: 2, symbol: 'O', x:   0, y: 34  },
      { id: 3, symbol: 'C', x:  26, y: -8  },
      { id: 4, symbol: 'H', x: -40, y: -24 },
      { id: 5, symbol: 'H', x: -48, y:  -8 },
      { id: 6, symbol: 'H', x: -40, y:   8 },
      { id: 7, symbol: 'H', x:  40, y: -24 },
      { id: 8, symbol: 'H', x:  48, y:  -8 },
      { id: 9, symbol: 'H', x:  40, y:   8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 1, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 3, to: 7, order: 1 },
      { from: 3, to: 8, order: 1 },
      { from: 3, to: 9, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₈O': {
    // Butanone: CH₃-CH₂-C(=O)-CH₃ — zigzag, C=O at lower position
    atoms: [
      { id: 0,  symbol: 'C', x: -38, y:  8  },
      { id: 1,  symbol: 'C', x: -12, y: -8  },
      { id: 2,  symbol: 'C', x:  14, y:  8  },
      { id: 3,  symbol: 'O', x:  14, y: 34  },
      { id: 4,  symbol: 'C', x:  40, y: -8  },
      { id: 5,  symbol: 'H', x: -50, y: -12 },
      { id: 6,  symbol: 'H', x: -60, y:   8 },
      { id: 7,  symbol: 'H', x: -50, y:  28 },
      { id: 8,  symbol: 'H', x: -24, y: -24 },
      { id: 9,  symbol: 'H', x:   0, y: -24 },
      { id: 10, symbol: 'H', x:  52, y: -26 },
      { id: 11, symbol: 'H', x:  62, y:  -8 },
      { id: 12, symbol: 'H', x:  52, y:   8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 2, to: 4, order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 4, to: 10, order: 1 },
      { from: 4, to: 11, order: 1 },
      { from: 4, to: 12, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₀O': {
    // Pentan-2-one: CH₃-CH₂-CH₂-C(=O)-CH₃ — zigzag, C=O at lower position
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: -8  },
      { id: 1,  symbol: 'C', x: -26, y:  8  },
      { id: 2,  symbol: 'C', x:   0, y: -8  },
      { id: 3,  symbol: 'C', x:  26, y:  8  },
      { id: 4,  symbol: 'O', x:  26, y: 34  },
      { id: 5,  symbol: 'C', x:  52, y: -8  },
      { id: 6,  symbol: 'H', x: -64, y: -26 },
      { id: 7,  symbol: 'H', x: -72, y:  -8 },
      { id: 8,  symbol: 'H', x: -64, y:   8 },
      { id: 9,  symbol: 'H', x: -38, y:  26 },
      { id: 10, symbol: 'H', x: -14, y:  26 },
      { id: 11, symbol: 'H', x: -12, y: -26 },
      { id: 12, symbol: 'H', x:  12, y: -26 },
      { id: 13, symbol: 'H', x:  40, y: -26 },
      { id: 14, symbol: 'H', x:  64, y: -26 },
      { id: 15, symbol: 'H', x:  70, y:  -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 2 },
      { from: 3, to: 5, order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 5, to: 13, order: 1 },
      { from: 5, to: 14, order: 1 },
      { from: 5, to: 15, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── HIGHLY POLAR ALCOHOLS ─────────────────────────────────────────────────
  // Bent O-H; H on C shown; no lonePairs on O.

  'CH₃OH': {
    // Zigzag C-O-H so the sp3 bend at O is clearly visible
    atoms: [
      { id: 0, symbol: 'C', x: -26, y: 8   },
      { id: 1, symbol: 'O', x: 2,   y: -8  },
      { id: 2, symbol: 'H', x: 20,  y: 14  },
      { id: 3, symbol: 'H', x: -38, y: -12 },
      { id: 4, symbol: 'H', x: -48, y: 8   },
      { id: 5, symbol: 'H', x: -38, y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
    ],
    lonePairs: [],
  },

  'C₂H₅OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 8   },
      { id: 1, symbol: 'C', x: -8,  y: -8  },
      { id: 2, symbol: 'O', x: 22,  y: 8   },
      { id: 3, symbol: 'H', x: 40,  y: -14 },
      { id: 4, symbol: 'H', x: -48, y: -12 },
      { id: 5, symbol: 'H', x: -56, y: 8   },
      { id: 6, symbol: 'H', x: -48, y: 28  },
      { id: 7, symbol: 'H', x: -16, y: -28 },
      { id: 8, symbol: 'H', x: 0,   y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₇OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8   },
      { id: 1,  symbol: 'C', x: -26, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'O', x: 28,  y: -8  },
      { id: 4,  symbol: 'H', x: 44,  y: 14  },
      { id: 5,  symbol: 'H', x: -64, y: -12 },
      { id: 6,  symbol: 'H', x: -72, y: 8   },
      { id: 7,  symbol: 'H', x: -64, y: 28  },
      { id: 8,  symbol: 'H', x: -34, y: -28 },
      { id: 9,  symbol: 'H', x: -18, y: -28 },
      { id: 10, symbol: 'H', x: -8,  y: 28  },
      { id: 11, symbol: 'H', x: 8,   y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₉OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8   },
      { id: 1,  symbol: 'C', x: -38, y: -8  },
      { id: 2,  symbol: 'C', x: -12, y: 8   },
      { id: 3,  symbol: 'C', x: 14,  y: -8  },
      { id: 4,  symbol: 'O', x: 42,  y: 8   },
      { id: 5,  symbol: 'H', x: 62,  y: -12 },
      { id: 6,  symbol: 'H', x: -76, y: -12 },
      { id: 7,  symbol: 'H', x: -84, y: 8   },
      { id: 8,  symbol: 'H', x: -76, y: 28  },
      { id: 9,  symbol: 'H', x: -46, y: -28 },
      { id: 10, symbol: 'H', x: -30, y: -28 },
      { id: 11, symbol: 'H', x: -20, y: 28  },
      { id: 12, symbol: 'H', x: -4,  y: 28  },
      { id: 13, symbol: 'H', x: 6,   y: -28 },
      { id: 14, symbol: 'H', x: 22,  y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₁OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -72, y: 8   },
      { id: 1,  symbol: 'C', x: -48, y: -8  },
      { id: 2,  symbol: 'C', x: -24, y: 8   },
      { id: 3,  symbol: 'C', x: 0,   y: -8  },
      { id: 4,  symbol: 'C', x: 24,  y: 8   },
      { id: 5,  symbol: 'O', x: 52,  y: -8  },
      { id: 6,  symbol: 'H', x: 68,  y: 14  },
      { id: 7,  symbol: 'H', x: -84, y: -12 },
      { id: 8,  symbol: 'H', x: -92, y: 8   },
      { id: 9,  symbol: 'H', x: -84, y: 28  },
      { id: 10, symbol: 'H', x: -56, y: -28 },
      { id: 11, symbol: 'H', x: -40, y: -28 },
      { id: 12, symbol: 'H', x: -32, y: 28  },
      { id: 13, symbol: 'H', x: -16, y: 28  },
      { id: 14, symbol: 'H', x: -8,  y: -28 },
      { id: 15, symbol: 'H', x: 8,   y: -28 },
      { id: 16, symbol: 'H', x: 16,  y: 28  },
      { id: 17, symbol: 'H', x: 32,  y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5,  order: 1 },
      { from: 5, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 0, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 1, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 2, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 3, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
      { from: 4, to: 17, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── IONS (alkoxides) ──────────────────────────────────────────────────────
  // O⁻; H on C shown; no lonePairs on O.

  'CH₃O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0,              },
      { id: 1, symbol: 'O', x: 8,   y: 0,  charge: -1  },
      { id: 2, symbol: 'H', x: -34, y: -20 },
      { id: 3, symbol: 'H', x: -44, y: 0   },
      { id: 4, symbol: 'H', x: -34, y: 20  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairs: [],
  },

  'C₂H₅O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 8,              },
      { id: 1, symbol: 'C', x: -8,  y: -8,             },
      { id: 2, symbol: 'O', x: 22,  y: 8,  charge: -1  },
      { id: 3, symbol: 'H', x: -48, y: -12 },
      { id: 4, symbol: 'H', x: -56, y: 8   },
      { id: 5, symbol: 'H', x: -48, y: 28  },
      { id: 6, symbol: 'H', x: -16, y: -28 },
      { id: 7, symbol: 'H', x: 0,   y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 1, to: 6, order: 1 },
      { from: 1, to: 7, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₇O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8,              },
      { id: 1,  symbol: 'C', x: -26, y: -8,             },
      { id: 2,  symbol: 'C', x: 0,   y: 8,              },
      { id: 3,  symbol: 'O', x: 28,  y: -8, charge: -1  },
      { id: 4,  symbol: 'H', x: -64, y: -12 },
      { id: 5,  symbol: 'H', x: -72, y: 8   },
      { id: 6,  symbol: 'H', x: -64, y: 28  },
      { id: 7,  symbol: 'H', x: -34, y: -28 },
      { id: 8,  symbol: 'H', x: -18, y: -28 },
      { id: 9,  symbol: 'H', x: -8,  y: 28  },
      { id: 10, symbol: 'H', x: 8,   y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 0, to: 4,  order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 1, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 2, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₉O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8,              },
      { id: 1,  symbol: 'C', x: -38, y: -8,             },
      { id: 2,  symbol: 'C', x: -12, y: 8,              },
      { id: 3,  symbol: 'C', x: 14,  y: -8,             },
      { id: 4,  symbol: 'O', x: 42,  y: 8,  charge: -1  },
      { id: 5,  symbol: 'H', x: -76, y: -12 },
      { id: 6,  symbol: 'H', x: -84, y: 8   },
      { id: 7,  symbol: 'H', x: -76, y: 28  },
      { id: 8,  symbol: 'H', x: -46, y: -28 },
      { id: 9,  symbol: 'H', x: -30, y: -28 },
      { id: 10, symbol: 'H', x: -20, y: 28  },
      { id: 11, symbol: 'H', x: -4,  y: 28  },
      { id: 12, symbol: 'H', x: 6,   y: -28 },
      { id: 13, symbol: 'H', x: 22,  y: -28 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 3, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₁O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -72, y: 8,              },
      { id: 1,  symbol: 'C', x: -48, y: -8,             },
      { id: 2,  symbol: 'C', x: -24, y: 8,              },
      { id: 3,  symbol: 'C', x: 0,   y: -8,             },
      { id: 4,  symbol: 'C', x: 24,  y: 8,              },
      { id: 5,  symbol: 'O', x: 52,  y: -8, charge: -1  },
      { id: 6,  symbol: 'H', x: -84, y: -12 },
      { id: 7,  symbol: 'H', x: -92, y: 8   },
      { id: 8,  symbol: 'H', x: -84, y: 28  },
      { id: 9,  symbol: 'H', x: -56, y: -28 },
      { id: 10, symbol: 'H', x: -40, y: -28 },
      { id: 11, symbol: 'H', x: -32, y: 28  },
      { id: 12, symbol: 'H', x: -16, y: 28  },
      { id: 13, symbol: 'H', x: -8,  y: -28 },
      { id: 14, symbol: 'H', x: 8,   y: -28 },
      { id: 15, symbol: 'H', x: 16,  y: 28  },
      { id: 16, symbol: 'H', x: 32,  y: 28  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5,  order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 0, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 4, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── SIMULATOR MOLECULES ───────────────────────────────────────────────────

  'H₂O': {
    atoms: [
      { id: 0, symbol: 'O', x: 0,   y: 0  },
      { id: 1, symbol: 'H', x: -20, y: 22 },
      { id: 2, symbol: 'H', x: 20,  y: 22 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
    lonePairs: [],
  },

  'NH₃': {
    // Side view of trigonal pyramid: N at top, all three H at bottom.
    // Makes the δ- (N/lone pair) vs δ+ (H) polarity immediately obvious.
    atoms: [
      { id: 0, symbol: 'N', x:   0, y:  0  },
      { id: 1, symbol: 'H', x: -22, y: 24  },
      { id: 2, symbol: 'H', x:   0, y: 28  },
      { id: 3, symbol: 'H', x:  22, y: 24  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    // Lone pair above N (angle 90° = upward in SVG convention).
    // Kept for getDipoleAngle — not rendered visually.
    lonePairs: [
      { atomId: 0, angles: [90] },
    ],
  },

  'HF': {
    atoms: [
      { id: 0, symbol: 'F', x: 0,   y: 0 },
      { id: 1, symbol: 'H', x: -26, y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [
      { atomId: 0, angles: [45, 135, 315] },
    ],
  },

  'HCl': {
    atoms: [
      { id: 0, symbol: 'Cl', x: 0,   y: 0 },
      { id: 1, symbol: 'H',  x: -30, y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [
      { atomId: 0, angles: [45, 135, 315] },
    ],
  },

  'CO₂': {
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: 0 },
      { id: 1, symbol: 'O', x: -32, y: 0 },
      { id: 2, symbol: 'O', x: 32,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    lonePairs: [],
  },

  'N₂': {
    atoms: [
      { id: 0, symbol: 'N', x: -16, y: 0 },
      { id: 1, symbol: 'N', x: 16,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 3 },
    ],
    lonePairs: [
      { atomId: 0, angles: [180] },
      { atomId: 1, angles: [0]   },
    ],
  },

  'O₂': {
    atoms: [
      { id: 0, symbol: 'O', x: -18, y: 0 },
      { id: 1, symbol: 'O', x: 18,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
    ],
    lonePairs: [],
  },

  'Cl₂': {
    atoms: [
      { id: 0, symbol: 'Cl', x: -22, y: 0 },
      { id: 1, symbol: 'Cl', x: 22,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [
      { atomId: 0, angles: [90, 150, 210] },
      { atomId: 1, angles: [30, 330, 270] },
    ],
  },

  'I₂': {
    atoms: [
      { id: 0, symbol: 'I', x: -24, y: 0 },
      { id: 1, symbol: 'I', x: 24,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [
      { atomId: 0, angles: [90, 150, 210] },
      { atomId: 1, angles: [30, 330, 270] },
    ],
  },

  'NaCl': {
    atoms: [
      { id: 0, symbol: 'Na', x: -22, y: 0, charge: 1  },
      { id: 1, symbol: 'Cl', x: 22,  y: 0, charge: -1 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1, ionic: true },
    ],
    lonePairs: [
      { atomId: 1, angles: [90, 150, 210, 330] },
    ],
  },

  'Na⁺': {
    atoms: [
      { id: 0, symbol: 'Na', x: 0, y: 0, charge: 1 },
    ],
    bonds: [],
    lonePairs: [],
  },

  'Cl⁻': {
    atoms: [
      { id: 0, symbol: 'Cl', x: 0, y: 0, charge: -1 },
    ],
    bonds: [],
    lonePairs: [
      { atomId: 0, angles: [0, 60, 120, 180, 240, 300] },
    ],
  },

  'SO₂': {
    atoms: [
      { id: 0, symbol: 'S', x: 0,   y: 0   },
      { id: 1, symbol: 'O', x: -28, y: -18 },
      { id: 2, symbol: 'O', x: 28,  y: -18 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    lonePairs: [],
  },

  'CH₃Cl': {
    atoms: [
      { id: 0, symbol: 'C',  x: 0,   y: 0   },
      { id: 1, symbol: 'Cl', x: 0,   y: -34 },
      { id: 2, symbol: 'H',  x: -22, y: 14  },
      { id: 3, symbol: 'H',  x: 22,  y: 14  },
      { id: 4, symbol: 'H',  x: 0,   y: 24  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [60, 120, 300] },
    ],
  },

  'CH₂Cl₂': {
    atoms: [
      { id: 0, symbol: 'C',  x: 0,   y: 0   },
      { id: 1, symbol: 'Cl', x: -30, y: -16 },
      { id: 2, symbol: 'Cl', x: 30,  y: -16 },
      { id: 3, symbol: 'H',  x: -12, y: 22  },
      { id: 4, symbol: 'H',  x: 12,  y: 22  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [90, 150, 210] },
      { atomId: 2, angles: [30, 330, 270] },
    ],
  },

  'C₆H₆': {
    // Benzene ring with 1H per C pointing outward
    atoms: [
      { id: 0,  symbol: 'C', x: 0,   y: -28 },
      { id: 1,  symbol: 'C', x: 24,  y: -14 },
      { id: 2,  symbol: 'C', x: 24,  y: 14  },
      { id: 3,  symbol: 'C', x: 0,   y: 28  },
      { id: 4,  symbol: 'C', x: -24, y: 14  },
      { id: 5,  symbol: 'C', x: -24, y: -14 },
      { id: 6,  symbol: 'H', x: 0,   y: -48 },
      { id: 7,  symbol: 'H', x: 42,  y: -24 },
      { id: 8,  symbol: 'H', x: 42,  y: 24  },
      { id: 9,  symbol: 'H', x: 0,   y: 48  },
      { id: 10, symbol: 'H', x: -42, y: 24  },
      { id: 11, symbol: 'H', x: -42, y: -24 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 1, to: 7,  order: 1 },
      { from: 2, to: 8,  order: 1 },
      { from: 3, to: 9,  order: 1 },
      { from: 4, to: 10, order: 1 },
      { from: 5, to: 11, order: 1 },
    ],
    lonePairs: [],
  },

  'C₆H₁₂': {
    // Cyclohexane ring with 2H per C pointing outward
    atoms: [
      { id: 0,  symbol: 'C', x: 0,   y: -30 },
      { id: 1,  symbol: 'C', x: 26,  y: -15 },
      { id: 2,  symbol: 'C', x: 26,  y: 15  },
      { id: 3,  symbol: 'C', x: 0,   y: 30  },
      { id: 4,  symbol: 'C', x: -26, y: 15  },
      { id: 5,  symbol: 'C', x: -26, y: -15 },
      { id: 6,  symbol: 'H', x: -8,  y: -48 },
      { id: 7,  symbol: 'H', x: 8,   y: -48 },
      { id: 8,  symbol: 'H', x: 44,  y: -24 },
      { id: 9,  symbol: 'H', x: 38,  y: -8  },
      { id: 10, symbol: 'H', x: 44,  y: 24  },
      { id: 11, symbol: 'H', x: 38,  y: 8   },
      { id: 12, symbol: 'H', x: -8,  y: 48  },
      { id: 13, symbol: 'H', x: 8,   y: 48  },
      { id: 14, symbol: 'H', x: -44, y: 24  },
      { id: 15, symbol: 'H', x: -38, y: 8   },
      { id: 16, symbol: 'H', x: -44, y: -24 },
      { id: 17, symbol: 'H', x: -38, y: -8  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 0, order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 0, to: 7,  order: 1 },
      { from: 1, to: 8,  order: 1 },
      { from: 1, to: 9,  order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 3, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 4, to: 14, order: 1 },
      { from: 4, to: 15, order: 1 },
      { from: 5, to: 16, order: 1 },
      { from: 5, to: 17, order: 1 },
    ],
    lonePairs: [],
  },
};
