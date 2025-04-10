import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnimatedBackground from '@/components/animated-background';

// --- Canvas API Mocking ---

/**
 * Comprehensive mock for the CanvasRenderingContext2D API.
 * Includes mocked methods (using `vi.fn()`) and properties (using getters/setters)
 * expected to be used by the `AnimatedBackground` component.
 * Also includes a custom `mockClear` method to reset internal mocks.
 */
const mockCtx = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })), // Mock the gradient object as well
    stroke: vi.fn(),

    // --- Mocked Properties with Backing Fields ---
    _globalAlpha: 1, // Internal state for the mock
    _fillStyle: '',
    _strokeStyle: '',
    _lineWidth: 0,
    _lineCap: 'butt' as CanvasLineCap, 

    /** Sets the mocked globalAlpha value. */
    set globalAlpha(value: number) { this._globalAlpha = value; },
    /** Gets the mocked globalAlpha value. */
    get globalAlpha() { return this._globalAlpha; },

    /** Sets the mocked fillStyle value (converted to string for simplicity). */
    set fillStyle(value: string | CanvasGradient | CanvasPattern) { this._fillStyle = String(value); },
    /** Gets the mocked fillStyle value. */
    get fillStyle() { return this._fillStyle; },

    /** Sets the mocked strokeStyle value (converted to string for simplicity). */
    set strokeStyle(value: string | CanvasGradient | CanvasPattern) { this._strokeStyle = String(value); },
    /** Gets the mocked strokeStyle value. */
    get strokeStyle() { return this._strokeStyle; },

    /** Sets the mocked lineWidth value. */
    set lineWidth(value: number) { this._lineWidth = value; },
    /** Gets the mocked lineWidth value. */
    get lineWidth() { return this._lineWidth; },

    /** Sets the mocked lineCap value. */
    set lineCap(value: CanvasLineCap) { this._lineCap = value; },
    /** Gets the mocked lineCap value. */
    get lineCap() { return this._lineCap; },

    /**
     * Resets all mocked methods and internal property states for this context mock.
     * Should be called in `beforeEach` or `afterEach` to ensure test isolation.
     */
    mockClear() {
        this.scale.mockClear();
        this.clearRect.mockClear();
        this.save.mockClear();
        this.restore.mockClear();
        this.beginPath.mockClear();
        this.moveTo.mockClear();
        this.lineTo.mockClear();
        this.closePath.mockClear();
        this.fill.mockClear();
        this.arc.mockClear();
        this.createRadialGradient.mockClear();
        this.stroke.mockClear();
        // Reset internal state
         this._globalAlpha = 1;
         this._fillStyle = '';
         this._strokeStyle = '';
         this._lineWidth = 0;
         this._lineCap = 'butt';
    }
};

/**
 * Mock for the `HTMLCanvasElement.prototype.getContext` method.
 * Returns the detailed `mockCtx` object when called with '2d'.
 */
const mockGetContext = vi.fn().mockReturnValue(mockCtx);

// --- Window/Document API Mocking ---

/** Mock for `window.addEventListener`. */
const mockAddEventListener = vi.fn();
/** Mock for `window.removeEventListener`. */
const mockRemoveEventListener = vi.fn();
/** Mock for `window.requestAnimationFrame`. */
const mockRequestAnimationFrame = vi.fn<[FrameRequestCallback], number>(); // Added type hint
/** Mock for `window.cancelAnimationFrame`. */
const mockCancelAnimationFrame = vi.fn<[number], void>(); // Added type hint

/** Initial mocked window width for tests. */
const initialWidth = 1024;
/** Initial mocked window height for tests. */
const initialHeight = 768;
/** Initial mocked device pixel ratio for tests. */
const initialDPR = 1;

/**
 * Test suite for the AnimatedBackground component.
 * Mocks the Canvas API and relevant Window/Document APIs (`requestAnimationFrame`, resize events)
 * to allow testing the component's logic without a real browser environment.
 */
