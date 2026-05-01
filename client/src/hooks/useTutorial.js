import { useState, useEffect } from 'react';

const TOUR_KEY = 'fx_todo_tour_completed';

const useTutorial = () => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  // Called externally after login/register to trigger tour
  const startIfNew = () => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (!completed) {
      setTimeout(() => setActive(true), 800);
    }
  };

  const next = (totalSteps) => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    setActive(false);
    setStep(0);
  };

  const replay = () => {
    setStep(0);
    setActive(true);
  };

  return { active, step, next, prev, finish, replay, startIfNew };
};

export default useTutorial;
