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
  nonpolar:    '#17b29e',
  weaklyPolar: '#85c441',
  polar:       '#fdb714',
  highlyPolar: '#e9177a',
  ion:         '#748ac5',
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

function MoleculeBuilderSection({ title, polarity, massIndex, onPolarityChange, onMassChange, tutorialPolarityAttr, tutorialMassAttr }) {
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

      <div data-tutorial={tutorialPolarityAttr}>
        <PolaritySlider value={polarity} onChange={onPolarityChange} molLabel={title} />
      </div>
      <div data-tutorial={tutorialMassAttr}>
        <MassSlider value={massIndex} onChange={onMassChange} polarityKey={polarity} />
      </div>
    </div>
  );
}

export default function BuilderMode({
  mol1Polarity, mol1Mass,
  mol2Polarity, mol2Mass,
  onMol1PolarityChange, onMol1MassChange,
  onMol2PolarityChange, onMol2MassChange,
}) {
  return (
    <div className="builder-mode">
      <MoleculeBuilderSection
        title="Molecule 1"
        polarity={mol1Polarity}
        massIndex={mol1Mass}
        onPolarityChange={onMol1PolarityChange}
        onMassChange={onMol1MassChange}
        tutorialPolarityAttr="polarity-sliders"
        tutorialMassAttr="mass-sliders"
      />
      <MoleculeBuilderSection
        title="Molecule 2"
        polarity={mol2Polarity}
        massIndex={mol2Mass}
        onPolarityChange={onMol2PolarityChange}
        onMassChange={onMol2MassChange}
      />
    </div>
  );
}
