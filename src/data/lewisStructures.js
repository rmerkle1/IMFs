// Lewis / skeletal structure data for all molecules in the IMF app.
//
// SKELETAL FORMAT:
//   - C atoms are implicit vertices (rendered as nothing, just bond endpoints)
//   - H atoms on carbon are OMITTED entirely (implicit in skeletal formulas)
//   - H atoms on heteroatoms (O-H, S-H, N-H) ARE included as text-only labels
//   - Heteroatoms (O, S, N, F, Cl, I, Na) are rendered as labeled circles
//
// lonePairs: each angle in the angles array = one lone-pair dot at that direction.
// Lone pairs come in pairs of two dots (two angles close together per pair).

export const LEWIS_STRUCTURES = {

  // ─── NONPOLAR ALKANES ──────────────────────────────────────────────────────
  // All C, no heteroatoms — skeletal formula is just a zigzag line.

  'CH₄': {
    atoms: [
      { id: 0, symbol: 'C', x: 0, y: 0 },
    ],
    bonds: [],
    lonePairs: [],
  },

  'C₂H₆': {
    atoms: [
      { id: 0, symbol: 'C', x: -14, y: 0 },
      { id: 1, symbol: 'C', x: 14,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [],
  },

  'C₃H₈': {
    atoms: [
      { id: 0, symbol: 'C', x: -28, y: 8  },
      { id: 1, symbol: 'C', x: 0,   y: -8 },
      { id: 2, symbol: 'C', x: 28,  y: 8  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
    ],
    lonePairs: [],
  },

  'C₄H₁₀': {
    atoms: [
      { id: 0, symbol: 'C', x: -42, y: 8  },
      { id: 1, symbol: 'C', x: -14, y: -8 },
      { id: 2, symbol: 'C', x: 14,  y: 8  },
      { id: 3, symbol: 'C', x: 42,  y: -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
    ],
    lonePairs: [],
  },

  'C₅H₁₂': {
    atoms: [
      { id: 0, symbol: 'C', x: -56, y: 8  },
      { id: 1, symbol: 'C', x: -28, y: -8 },
      { id: 2, symbol: 'C', x: 0,   y: 8  },
      { id: 3, symbol: 'C', x: 28,  y: -8 },
      { id: 4, symbol: 'C', x: 56,  y: 8  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
    ],
    lonePairs: [],
  },

  // ─── WEAKLY POLAR THIOLS ───────────────────────────────────────────────────
  // S-H kept; H on C removed.

  'CH₃SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0  },
      { id: 1, symbol: 'S', x: 8,   y: 0  },
      { id: 2, symbol: 'H', x: 36,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [80, 100, 260, 280] },
    ],
  },

  'C₂H₅SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0  },
      { id: 1, symbol: 'C', x: -10, y: 0  },
      { id: 2, symbol: 'S', x: 20,  y: 0  },
      { id: 3, symbol: 'H', x: 48,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 2, angles: [80, 100, 260, 280] },
    ],
  },

  'C₃H₇SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -52, y: 8  },
      { id: 1, symbol: 'C', x: -26, y: -8 },
      { id: 2, symbol: 'C', x: 0,   y: 8  },
      { id: 3, symbol: 'S', x: 30,  y: -8 },
      { id: 4, symbol: 'H', x: 56,  y: -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [80, 100, 260, 280] },
    ],
  },

  'C₄H₉SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -64, y: 8  },
      { id: 1, symbol: 'C', x: -38, y: -8 },
      { id: 2, symbol: 'C', x: -12, y: 8  },
      { id: 3, symbol: 'C', x: 14,  y: -8 },
      { id: 4, symbol: 'S', x: 44,  y: 8  },
      { id: 5, symbol: 'H', x: 70,  y: 8  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [80, 100, 260, 280] },
    ],
  },

  'C₅H₁₁SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -70, y: 8  },
      { id: 1, symbol: 'C', x: -46, y: -8 },
      { id: 2, symbol: 'C', x: -22, y: 8  },
      { id: 3, symbol: 'C', x: 2,   y: -8 },
      { id: 4, symbol: 'C', x: 26,  y: 8  },
      { id: 5, symbol: 'S', x: 54,  y: -8 },
      { id: 6, symbol: 'H', x: 78,  y: -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 6, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [80, 100, 260, 280] },
    ],
  },

  // ─── POLAR CARBONYLS ───────────────────────────────────────────────────────
  // C=O double bond kept; all H on C removed.

  'CH₂O': {
    // Formaldehyde: C=O (the C is a vertex, O is labeled)
    atoms: [
      { id: 0, symbol: 'C', x: -10, y: 0  },
      { id: 1, symbol: 'O', x: 20,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
    ],
    lonePairs: [
      { atomId: 1, angles: [60, 300] },
    ],
  },

  'C₂H₄O': {
    // Acetaldehyde: C-C=O (ketone-like end)
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0  },
      { id: 1, symbol: 'C', x: 6,   y: 0  },
      { id: 2, symbol: 'O', x: 34,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 2 },
    ],
    lonePairs: [
      { atomId: 2, angles: [60, 300] },
    ],
  },

  'C₃H₆O': {
    // Acetone: two C arms with C=O pointing up from center
    atoms: [
      { id: 0, symbol: 'C', x: -32, y: 0   },
      { id: 1, symbol: 'C', x: 0,   y: 0   },
      { id: 2, symbol: 'O', x: 0,   y: -30 },
      { id: 3, symbol: 'C', x: 32,  y: 0   },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 1, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 2, angles: [135, 45] },
    ],
  },

  'C₄H₈O': {
    // Butanone: C-C-C(=O)-C
    atoms: [
      { id: 0, symbol: 'C', x: -52, y: 0   },
      { id: 1, symbol: 'C', x: -24, y: 0   },
      { id: 2, symbol: 'C', x: 0,   y: 0   },
      { id: 3, symbol: 'O', x: 0,   y: -28 },
      { id: 4, symbol: 'C', x: 28,  y: 0   },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 2, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [135, 45] },
    ],
  },

  'C₅H₁₀O': {
    // 2-Pentanone: C-C-C-C(=O)-C
    atoms: [
      { id: 0, symbol: 'C', x: -64, y: 0   },
      { id: 1, symbol: 'C', x: -38, y: 0   },
      { id: 2, symbol: 'C', x: -12, y: 0   },
      { id: 3, symbol: 'C', x: 14,  y: 0   },
      { id: 4, symbol: 'O', x: 14,  y: -28 },
      { id: 5, symbol: 'C', x: 42,  y: 0   },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 2 },
      { from: 3, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [135, 45] },
    ],
  },

  // ─── HIGHLY POLAR ALCOHOLS ─────────────────────────────────────────────────
  // O-H kept; H on C removed.

  'CH₃OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0  },
      { id: 1, symbol: 'O', x: 8,   y: 0  },
      { id: 2, symbol: 'H', x: 32,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [80, 280] },
    ],
  },

  'C₂H₅OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0  },
      { id: 1, symbol: 'C', x: -8,  y: 0  },
      { id: 2, symbol: 'O', x: 22,  y: 0  },
      { id: 3, symbol: 'H', x: 46,  y: 0  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 2, angles: [80, 280] },
    ],
  },

  'C₃H₇OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -52, y: 8  },
      { id: 1, symbol: 'C', x: -26, y: -8 },
      { id: 2, symbol: 'C', x: 0,   y: 8  },
      { id: 3, symbol: 'O', x: 28,  y: -8 },
      { id: 4, symbol: 'H', x: 52,  y: -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [80, 280] },
    ],
  },

  'C₄H₉OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -64, y: 8  },
      { id: 1, symbol: 'C', x: -38, y: -8 },
      { id: 2, symbol: 'C', x: -12, y: 8  },
      { id: 3, symbol: 'C', x: 14,  y: -8 },
      { id: 4, symbol: 'O', x: 42,  y: 8  },
      { id: 5, symbol: 'H', x: 66,  y: 8  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [80, 280] },
    ],
  },

  'C₅H₁₁OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -72, y: 8  },
      { id: 1, symbol: 'C', x: -48, y: -8 },
      { id: 2, symbol: 'C', x: -24, y: 8  },
      { id: 3, symbol: 'C', x: 0,   y: -8 },
      { id: 4, symbol: 'C', x: 24,  y: 8  },
      { id: 5, symbol: 'O', x: 52,  y: -8 },
      { id: 6, symbol: 'H', x: 74,  y: -8 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 6, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [80, 280] },
    ],
  },

  // ─── IONS (alkoxides) ──────────────────────────────────────────────────────
  // O⁻ with extra lone pairs; H on C removed.

  'CH₃O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0               },
      { id: 1, symbol: 'O', x: 8,   y: 0, charge: -1   },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [60, 120, 240, 300] },
    ],
  },

  'C₂H₅O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0               },
      { id: 1, symbol: 'C', x: -8,  y: 0               },
      { id: 2, symbol: 'O', x: 22,  y: 0, charge: -1   },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
    ],
    lonePairs: [
      { atomId: 2, angles: [60, 120, 240, 300] },
    ],
  },

  'C₃H₇O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -52, y: 8               },
      { id: 1, symbol: 'C', x: -26, y: -8              },
      { id: 2, symbol: 'C', x: 0,   y: 8               },
      { id: 3, symbol: 'O', x: 28,  y: -8, charge: -1  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [60, 120, 240, 300] },
    ],
  },

  'C₄H₉O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -64, y: 8               },
      { id: 1, symbol: 'C', x: -38, y: -8              },
      { id: 2, symbol: 'C', x: -12, y: 8               },
      { id: 3, symbol: 'C', x: 14,  y: -8              },
      { id: 4, symbol: 'O', x: 42,  y: 8,  charge: -1  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [60, 120, 240, 300] },
    ],
  },

  'C₅H₁₁O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -72, y: 8               },
      { id: 1, symbol: 'C', x: -48, y: -8              },
      { id: 2, symbol: 'C', x: -24, y: 8               },
      { id: 3, symbol: 'C', x: 0,   y: -8              },
      { id: 4, symbol: 'C', x: 24,  y: 8               },
      { id: 5, symbol: 'O', x: 52,  y: -8, charge: -1  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [60, 120, 240, 300] },
    ],
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
    lonePairs: [
      { atomId: 0, angles: [135, 45] },
    ],
  },

  'NH₃': {
    atoms: [
      { id: 0, symbol: 'N', x: 0,   y: 0   },
      { id: 1, symbol: 'H', x: 0,   y: -26 },
      { id: 2, symbol: 'H', x: -22, y: 16  },
      { id: 3, symbol: 'H', x: 22,  y: 16  },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 0, angles: [270] },
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
    // C is implicit vertex; two O labels flank it
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: 0 },
      { id: 1, symbol: 'O', x: -32, y: 0 },
      { id: 2, symbol: 'O', x: 32,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    lonePairs: [
      { atomId: 1, angles: [120, 240] },
      { atomId: 2, angles: [60, 300]  },
    ],
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
    lonePairs: [
      { atomId: 0, angles: [120, 240] },
      { atomId: 1, angles: [60, 300]  },
    ],
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
    lonePairs: [
      { atomId: 0, angles: [270]       },
      { atomId: 1, angles: [120, 210]  },
      { atomId: 2, angles: [60, 330]   },
    ],
  },

  'CH₃Cl': {
    // C is implicit; Cl is labeled
    atoms: [
      { id: 0, symbol: 'C',  x: 0,   y: 0   },
      { id: 1, symbol: 'Cl', x: 0,   y: -34 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
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
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [90, 150, 210] },
      { atomId: 2, angles: [30, 330, 270] },
    ],
  },

  'C₆H₆': {
    // Benzene: all C implicit, just the ring with alternating bonds
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: -28 },
      { id: 1, symbol: 'C', x: 24,  y: -14 },
      { id: 2, symbol: 'C', x: 24,  y: 14  },
      { id: 3, symbol: 'C', x: 0,   y: 28  },
      { id: 4, symbol: 'C', x: -24, y: 14  },
      { id: 5, symbol: 'C', x: -24, y: -14 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 0, order: 1 },
    ],
    lonePairs: [],
  },

  'C₆H₁₂': {
    // Cyclohexane: all C implicit, hexagonal ring
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: -30 },
      { id: 1, symbol: 'C', x: 26,  y: -15 },
      { id: 2, symbol: 'C', x: 26,  y: 15  },
      { id: 3, symbol: 'C', x: 0,   y: 30  },
      { id: 4, symbol: 'C', x: -26, y: 15  },
      { id: 5, symbol: 'C', x: -26, y: -15 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 0, order: 1 },
    ],
    lonePairs: [],
  },
};
