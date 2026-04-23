// Lewis structure data for all molecules in the IMF app.
// Each structure defines atoms, bonds, and lone pairs for SVG rendering.
// Coordinates are centered near (0,0), fitting within roughly ±80px from origin.
//
// lonePairs: each angle in the angles array = one dot at that direction from the atom.
// Lone pairs come in pairs of two dots close together.

export const LEWIS_STRUCTURES = {

  // ─── NONPOLAR ALKANES ──────────────────────────────────────────────────────

  'CH₄': {
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: 0  },
      { id: 1, symbol: 'H', x: 0,   y: -22 },
      { id: 2, symbol: 'H', x: 22,  y: 0  },
      { id: 3, symbol: 'H', x: 0,   y: 22 },
      { id: 4, symbol: 'H', x: -22, y: 0  },
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
      { id: 0, symbol: 'C', x: -14, y: 0  },
      { id: 1, symbol: 'C', x: 14,  y: 0  },
      { id: 2, symbol: 'H', x: -14, y: -22 },
      { id: 3, symbol: 'H', x: -30, y: -8  },
      { id: 4, symbol: 'H', x: -30, y: 8   },
      { id: 5, symbol: 'H', x: 14,  y: -22 },
      { id: 6, symbol: 'H', x: 30,  y: -8  },
      { id: 7, symbol: 'H', x: 30,  y: 8   },
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
    // 3-C zigzag: C(-28,8) C(0,-8) C(28,8)
    // H atoms as small dots (radius 4)
    atoms: [
      { id: 0,  symbol: 'C', x: -28, y: 8   },
      { id: 1,  symbol: 'C', x: 0,   y: -8  },
      { id: 2,  symbol: 'C', x: 28,  y: 8   },
      // H on left terminal C (3 H's spread around)
      { id: 3,  symbol: 'H', x: -28, y: -10, radius: 4 },
      { id: 4,  symbol: 'H', x: -44, y: 18,  radius: 4 },
      { id: 5,  symbol: 'H', x: -44, y: -2,  radius: 4 },
      // H on middle C (2 H's up/down)
      { id: 6,  symbol: 'H', x: -14, y: -22, radius: 4 },
      { id: 7,  symbol: 'H', x: 14,  y: -22, radius: 4 },
      // H on right terminal C (3 H's spread around)
      { id: 8,  symbol: 'H', x: 28,  y: -10, radius: 4 },
      { id: 9,  symbol: 'H', x: 44,  y: 18,  radius: 4 },
      { id: 10, symbol: 'H', x: 44,  y: -2,  radius: 4 },
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
    // 4-C zigzag
    atoms: [
      { id: 0,  symbol: 'C', x: -42, y: 8  },
      { id: 1,  symbol: 'C', x: -14, y: -8 },
      { id: 2,  symbol: 'C', x: 14,  y: 8  },
      { id: 3,  symbol: 'C', x: 42,  y: -8 },
      // 3 H on terminal C0
      { id: 4,  symbol: 'H', x: -42, y: -10, radius: 4 },
      { id: 5,  symbol: 'H', x: -58, y: 18,  radius: 4 },
      { id: 6,  symbol: 'H', x: -58, y: -2,  radius: 4 },
      // 2 H on internal C1
      { id: 7,  symbol: 'H', x: -20, y: -24, radius: 4 },
      { id: 8,  symbol: 'H', x: -8,  y: -24, radius: 4 },
      // 2 H on internal C2
      { id: 9,  symbol: 'H', x: 8,   y: 24,  radius: 4 },
      { id: 10, symbol: 'H', x: 20,  y: 24,  radius: 4 },
      // 3 H on terminal C3
      { id: 11, symbol: 'H', x: 42,  y: -24, radius: 4 },
      { id: 12, symbol: 'H', x: 58,  y: 2,   radius: 4 },
      { id: 13, symbol: 'H', x: 58,  y: -18, radius: 4 },
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
    // 5-C zigzag
    atoms: [
      { id: 0,  symbol: 'C', x: -56, y: 8  },
      { id: 1,  symbol: 'C', x: -28, y: -8 },
      { id: 2,  symbol: 'C', x: 0,   y: 8  },
      { id: 3,  symbol: 'C', x: 28,  y: -8 },
      { id: 4,  symbol: 'C', x: 56,  y: 8  },
      // 3 H on terminal C0
      { id: 5,  symbol: 'H', x: -56, y: -10, radius: 4 },
      { id: 6,  symbol: 'H', x: -72, y: 18,  radius: 4 },
      { id: 7,  symbol: 'H', x: -72, y: -2,  radius: 4 },
      // 2 H on internal C1
      { id: 8,  symbol: 'H', x: -34, y: -24, radius: 4 },
      { id: 9,  symbol: 'H', x: -22, y: -24, radius: 4 },
      // 2 H on internal C2
      { id: 10, symbol: 'H', x: -6,  y: 24,  radius: 4 },
      { id: 11, symbol: 'H', x: 6,   y: 24,  radius: 4 },
      // 2 H on internal C3
      { id: 12, symbol: 'H', x: 22,  y: -24, radius: 4 },
      { id: 13, symbol: 'H', x: 34,  y: -24, radius: 4 },
      // 3 H on terminal C4
      { id: 14, symbol: 'H', x: 56,  y: -10, radius: 4 },
      { id: 15, symbol: 'H', x: 72,  y: 18,  radius: 4 },
      { id: 16, symbol: 'H', x: 72,  y: -2,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
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

  'CH₃SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0   },
      { id: 1, symbol: 'S', x: 8,   y: 0   },
      { id: 2, symbol: 'H', x: 38,  y: 0   },
      { id: 3, symbol: 'H', x: -22, y: -22 },
      { id: 4, symbol: 'H', x: -38, y: 10  },
      { id: 5, symbol: 'H', x: -38, y: -10 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [80, 100, 260, 280] },
    ],
  },

  'C₂H₅SH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0   },
      { id: 1, symbol: 'C', x: -10, y: 0   },
      { id: 2, symbol: 'S', x: 20,  y: 0   },
      { id: 3, symbol: 'H', x: 48,  y: 0   },
      { id: 4, symbol: 'H', x: -36, y: -22 },
      { id: 5, symbol: 'H', x: -52, y: 10  },
      { id: 6, symbol: 'H', x: -52, y: -10 },
      { id: 7, symbol: 'H', x: -10, y: -22 },
      { id: 8, symbol: 'H', x: -10, y: 22  },
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
    lonePairs: [
      { atomId: 2, angles: [80, 100, 260, 280] },
    ],
  },

  'C₃H₇SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8   },
      { id: 1,  symbol: 'C', x: -26, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'S', x: 30,  y: -8  },
      { id: 4,  symbol: 'H', x: 52,  y: -8  },
      // 3 H on terminal C0
      { id: 5,  symbol: 'H', x: -52, y: -10, radius: 4 },
      { id: 6,  symbol: 'H', x: -66, y: 18,  radius: 4 },
      { id: 7,  symbol: 'H', x: -66, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 8,  symbol: 'H', x: -32, y: -22, radius: 4 },
      { id: 9,  symbol: 'H', x: -20, y: -22, radius: 4 },
      // 2 H on C2
      { id: 10, symbol: 'H', x: -6,  y: 22,  radius: 4 },
      { id: 11, symbol: 'H', x: 6,   y: 22,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [80, 100, 260, 280] },
    ],
  },

  'C₄H₉SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8   },
      { id: 1,  symbol: 'C', x: -38, y: -8  },
      { id: 2,  symbol: 'C', x: -12, y: 8   },
      { id: 3,  symbol: 'C', x: 14,  y: -8  },
      { id: 4,  symbol: 'S', x: 44,  y: 8   },
      { id: 5,  symbol: 'H', x: 64,  y: 8   },
      // 3 H on terminal C0
      { id: 6,  symbol: 'H', x: -64, y: -10, radius: 4 },
      { id: 7,  symbol: 'H', x: -78, y: 18,  radius: 4 },
      { id: 8,  symbol: 'H', x: -78, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 9,  symbol: 'H', x: -44, y: -22, radius: 4 },
      { id: 10, symbol: 'H', x: -32, y: -22, radius: 4 },
      // 2 H on C2
      { id: 11, symbol: 'H', x: -18, y: 22,  radius: 4 },
      { id: 12, symbol: 'H', x: -6,  y: 22,  radius: 4 },
      // 2 H on C3
      { id: 13, symbol: 'H', x: 8,   y: -22, radius: 4 },
      { id: 14, symbol: 'H', x: 20,  y: -22, radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [80, 100, 260, 280] },
    ],
  },

  'C₅H₁₁SH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -70, y: 8   },
      { id: 1,  symbol: 'C', x: -46, y: -8  },
      { id: 2,  symbol: 'C', x: -22, y: 8   },
      { id: 3,  symbol: 'C', x: 2,   y: -8  },
      { id: 4,  symbol: 'C', x: 26,  y: 8   },
      { id: 5,  symbol: 'S', x: 54,  y: -8  },
      { id: 6,  symbol: 'H', x: 72,  y: -8  },
      // 3 H on terminal C0
      { id: 7,  symbol: 'H', x: -70, y: -10, radius: 4 },
      { id: 8,  symbol: 'H', x: -82, y: 18,  radius: 4 },
      { id: 9,  symbol: 'H', x: -82, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 10, symbol: 'H', x: -52, y: -22, radius: 4 },
      { id: 11, symbol: 'H', x: -40, y: -22, radius: 4 },
      // 2 H on C2
      { id: 12, symbol: 'H', x: -28, y: 22,  radius: 4 },
      { id: 13, symbol: 'H', x: -16, y: 22,  radius: 4 },
      // 2 H on C3
      { id: 14, symbol: 'H', x: -4,  y: -22, radius: 4 },
      { id: 15, symbol: 'H', x: 8,   y: -22, radius: 4 },
      // 2 H on C4
      { id: 16, symbol: 'H', x: 20,  y: 22,  radius: 4 },
      { id: 17, symbol: 'H', x: 32,  y: 22,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 0, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 1, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 2, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 3, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
      { from: 4, to: 17, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [80, 100, 260, 280] },
    ],
  },

  // ─── POLAR CARBONYLS ───────────────────────────────────────────────────────

  'CH₂O': {
    atoms: [
      { id: 0, symbol: 'C', x: 0,   y: 0   },
      { id: 1, symbol: 'O', x: 28,  y: 0   },
      { id: 2, symbol: 'H', x: -22, y: -16 },
      { id: 3, symbol: 'H', x: -22, y: 16  },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [60, 300] },
    ],
  },

  'C₂H₄O': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0   },
      { id: 1, symbol: 'C', x: 10,  y: 0   },
      { id: 2, symbol: 'O', x: 38,  y: 0   },
      { id: 3, symbol: 'H', x: -22, y: -22 },
      { id: 4, symbol: 'H', x: -38, y: 10  },
      { id: 5, symbol: 'H', x: -38, y: -10 },
      { id: 6, symbol: 'H', x: 10,  y: -22 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 1, to: 6, order: 1 },
    ],
    lonePairs: [
      { atomId: 2, angles: [60, 300] },
    ],
  },

  'C₃H₆O': {
    atoms: [
      { id: 0, symbol: 'C', x: -32, y: 0   },
      { id: 1, symbol: 'C', x: 0,   y: 0   },
      { id: 2, symbol: 'O', x: 0,   y: -30 },
      { id: 3, symbol: 'C', x: 32,  y: 0   },
      { id: 4, symbol: 'H', x: -32, y: -22, radius: 4 },
      { id: 5, symbol: 'H', x: -48, y: 10,  radius: 4 },
      { id: 6, symbol: 'H', x: -48, y: -10, radius: 4 },
      { id: 7, symbol: 'H', x: 32,  y: -22, radius: 4 },
      { id: 8, symbol: 'H', x: 48,  y: 10,  radius: 4 },
      { id: 9, symbol: 'H', x: 48,  y: -10, radius: 4 },
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
    lonePairs: [
      { atomId: 2, angles: [135, 45] },
    ],
  },

  'C₄H₈O': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 0   },
      { id: 1,  symbol: 'C', x: -24, y: 0   },
      { id: 2,  symbol: 'C', x: 0,   y: 0   },
      { id: 3,  symbol: 'O', x: 0,   y: -28 },
      { id: 4,  symbol: 'C', x: 28,  y: 0   },
      // H on C0 (3 H's)
      { id: 5,  symbol: 'H', x: -52, y: -18, radius: 4 },
      { id: 6,  symbol: 'H', x: -66, y: 8,   radius: 4 },
      { id: 7,  symbol: 'H', x: -66, y: -8,  radius: 4 },
      // H on C1 (2 H's)
      { id: 8,  symbol: 'H', x: -28, y: -16, radius: 4 },
      { id: 9,  symbol: 'H', x: -20, y: -16, radius: 4 },
      // H on C4 (3 H's)
      { id: 10, symbol: 'H', x: 28,  y: -18, radius: 4 },
      { id: 11, symbol: 'H', x: 42,  y: 8,   radius: 4 },
      { id: 12, symbol: 'H', x: 42,  y: -8,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 2 },
      { from: 2, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 4, to: 10, order: 1 },
      { from: 4, to: 11, order: 1 },
      { from: 4, to: 12, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [135, 45] },
    ],
  },

  'C₅H₁₀O': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 0   },
      { id: 1,  symbol: 'C', x: -38, y: 0   },
      { id: 2,  symbol: 'C', x: -12, y: 0   },
      { id: 3,  symbol: 'C', x: 14,  y: 0   },
      { id: 4,  symbol: 'O', x: 14,  y: -28 },
      { id: 5,  symbol: 'C', x: 42,  y: 0   },
      // H on C0 (3 H's)
      { id: 6,  symbol: 'H', x: -64, y: -18, radius: 4 },
      { id: 7,  symbol: 'H', x: -78, y: 8,   radius: 4 },
      { id: 8,  symbol: 'H', x: -78, y: -8,  radius: 4 },
      // H on C1 (2 H's)
      { id: 9,  symbol: 'H', x: -44, y: -14, radius: 4 },
      { id: 10, symbol: 'H', x: -32, y: -14, radius: 4 },
      // H on C2 (2 H's)
      { id: 11, symbol: 'H', x: -18, y: -14, radius: 4 },
      { id: 12, symbol: 'H', x: -6,  y: -14, radius: 4 },
      // H on C5 (3 H's)
      { id: 13, symbol: 'H', x: 42,  y: -18, radius: 4 },
      { id: 14, symbol: 'H', x: 56,  y: 8,   radius: 4 },
      { id: 15, symbol: 'H', x: 56,  y: -8,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 2 },
      { from: 3, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 5, to: 13, order: 1 },
      { from: 5, to: 14, order: 1 },
      { from: 5, to: 15, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [135, 45] },
    ],
  },

  // ─── HIGHLY POLAR ALCOHOLS ─────────────────────────────────────────────────

  'CH₃OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0   },
      { id: 1, symbol: 'O', x: 8,   y: 0   },
      { id: 2, symbol: 'H', x: 32,  y: 0   },
      { id: 3, symbol: 'H', x: -22, y: -22 },
      { id: 4, symbol: 'H', x: -38, y: 10  },
      { id: 5, symbol: 'H', x: -38, y: -10 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [80, 280] },
    ],
  },

  'C₂H₅OH': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0   },
      { id: 1, symbol: 'C', x: -8,  y: 0   },
      { id: 2, symbol: 'O', x: 22,  y: 0   },
      { id: 3, symbol: 'H', x: 44,  y: 0   },
      { id: 4, symbol: 'H', x: -36, y: -22 },
      { id: 5, symbol: 'H', x: -52, y: 10  },
      { id: 6, symbol: 'H', x: -52, y: -10 },
      { id: 7, symbol: 'H', x: -8,  y: -22 },
      { id: 8, symbol: 'H', x: -8,  y: 22  },
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
    lonePairs: [
      { atomId: 2, angles: [80, 280] },
    ],
  },

  'C₃H₇OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8   },
      { id: 1,  symbol: 'C', x: -26, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'O', x: 28,  y: -8  },
      { id: 4,  symbol: 'H', x: 50,  y: -8  },
      // 3 H on terminal C0
      { id: 5,  symbol: 'H', x: -52, y: -10, radius: 4 },
      { id: 6,  symbol: 'H', x: -66, y: 18,  radius: 4 },
      { id: 7,  symbol: 'H', x: -66, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 8,  symbol: 'H', x: -32, y: -22, radius: 4 },
      { id: 9,  symbol: 'H', x: -20, y: -22, radius: 4 },
      // 2 H on C2
      { id: 10, symbol: 'H', x: -6,  y: 22,  radius: 4 },
      { id: 11, symbol: 'H', x: 6,   y: 22,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
    ],
    lonePairs: [
      { atomId: 3, angles: [80, 280] },
    ],
  },

  'C₄H₉OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8   },
      { id: 1,  symbol: 'C', x: -38, y: -8  },
      { id: 2,  symbol: 'C', x: -12, y: 8   },
      { id: 3,  symbol: 'C', x: 14,  y: -8  },
      { id: 4,  symbol: 'O', x: 42,  y: 8   },
      { id: 5,  symbol: 'H', x: 62,  y: 8   },
      // 3 H on terminal C0
      { id: 6,  symbol: 'H', x: -64, y: -10, radius: 4 },
      { id: 7,  symbol: 'H', x: -78, y: 18,  radius: 4 },
      { id: 8,  symbol: 'H', x: -78, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 9,  symbol: 'H', x: -44, y: -22, radius: 4 },
      { id: 10, symbol: 'H', x: -32, y: -22, radius: 4 },
      // 2 H on C2
      { id: 11, symbol: 'H', x: -18, y: 22,  radius: 4 },
      { id: 12, symbol: 'H', x: -6,  y: 22,  radius: 4 },
      // 2 H on C3
      { id: 13, symbol: 'H', x: 8,   y: -22, radius: 4 },
      { id: 14, symbol: 'H', x: 20,  y: -22, radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [80, 280] },
    ],
  },

  'C₅H₁₁OH': {
    atoms: [
      { id: 0,  symbol: 'C', x: -72, y: 8   },
      { id: 1,  symbol: 'C', x: -48, y: -8  },
      { id: 2,  symbol: 'C', x: -24, y: 8   },
      { id: 3,  symbol: 'C', x: 0,   y: -8  },
      { id: 4,  symbol: 'C', x: 24,  y: 8   },
      { id: 5,  symbol: 'O', x: 52,  y: -8  },
      { id: 6,  symbol: 'H', x: 72,  y: -8  },
      // 3 H on terminal C0
      { id: 7,  symbol: 'H', x: -72, y: -10, radius: 4 },
      { id: 8,  symbol: 'H', x: -84, y: 18,  radius: 4 },
      { id: 9,  symbol: 'H', x: -84, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 10, symbol: 'H', x: -54, y: -22, radius: 4 },
      { id: 11, symbol: 'H', x: -42, y: -22, radius: 4 },
      // 2 H on C2
      { id: 12, symbol: 'H', x: -30, y: 22,  radius: 4 },
      { id: 13, symbol: 'H', x: -18, y: 22,  radius: 4 },
      // 2 H on C3
      { id: 14, symbol: 'H', x: -6,  y: -22, radius: 4 },
      { id: 15, symbol: 'H', x: 6,   y: -22, radius: 4 },
      // 2 H on C4
      { id: 16, symbol: 'H', x: 18,  y: 22,  radius: 4 },
      { id: 17, symbol: 'H', x: 30,  y: 22,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 0, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 1, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 2, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 3, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
      { from: 4, to: 17, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [80, 280] },
    ],
  },

  // ─── IONS (alkoxides) ──────────────────────────────────────────────────────

  'CH₃O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -22, y: 0   },
      { id: 1, symbol: 'O', x: 8,   y: 0, charge: -1 },
      { id: 2, symbol: 'H', x: -22, y: -22 },
      { id: 3, symbol: 'H', x: -38, y: 10  },
      { id: 4, symbol: 'H', x: -38, y: -10 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 },
      { from: 0, to: 4, order: 1 },
    ],
    lonePairs: [
      { atomId: 1, angles: [60, 120, 240, 300] },
    ],
  },

  'C₂H₅O⁻': {
    atoms: [
      { id: 0, symbol: 'C', x: -36, y: 0   },
      { id: 1, symbol: 'C', x: -8,  y: 0   },
      { id: 2, symbol: 'O', x: 22,  y: 0, charge: -1 },
      { id: 3, symbol: 'H', x: -36, y: -22 },
      { id: 4, symbol: 'H', x: -52, y: 10  },
      { id: 5, symbol: 'H', x: -52, y: -10 },
      { id: 6, symbol: 'H', x: -8,  y: -22 },
      { id: 7, symbol: 'H', x: -8,  y: 22  },
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
    lonePairs: [
      { atomId: 2, angles: [60, 120, 240, 300] },
    ],
  },

  'C₃H₇O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -52, y: 8   },
      { id: 1,  symbol: 'C', x: -26, y: -8  },
      { id: 2,  symbol: 'C', x: 0,   y: 8   },
      { id: 3,  symbol: 'O', x: 28,  y: -8, charge: -1 },
      // 3 H on terminal C0
      { id: 4,  symbol: 'H', x: -52, y: -10, radius: 4 },
      { id: 5,  symbol: 'H', x: -66, y: 18,  radius: 4 },
      { id: 6,  symbol: 'H', x: -66, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 7,  symbol: 'H', x: -32, y: -22, radius: 4 },
      { id: 8,  symbol: 'H', x: -20, y: -22, radius: 4 },
      // 2 H on C2
      { id: 9,  symbol: 'H', x: -6,  y: 22,  radius: 4 },
      { id: 10, symbol: 'H', x: 6,   y: 22,  radius: 4 },
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
    ],
    lonePairs: [
      { atomId: 3, angles: [60, 120, 240, 300] },
    ],
  },

  'C₄H₉O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -64, y: 8   },
      { id: 1,  symbol: 'C', x: -38, y: -8  },
      { id: 2,  symbol: 'C', x: -12, y: 8   },
      { id: 3,  symbol: 'C', x: 14,  y: -8  },
      { id: 4,  symbol: 'O', x: 42,  y: 8, charge: -1 },
      // 3 H on terminal C0
      { id: 5,  symbol: 'H', x: -64, y: -10, radius: 4 },
      { id: 6,  symbol: 'H', x: -78, y: 18,  radius: 4 },
      { id: 7,  symbol: 'H', x: -78, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 8,  symbol: 'H', x: -44, y: -22, radius: 4 },
      { id: 9,  symbol: 'H', x: -32, y: -22, radius: 4 },
      // 2 H on C2
      { id: 10, symbol: 'H', x: -18, y: 22,  radius: 4 },
      { id: 11, symbol: 'H', x: -6,  y: 22,  radius: 4 },
      // 2 H on C3
      { id: 12, symbol: 'H', x: 8,   y: -22, radius: 4 },
      { id: 13, symbol: 'H', x: 20,  y: -22, radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 0, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 1, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 2, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 3, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
    ],
    lonePairs: [
      { atomId: 4, angles: [60, 120, 240, 300] },
    ],
  },

  'C₅H₁₁O⁻': {
    atoms: [
      { id: 0,  symbol: 'C', x: -72, y: 8   },
      { id: 1,  symbol: 'C', x: -48, y: -8  },
      { id: 2,  symbol: 'C', x: -24, y: 8   },
      { id: 3,  symbol: 'C', x: 0,   y: -8  },
      { id: 4,  symbol: 'C', x: 24,  y: 8   },
      { id: 5,  symbol: 'O', x: 52,  y: -8, charge: -1 },
      // 3 H on terminal C0
      { id: 6,  symbol: 'H', x: -72, y: -10, radius: 4 },
      { id: 7,  symbol: 'H', x: -84, y: 18,  radius: 4 },
      { id: 8,  symbol: 'H', x: -84, y: -2,  radius: 4 },
      // 2 H on C1
      { id: 9,  symbol: 'H', x: -54, y: -22, radius: 4 },
      { id: 10, symbol: 'H', x: -42, y: -22, radius: 4 },
      // 2 H on C2
      { id: 11, symbol: 'H', x: -30, y: 22,  radius: 4 },
      { id: 12, symbol: 'H', x: -18, y: 22,  radius: 4 },
      // 2 H on C3
      { id: 13, symbol: 'H', x: -6,  y: -22, radius: 4 },
      { id: 14, symbol: 'H', x: 6,   y: -22, radius: 4 },
      // 2 H on C4
      { id: 15, symbol: 'H', x: 18,  y: 22,  radius: 4 },
      { id: 16, symbol: 'H', x: 30,  y: 22,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 0, to: 6, order: 1 },
      { from: 0, to: 7, order: 1 },
      { from: 0, to: 8, order: 1 },
      { from: 1, to: 9, order: 1 },
      { from: 1, to: 10, order: 1 },
      { from: 2, to: 11, order: 1 },
      { from: 2, to: 12, order: 1 },
      { from: 3, to: 13, order: 1 },
      { from: 3, to: 14, order: 1 },
      { from: 4, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
    ],
    lonePairs: [
      { atomId: 5, angles: [60, 120, 240, 300] },
    ],
  },

  // ─── SIMULATOR MOLECULES ───────────────────────────────────────────────────

  'H₂O': {
    atoms: [
      { id: 0, symbol: 'O', x: 0,   y: 0  },
      { id: 1, symbol: 'H', x: -18, y: 22 },
      { id: 2, symbol: 'H', x: 18,  y: 22 },
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
      { id: 1, symbol: 'H', x: 0,   y: -24 },
      { id: 2, symbol: 'H', x: -22, y: 14  },
      { id: 3, symbol: 'H', x: 22,  y: 14  },
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
      { id: 1, symbol: 'H', x: -24, y: 0 },
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
      { id: 1, symbol: 'H',  x: -28, y: 0 },
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
      { id: 1, symbol: 'O', x: -30, y: 0 },
      { id: 2, symbol: 'O', x: 30,  y: 0 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    lonePairs: [
      { atomId: 1, angles: [120, 240] },
      { atomId: 2, angles: [60, 300] },
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
      { atomId: 1, angles: [0] },
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
      { atomId: 1, angles: [60, 300] },
    ],
  },

  'Cl₂': {
    atoms: [
      { id: 0, symbol: 'Cl', x: -20, y: 0 },
      { id: 1, symbol: 'Cl', x: 20,  y: 0 },
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
      { id: 0, symbol: 'I', x: -22, y: 0 },
      { id: 1, symbol: 'I', x: 22,  y: 0 },
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
      { id: 0, symbol: 'Na', x: -20, y: 0, charge: 1  },
      { id: 1, symbol: 'Cl', x: 20,  y: 0, charge: -1 },
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
      { id: 1, symbol: 'O', x: -26, y: -18 },
      { id: 2, symbol: 'O', x: 26,  y: -18 },
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 },
    ],
    lonePairs: [
      { atomId: 0, angles: [270] },
      { atomId: 1, angles: [120, 200] },
      { atomId: 2, angles: [60, 340] },
    ],
  },

  'CH₃Cl': {
    atoms: [
      { id: 0, symbol: 'C',  x: 0,   y: 0   },
      { id: 1, symbol: 'Cl', x: 0,   y: -30 },
      { id: 2, symbol: 'H',  x: -22, y: 14  },
      { id: 3, symbol: 'H',  x: 22,  y: 14  },
      { id: 4, symbol: 'H',  x: 0,   y: 22  },
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
      { id: 1, symbol: 'Cl', x: -30, y: -10 },
      { id: 2, symbol: 'Cl', x: 30,  y: -10 },
      { id: 3, symbol: 'H',  x: -18, y: 18  },
      { id: 4, symbol: 'H',  x: 18,  y: 18  },
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
    // Benzene: hexagonal ring, alternating single/double bonds
    atoms: [
      { id: 0,  symbol: 'C', x: 0,    y: -28 },
      { id: 1,  symbol: 'C', x: 24,   y: -14 },
      { id: 2,  symbol: 'C', x: 24,   y: 14  },
      { id: 3,  symbol: 'C', x: 0,    y: 28  },
      { id: 4,  symbol: 'C', x: -24,  y: 14  },
      { id: 5,  symbol: 'C', x: -24,  y: -14 },
      // H atoms at outer radius
      { id: 6,  symbol: 'H', x: 0,    y: -46 },
      { id: 7,  symbol: 'H', x: 38,   y: -23 },
      { id: 8,  symbol: 'H', x: 38,   y: 23  },
      { id: 9,  symbol: 'H', x: 0,    y: 46  },
      { id: 10, symbol: 'H', x: -38,  y: 23  },
      { id: 11, symbol: 'H', x: -38,  y: -23 },
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
    // Cyclohexane: hexagonal ring, all single bonds, 1 H per C shown at outer
    atoms: [
      { id: 0,  symbol: 'C', x: 0,    y: -28 },
      { id: 1,  symbol: 'C', x: 24,   y: -14 },
      { id: 2,  symbol: 'C', x: 24,   y: 14  },
      { id: 3,  symbol: 'C', x: 0,    y: 28  },
      { id: 4,  symbol: 'C', x: -24,  y: 14  },
      { id: 5,  symbol: 'C', x: -24,  y: -14 },
      // Outer H (one per C, simplified)
      { id: 6,  symbol: 'H', x: 0,    y: -44, radius: 4 },
      { id: 7,  symbol: 'H', x: 38,   y: -22, radius: 4 },
      { id: 8,  symbol: 'H', x: 38,   y: 22,  radius: 4 },
      { id: 9,  symbol: 'H', x: 0,    y: 44,  radius: 4 },
      { id: 10, symbol: 'H', x: -38,  y: 22,  radius: 4 },
      { id: 11, symbol: 'H', x: -38,  y: -22, radius: 4 },
      // Inner H (one per C, at inner positions)
      { id: 12, symbol: 'H', x: 0,    y: -14, radius: 4 },
      { id: 13, symbol: 'H', x: 12,   y: -7,  radius: 4 },
      { id: 14, symbol: 'H', x: 12,   y: 7,   radius: 4 },
      { id: 15, symbol: 'H', x: 0,    y: 14,  radius: 4 },
      { id: 16, symbol: 'H', x: -12,  y: 7,   radius: 4 },
      { id: 17, symbol: 'H', x: -12,  y: -7,  radius: 4 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 },
      { from: 3, to: 4, order: 1 },
      { from: 4, to: 5, order: 1 },
      { from: 5, to: 0, order: 1 },
      { from: 0, to: 6,  order: 1 },
      { from: 1, to: 7,  order: 1 },
      { from: 2, to: 8,  order: 1 },
      { from: 3, to: 9,  order: 1 },
      { from: 4, to: 10, order: 1 },
      { from: 5, to: 11, order: 1 },
      { from: 0, to: 12, order: 1 },
      { from: 1, to: 13, order: 1 },
      { from: 2, to: 14, order: 1 },
      { from: 3, to: 15, order: 1 },
      { from: 4, to: 16, order: 1 },
      { from: 5, to: 17, order: 1 },
    ],
    lonePairs: [],
  },
};
