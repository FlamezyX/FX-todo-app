import { createContext, useContext } from 'react';
import useTutorial from '../hooks/useTutorial';

const TutorialContext = createContext(null);

export const TutorialProvider = ({ children }) => {
  const tutorial = useTutorial();
  return (
    <TutorialContext.Provider value={tutorial}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorialContext = () => useContext(TutorialContext);
