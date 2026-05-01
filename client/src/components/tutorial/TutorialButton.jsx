import { useTutorialContext } from '../../context/TutorialContext';

const TutorialButton = () => {
  const { replay } = useTutorialContext();

  return (
    <button
      data-tour="tutorial-btn"
      onClick={replay}
      title="Replay Tutorial"
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-violet-600/20 hover:text-violet-300 text-slate-400 transition-all text-base"
    >
      ?
    </button>
  );
};

export default TutorialButton;
