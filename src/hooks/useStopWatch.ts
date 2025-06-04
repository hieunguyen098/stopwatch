import { LapRecord } from "@/types/types";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";

interface StopWatchState {
  time: number;
  isRunning: boolean;
  laps: LapRecord[];
  handleStartStop: () => void;
  handleReset: () => void;
  handleLap: () => void;
}

export const useStopWatch = (): StopWatchState => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const lapStartTimeRef = useRef<number>(0); // Track when the current lap started

  // Cleanup function to cancel animation frame
  const cleanup = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const updateTime = useCallback(() => {
    if (!isRunning) return;

    const currentTime = Date.now() - startTimeRef.current;
    accumulatedTimeRef.current = currentTime;

    // Only update state if time has changed by at least 1ms
    if (Math.abs(currentTime - previousTimeRef.current) >= 1) {
      setTime(currentTime);
      previousTimeRef.current = currentTime;
    }

    frameRef.current = requestAnimationFrame(updateTime);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      const now = Date.now();
      startTimeRef.current = now - accumulatedTimeRef.current;
      lapStartTimeRef.current = now - (time - lastLapTime); // Set lap start time
      previousTimeRef.current = accumulatedTimeRef.current;
      frameRef.current = requestAnimationFrame(updateTime);
    } else {
      accumulatedTimeRef.current = time;
      cleanup();
    }

    return cleanup;
  }, [isRunning, updateTime, cleanup, time, lastLapTime]);

  const handleStartStop = useCallback(() => {
    try {
      if (!isRunning) {
        // Starting the timer
        lapStartTimeRef.current = Date.now() - (time - lastLapTime);
      }
      setIsRunning((prev) => !prev);
    } catch (error) {
      console.error("Error toggling stopwatch:", error);
      setIsRunning(false);
      cleanup();
    }
  }, [isRunning, time, lastLapTime, cleanup]);

  const handleReset = useCallback(() => {
    try {
      cleanup();
      setTime(0);
      setIsRunning(false);
      setLaps([]);
      setLastLapTime(0);
      accumulatedTimeRef.current = 0;
      startTimeRef.current = 0;
      previousTimeRef.current = 0;
      lapStartTimeRef.current = 0;
    } catch (error) {
      console.error("Error resetting stopwatch:", error);
      setIsRunning(false);
      cleanup();
    }
  }, [cleanup]);

  const handleLap = useCallback(() => {
    if (!isRunning) return;

    try {
      const now = Date.now();
      const currentLapTime = now - lapStartTimeRef.current;
      const totalTime = time + currentLapTime;

      setLaps((prev) => [
        ...prev,
        {
          lapNumber: prev.length + 1,
          totalTime: totalTime,
          splitTime: currentLapTime,
        },
      ]);

      setLastLapTime(totalTime);
      lapStartTimeRef.current = now; // Reset lap start time for next lap
    } catch (error) {
      console.error("Error recording lap:", error);
    }
  }, [isRunning, time]);

  // Memoize the return object to prevent unnecessary re-renders
  const stopwatchState = useMemo<StopWatchState>(
    () => ({
      time,
      isRunning,
      laps,
      handleStartStop,
      handleReset,
      handleLap,
    }),
    [time, isRunning, laps, handleStartStop, handleReset, handleLap]
  );

  return stopwatchState;
};
