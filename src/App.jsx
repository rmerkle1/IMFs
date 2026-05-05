import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MoleculeCanvas from './components/MoleculeCanvas';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import TutorialOverlay from './components/TutorialOverlay';
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
  const [mol2Polarity, setMol2Polarity] = useState('highlyPolar');
  const [mol2Mass, setMol2Mass] = useState(0);

  // Tutorial
  const [tutorialOpen, setTutorialOpen] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('imf-tutorial-seen')) {
      setTutorialOpen(true);
      localStorage.setItem('imf-tutorial-seen', '1');
    }
  }, []);

  // Simulator state
  const [sim1Formula, setSim1Formula] = useState('H₂O');
  const [sim2Formula, setSim2Formula] = useState('CH₄');

  // Derive molecules
  const mol1 = useMemo(() => {
    if (mode === 'builder') {
      return getBuilderMolecule(mol1Polarity, mol1Mass) || null;
    } else {
      return SIMULATOR_MOLECULES.find(m => m.formula === sim1Formula) || null;
    }
  }, [mode, mol1Polarity, mol1Mass, sim1Formula]);

  const mol2 = useMemo(() => {
    if (mode === 'builder') {
      return getBuilderMolecule(mol2Polarity, mol2Mass) || null;
    } else {
      return SIMULATOR_MOLECULES.find(m => m.formula === sim2Formula) || null;
    }
  }, [mode, mol2Polarity, mol2Mass, sim2Formula]);

  const handleDataUpdate = useCallback(() => {}, []);

  const tempPercent = ((temperature - (-100)) / 600) * 100;

  // Temperature color gradient (cold → hot)
  const tempColor = (() => {
    const t = (temperature - (-100)) / 600;
    if (t < 0.25) return '#00addb';
    if (t < 0.5)  return '#17b29e';
    if (t < 0.75) return '#fdb714';
    return '#e9177a';
  })();

  return (
    <div className="app">
      {/* Tutorial overlay */}
      <TutorialOverlay isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />

      {/* Help button — fixed top-right */}
      <button
        onClick={() => setTutorialOpen(true)}
        title="Open tutorial"
        style={{
          position: 'fixed', top: 14, right: 14, zIndex: 9000,
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(23,178,158,0.15)',
          border: '1.5px solid rgba(23,178,158,0.5)',
          color: '#17b29e', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', lineHeight: '30px', textAlign: 'center',
          fontFamily: 'serif', padding: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        ?
      </button>

      {/* Main canvas area */}
      <div className="canvas-area">
        {/* Temperature slider */}
        <div data-tutorial="temp-slider" className="temp-slider-bar">
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
        <div data-tutorial="data-panel">
          <DataPanel mol1={mol1} mol2={mol2} temperature={temperature} />
        </div>
      </div>

      {/* Right control panel */}
      <ControlPanel
        mode={mode}
        onModeChange={setMode}
        mol1Polarity={mol1Polarity}
        mol1Mass={mol1Mass}
        mol2Polarity={mol2Polarity}
        mol2Mass={mol2Mass}
        onMol1PolarityChange={setMol1Polarity}
        onMol1MassChange={setMol1Mass}
        onMol2PolarityChange={setMol2Polarity}
        onMol2MassChange={setMol2Mass}
        sim1Formula={sim1Formula}
        sim2Formula={sim2Formula}
        onSim1Change={setSim1Formula}
        onSim2Change={setSim2Formula}
      />
    </div>
  );
}