describe('AnimatedBackground Component', () => {
    /** Store the original `getContext` implementation to restore it later. */
    let originalGetContext: typeof HTMLCanvasElement.prototype.getContext;

    /**
     * Setup before each test.
     * - Stubs global window properties and methods (`innerWidth`, `addEventListener`, `requestAnimationFrame`, etc.).
     * - Replaces the real `HTMLCanvasElement.prototype.getContext` with the mock.
     * - Sets a default return value for `mockRequestAnimationFrame`.
     * - Resets the body background style.
     * - Clears all mocks (global stubs, context mock) to ensure test isolation.
     */
    beforeEach(() => {
        // Stub global window properties/methods needed by the component
        vi.stubGlobal('innerWidth', initialWidth);
        vi.stubGlobal('innerHeight', initialHeight);
        vi.stubGlobal('devicePixelRatio', initialDPR);
        vi.stubGlobal('addEventListener', mockAddEventListener);
        vi.stubGlobal('removeEventListener', mockRemoveEventListener);
        vi.stubGlobal('requestAnimationFrame', mockRequestAnimationFrame);
        vi.stubGlobal('cancelAnimationFrame', mockCancelAnimationFrame);

        // Mock `getContext` on the Canvas prototype
        originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = mockGetContext;

        // Provide a default return value (dummy ID) for requestAnimationFrame
        mockRequestAnimationFrame.mockReturnValue(999);

        // Reset body background before each test
        document.body.style.background = '';

        // Reset mocks to ensure clean state for each test
        vi.clearAllMocks(); // Clears calls for stubGlobal mocks etc.
        mockGetContext.mockClear();
        mockCtx.mockClear(); // Clears calls for the context mock methods/properties
    });

    /**
     * Cleanup after each test.
     * - Restores the original `HTMLCanvasElement.prototype.getContext`.
     * - Removes all global stubs created with `vi.stubGlobal`.
     */
    afterEach(() => {
        // Restore original implementations
        HTMLCanvasElement.prototype.getContext = originalGetContext;
        vi.unstubAllGlobals(); // Clean up stubGlobal mocks
        // vi.restoreAllMocks(); // Only necessary if vi.spyOn was also used
    });

    /**
     * Test: Should render the main canvas element and a fallback div.
     * Checks for the presence and basic attributes (`aria-hidden`) of the canvas,
     * and the existence of the fallback element using its CSS classes.
     */
    it('should render a canvas element and a fallback div', () => {
        render(<AnimatedBackground />);
        const canvasElement = document.querySelector('canvas');
        expect(canvasElement).toBeInTheDocument();
        expect(canvasElement).toHaveAttribute('aria-hidden', 'true');
        // Check for the fallback div using its expected classes
        const fallbackDiv = document.querySelector('.fixed.inset-0.-z-20');
        expect(fallbackDiv).toBeInTheDocument();
    });

    /**
     * Test: Should get the canvas 2D context and set initial dimensions on mount.
     * Verifies that `getContext('2d')` is called, the canvas style dimensions (`width`, `height`)
     * are set based on window size, and the canvas element attributes (`width`, `height`)
     * are set correctly considering the device pixel ratio. Uses `waitFor` as these actions
     * likely occur within a `useEffect` hook.
     */
    it('should get the canvas context and set dimensions on mount', async () => {
        render(<AnimatedBackground />);
        const canvasElement = document.querySelector('canvas');

        // Check immediately if getContext was called synchronously (might depend on implementation)
        expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d', { alpha: true });

        // Wait for asynchronous effects (like dimension setting in useEffect) to complete
        await waitFor(() => {
            // Check if context scaling was applied based on DPR
            expect(mockCtx.scale).toHaveBeenCalledOnce();
            expect(mockCtx.scale).toHaveBeenCalledWith(initialDPR, initialDPR);
            // Check CSS dimensions
            expect(canvasElement?.style.width).toBe(`${initialWidth}px`);
            expect(canvasElement?.style.height).toBe(`${initialHeight}px`);
            // Check canvas buffer dimensions (considering DPR)
            expect(canvasElement).toHaveAttribute('width', `${initialWidth * initialDPR}`);
            expect(canvasElement).toHaveAttribute('height', `${initialHeight * initialDPR}`);
        });
    });

    /**
     * Test: Should set a fallback background style on the document body.
     * Verifies that the `document.body.style.background` property is set,
     * and specifically checks if it includes a linear gradient and a specific color.
     * Uses `waitFor` as this might happen in an effect.
     */
    it('should set the fallback background for body', async () => {
        render(<AnimatedBackground />);
        await waitFor(() => {
            // Check that *some* background was set
            expect(document.body.style.background).not.toBe('');
            // Perform more specific checks on the background value
            expect(document.body.style.background).toMatch(/linear-gradient/);
            expect(document.body.style.background).toContain('#0a1929'); // Example color
        });
    });

    /**
     * Test: Should add resize event listener and start the animation loop on mount.
     * Verifies that `window.addEventListener` is called for the 'resize' event
     * and `window.requestAnimationFrame` is called to initiate the animation.
     * Uses `waitFor` for effect execution.
     */
    it('should add event listener and start animation', async () => {
        render(<AnimatedBackground />);
        await waitFor(() => {
            // Check resize listener attachment
            expect(mockAddEventListener).toHaveBeenCalledOnce();
            expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
            // Check animation loop start
            expect(mockRequestAnimationFrame).toHaveBeenCalledOnce();
            expect(mockRequestAnimationFrame).toHaveBeenCalledWith(expect.any(Function));
        });
    });


    /**
     * Test: Should remove the resize listener and cancel the animation frame on unmount.
     * 1. Renders the component.
     * 2. Waits for the initial setup (`addEventListener` and `requestAnimationFrame`) to occur.
     * 3. Captures the specific listener function and animation frame ID that were used.
     * 4. Unmounts the component.
     * 5. Verifies that `removeEventListener` and `cancelAnimationFrame` were called with the captured listener and ID.
     * Increases the Jest timeout for this potentially longer test involving waitFor.
     */
    it('should remove listener and stop animation on unmount', async () => {
        const { unmount } = render(<AnimatedBackground />);
        let addedListener: any;
        let animationFrameId: number | undefined;

        // Wait for the component's effect to run and add the listener/start animation
        try {
            await waitFor(() => {
                // Ensure mocks have been called before accessing their args/results
                expect(mockAddEventListener).toHaveBeenCalledTimes(1);
                expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);

                // Capture the arguments *after* ensuring the calls happened
                addedListener = mockAddEventListener.mock.calls[0]?.[1];
                animationFrameId = mockRequestAnimationFrame.mock.results[0]?.value;

                // Add a check within waitFor to ensure values are defined before proceeding
                if (!addedListener || animationFrameId === undefined) {
                    throw new Error("Listener or Frame ID not captured yet within waitFor");
                }
            });
        } catch (error) {
            console.error("UNMOUNT TEST: Error during waitFor for setup:", error);
            throw error; // Fail the test if setup didn't complete
        }

        // Assert that the listener and ID were successfully captured
        expect(addedListener).toBeDefined();
        expect(animationFrameId).toBeDefined();
        // Ensure the captured ID is a number (or the specific dummy value we set)
        expect(typeof animationFrameId).toBe('number');


        // Unmount the component to trigger cleanup effects
        unmount();

        // Check that the cleanup functions were called with the correct arguments
        // No waitFor needed here typically, as unmount cleanup is usually synchronous
        expect(mockRemoveEventListener).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
        expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', addedListener);

        expect(mockCancelAnimationFrame).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
        expect(mockCancelAnimationFrame).toHaveBeenCalledWith(animationFrameId);

    }, 30000); // Increased timeout (30s) for safety, adjust if needed

    /**
     * Skipped Test: Acknowledges the difficulty of unit testing internal class logic.
     * Testing the behavior of internal helper classes like `Star` or `Glitter` directly
     * might require exporting them or restructuring the code, which is often not desirable.
     * Focus is on the component's interaction with the DOM and browser APIs.
     */
    it.skip('cannot easily test internal class logic (Star, Glitter etc.)', () => {});

    /**
     * Skipped Test: Acknowledges the limitation of unit/integration tests for visual output.
     * Verifying the actual pixels drawn on the canvas requires visual regression testing tools,
     * which are outside the scope of standard Jest/RTL tests.
     */
    it.skip('cannot test the actual visual result', () => {});
});
