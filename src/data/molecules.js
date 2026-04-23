export const BUILDER_MOLECULES = {
  nonpolar: [
    { formula: 'CH₄', name: 'Methane', mass: 16, bp: -161, mp: -182, shape: 'tetrahedral', polarity: 'nonpolar' },
    { formula: 'C₂H₆', name: 'Ethane', mass: 30, bp: -89, mp: -183, shape: 'linear', polarity: 'nonpolar' },
    { formula: 'C₃H₈', name: 'Propane', mass: 44, bp: -42, mp: -188, shape: 'linear', polarity: 'nonpolar' },
    { formula: 'C₄H₁₀', name: 'Butane', mass: 58, bp: -1, mp: -138, shape: 'linear', polarity: 'nonpolar' },
    { formula: 'C₅H₁₂', name: 'Pentane', mass: 72, bp: 36, mp: -130, shape: 'linear', polarity: 'nonpolar' },
  ],
  weaklyPolar: [
    { formula: 'CH₃SH', name: 'Methanethiol', mass: 48, bp: 6, mp: -123, shape: 'bent', polarity: 'weaklyPolar' },
    { formula: 'C₂H₅SH', name: 'Ethanethiol', mass: 62, bp: 35, mp: -148, shape: 'linear', polarity: 'weaklyPolar' },
    { formula: 'C₃H₇SH', name: 'Propanethiol', mass: 76, bp: 68, mp: -113, shape: 'linear', polarity: 'weaklyPolar' },
    { formula: 'C₄H₉SH', name: 'Butanethiol', mass: 90, bp: 98, mp: -116, shape: 'linear', polarity: 'weaklyPolar' },
    { formula: 'C₅H₁₁SH', name: 'Pentanethiol', mass: 104, bp: 127, mp: -75, shape: 'linear', polarity: 'weaklyPolar' },
  ],
  polar: [
    { formula: 'CH₂O', name: 'Formaldehyde', mass: 30, bp: -19, mp: -92, shape: 'trigonal', polarity: 'polar' },
    { formula: 'C₂H₄O', name: 'Acetaldehyde', mass: 44, bp: 20, mp: -123, shape: 'linear', polarity: 'polar' },
    { formula: 'C₃H₆O', name: 'Acetone', mass: 58, bp: 56, mp: -95, shape: 'linear', polarity: 'polar' },
    { formula: 'C₄H₈O', name: 'Butanone', mass: 72, bp: 80, mp: -87, shape: 'linear', polarity: 'polar' },
    { formula: 'C₅H₁₀O', name: 'Pentanone', mass: 86, bp: 102, mp: -78, shape: 'linear', polarity: 'polar' },
  ],
  highlyPolar: [
    { formula: 'CH₃OH', name: 'Methanol', mass: 32, bp: 65, mp: -98, shape: 'bent', polarity: 'highlyPolar' },
    { formula: 'C₂H₅OH', name: 'Ethanol', mass: 46, bp: 78, mp: -115, shape: 'linear', polarity: 'highlyPolar' },
    { formula: 'C₃H₇OH', name: 'Propanol', mass: 60, bp: 97, mp: -126, shape: 'linear', polarity: 'highlyPolar' },
    { formula: 'C₄H₉OH', name: 'Butanol', mass: 74, bp: 117, mp: -90, shape: 'linear', polarity: 'highlyPolar' },
    { formula: 'C₅H₁₁OH', name: 'Pentanol', mass: 88, bp: 138, mp: -78, shape: 'linear', polarity: 'highlyPolar' },
  ],
  ion: [
    { formula: 'CH₃O⁻', name: 'Methoxide', mass: 31, bp: null, mp: null, shape: 'tetrahedral', polarity: 'ion', charge: -1 },
    { formula: 'C₂H₅O⁻', name: 'Ethoxide', mass: 45, bp: null, mp: null, shape: 'linear', polarity: 'ion', charge: -1 },
    { formula: 'C₃H₇O⁻', name: 'Propoxide', mass: 59, bp: null, mp: null, shape: 'linear', polarity: 'ion', charge: -1 },
    { formula: 'C₄H₉O⁻', name: 'Butoxide', mass: 73, bp: null, mp: null, shape: 'linear', polarity: 'ion', charge: -1 },
    { formula: 'C₅H₁₁O⁻', name: 'Pentoxide', mass: 87, bp: null, mp: null, shape: 'linear', polarity: 'ion', charge: -1 },
  ],
};

