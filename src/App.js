import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, Plus, Minus } from 'lucide-react';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timerLabel, setTimerLabel] = useState('Session');

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setIsSession(true);
    setTimeLeft(25 * 60);

    const beepSound = document.getElementById('beep');
    beepSound.pause();
    beepSound.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            const beepSound = document.getElementById('beep');
            beepSound.play();

            if (isSession) {
              setIsSession(false);
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setIsSession(true);
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isSession, sessionLength, breakLength]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex items-center justify-center">
          <Clock className="mr-3 text-blue-600" size={36} />
          25 + 5 Clock
        </h1>

        {/* Length Controls */}
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <div id="break-label" className="text-sm font-medium text-gray-600 mb-2">Break Length</div>
            <div className="flex items-center justify-center space-x-2">
              <button 
                id="break-decrement" 
                onClick={handleBreakDecrement} 
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition"
              >
                <Minus size={20} />
              </button>
              <div id="break-length" className="text-xl font-semibold">{breakLength}</div>
              <button 
                id="break-increment" 
                onClick={handleBreakIncrement} 
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="text-center">
            <div id="session-label" className="text-sm font-medium text-gray-600 mb-2">Session Length</div>
            <div className="flex items-center justify-center space-x-2">
              <button 
                id="session-decrement" 
                onClick={handleSessionDecrement} 
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition"
              >
                <Minus size={20} />
              </button>
              <div id="session-length" className="text-xl font-semibold">{sessionLength}</div>
              <button 
                id="session-increment" 
                onClick={handleSessionIncrement} 
                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-center mb-6">
          <div id="timer-label" className="text-xl font-medium text-white mb-2">{timerLabel}</div>
          <div 
            id="time-left" 
            className="text-6xl font-bold text-white"
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            id="start_stop" 
            onClick={handleStartStop} 
            className={`flex items-center justify-center w-16 h-16 rounded-full ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white transition`}
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button 
            id="reset" 
            onClick={handleReset} 
            className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
          >
            <RefreshCw size={32} />
          </button>
        </div>

        {/* Beep Sound */}
        <audio id="beep">
          <source src="/BeepSound.wav" type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default App;