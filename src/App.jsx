import React, { useState, useEffect, useRef } from "react";
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const App = () => {
  const [breakCount, setBreakCount] = useState(5);
  const [sessionCount, setSessionCount] = useState(25);
  const [clockCount, setClockCount] = useState(25 * 60);
  const [currentTimer, setCurrentTimer] = useState("Session");
  const [isPlaying, setIsPlaying] = useState(false);

  const loopRef = useRef();
  const beepSoundRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      loopRef.current = setInterval(() => {
        if (clockCount === 0) {
          setCurrentTimer(currentTimer === "Session" ? "Break" : "Session");
          setClockCount(currentTimer === "Session" ? breakCount * 60 : sessionCount * 60);
          playBeep();
        } else {
          setClockCount(clockCount - 1);
        }
      }, 1000);
    } else {
      clearInterval(loopRef.current);
    }

    return () => clearInterval(loopRef.current);
  }, [isPlaying, clockCount, currentTimer, breakCount, sessionCount]);

  const playBeep = () => {
    if (beepSoundRef.current) {
      beepSoundRef.current.currentTime = 0;
      beepSoundRef.current.play();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimer("Session");
    setBreakCount(5);
    setSessionCount(25);
    setClockCount(25 * 60);

    if (beepSoundRef.current) {
      beepSoundRef.current.pause();
      beepSoundRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLengthChange = (count, timerType) => {
    if (!isPlaying) {
      if (timerType === "session") {
        const newSessionCount = sessionCount + count;

        if (newSessionCount > 0 && newSessionCount < 61) {
          setSessionCount(newSessionCount);

          if (currentTimer === "Session") {
            setClockCount(newSessionCount * 60);
          }
        }
      } else {
        const newBreakCount = breakCount + count;
        if (newBreakCount > 0 && newBreakCount < 61) {
          setBreakCount(newBreakCount);
          
          if (currentTimer === "Break") {
            setClockCount(newBreakCount * 60);
          }
        }
      }
    }
  };

  const convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  return (
    <div id="main">
      <h1 id="session_timer">
        Session Timer
      </h1>

      <div className="clock-wrapper">
        <h1 id="timer-label">
          {currentTimer}
        </h1>

        <span id="time-left">
          {convertToTime(clockCount)}
        </span>

        <div className="flex">
          <button
            id="start_stop"
            className="button button-safe"
            onClick={handlePlayPause}
          >
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`} />
          </button>

          <button
            id="reset"
            className="button button-danger"
            onClick={handleReset}
          >
            <i className="fas fa-sync" />
          </button>
        </div>
      </div>

      <div className="flex">
        <SetTimer
          title="Break"
          count={breakCount}
          handleDecrease={() => handleLengthChange(-1, "break")}
          handleIncrease={() => handleLengthChange(1, "break")}
        />

        <SetTimer
          title="Session"
          count={sessionCount}
          handleDecrease={() => handleLengthChange(-1, "session")}
          handleIncrease={() => handleLengthChange(1, "session")}
        />
      </div>

      <audio
        id="beep"
        preload="auto"
        ref={beepSoundRef}
        src='https://www.soundjay.com/buttons/sounds/button-2.mp3'
      />
    </div>
  );
};

const SetTimer = ({
  title,
  handleIncrease,
  handleDecrease,
  count }) => {
  const category = title.toLowerCase();

  return (
    <div className="time-adjustment-wrapper">
      <h2 id={`${category}-label`}>
        {title} Length
      </h2>

      <div className="flex plus-minus-wrapper">
        <button
          id={`${category}-decrement`}
          className="button button-danger"
          onClick={handleDecrease}
        >
          <i className="fas fa-minus" />
        </button>

        <span id={`${category}-length`}>
          {count}
        </span>

        <button
          id={`${category}-increment`}
          className="button"
          onClick={handleIncrease}
        >
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
};
