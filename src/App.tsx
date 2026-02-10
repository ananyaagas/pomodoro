import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Import assets for Electron compatibility
import foxWalk from "./assets/fox_walk.gif";
import slothRoll from "./assets/sloth_roll.gif";
import confettiFalling from "./assets/confetti_falling.gif";
import workIcon from "./assets/work.png";
import workClickedIcon from "./assets/work-clicked.png";
import breakIcon from "./assets/break.png";
import breakClickedIcon from "./assets/break-clicked.png";
import closeIcon from "./assets/close.png";
import minimizeIcon from "./assets/minimize.png";
import resetIcon from "./assets/reset.png";
import flower1 from "./assets/flower-1.png";
import flower2 from "./assets/flower-2.png";
import flowersAnimated from "./assets/flowers-animated.gif";
import roseAnimate from "./assets/rose-animate.gif";

// Declare electron if it exists
declare global {
  interface Window {
    electron?: {
      minimize: () => void;
      close: () => void;
    };
  }
}

function App() {
  /* --- constants --- */
  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  /* --- timer state --- */
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  /* --- internal refs --- */
  const celebrationTimeout = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* --- messages --- */
  const cheerMessages = [
    "you can do it!",
    "i believe in you!",
    "you're so smart, you are the smartest girl in the world!",
    "lock in raaaa",
    "stay focused!",
  ];

  const breakMessages = [
    "stay hydrated!",
    "FEEEED MEEEEE (get a snack)",
    "text me! i miss you :(",
    "i love you <3",
    "stretch! shake some ass :P",
  ];

  /* --- derived values --- */
  const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION;
  const progress = 1 - timeLeft / totalTime;
  const messages = isBreak ? breakMessages : cheerMessages;

  // Calculate which message to show based on progress (5 messages = 20% each)
  const messageIndex = Math.min(
    Math.floor(progress * messages.length),
    messages.length - 1
  );

  // Animal movement: they should meet in the center
  // Distance to travel for each animal
  const MEET_DISTANCE = 110;
  const animalProgress = isCelebrating ? 1 : progress;

  /* --- countdown timer --- */
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((p) => Math.max(0, p - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  /* --- celebration when timer finishes --- */
  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return;

    setIsRunning(false);
    setIsCelebrating(true);

    // clear any previous timeout
    if (celebrationTimeout.current) {
      clearTimeout(celebrationTimeout.current);
    }

    const nextIsBreak = !isBreak;

    celebrationTimeout.current = setTimeout(() => {
      setIsCelebrating(false);
      setIsBreak(nextIsBreak);
      setTimeLeft(nextIsBreak ? BREAK_DURATION : WORK_DURATION);
      celebrationTimeout.current = null;
    }, 3000);

    return () => {
      if (celebrationTimeout.current) {
        clearTimeout(celebrationTimeout.current);
        celebrationTimeout.current = null;
      }
    };
  }, [timeLeft, isRunning, isBreak]);

  /* --- helpers --- */
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  /* --- handlers --- */
  const startStop = () => setIsRunning((p) => !p);

  const switchMode = (b: boolean) => {
    setIsRunning(false);
    setIsCelebrating(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (celebrationTimeout.current) {
      clearTimeout(celebrationTimeout.current);
      celebrationTimeout.current = null;
    }

    setIsBreak(b);
    setTimeLeft(b ? BREAK_DURATION : WORK_DURATION);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCelebrating(false);

    // stop ticking immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // cancel celebration transition
    if (celebrationTimeout.current) {
      clearTimeout(celebrationTimeout.current);
      celebrationTimeout.current = null;
    }

    setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
  };

  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const handleClose = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  // Get the correct mode icon
  const getModeIcon = () => {
    if (isBreak) {
      return isRunning ? breakClickedIcon : breakIcon;
    } else {
      return isRunning ? workClickedIcon : workIcon;
    }
  };

  return (
    <div className={`app ${isBreak ? "break" : "work"}`}>
      {/* === TOP BAR === */}
      <div className="topbar">
        <div className="window-controls left">
          <img src={closeIcon} alt="Close" onClick={handleClose} />
          <img src={minimizeIcon} alt="Minimize" onClick={handleMinimize} />
        </div>

        <img
          className="topbar-mode-icon"
          src={getModeIcon()}
          alt={isBreak ? "Break" : "Work"}
        />

        <div className="window-controls right">
          <img src={resetIcon} alt="Reset" onClick={handleReset} />
        </div>
      </div>

      {/* === CLOUD LAYER === */}
      <div className="cloud-layer">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      {/* === MODE TITLE === */}
      <img
        className="mode-title"
        src={getModeIcon()}
        alt={isBreak ? "Break" : "Work"}
      />

      {/* === TIMER === */}
      <div className="timer">{formatTime(timeLeft)}</div>

      {/* === ANIMAL STAGE === */}
      <div className="animal-stage">
        <div className="message">{messages[messageIndex]}</div>

        <img
          src={foxWalk}
          alt="Fox"
          className="animal fox"
          style={{
            transform: `translateX(${animalProgress * MEET_DISTANCE}px)`,
          }}
        />

        <img
          src={slothRoll}
          alt="Sloth"
          className="animal sloth"
          style={{
            transform: `translateX(${-animalProgress * MEET_DISTANCE}px)`,
          }}
        />

        {isCelebrating && (
          <div className="confetti">
            <img src={confettiFalling} alt="Celebration!" />
          </div>
        )}
      </div>

      {/* === GRASS + FLOWERS === */}
      <div className="grass">
        <img src={flower1} className="flower f1" alt="" />
        <img src={flower2} className="flower f2" alt="" />
        <img src={flowersAnimated} className="flower f3" alt="" />
        <img src={roseAnimate} className="flower f4" alt="" />
      </div>

      {/* === CONTROLS === */}
      <div className="controls">
        <button onClick={() => switchMode(false)}>WORK</button>
        <button onClick={() => switchMode(true)}>BREAK</button>
        <button onClick={startStop}>{isRunning ? "PAUSE" : "START"}</button>
      </div>

      {/* === PROGRESS BAR === */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export default App;
