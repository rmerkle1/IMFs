import React from 'react';
import BuilderMode from './BuilderMode';
import SimulatorMode from './SimulatorMode';

export default function ControlPanel({
  mode,
  onModeChange,
  // Builder props
  mol1Polarity, mol1Mass, mol1Shape,
  mol2Polarity, mol2Mass, mol2Shape,
  onMol1PolarityChange, onMol1MassChange, onMol1ShapeChange,
  onMol2PolarityChange, onMol2MassChange, onMol2ShapeChange,
  // Simulator props
  sim1Formula, sim2Formula,
  onSim1Change, onSim2Change,
}) {
  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <h2 className="control-panel-title">IMF Explorer</h2>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'builder' ? 'mode-btn-active' : ''}`}
            onClick={() => onModeChange('builder')}
          >
            Builder
          </button>
          <button
            className={`mode-btn ${mode === 'simulator' ? 'mode-btn-active' : ''}`}
            onClick={() => onModeChange('simulator')}
          >
            Simulator
          </button>
        </div>
        <p className="mode-description">
          {mode === 'builder'
            ? 'Build molecules by adjusting polarity and mass to see how structure affects IMFs.'
            : 'Select real molecules and observe their intermolecular forces.'}
        </p>
      </div>

      <div className="control-panel-body">
        {mode === 'builder' ? (
          <BuilderMode
            mol1Polarity={mol1Polarity}
            mol1Mass={mol1Mass}
            mol1Shape={mol1Shape}
            mol2Polarity={mol2Polarity}
            mol2Mass={mol2Mass}
            mol2Shape={mol2Shape}
            onMol1PolarityChange={onMol1PolarityChange}
            onMol1MassChange={onMol1MassChange}
            onMol1ShapeChange={onMol1ShapeChange}
            onMol2PolarityChange={onMol2PolarityChange}
            onMol2MassChange={onMol2MassChange}
            onMol2ShapeChange={onMol2ShapeChange}
          />
        ) : (
          <SimulatorMode
            mol1Formula={sim1Formula}
            mol2Formula={sim2Formula}
            onMol1Change={onSim1Change}
            onMol2Change={onSim2Change}
          />
        )}
      </div>
    </div>
  );
}