export const SIMULATOR_MOLECULES = [
  { formula: 'H₂O', name: 'Water', mass: 18, bp: 100, mp: 0, polarity: 'highlyPolar', imfs: ['hydrogen bonding', 'dipole-dipole', 'London dispersion'] },
  { formula: 'NH₃', name: 'Ammonia', mass: 17, bp: -33, mp: -78, polarity: 'highlyPolar', imfs: ['hydrogen bonding', 'dipole-dipole', 'London dispersion'] },
  { formula: 'HF', name: 'Hydrogen Fluoride', mass: 20, bp: 20, mp: -83, polarity: 'highlyPolar', imfs: ['hydrogen bonding', 'dipole-dipole', 'London dispersion'] },
  { formula: 'CH₃OH', name: 'Methanol', mass: 32, bp: 65, mp: -98, polarity: 'highlyPolar', imfs: ['hydrogen bonding', 'dipole-dipole', 'London dispersion'] },
  { formula: 'C₂H₅OH', name: 'Ethanol', mass: 46, bp: 78, mp: -115, polarity: 'highlyPolar', imfs: ['hydrogen bonding', 'dipole-dipole', 'London dispersion'] },
  { formula: 'HCl', name: 'Hydrogen Chloride', mass: 36, bp: -85, mp: -114, polarity: 'polar', imfs: ['dipole-dipole', 'London dispersion'] },
  { formula: 'SO₂', name: 'Sulfur Dioxide', mass: 64, bp: -10, mp: -73, polarity: 'polar', imfs: ['dipole-dipole', 'London dispersion'] },
  { formula: 'CH₃Cl', name: 'Chloromethane', mass: 50, bp: -24, mp: -97, polarity: 'polar', imfs: ['dipole-dipole', 'London dispersion'] },
  { formula: 'CH₂Cl₂', name: 'Dichloromethane', mass: 85, bp: 40, mp: -95, polarity: 'polar', imfs: ['dipole-dipole', 'London dispersion'] },
  { formula: 'CH₄', name: 'Methane', mass: 16, bp: -161, mp: -182, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'CO₂', name: 'Carbon Dioxide', mass: 44, bp: -57, mp: -78, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'N₂', name: 'Nitrogen', mass: 28, bp: -196, mp: -210, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'O₂', name: 'Oxygen', mass: 32, bp: -183, mp: -219, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'Cl₂', name: 'Chlorine', mass: 71, bp: -34, mp: -101, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'I₂', name: 'Iodine', mass: 254, bp: 184, mp: 114, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'NaCl', name: 'Sodium Chloride', mass: 58, bp: 1413, mp: 801, polarity: 'ion', imfs: ['ion-ion', 'London dispersion'] },
  { formula: 'Na⁺', name: 'Sodium Ion', mass: 23, bp: null, mp: null, polarity: 'ion', charge: 1, imfs: ['ion-ion', 'ion-dipole'] },
  { formula: 'Cl⁻', name: 'Chloride Ion', mass: 35, bp: null, mp: null, polarity: 'ion', charge: -1, imfs: ['ion-ion', 'ion-dipole'] },
  { formula: 'C₆H₆', name: 'Benzene', mass: 78, bp: 80, mp: 5, polarity: 'nonpolar', imfs: ['London dispersion'] },
  { formula: 'C₆H₁₂', name: 'Cyclohexane', mass: 84, bp: 81, mp: 7, polarity: 'nonpolar', imfs: ['London dispersion'] },
];

