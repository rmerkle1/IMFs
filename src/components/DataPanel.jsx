import React from 'react';
import { getMoleculeIMFs, getIMFs, getIMFStrength } from '../data/molecules';

const POLARITY_COLORS = {
  nonpolar: '#4A90D9',
  weaklyPolar: '#4CAF7D',
  polar: '#FF9800',
  highlyPolar: '#E91E8C',
  ion: '#FFD700',
};

const POLARITY_LABELS = {
  nonpolar: 'Nonpolar',
  weaklyPolar: 'Weakly Polar',
  polar: 'Polar',
  highlyPolar: 'Highly Polar',
  ion: 'Ion',
};

function formatTemp(val) {
  if (val === null || val === undefined) return '—';
  return `${val} °C`;
}

function MolCard({ mol, label }) {
  if (!mol) return (
    <div className="data-mol-card data-mol-empty">
      <span className="data-mol-label">{label}</span>
      <span className="data-mol-none">No molecule selected</span>
    </div>
  );

  const color = POLARITY_COLORS[mol.polarity] || '#4A90D9';
  const molImfs = getMoleculeIMFs(mol);

  return (
    <div className="data-mol-card" style={{ borderColor: color + '44' }}>
      <div className="data-mol-header">
        <span className="data-mol-label" style={{ color: '#8BAFD4' }}>{label}</span>
        <span className="data-mol-formula" style={{ color }}>{mol.formula}</span>
        <span className="data-mol-name">{mol.name}</span>
        <span className="data-mol-polarity" style={{ color, background: color + '22', borderColor: color + '55' }}>
          {POLARITY_LABELS[mol.polarity] || mol.polarity}
        </span>
      </div>
      <div className="data-mol-stats">
        <div className="data-stat">
          <span className="data-stat-label">BP</span>
          <span className="data-stat-value">{formatTemp(mol.bp)}</span>
        </div>
        <div className="data-stat">
          <span className="data-stat-label">MP</span>
          <span className="data-stat-value">{formatTemp(mol.mp)}</span>
        </div>
        <div className="data-stat">
          <span className="data-stat-label">Mass</span>
          <span className="data-stat-value">{mol.mass} g/mol</span>
        </div>
      </div>
      <div className="data-mol-imfs">
        <span className="data-imf-title">IMFs:</span>
        <div className="data-imf-tags">
          {molImfs.map(imf => (
            <span key={imf} className="data-imf-tag" style={{ color, background: color + '18', borderColor: color + '40' }}>
              {imf}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DataPanel({ mol1, mol2, temperature }) {
  const bothPresent = mol1 && mol2;
  const imfs = bothPresent ? getIMFs(mol1.polarity, mol2.polarity) : [];
  const strength = bothPresent ? getIMFStrength(mol1, mol2) : 0;

  const imfColors = {
    'ion-ion': '#FFD700',
    'ion-dipole': '#FFD700',
    'ion-induced dipole': '#FFAA00',
    'hydrogen bonding': '#E91E8C',
    'dipole-dipole': '#FF9800',
    'dipole-dipole (weak)': '#4CAF7D',
    'dipole-induced dipole': '#FF9800',
    'London dispersion': '#4A90D9',
  };

  const primaryColor = imfs.length > 0 ? (imfColors[imfs[0]] || '#4A90D9') : '#4A90D9';

  // Temperature phase description
  let tempPhase = '';
  if (temperature < -50) tempPhase = 'Solid-like — molecules locked in place';
  else if (temperature < 50) tempPhase = 'Liquid-like — moderate thermal motion';
  else if (temperature < 200) tempPhase = 'Gas-like — increased kinetic energy';
  else tempPhase = 'High energy — chaotic motion dominates';

  return (
    <div className="data-panel">
      <MolCard mol={mol1} label="Molecule 1" />

      <div className="data-center-panel">
        <div className="data-temp-display">
          <span className="data-temp-label">Temperature</span>
          <span className="data-temp-value">{temperature} °C</span>
          <span className="data-temp-phase">{tempPhase}</span>
        </div>
        {bothPresent && (
          <div className="data-between">
            <div className="data-between-title" style={{ color: primaryColor }}>Between these molecules:</div>
            <div className="data-between-imfs">
              {imfs.map(imf => (
                <span
                  key={imf}
                  className="data-imf-tag data-imf-tag-lg"
                  style={{
                    color: imfColors[imf] || '#4A90D9',
                    background: (imfColors[imf] || '#4A90D9') + '18',
                    borderColor: (imfColors[imf] || '#4A90D9') + '50',
                  }}
                >
                  {imf.charAt(0).toUpperCase() + imf.slice(1)}
                </span>
              ))}
            </div>
            <div className="data-strength-row">
              <span className="data-strength-label">Attraction strength</span>
              <div className="data-strength-bar-bg">
                <div
                  className="data-strength-bar-fill"
                  style={{ width: `${strength * 100}%`, background: primaryColor }}
                />
              </div>
              <span className="data-strength-pct" style={{ color: primaryColor }}>
                {Math.round(strength * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <MolCard mol={mol2} label="Molecule 2" />
    </div>
  );
}
