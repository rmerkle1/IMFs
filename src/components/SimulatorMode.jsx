import React from 'react';
import { SIMULATOR_MOLECULES } from '../data/molecules';

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

const GROUP_ORDER = ['highlyPolar', 'polar', 'weaklyPolar', 'nonpolar', 'ion'];

function groupMolecules() {
  const groups = {};
  GROUP_ORDER.forEach(key => { groups[key] = []; });
  SIMULATOR_MOLECULES.forEach(mol => {
    if (groups[mol.polarity]) {
      groups[mol.polarity].push(mol);
    }
  });
  return groups;
}

function MolCard({ mol }) {
  if (!mol) return null;
  const color = POLARITY_COLORS[mol.polarity] || '#4A90D9';
  return (
    <div className="sim-mol-card" style={{ borderColor: color + '40' }}>
      <div className="sim-mol-card-header">
        <span className="sim-mol-formula" style={{ color }}>{mol.formula}</span>
        <span className="sim-mol-name">{mol.name}</span>
        <span className="sim-mol-polarity" style={{ color, background: color + '18', borderColor: color + '44' }}>
          {POLARITY_LABELS[mol.polarity]}
        </span>
      </div>
      <div className="sim-mol-stats">
        <div className="sim-stat">
          <span className="sim-stat-label">BP</span>
          <span className="sim-stat-value" style={{ color }}>
            {mol.bp !== null && mol.bp !== undefined ? `${mol.bp} °C` : '—'}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-label">MP</span>
          <span className="sim-stat-value" style={{ color }}>
            {mol.mp !== null && mol.mp !== undefined ? `${mol.mp} °C` : '—'}
          </span>
        </div>
        <div className="sim-stat">
          <span className="sim-stat-label">Mass</span>
          <span className="sim-stat-value">{mol.mass} g/mol</span>
        </div>
      </div>
      <div className="sim-mol-imfs">
        {(mol.imfs || []).map(imf => (
          <span key={imf} className="sim-imf-tag" style={{ color, background: color + '14', borderColor: color + '35' }}>
            {imf}
          </span>
        ))}
      </div>
    </div>
  );
}

function MoleculeSelect({ label, value, onChange }) {
  const groups = groupMolecules();
  const selected = SIMULATOR_MOLECULES.find(m => m.formula === value);

  return (
    <div className="sim-select-section">
      <label className="sim-select-label">{label}</label>
      <div className="sim-select-wrapper">
        <select
          className="sim-select"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">— Select a molecule —</option>
          {GROUP_ORDER.map(key => {
            const mols = groups[key];
            if (!mols || mols.length === 0) return null;
            return (
              <optgroup key={key} label={POLARITY_LABELS[key]}>
                {mols.map(mol => (
                  <option key={mol.formula} value={mol.formula}>
                    {mol.formula} — {mol.name}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>
      {selected && <MolCard mol={selected} />}
    </div>
  );
}

export default function SimulatorMode({ mol1Formula, mol2Formula, onMol1Change, onMol2Change }) {
  return (
    <div className="sim-mode">
      <div className="sim-description">
        <span className="sim-desc-text">
          Choose from real molecules to compare their intermolecular forces and physical properties.
        </span>
      </div>
      <MoleculeSelect
        label="Molecule 1"
        value={mol1Formula}
        onChange={onMol1Change}
      />
      <MoleculeSelect
        label="Molecule 2"
        value={mol2Formula}
        onChange={onMol2Change}
      />
    </div>
  );
}