export function getIMFs(polarity1, polarity2) {
  if (polarity1 === 'ion' && polarity2 === 'ion') {
    return ['ion-ion', 'London dispersion'];
  }
  if (polarity1 === 'ion' || polarity2 === 'ion') {
    const other = polarity1 === 'ion' ? polarity2 : polarity1;
    if (other === 'highlyPolar' || other === 'polar') {
      return ['ion-dipole', 'London dispersion'];
    }
    return ['ion-induced dipole', 'London dispersion'];
  }
  if (polarity1 === 'highlyPolar' && polarity2 === 'highlyPolar') {
    return ['hydrogen bonding', 'dipole-dipole', 'London dispersion'];
  }
  if (
    (polarity1 === 'highlyPolar' && polarity2 === 'polar') ||
    (polarity1 === 'polar' && polarity2 === 'highlyPolar')
  ) {
    return ['dipole-dipole', 'London dispersion'];
  }
  if (polarity1 === 'polar' && polarity2 === 'polar') {
    return ['dipole-dipole', 'London dispersion'];
  }
  if (polarity1 === 'weaklyPolar' && polarity2 === 'weaklyPolar') {
    return ['dipole-dipole (weak)', 'London dispersion'];
  }
  if (
    (polarity1 === 'polar' && polarity2 === 'nonpolar') ||
    (polarity1 === 'nonpolar' && polarity2 === 'polar') ||
    (polarity1 === 'weaklyPolar' && polarity2 === 'nonpolar') ||
    (polarity1 === 'nonpolar' && polarity2 === 'weaklyPolar')
  ) {
    return ['dipole-induced dipole', 'London dispersion'];
  }
  if (
    (polarity1 === 'weaklyPolar' && polarity2 === 'polar') ||
    (polarity1 === 'polar' && polarity2 === 'weaklyPolar') ||
    (polarity1 === 'weaklyPolar' && polarity2 === 'highlyPolar') ||
    (polarity1 === 'highlyPolar' && polarity2 === 'weaklyPolar')
  ) {
    return ['dipole-dipole (weak)', 'London dispersion'];
  }
  return ['London dispersion'];
}

export function getBuilderMolecule(polarityKey, massIndex) {
  const group = BUILDER_MOLECULES[polarityKey];
  if (!group) return null;
  const idx = Math.max(0, Math.min(4, massIndex));
  return group[idx];
}

export function getBuilderIMFs(mol1, mol2) {
  if (!mol1 || !mol2) return [];
  return getIMFs(mol1.polarity, mol2.polarity);
}

export function getMoleculeIMFs(mol) {
  if (!mol) return [];
  const p = mol.polarity;
  if (p === 'ion') return ['ion-ion', 'ion-dipole', 'London dispersion'];
  if (p === 'highlyPolar') return ['hydrogen bonding', 'dipole-dipole', 'London dispersion'];
  if (p === 'polar') return ['dipole-dipole', 'London dispersion'];
  if (p === 'weaklyPolar') return ['dipole-dipole (weak)', 'London dispersion'];
  return ['London dispersion'];
}

// Returns normalized 0-1 attraction strength between two molecules
export function getIMFStrength(mol1, mol2) {
  if (!mol1 || !mol2) return 0.1;
  const p1 = mol1.polarity;
  const p2 = mol2.polarity;
  const imfs = getIMFs(p1, p2);

  let baseStrength = 0.15; // London dispersion baseline

  // Mass contribution to London dispersion
  const avgMass = ((mol1.mass || 30) + (mol2.mass || 30)) / 2;
  const massBonus = Math.min(0.2, avgMass / 300);
  baseStrength += massBonus;

  if (imfs.includes('ion-ion')) return Math.min(1.0, 0.95 + massBonus);
  if (imfs.includes('ion-dipole')) return Math.min(1.0, 0.8 + massBonus);
  if (imfs.includes('ion-induced dipole')) return Math.min(1.0, 0.6 + massBonus);
  if (imfs.includes('hydrogen bonding')) return Math.min(1.0, 0.75 + massBonus);
  if (imfs.includes('dipole-dipole')) return Math.min(1.0, 0.5 + massBonus);
  if (imfs.includes('dipole-induced dipole')) return Math.min(1.0, 0.3 + massBonus);
  if (imfs.includes('dipole-dipole (weak)')) return Math.min(1.0, 0.35 + massBonus);

  return baseStrength;
}

// Returns preferred orientation angle (radians) for mol2 relative to mol1
export function getOrientationAngle(mol1, mol2) {
  if (!mol1 || !mol2) return 0;
  const p1 = mol1.polarity;
  const p2 = mol2.polarity;

  // Ions: no preferred orientation angle beyond direct attraction
  if (p1 === 'ion' || p2 === 'ion') return 0;

  // Polar molecules: dipole alignment — δ- of one toward δ+ of other
  if (p1 === 'highlyPolar' || p1 === 'polar') {
    if (p2 === 'highlyPolar' || p2 === 'polar') {
      // Anti-parallel dipoles (head-to-tail)
      return Math.PI;
    }
  }
  return 0;
}
