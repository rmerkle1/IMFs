import { useState, useEffect, useRef, useCallback } from 'react';
import { getIMFStrength, getOrientationAngle } from '../data/molecules';

const DAMPING = 0.92;
const ANGLE_DAMPING = 0.88;
const MAX_SPEED = 4.5;
const MIN_DIST = 60;

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function randomVelocity(scale) {
  return (Math.random() - 0.5) * 2 * scale;
}

export function useMoleculePhysics({ mol1, mol2, temperature, canvasWidth, canvasHeight }) {
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [renderTick, setRenderTick] = useState(0);

  const getInitialState = useCallback((w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const spread = Math.min(w, h) * 0.22;
    return {
      pos1: { x: cx - spread, y: cy + randomVelocity(10), angle: 0 },
      pos2: { x: cx + spread, y: cy + randomVelocity(10), angle: Math.PI },
      vel1: { vx: randomVelocity(0.5), vy: randomVelocity(0.5), vangle: randomVelocity(0.02) },
      vel2: { vx: randomVelocity(0.5), vy: randomVelocity(0.5), vangle: randomVelocity(0.02) },
    };
  }, []);

  // Initialize state
  useEffect(() => {
    const w = canvasWidth || 700;
    const h = canvasHeight || 480;
    stateRef.current = getInitialState(w, h);
  }, [canvasWidth, canvasHeight, getInitialState]);

  const resetPositions = useCallback(() => {
    const w = canvasWidth || 700;
    const h = canvasHeight || 480;
    stateRef.current = getInitialState(w, h);
    setRenderTick(t => t + 1);
  }, [canvasWidth, canvasHeight, getInitialState]);

  // Reset when molecules change
  useEffect(() => {
    resetPositions();
  }, [mol1?.formula, mol2?.formula]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const W = canvasWidth || 700;
    const H = canvasHeight || 480;

    function step() {
      if (!stateRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const state = stateRef.current;
      let { pos1, pos2, vel1, vel2 } = state;

      // Normalized temperature 0..1 (range -100 to 500)
      const tempNorm = clamp((temperature - (-100)) / 600, 0, 1);
      const thermalScale = 0.06 + tempNorm * 1.8;
      const orderFactor = clamp(1 - tempNorm * 1.4, 0, 1);

      const strength = getIMFStrength(mol1, mol2);
      const prefAngle = getOrientationAngle(mol1, mol2);

      // Distance vector
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Lennard-Jones-like force
      // Equilibrium distance scales with molecule sizes
      const r1 = getMolRadius(mol1);
      const r2 = getMolRadius(mol2);
      const sigmaBase = (r1 + r2) * 1.6;

      // Scale sigma based on strength — stronger IMFs = tighter equilibrium
      const sigma = sigmaBase * (1.1 - strength * 0.3);

      const sr = sigma / dist;
      const sr6 = Math.pow(sr, 6);
      const sr12 = sr6 * sr6;

      // LJ force magnitude: negative = attractive, positive = repulsive
      // F = 4*epsilon*(12*sr12 - 6*sr6) / dist  (along unit vector)
      const epsilon = strength * (0.15 + strength * 0.85);
      const forceMag = epsilon * (12 * sr12 - 6 * sr6) / dist;

      // Cap force
      const fCapped = clamp(forceMag, -4.0, 4.0);

      const fx = fCapped * (dx / dist);
      const fy = fCapped * (dy / dist);

      // Thermal noise
      const noise1x = randomVelocity(thermalScale);
      const noise1y = randomVelocity(thermalScale);
      const noise2x = randomVelocity(thermalScale);
      const noise2y = randomVelocity(thermalScale);

      // Update velocities
      vel1 = {
        vx: clamp((vel1.vx - fx + noise1x) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vy: clamp((vel1.vy - fy + noise1y) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vangle: vel1.vangle,
      };
      vel2 = {
        vx: clamp((vel2.vx + fx + noise2x) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vy: clamp((vel2.vy + fy + noise2y) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vangle: vel2.vangle,
      };

      // Orientation physics
      const angleToTarget = Math.atan2(dy, dx);

      if (mol1 && (mol1.polarity === 'highlyPolar' || mol1.polarity === 'polar' || mol1.polarity === 'weaklyPolar')) {
        const targetAngle1 = angleToTarget;
        let angleDiff1 = targetAngle1 - pos1.angle;
        while (angleDiff1 > Math.PI) angleDiff1 -= 2 * Math.PI;
        while (angleDiff1 < -Math.PI) angleDiff1 += 2 * Math.PI;
        const angTorque1 = angleDiff1 * 0.04 * orderFactor;
        vel1.vangle = clamp((vel1.vangle + angTorque1 + randomVelocity(0.01 * thermalScale)) * ANGLE_DAMPING, -0.15, 0.15);
      } else {
        vel1.vangle = (vel1.vangle + randomVelocity(0.008 * thermalScale)) * ANGLE_DAMPING;
      }

      if (mol2 && (mol2.polarity === 'highlyPolar' || mol2.polarity === 'polar' || mol2.polarity === 'weaklyPolar')) {
        const targetAngle2 = angleToTarget + Math.PI + prefAngle;
        let angleDiff2 = targetAngle2 - pos2.angle;
        while (angleDiff2 > Math.PI) angleDiff2 -= 2 * Math.PI;
        while (angleDiff2 < -Math.PI) angleDiff2 += 2 * Math.PI;
        const angTorque2 = angleDiff2 * 0.04 * orderFactor;
        vel2.vangle = clamp((vel2.vangle + angTorque2 + randomVelocity(0.01 * thermalScale)) * ANGLE_DAMPING, -0.15, 0.15);
      } else {
        vel2.vangle = (vel2.vangle + randomVelocity(0.008 * thermalScale)) * ANGLE_DAMPING;
      }

      // Update positions
      let newPos1 = {
        x: pos1.x + vel1.vx,
        y: pos1.y + vel1.vy,
        angle: pos1.angle + vel1.vangle,
      };
      let newPos2 = {
        x: pos2.x + vel2.vx,
        y: pos2.y + vel2.vy,
        angle: pos2.angle + vel2.vangle,
      };

      // Wall bouncing with padding
      const pad = 55;
      if (newPos1.x < pad) { newPos1.x = pad; vel1.vx = Math.abs(vel1.vx) * 0.7; }
      if (newPos1.x > W - pad) { newPos1.x = W - pad; vel1.vx = -Math.abs(vel1.vx) * 0.7; }
      if (newPos1.y < pad) { newPos1.y = pad; vel1.vy = Math.abs(vel1.vy) * 0.7; }
      if (newPos1.y > H - pad) { newPos1.y = H - pad; vel1.vy = -Math.abs(vel1.vy) * 0.7; }

      if (newPos2.x < pad) { newPos2.x = pad; vel2.vx = Math.abs(vel2.vx) * 0.7; }
      if (newPos2.x > W - pad) { newPos2.x = W - pad; vel2.vx = -Math.abs(vel2.vx) * 0.7; }
      if (newPos2.y < pad) { newPos2.y = pad; vel2.vy = Math.abs(vel2.vy) * 0.7; }
      if (newPos2.y > H - pad) { newPos2.y = H - pad; vel2.vy = -Math.abs(vel2.vy) * 0.7; }

      // Hard minimum separation
      const newDx = newPos2.x - newPos1.x;
      const newDy = newPos2.y - newPos1.y;
      const newDist = Math.sqrt(newDx * newDx + newDy * newDy);
      if (newDist < MIN_DIST) {
        const push = (MIN_DIST - newDist) / 2;
        const nx = newDx / (newDist || 1);
        const ny = newDy / (newDist || 1);
        newPos1.x -= nx * push;
        newPos1.y -= ny * push;
        newPos2.x += nx * push;
        newPos2.y += ny * push;
        vel1.vx -= nx * 0.5;
        vel1.vy -= ny * 0.5;
        vel2.vx += nx * 0.5;
        vel2.vy += ny * 0.5;
      }

      stateRef.current = { pos1: newPos1, pos2: newPos2, vel1, vel2 };
      setRenderTick(t => (t + 1) % 10000);

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mol1, mol2, temperature, canvasWidth, canvasHeight]);

  const s = stateRef.current;
  return {
    pos1: s?.pos1 ?? { x: 200, y: 240, angle: 0 },
    pos2: s?.pos2 ?? { x: 500, y: 240, angle: Math.PI },
    vel1: s?.vel1 ?? { vx: 0, vy: 0, vangle: 0 },
    vel2: s?.vel2 ?? { vx: 0, vy: 0, vangle: 0 },
    resetPositions,
  };
}

function getMolRadius(mol) {
  if (!mol) return 28;
  const mass = mol.mass || 30;
  return 22 + Math.sqrt(mass) * 1.8;
}
