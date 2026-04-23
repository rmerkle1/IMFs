import React from 'react';
import { BUILDER_MOLECULES, getBuilderMolecule } from '../data/molecules';

const POLARITY_KEYS = ['nonpolar', 'weaklyPolar', 'polar', 'highlyPolar', 'ion'];
const POLARITY_LABELS = {
  nonpolar: 'Nonpolar',
  weaklyPolar: 'Weakly Polar',
  polar: 'Polar',
  highlyPolar: 'Highly Polar',
  ion: 'Ion',
};
const POLARITY_COLORS = {
  nonpolar: '#4A90D9',
  weaklyPolar: '#4CAF7D',
  polar: '#FF9800',
  highlyPolar: '#E91E8C',
  ion: '#FFD700',
};

function PolaritySlider({ value, onChange, molLabel }) {
  const idx = POLARITY_KEYS.indexOf(value);
  const color = POLARITY_COLORS[value] || '#4A90D9';

  return (
    <div className="builder-slider-group">
      <div className="builder-slider-label-row">
        <span className="builder-slider-title">Polarity</span>
        <span className="builder-slider-current" style={{ color, background: color + '22', borderColor: color + '44' }}>
          {POLARITY_LABELS[value]}
        </span>
      </div>
      <div className="builder-notch-slider">
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={idx}
          onChange={e => onChange(POLARITY_KEYS[parseInt(e.target.value)])}
          style={{ '--thumb-color': color }}
          className="notch-range"
        />
        <div className="notch-labels">
          {POLARITY_KEYS.map((key, i) => (
            <span
              key={key}
              className={`notch-label ${idx === i ? 'notch-label-active' : ''}`}
              style={idx === i ? { color } : {}}
              onClick={() => onChange(key)}
            >
              {POLARITY_LABELS[key]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MassSlider({ value, onChange, polarityKey }) {
  const group = BUILDER_MOLECULES[polarityKey] || [];
  const color = POLARITY_COLORS[polarityKey] || '#4A90D9';

  return (
    <div className="builder-slider-group">
      <div className="builder-slider-label-row">
        <span className="builder-slider-title">Mass / Size</span>
        {group[value] && (
          <span className="builder-slider-current" style={{ color, background: color + '22', borderColor: color + '44' }}>
            {group[value].formula}
          </span>
        )}
      </div>
      <div className="builder-notch-slider">
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{ '--thumb-color': color }}
          className="notch-range"
        />
        <div className="notch-labels">
          {group.map((mol, i) => (
            <span
              key={mol.formula}
              className={`notch-label ${value === i ? 'notch-label-active' : ''}`}
              style={value === i ? { color } : {}}
              onClick={() => onChange(i)}
            >
              {mol.formula}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShapeToggle({ value, onChange, polarity }) {
  const color = POLARITY_COLORS[polarity] || '#4A90D9';
  return (
    <div className="builder-slider-group">
      <span className="builder-slider-title">Shape</span>
      <div className="shape-toggle-row">
        {['linear', 'bundled'].map(shape => (
          <button
            key={shape}
            className={`shape-toggle-btn ${value === shape ? 'shape-toggle-active' : ''}`}
            style={value === shape ? { background: color + '30', borderColor: color, color } : {}}
            onClick={() => onChange(shape)}
          >
            {shape === 'linear' ? (
              <span className="shape-icon">⟶⟶ Linear</span>
            ) : (
              <span className="shape-icon">⬡ Bundled</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MoleculeBuilderSection({ title, polarity, massIndex, shape, onPolarityChange, onMassChange, onShapeChange }) {
  const mol = getBuilderMolecule(polarity, massIndex);
  const color = POLARITY_COLORS[polarity] || '#4A90D9';

  return (
    <div className="builder-section">
      <div className="builder-section-header" style={{ borderColor: color + '50' }}>
        <span className="builder-section-title" style={{ color }}>{title}</span>
        {mol && (
          <div className="builder-section-preview">
            <span className="builder-preview-formula" style={{ color }}>{mol.formula}</span>
            <span className="builder-preview-name">{mol.name}</span>
          </div>
        )}
      </div>

      <PolaritySlider value={polarity} onChange={onPolarityChange} molLabel={title} />
      <MassSlider value={massIndex} onChange={onMassChange} polarityKey={polarity} />
      <ShapeToggle value={shape} onChange={onShapeChange} polarity={polarity} />

    </div>
  );
}

export default function BuilderMode({
  mol1Polarity, mol1Mass, mol1Shape,
  mol2Polarity, mol2Mass, mol2Shape,
  onMol1PolarityChange, onMol1MassChange, onMol1ShapeChange,
  onMol2PolarityChange, onMol2MassChange, onMol2ShapeChange,
}) {
  return (
    <div className="builder-mode">
      <MoleculeBuilderSection
        title="Molecule 1"
        polarity={mol1Polarity}
        massIndex={mol1Mass}
        shape={mol1Shape}
        onPolarityChange={onMol1PolarityChange}
        onMassChange={onMol1MassChange}
        onShapeChange={onMol1ShapeChange}
      />
      <MoleculeBuilderSection
        title="Molecule 2"
        polarity={mol2Polarity}
        massIndex={mol2Mass}
        shape={mol2Shape}
        onPolarityChange={onMol2PolarityChange}
        onMassChange={onMol2MassChange}
        onShapeChange={onMol2ShapeChange}
      />
    </div>
  );
}
