import React, { useState, useCallback, useMemo } from 'react';
import MoleculeCanvas from './components/MoleculeCanvas';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import { getBuilderMolecule, SIMULATOR_MOLECULES } from './data/molecules';
import './App.css';

const DEFAULT_TEMP = 25;

export default function App() {
  // Mode
  const [mode, setMode] = useState('builder');

  // Temperature
  const [temperature, setTemperature] = useState(DEFAULT_TEMP);

  // Builder state
  const [mol1Polarity, setMol1Polarity] = useState('nonpolar');
  const [mol1Mass, setMol1Mass] = useState(0);
  const [mol1Shape, setMol1Shape] = useState('linear');

  const [mol2Polarity, setMol2Polarity] = useState('highlyPolar');
  const [mol2Mass, setMol2Mass] = useState(0);
  const [mol2Shape, setMol2Shape] = useState('linear');

  // Simulator state
  const [sim1Formula, setSim1Formula] = useState('H₂O');
  const [sim2Formula, setSim2Formula] = useState('CH₄');

  // Derive molecules
  const mol1 = useMemo(() => {
    if (mode === 'builder') {
      const m = getBuilderMolecule(mol1Polarity, mol1Mass);
      return m ? { ...m, shape: mol1Shape } : null;
    } else {
      return SIMULATOR_MOLECULES.find(m => m.formula === sim1Formula) || null;
    }
  }, [mode, mol1Polarity, mol1Mass, mol1Shape, sim1Formula]);

  const mol2 = useMemo(() => {
    if (mode === 'builder') {
      const m = getBuilderMolecule(mol2Polarity, mol2Mass);
      return m ? { ...m, shape: mol2Shape } : null;
    } else {
      return SIMULATOR_MOLECULES.find(m => m.formula === sim2Formula) || null;
    }
  }, [mode, mol2Polarity, mol2Mass, mol2Shape, sim2Formula]);

  const handleDataUpdate = useCallback(() => {}, []);

  const tempPercent = ((temperature - (-100)) / 600) * 100;

  // Temperature color gradient
  const tempColor = (() => {
    const t = (temperature - (-100)) / 600;
    if (t < 0.25) return '#4A90D9';
    if (t < 0.5) return '#4CAF7D';
    if (t < 0.75) return '#FF9800';
    return '#E53935';
  })();

  return (
    <div className="app">
      {/* Main canvas area */}
      <div className="canvas-area">
        {/* Temperature slider */}
        <div className="temp-slider-bar">
          <div className="temp-slider-inner">
            <div className="temp-info">
              <span className="temp-icon">&#x1F321;</span>
              <span className="temp-label">Temperature</span>
              <span className="temp-value" style={{ color: tempColor }}>
                {temperature} &deg;C
              </span>
            </div>
            <div className="temp-range-wrapper">
              <span className="temp-range-label temp-range-low">&minus;100&deg;C</span>
              <div className="temp-track-wrapper">
                <div
                  className="temp-track-fill"
                  style={{ width: `${tempPercent}%`, background: tempColor }}
                />
                <input
                  type="range"
                  min={-100}
                  max={500}
                  step={1}
                  value={temperature}
                  onChange={e => setTemperature(parseInt(e.target.value))}
                  className="temp-range"
                  style={{ '--temp-color': tempColor }}
                />
              </div>
              <span className="temp-range-label temp-range-high">500&deg;C</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <MoleculeCanvas
          mol1={mol1}
          mol2={mol2}
          temperature={temperature}
          onDataUpdate={handleDataUpdate}
        />

        {/* Data panel */}
        <DataPanel mol1={mol1} mol2={mol2} temperature={temperature} />
      </div>

      {/* Right control panel */}
      <ControlPanel
        mode={mode}
        onModeChange={setMode}
        mol1Polarity={mol1Polarity}
        mol1Mass={mol1Mass}
        mol1Shape={mol1Shape}
        mol2Polarity={mol2Polarity}
        mol2Mass={mol2Mass}
        mol2Shape={mol2Shape}
        onMol1PolarityChange={setMol1Polarity}
        onMol1MassChange={setMol1Mass}
        onMol1ShapeChange={setMol1Shape}
        onMol2PolarityChange={setMol2Polarity}
        onMol2MassChange={setMol2Mass}
        onMol2ShapeChange={setMol2Shape}
        sim1Formula={sim1Formula}
        sim2Formula={sim2Formula}
        onSim1Change={setSim1Formula}
        onSim2Change={setSim2Formula}
      />
    </div>
  );
}
