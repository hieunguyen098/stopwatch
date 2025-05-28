import { LapRecord } from "@/types/types";
import { useCallback, useEffect, useState, useRef } from "react";

export const useStopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;

      intervalId = setInterval(() => {
        const currentTime = Date.now() - startTimeRef.current;
        accumulatedTimeRef.current = currentTime;
        setTime(currentTime);
      }, 10);
    } else {
      accumulatedTimeRef.current = time;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, time]);

  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
    setLastLapTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
  }, []);

  const handleLap = useCallback(() => {
    const splitTime = time - lastLapTime;
    setLaps((prev) => [
      ...prev,
      {
        lapNumber: prev.length + 1,
        totalTime: time,
        splitTime: splitTime,
      },
    ]);
    setLastLapTime(time);
  }, [time, lastLapTime]);

  return {
    time,
    isRunning,
    laps,
    handleStartStop,
    handleReset,
    handleLap,
  };
};
