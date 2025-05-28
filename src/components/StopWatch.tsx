"use client";

import { useStopWatch } from "@/hooks/useStopWatch";
import { formatTime } from "@/utils/time";

function StopWatch() {
  const { time, isRunning, laps, handleStartStop, handleReset, handleLap } =
    useStopWatch();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-gray-800 mb-2">
            {formatTime(time)}
          </h1>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleStartStop}
              className={`px-6 py-2 rounded-full font-semibold ${
                isRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white transition-colors`}
            >
              {isRunning ? "Stop" : "Start"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-full font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleLap}
              disabled={!isRunning}
              className={`px-6 py-2 rounded-full font-semibold ${
                isRunning
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white transition-colors`}
            >
              Lap
            </button>
          </div>
        </div>

        {laps.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Lap Times
            </h2>
            <div className="max-h-48 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 mb-2 px-2 text-sm font-semibold text-gray-600">
                <div>Lap</div>
                <div className="text-right">Split Time</div>
                <div className="text-right">Total Time</div>
              </div>
              {laps.map((lap) => (
                <div
                  key={lap.lapNumber}
                  className="grid grid-cols-3 gap-4 py-2 px-2 border-b border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-gray-600">Lap {lap.lapNumber}</span>
                  <span className="font-mono text-gray-800 text-right">
                    {formatTime(lap.splitTime)}
                  </span>
                  <span className="font-mono text-gray-800 text-right">
                    {formatTime(lap.totalTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StopWatch;
