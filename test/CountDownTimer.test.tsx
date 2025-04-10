// test/CountdownTimer.test.tsx

import { render, screen, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, SpyInstance } from 'vitest';
import CountdownTimer from '@/components/countdown-timer'; 


const expectValue = (testId: string, value: string | number) => {
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(String(value));
};

describe('CountdownTimer Component', () => {
    const MOCK_SYSTEM_TIME = '2025-04-10T10:00:00.000Z'; 

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(MOCK_SYSTEM_TIME));
    });

    afterEach(() => {
        cleanup(); 
        vi.runOnlyPendingTimers(); 
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    /**
     * Calculates and displays the correct initial time left for a future date.
     */
    it('should display the correct initial countdown for a future date', () => {
        const futureDate = '2025-04-11T12:03:04.000Z';
        render(<CountdownTimer targetDate={futureDate} />);

        expectValue('days-value', 1);
        expectValue('hours-value', 2);
        expectValue('minutes-value', 3);
        expectValue('seconds-value', 4);
    });

    /**
     * Displays all zeros when the target date is in the past.
     */
    it('should display all zeros for a past date', () => {
        const pastDate = '2025-04-09T10:00:00.000Z';
        render(<CountdownTimer targetDate={pastDate} />);

        expectValue('days-value', 0);
        expectValue('hours-value', 0);
        expectValue('minutes-value', 0);
        expectValue('seconds-value', 0);
    });

    /**
     * Displays all zeros when the target date string is invalid.
     */
    it('should display all zeros for an invalid date string', () => {
        render(<CountdownTimer targetDate="this is not a date" />);

        expectValue('days-value', 0);
        expectValue('hours-value', 0);
        expectValue('minutes-value', 0);
        expectValue('seconds-value', 0);
    });

    /**
     * Updates the displayed time correctly every second.
     */
    it('should update the countdown every second', async () => {
        // Target: 5 seconds from MOCK_SYSTEM_TIME
        const futureDate = '2025-04-10T10:00:05.000Z';
        render(<CountdownTimer targetDate={futureDate} />);
        expectValue('seconds-value', 5);

        await act(async () => {
             vi.advanceTimersByTime(1001);
        });
        expectValue('seconds-value', 4);

         await act(async () => {
             vi.advanceTimersByTime(2000);
         });
        expectValue('seconds-value', 2);


        await act(async () => {
             vi.advanceTimersByTime(3000);
        });
        expectValue('seconds-value', 0); // Should now be zero
        expectValue('minutes-value', 0); // Other values should also be zero
    });

    /**
     * Updates the countdown when the targetDate prop changes.
     */
    it('should update countdown when targetDate prop changes', () => {
        const date1 = '2025-04-10T10:00:10.000Z'; // 10 seconds away
        const date2 = '2025-04-10T10:01:00.000Z'; // 1 minute (60 seconds) away

        const { rerender } = render(<CountdownTimer targetDate={date1} />);

        expectValue('seconds-value', 10);
        expectValue('minutes-value', 0);

        rerender(<CountdownTimer targetDate={date2} />);

        expectValue('seconds-value', 0); // 60 seconds = 0 seconds left in the minute
        expectValue('minutes-value', 1); // Should show 1 minute now
    });

    /**
     * Clears the interval timer on component unmount.
     */
    it('should clear the interval timer on unmount', () => {
        const clearIntervalSpy: SpyInstance = vi.spyOn(global, 'clearInterval');
        const futureDate = '2025-04-11T12:00:00.000Z';

        const { unmount } = render(<CountdownTimer targetDate={futureDate} />);

        expect(clearIntervalSpy).not.toHaveBeenCalled();
        unmount();
        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
        clearIntervalSpy.mockRestore();
    });
});