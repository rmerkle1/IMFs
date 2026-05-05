import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';

const STEPS = [
  {
    title: 'Welcome to IMF Explorer',
    body: "Intermolecular forces (IMFs) are the invisible attractions between molecules that determine whether a substance is solid, liquid, or gas at a given temperature. Let's walk through the app!",
    target: null,
  },
  {
    title: 'Set Molecule Polarity',
    body: 'Use the Polarity slider to choose how polar each molecule is. Polarity determines which IMFs are possible — nonpolar molecules only have London dispersion forces, while highly polar ones can form hydrogen bonds.',
    target: 'polarity-sliders',
    card: 'left',
  },
  {
    title: 'Adjust Mass & Size',
    body: 'The Mass/Size slider picks a larger molecule in the same polarity family. Bigger molecules have more electrons and stronger London dispersion forces — notice how the boiling point rises as you increase mass!',
    target: 'mass-sliders',
    card: 'left',
  },
  {
    title: 'Hit Play',
    body: 'Click the ▶ Play button to start the simulation. The molecules will attract each other based on their IMFs. Stronger attractions bring them closer together — watch how quickly they move!',
    target: 'play-button',
    card: 'top',
  },
  {
    title: 'Electron Density Map',
    body: 'Toggle the e⁻ Density button to reveal a color-coded electron cloud. Pink regions are electron-rich (δ−) and purple regions are electron-poor (δ+). This shows where partial charges form on the molecule.',
    target: 'density-toggle',
    card: 'bottom',
  },
  {
    title: 'IMF Lines & Labels',
    body: 'Once molecules come close, colored lines and labels appear showing the active intermolecular forces. The strength bar shows how strong the attraction is. For London dispersion forces, watch for the flashing δ+/δ− symbols!',
    target: 'canvas',
    card: 'right',
  },
  {
    title: 'Info Panels',
    body: "The panels below the simulation show each molecule's boiling point, melting point, mass, and IMF types. The center panel shows the forces acting between the pair and their overall attraction strength.",
    target: 'data-panel',
    card: 'top',
  },
  {
    title: 'Adjust Temperature',
    body: 'Drag the temperature slider to heat things up. As temperature rises, kinetic energy competes with IMFs. High enough temperatures overcome even strong attractions and molecules fly apart — just like boiling!',
    target: 'temp-slider',
    card: 'bottom',
  },
  {
    title: 'Try the Simulator Tab',
    body: 'Switch to the Simulator tab to choose from real molecules — water, ammonia, iodine, sodium chloride, and more. Compare their boiling points and see which IMFs are responsible.',
    target: 'simulator-tab',
    card: 'left',
  },
  {
    title: "You're all set!",
    body: "Experiment with different combinations of polarity, mass, and temperature. Look for patterns in boiling points and attraction strength. You can always reopen this guide with the ? button in the top right.",
    target: null,
  },
];

const CARD_W = 300;
const PAD = 14;

function getCardStyle(targetRect, card) {
  if (!targetRect || !card) {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      width: CARD_W,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const style = { position: 'fixed', zIndex: 9999, width: CARD_W };

  if (card === 'left') {
    style.right = vw - targetRect.left + 16;
    style.top = Math.max(10, Math.min(vh - 240, targetRect.top + targetRect.height / 2 - 110));
  } else if (card === 'right') {
    style.left = targetRect.right + 16;
    style.top = Math.max(10, Math.min(vh - 240, targetRect.top + targetRect.height / 2 - 110));
  } else if (card === 'top') {
    style.bottom = vh - targetRect.top + 16;
    style.left = Math.max(10, Math.min(vw - CARD_W - 10, targetRect.left + targetRect.width / 2 - CARD_W / 2));
  } else if (card === 'bottom') {
    style.top = targetRect.bottom + 16;
    style.left = Math.max(10, Math.min(vw - CARD_W - 10, targetRect.left + targetRect.width / 2 - CARD_W / 2));
  }

  return style;
}

export default function TutorialOverlay({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const current = STEPS[step];

  const measure = useCallback(() => {
    if (!current.target) { setTargetRect(null); return; }
    const el = document.querySelector(`[data-tutorial="${current.target}"]`);
    setTargetRect(el ? el.getBoundingClientRect() : null);
  }, [current.target]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    measure();
  }, [isOpen, step, measure]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isOpen, measure]);

  // Reset step when reopened
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose]);

  const handleNext = () => {
    if (step === STEPS.length - 1) handleClose();
    else setStep(s => s + 1);
  };

  const handlePrev = () => setStep(s => Math.max(0, s - 1));

  if (!isOpen) return null;

  const isLast = step === STEPS.length - 1;
  const cardStyle = getCardStyle(targetRect, current.card);

  return (
    <>
      {/* Full overlay for non-spotlight steps */}
      {!targetRect && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(8,18,30,0.78)',
            zIndex: 9997,
          }}
          onClick={handleClose}
        />
      )}

      {/* Spotlight box — dims everything outside via box-shadow */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            left: targetRect.left - PAD,
            top: targetRect.top - PAD,
            width: targetRect.width + PAD * 2,
            height: targetRect.height + PAD * 2,
            borderRadius: 10,
            boxShadow: '0 0 0 9999px rgba(8,18,30,0.78)',
            outline: '2px solid rgba(23,178,158,0.65)',
            outlineOffset: 0,
            zIndex: 9998,
            pointerEvents: 'none',
            transition: 'left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease',
          }}
        />
      )}

      {/* Tutorial card */}
      <div style={{
        ...cardStyle,
        background: '#132030',
        border: '1px solid rgba(23,178,158,0.35)',
        borderRadius: 14,
        padding: '22px 24px 18px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 16, alignItems: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? '#17b29e' : i < step ? 'rgba(23,178,158,0.5)' : 'rgba(23,178,158,0.2)',
                transition: 'width 0.2s, background 0.2s',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4A6A80' }}>
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: '#17b29e', marginBottom: 10, letterSpacing: '0.01em' }}>
          {current.title}
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.65, color: '#9AB8CC', marginBottom: 20 }}>
          {current.body}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none',
              color: '#4A6A80', fontSize: 12, cursor: 'pointer',
              padding: '4px 0', fontFamily: 'inherit',
            }}
          >
            Skip tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  background: 'rgba(23,178,158,0.12)',
                  border: '1px solid rgba(23,178,158,0.3)',
                  color: '#17b29e', borderRadius: 7,
                  padding: '7px 15px', fontSize: 12.5,
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                background: '#17b29e', border: 'none',
                color: '#fff', borderRadius: 7,
                padding: '7px 18px', fontSize: 12.5,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {isLast ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
