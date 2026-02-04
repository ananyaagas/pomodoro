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

  /* --- messages (UNCHANGED) --- */
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

  /* --- message state --- */
  const [messageIndex, setMessageIndex] = useState(0);

  /* --- derived --- */
  const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION;
  const progress = isRunning ? 1 - timeLeft / totalTime : 0;
  const messages = isBreak ? breakMessages : cheerMessages;

  const meetProgress = () => {
    const start = 0.9;
    if (progress < start) return 0;
    return (progress - start) / (1 - start);
  };

  const meet = meetProgress();
  const MEET_DISTANCE = 110;

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
      {/* === NEW: CLOUD LAYER (responsive + drifting) === */}
      <div className="cloud-layer">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>

      <h1>{isBreak ? "Break" : "Work"}</h1>
      <div className="timer">{formatTime(timeLeft)}</div>

      {/* === CLOUD STAGE (UNCHANGED LOGIC) === */}
      <div className="animal-stage">
        <div className="message">{messages[messageIndex]}</div>

        <img
          src={`${process.env.PUBLIC_URL}/fox_walk.gif`}
          alt="Fox"
          className="animal fox"
          style={{ transform: `translateX(${meet * MEET_DISTANCE}px)` }}
        />

        <img
          src={`${process.env.PUBLIC_URL}/sloth_roll.gif`}
          alt="Sloth"
          className="animal sloth"
          style={{ transform: `translateX(${-meet * MEET_DISTANCE}px)` }}
        />

        {isCelebrating && (
          <div className="confetti">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                style={{
                  ["--x" as any]: Math.random(),
                  ["--hue" as any]: Math.random() * 360,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* === NEW: GRASS + FLOWERS === */}
      <div className="grass">
        <img src="/flower-1.png" className="flower f1" alt="" />
        <img src="/flower-2.png" className="flower f2" alt="" />
        <img src="/flowers-animated.gif" className="flower f3" alt="" />
        <img src="/rose-animate.gif" className="flower f4" alt="" />
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
