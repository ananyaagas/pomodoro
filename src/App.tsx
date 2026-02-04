import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  /* --- constants --- */
  const WORK_DURATION = 25 * 60;
  const BREAK_DURATION = 5 * 60;

  /* --- timer state --- */
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  /* --- flowers --- */

  /* --- messages (UNCHANGED) --- */
  const cheerMessages = [
    "You Can Do It!",
    "I believe in you!",
    "You're so smart, you are the smartest girl in the world!",
    "Keep going!",
    "Stay focused!",
  ];

  const breakMessages = [
    "Stay hydrated!",
    "FEEEED MEEEEE (get a snack)",
    "Text me! I miss you :(",
    "I love you <3 EEEEEKKKK",
    "Stretch! Shake some ass :P",
  ];

  /* --- message state --- */
  const [messageIndex, setMessageIndex] = useState(0);

  /* --- derived --- */
  const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION;
  const progress = isRunning ? 1 - timeLeft / totalTime : 0;
  const messages = isBreak ? breakMessages : cheerMessages;

  /* --- countdown --- */
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, timeLeft]);

  /* --- finish --- */
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCelebrating(true);

      const t = setTimeout(() => {
        setIsCelebrating(false);
        setTimeLeft(isBreak ? BREAK_DURATION : WORK_DURATION);
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [timeLeft, isRunning, isBreak]);

  /* --- message rotation --- */
  useEffect(() => {
    if (!isRunning) return;

    const interval = isBreak ? 60_000 : 300_000;

    const t = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, interval);

    return () => clearInterval(t);
  }, [isRunning, isBreak, messages.length]);

  /* --- helpers --- */
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  /* --- handlers --- */
  const startStop = () => setIsRunning((p) => !p);

  const switchMode = (b: boolean) => {
    setIsBreak(b);
    setIsRunning(false);
    setTimeLeft(b ? BREAK_DURATION : WORK_DURATION);
    setMessageIndex(0);
  };

  return (
    <div className={`app ${isBreak ? "break" : "work"}`}>
      <h1>{isBreak ? "Break" : "Work"}</h1>
      <div className="timer">{formatTime(timeLeft)}</div>

      {/* === CLOUD STAGE === */}
      <div className="animal-stage">
        {!isCelebrating ? (
          <>
            <div className="message">{messages[messageIndex]}</div>

            <img
              src={`${process.env.PUBLIC_URL}/fox_walk.gif`}
              alt="Fox"
              className="animal fox"
              style={{ transform: `translateX(${progress * 220}px)` }}
            />

            <img
              src={`${process.env.PUBLIC_URL}/sloth_roll.gif`}
              alt="Sloth"
              className="animal sloth"
              style={{ transform: `translateX(${-progress * 220}px)` }}
            />
          </>
        ) : (
          <div className="celebration">🦊🤗🦥</div>
        )}
      </div>

      <div className="controls">
        <button onClick={() => switchMode(false)}>Work</button>
        <button onClick={() => switchMode(true)}>Break</button>
        <button onClick={startStop}>{isRunning ? "Pause" : "Start"}</button>
      </div>

      <div className="debug">Progress: {progress.toFixed(2)}</div>
    </div>
  );
}

export default App;
