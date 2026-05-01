import { useEffect, useState, useCallback } from 'react';
import { useTutorialContext } from '../../context/TutorialContext';
import TOUR_STEPS from './tourSteps';

const PADDING = 12;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 260;
const SCREEN_MARGIN = 16;

const getTargetRect = (selector) => {
  if (!selector) return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getTooltipStyle = (rect, position) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 16;

  if (!rect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  let top, left;

  switch (position) {
    case 'right':
      top = clamp(rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2, SCREEN_MARGIN, vh - TOOLTIP_HEIGHT - SCREEN_MARGIN);
      left = rect.left + rect.width + gap;
      // If goes off right edge, flip to left
      if (left + TOOLTIP_WIDTH > vw - SCREEN_MARGIN) {
        left = rect.left - TOOLTIP_WIDTH - gap;
      }
      // If still off screen, center it
      if (left < SCREEN_MARGIN) {
        left = clamp(rect.centerX - TOOLTIP_WIDTH / 2, SCREEN_MARGIN, vw - TOOLTIP_WIDTH - SCREEN_MARGIN);
        top = rect.top + rect.height + gap;
      }
      break;

    case 'left':
      top = clamp(rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2, SCREEN_MARGIN, vh - TOOLTIP_HEIGHT - SCREEN_MARGIN);
      left = rect.left - TOOLTIP_WIDTH - gap;
      if (left < SCREEN_MARGIN) {
        left = rect.left + rect.width + gap;
      }
      if (left + TOOLTIP_WIDTH > vw - SCREEN_MARGIN) {
        left = clamp(rect.centerX - TOOLTIP_WIDTH / 2, SCREEN_MARGIN, vw - TOOLTIP_WIDTH - SCREEN_MARGIN);
        top = rect.top + rect.height + gap;
      }
      break;

    case 'bottom':
      top = rect.top + rect.height + gap;
      left = clamp(rect.centerX - TOOLTIP_WIDTH / 2, SCREEN_MARGIN, vw - TOOLTIP_WIDTH - SCREEN_MARGIN);
      if (top + TOOLTIP_HEIGHT > vh - SCREEN_MARGIN) {
        top = rect.top - TOOLTIP_HEIGHT - gap;
      }
      break;

    case 'top':
      top = rect.top - TOOLTIP_HEIGHT - gap;
      left = clamp(rect.centerX - TOOLTIP_WIDTH / 2, SCREEN_MARGIN, vw - TOOLTIP_WIDTH - SCREEN_MARGIN);
      if (top < SCREEN_MARGIN) {
        top = rect.top + rect.height + gap;
      }
      break;

    default:
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  // Final clamp to always keep tooltip on screen
  top = clamp(top, SCREEN_MARGIN, vh - TOOLTIP_HEIGHT - SCREEN_MARGIN);
  left = clamp(left, SCREEN_MARGIN, vw - TOOLTIP_WIDTH - SCREEN_MARGIN);

  return { top, left };
};

const TourOverlay = () => {
  const { active, step, next, prev, finish } = useTutorialContext();
  const [rect, setRect] = useState(null);
  const [visible, setVisible] = useState(false);

  const currentStep = TOUR_STEPS[step];

  const updateRect = useCallback(() => {
    if (!active) return;
    const r = getTargetRect(currentStep?.target);
    setRect(r);
  }, [active, currentStep]);

  useEffect(() => {
    if (!active) { setVisible(false); return; }
    setVisible(false);
    const t = setTimeout(() => {
      updateRect();
      setVisible(true);
    }, 150);
    return () => clearTimeout(t);
  }, [active, step, updateRect]);

  useEffect(() => {
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [updateRect]);

  useEffect(() => {
    if (!active || !currentStep?.target) return;
    const el = document.querySelector(currentStep.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [active, step, currentStep]);

  if (!active) return null;

  const tooltipStyle = getTooltipStyle(rect, currentStep?.position);
  const isCenter = currentStep?.position === 'center';

  return (
    <div className="fixed inset-0 z-[200]" onClick={(e) => e.stopPropagation()}>
      {rect && !isCenter ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="10" fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#spotlight-mask)" />
          <rect x={rect.left} y={rect.top} width={rect.width} height={rect.height} rx="10" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.8" />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-black/75" />
      )}

      <div
        className={`absolute z-10 glass border border-violet-500/50 rounded-2xl p-5 shadow-2xl transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          ...tooltipStyle,
          width: TOOLTIP_WIDTH,
          boxShadow: '0 0 30px rgba(124,58,237,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-violet-400 font-semibold tracking-wider uppercase">
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
          <button onClick={finish} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
            Skip ✕
          </button>
        </div>

        <div className="flex gap-1 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'bg-violet-500 w-6' : i < step ? 'bg-violet-800 w-2' : 'bg-white/10 w-2'
              }`}
            />
          ))}
        </div>

        <h3 className="text-slate-100 font-bold text-base mb-2">{currentStep?.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{currentStep?.content}</p>

        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={prev}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-sm transition-all"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => next(TOUR_STEPS.length)}
            className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all neon-glow"
          >
            {step === TOUR_STEPS.length - 1 ? '🚀 Get Started!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourOverlay;
