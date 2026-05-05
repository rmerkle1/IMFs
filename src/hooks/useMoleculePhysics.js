import { useState, useEffect, useRef, useCallback } from 'react';
import { getIMFStrength } from '../data/molecules';
import { getDipoleAngle } from '../data/lewisStructures';

const DAMPING       = 0.92;
const ANGLE_DAMPING = 0.88;
const MAX_SPEED     = 4.5;
const ORIENT_TORQUE = 0.10;
const FLEX_SPRING   = 0.06;
const FLEX_DAMP     = 0.88;
const MAX_FLEX      = 0.30;

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function randomVelocity(scale) { return (Math.random() - 0.5) * 2 * scale; }
function wrapAngle(a) {
  while (a >  Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

// mol1's δ- faces mol2, mol2's δ+ faces mol1 → antiparallel dipoles
function targetAngleForDipoleFacing(worldAngle, dipoleAngle) {
  return worldAngle - dipoleAngle;
}

export function useMoleculePhysics({ mol1, mol2, temperature, canvasWidth, canvasHeight, simState }) {
  const stateRef = useRef(null);
  const rafRef   = useRef(null);
  const [renderTick, setRenderTick] = useState(0);

  // Initial state: side-by-side, both pointing right, stationary
  const getInitialState = useCallback((w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const r1       = getMolRadius(mol1);
    const r2       = getMolRadius(mol2);
    const strength = getIMFStrength(mol1, mol2);
    // Compute the same equilibrium distance used by the physics loop so that
    // the idle starting position is 25% beyond it — molecules are clearly
    // separated at rest, and quickly settle to their strength-appropriate gap
    // once Play is clicked.
    const surfaceGap = Math.pow(1.0 - strength, 2) * 220;
    const equilDist  = (r1 + r2) * 1.05 + surfaceGap;
    const spread = Math.min(w * 0.44, equilDist / 2 * 1.25);
    return {
      pos1:  { x: cx - spread, y: cy, angle: 0 },
      pos2:  { x: cx + spread, y: cy, angle: 0 },
      vel1:  { vx: 0, vy: 0, vangle: 0 },
      vel2:  { vx: 0, vy: 0, vangle: 0 },
      flex1: 0, vflex1: 0,
      flex2: 0, vflex2: 0,
    };
  }, [mol1, mol2]);

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

  // Reset when molecule identity changes
  useEffect(() => {
    resetPositions();
  }, [mol1?.formula, mol2?.formula]); // eslint-disable-line react-hooks/exhaustive-deps

  // Physics loop — only runs when simState === 'playing'
  useEffect(() => {
    if (simState !== 'playing') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const W = canvasWidth || 700;
    const H = canvasHeight || 480;
    const dipole1 = mol1 ? getDipoleAngle(mol1.formula) : 0;
    const dipole2 = mol2 ? getDipoleAngle(mol2.formula) : 0;

    function step() {
      if (!stateRef.current) { rafRef.current = requestAnimationFrame(step); return; }

      const state = stateRef.current;
      let { pos1, pos2, vel1, vel2 } = state;
      let { flex1, vflex1, flex2, vflex2 } = state;

      const tempNorm     = clamp((temperature - (-100)) / 600, 0, 1);
      const thermalScale = 0.05 + tempNorm * 2.2; // more aggressive at high temp
      const orderFactor  = clamp(1 - tempNorm * 1.4, 0, 1);

      const strength = getIMFStrength(mol1, mol2);

      const dx   = pos2.x - pos1.x;
      const dy   = pos2.y - pos1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const r1    = getMolRadius(mol1);
      const r2    = getMolRadius(mol2);
      // Surface gap shrinks quadratically with strength — stronger pairs settle
      // nearly touching, weaker pairs sit far apart.
      const surfaceGap = Math.pow(1.0 - strength, 2) * 220;
      const equilDist  = (r1 + r2) * 1.05 + surfaceGap;
      const sigma = equilDist / Math.pow(2, 1 / 6) * (1 + tempNorm * 0.5);
      const sr    = sigma / dist;
      const sr6   = Math.pow(sr, 6);
      const sr12  = sr6 * sr6;

      // Epsilon fades at high temperature — molecules escape the well and boil off.
      // Threshold scales with IMF strength so stronger interactions persist longer.
      const boilThreshold = 0.3 + strength * 0.4;
      const epsilonFade   = Math.max(0, 1 - Math.max(0,
        (tempNorm - boilThreshold) / Math.max(0.1, 1 - boilThreshold)));
      // epsilon 10× larger so LJ forces dominate thermal noise and molecules
      // actually converge to their equilibrium distance at room temperature.
      const epsilon  = strength * strength * 50.0 * epsilonFade;
      const forceMag = epsilon * (12 * sr12 - 6 * sr6) / dist;
      const fCapped  = clamp(forceMag, -8.0, 8.0);
      const fx = fCapped * (dx / dist);
      const fy = fCapped * (dy / dist);

      vel1 = {
        vx: clamp((vel1.vx - fx + randomVelocity(thermalScale)) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vy: clamp((vel1.vy - fy + randomVelocity(thermalScale)) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vangle: vel1.vangle,
      };
      vel2 = {
        vx: clamp((vel2.vx + fx + randomVelocity(thermalScale)) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vy: clamp((vel2.vy + fy + randomVelocity(thermalScale)) * DAMPING, -MAX_SPEED, MAX_SPEED),
        vangle: vel2.vangle,
      };

      // ── Orientation: align charges positive-to-negative ──────────────────
      const angleToTarget = Math.atan2(dy, dx);
      const isPolar1 = mol1 && mol1.polarity !== 'nonpolar';
      const isPolar2 = mol2 && mol2.polarity !== 'nonpolar';

      if (isPolar1) {
        const target1 = targetAngleForDipoleFacing(angleToTarget, dipole1);
        const diff1   = wrapAngle(target1 - pos1.angle);
        vel1.vangle   = clamp(
          (vel1.vangle + diff1 * ORIENT_TORQUE * orderFactor + randomVelocity(0.01 * thermalScale)) * ANGLE_DAMPING,
          -0.15, 0.15
        );
      } else {
        vel1.vangle = (vel1.vangle + randomVelocity(0.008 * thermalScale)) * ANGLE_DAMPING;
      }

      if (isPolar2) {
        const target2 = targetAngleForDipoleFacing(angleToTarget, dipole2);
        const diff2   = wrapAngle(target2 - pos2.angle);
        vel2.vangle   = clamp(
          (vel2.vangle + diff2 * ORIENT_TORQUE * orderFactor + randomVelocity(0.01 * thermalScale)) * ANGLE_DAMPING,
          -0.15, 0.15
        );
      } else {
        vel2.vangle = (vel2.vangle + randomVelocity(0.008 * thermalScale)) * ANGLE_DAMPING;
      }

      // ── Stacking alignment for nonpolar molecules ────────────────────────
      if (!isPolar1 && !isPolar2) {
        const avgSqrtMass   = (Math.sqrt(mol1?.mass || 30) + Math.sqrt(mol2?.mass || 30)) / 2;
        const stackStrength = Math.min(1, avgSqrtMass / 7);
        const proximityStack = Math.max(0, 1 - dist / 340);
        const tempFade = 1 - tempNorm * 0.8;

        if (stackStrength > 0.05 && proximityStack > 0) {
          const delta       = wrapAngle(pos2.angle - pos1.angle);
          const parallelism = Math.pow(Math.cos(delta), 2);

          // 1. Angular torque toward parallel/antiparallel
          const STACK_TORQUE = stackStrength * 0.022 * tempFade;
          const stackImpulse = Math.sin(2 * delta) * STACK_TORQUE * proximityStack * orderFactor;
          vel1.vangle = clamp(vel1.vangle + stackImpulse, -0.15, 0.15);
          vel2.vangle = clamp(vel2.vangle - stackImpulse, -0.15, 0.15);

          // 2. Lateral slide — push end-to-end pairs toward side-by-side
          if (parallelism > 0.35) {
            const axisX    = Math.cos(pos1.angle);
            const axisY    = Math.sin(pos1.angle);
            const perpAxisX = -Math.sin(pos1.angle);
            const perpAxisY =  Math.cos(pos1.angle);
            const along    = dx * axisX + dy * axisY;
            const perp     = dx * perpAxisX + dy * perpAxisY;
            const perpSign = perp !== 0 ? Math.sign(perp) : (vel2.vy - vel1.vy >= 0 ? 1 : -1);
            const endToEndness = Math.abs(along) / (dist || 1);
            const TANG_K = stackStrength * 0.10 * parallelism * proximityStack * tempFade;
            const tangFx = perpAxisX * perpSign * endToEndness * TANG_K;
            const tangFy = perpAxisY * perpSign * endToEndness * TANG_K;
            vel2.vx = clamp(vel2.vx + tangFx, -MAX_SPEED, MAX_SPEED);
            vel2.vy = clamp(vel2.vy + tangFy, -MAX_SPEED, MAX_SPEED);
            vel1.vx = clamp(vel1.vx - tangFx, -MAX_SPEED, MAX_SPEED);
            vel1.vy = clamp(vel1.vy - tangFy, -MAX_SPEED, MAX_SPEED);
          }
        }
      }

      // ── Update positions ──────────────────────────────────────────────────
      let newPos1 = { x: pos1.x + vel1.vx, y: pos1.y + vel1.vy, angle: pos1.angle + vel1.vangle };
      let newPos2 = { x: pos2.x + vel2.vx, y: pos2.y + vel2.vy, angle: pos2.angle + vel2.vangle };

      // No hard walls — instead correct center-of-mass drift gently.
      // This fades at high temperature so molecules can "boil off" screen.
      const cmX      = (newPos1.x + newPos2.x) / 2;
      const cmY      = (newPos1.y + newPos2.y) / 2;
      const cmK      = 0.004 * Math.max(0, 1 - tempNorm * 0.9);
      const driftX   = (cmX - W / 2) * cmK;
      const driftY   = (cmY - H / 2) * cmK;
      newPos1.x -= driftX; newPos1.y -= driftY;
      newPos2.x -= driftX; newPos2.y -= driftY;
      vel1.vx   -= driftX; vel1.vy   -= driftY;
      vel2.vx   -= driftX; vel2.vy   -= driftY;

      // Hard minimum separation (prevent overlap)
      const ndx    = newPos2.x - newPos1.x;
      const ndy    = newPos2.y - newPos1.y;
      const nd     = Math.sqrt(ndx * ndx + ndy * ndy);
      const MIN_DIST = (r1 + r2) * 0.55;
      if (nd < MIN_DIST) {
        const push = (MIN_DIST - nd) / 2;
        const nx = ndx / (nd || 1), ny = ndy / (nd || 1);
        newPos1.x -= nx * push; newPos1.y -= ny * push;
        newPos2.x += nx * push; newPos2.y += ny * push;
        const bounceImpulse = 0.4 * (1 - strength * 0.7);
        vel1.vx -= nx * bounceImpulse; vel1.vy -= ny * bounceImpulse;
        vel2.vx += nx * bounceImpulse; vel2.vy += ny * bounceImpulse;
      }

      // ── Flex joint physics ────────────────────────────────────────────────
      const flexNoise = 0.022 * thermalScale;
      vflex1 = (vflex1 - flex1 * FLEX_SPRING + randomVelocity(flexNoise)) * FLEX_DAMP;
      flex1  = clamp(flex1 + vflex1, -MAX_FLEX, MAX_FLEX);
      vflex2 = (vflex2 - flex2 * FLEX_SPRING + randomVelocity(flexNoise)) * FLEX_DAMP;
      flex2  = clamp(flex2 + vflex2, -MAX_FLEX, MAX_FLEX);

      stateRef.current = { pos1: newPos1, pos2: newPos2, vel1, vel2, flex1, vflex1, flex2, vflex2 };
      setRenderTick(t => (t + 1) % 10000);
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mol1, mol2, temperature, canvasWidth, canvasHeight, simState]);

  const s = stateRef.current;
  return {
    pos1:  s?.pos1  ?? { x: 200, y: 200, angle: 0 },
    pos2:  s?.pos2  ?? { x: 200, y: 280, angle: 0 },
    vel1:  s?.vel1  ?? { vx: 0, vy: 0, vangle: 0 },
    vel2:  s?.vel2  ?? { vx: 0, vy: 0, vangle: 0 },
    flex1: s?.flex1 ?? 0,
    flex2: s?.flex2 ?? 0,
    resetPositions,
  };
}

function getMolRadius(mol) {
  if (!mol) return 45;
  const mass = mol.mass || 30;
  return (22 + Math.sqrt(mass) * 1.8) * 1.6;
}
