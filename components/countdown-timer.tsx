'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime(); // Define calculation logic separately for clarity

    const calculateTimeLeft = () => {
      const now = new Date().getTime(); // Relies on current time
      const difference = target - now;

      if (!isNaN(difference) && difference > 0) {
        // Check for NaN from invalid dates
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Handle past dates, invalid dates, or difference being exactly 0
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // Initial calculation
    const timerId = setInterval(calculateTimeLeft, 1000); // Update every second
    // Cleanup function to clear interval

    return () => clearInterval(timerId);
  }, [targetDate]); // Rerun effect if targetDate changes

  return (
    <div className="grid grid-cols-4 gap-4 text-center">
           {' '}
      <div className="flex flex-col items-center">
               {' '}
        <div
          data-testid="days-value"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 text-3xl font-bold backdrop-blur-sm border border-purple-500/20"
        >
                    {timeLeft.days}       {' '}
        </div>
                <span className="mt-2 text-sm">Tage</span>     {' '}
      </div>
           {' '}
      <div className="flex flex-col items-center">
               {' '}
        <div
          data-testid="hours-value"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 text-3xl font-bold backdrop-blur-sm border border-purple-500/20"
        >
                    {timeLeft.hours}       {' '}
        </div>
                <span className="mt-2 text-sm">Stunden</span>     {' '}
      </div>
           {' '}
      <div className="flex flex-col items-center">
               {' '}
        <div
          data-testid="minutes-value"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 text-3xl font-bold backdrop-blur-sm border border-purple-500/20"
        >
                    {timeLeft.minutes}       {' '}
        </div>
                <span className="mt-2 text-sm">Minuten</span>     {' '}
      </div>
           {' '}
      <div className="flex flex-col items-center">
               {' '}
        <div
          data-testid="seconds-value"
          className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/40 to-blue-900/40 text-3xl font-bold backdrop-blur-sm border border-purple-500/20"
        >
                    {timeLeft.seconds}       {' '}
        </div>
                <span className="mt-2 text-sm">Sekunden</span>     {' '}
      </div>
         {' '}
    </div>
  );
}
