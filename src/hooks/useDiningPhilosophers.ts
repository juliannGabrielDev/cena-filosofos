import { useState, useEffect, useCallback, useRef } from 'react';

type PhilosopherState = 'thinking' | 'hungry' | 'eating' | undefined;

const NUM_PHILOSOPHERS = 5;
const THINKING_TIME = 5000; // 5 seconds
const EATING_TIME = 4000; // 4 seconds
const RETRY_TIME = 800; // 800ms to retry picking up spoons

export const useDiningPhilosophers = () => {
	const [philosophers, setPhilosophers] = useState<PhilosopherState[]>(
		Array(NUM_PHILOSOPHERS).fill(undefined)
	);
	const [spoons, setSpoons] = useState<boolean[]>(
		Array(NUM_PHILOSOPHERS).fill(true)
	);
	const [isRunning, setIsRunning] = useState(false);

	const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
	const isRunningRef = useRef(isRunning);

	// Update ref when isRunning changes
	useEffect(() => {
		isRunningRef.current = isRunning;
	}, [isRunning]);

	// Get the left spoon index for a philosopher
	const getLeftSpoon = (philosopherIndex: number): number => {
		return philosopherIndex;
	};

	// Get the right spoon index for a philosopher
	const getRightSpoon = (philosopherIndex: number): number => {
		return (philosopherIndex + 1) % NUM_PHILOSOPHERS;
	};

	// Philosopher lifecycle simulation
	const runPhilosopherCycle = useCallback((philosopherIndex: number) => {
		if (!isRunningRef.current) return;

		// Clear any existing timeout for this philosopher
		const existingTimeout = timeoutsRef.current.get(philosopherIndex);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
		}

		setPhilosophers((prev) => {
			const newState = [...prev];
			const currentState = prev[philosopherIndex];

			// Initialize philosopher to thinking if undefined
			if (currentState === undefined) {
				newState[philosopherIndex] = 'thinking';

				// Schedule next cycle
				const timeout = setTimeout(() => {
					runPhilosopherCycle(philosopherIndex);
				}, THINKING_TIME);
				timeoutsRef.current.set(philosopherIndex, timeout);

				return newState;
			} else if (currentState === 'thinking') {
				// Finished thinking, now hungry
				newState[philosopherIndex] = 'hungry';

				// Immediately try to pick up spoons
				const timeout = setTimeout(() => {
					runPhilosopherCycle(philosopherIndex);
				}, 100);
				timeoutsRef.current.set(philosopherIndex, timeout);

				return newState;
			} else if (currentState === 'hungry') {
				// Try to pick up spoons
				const leftSpoonIndex = getLeftSpoon(philosopherIndex);
				const rightSpoonIndex = getRightSpoon(philosopherIndex);

				setSpoons((currentSpoons) => {
					// Check if both spoons are available
					if (
						currentSpoons[leftSpoonIndex] &&
						currentSpoons[rightSpoonIndex]
					) {
						// Pick up both spoons
						const newSpoons = [...currentSpoons];
						newSpoons[leftSpoonIndex] = false;
						newSpoons[rightSpoonIndex] = false;

						// Start eating
						setPhilosophers((p) => {
							const updated = [...p];
							updated[philosopherIndex] = 'eating';
							return updated;
						});

						// Schedule finishing eating
						const timeout = setTimeout(() => {
							// Put down spoons
							setSpoons((s) => {
								const updatedSpoons = [...s];
								updatedSpoons[leftSpoonIndex] = true;
								updatedSpoons[rightSpoonIndex] = true;
								return updatedSpoons;
							});

							// Start thinking
							setPhilosophers((p) => {
								const updated = [...p];
								updated[philosopherIndex] = 'thinking';
								return updated;
							});

							// After thinking time, continue cycle
							const thinkTimeout = setTimeout(() => {
								runPhilosopherCycle(philosopherIndex);
							}, THINKING_TIME);
							timeoutsRef.current.set(philosopherIndex, thinkTimeout);
						}, EATING_TIME);

						timeoutsRef.current.set(philosopherIndex, timeout);

						return newSpoons;
					} else {
						// Spoons not available, retry after a short delay
						const timeout = setTimeout(() => {
							runPhilosopherCycle(philosopherIndex);
						}, RETRY_TIME);
						timeoutsRef.current.set(philosopherIndex, timeout);

						return currentSpoons;
					}
				});

				return newState;
			}

			return newState;
		});
	}, []);

	// Start simulation
	const start = useCallback(() => {
		setIsRunning(true);
	}, []);

	// Stop simulation
	const stop = useCallback(() => {
		setIsRunning(false);
		// Clear all timeouts
		timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
		timeoutsRef.current.clear();
		// Reset philosophers to default state
		setPhilosophers(Array(NUM_PHILOSOPHERS).fill(undefined));
	}, []);

	// Reset simulation
	const reset = useCallback(() => {
		stop();
		setPhilosophers(Array(NUM_PHILOSOPHERS).fill(undefined));
		setSpoons(Array(NUM_PHILOSOPHERS).fill(true));
	}, [stop]);

	// Effect to manage simulation
	useEffect(() => {
		if (isRunning) {
			// Start simulation for each philosopher with a slight delay between them
			// to avoid all philosophers trying to pick up spoons at the same time
			for (let i = 0; i < NUM_PHILOSOPHERS; i++) {
				const delay = i * 800; // 800ms delay between each philosopher starting
				const timeout = setTimeout(() => {
					runPhilosopherCycle(i);
				}, delay);
				timeoutsRef.current.set(i, timeout);
			}
		} else {
			// Stop all philosophers
			timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			timeoutsRef.current.clear();
		}

		return () => {
			timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			timeoutsRef.current.clear();
		};
	}, [isRunning, runPhilosopherCycle]);

	return {
		philosophers,
		spoons,
		isRunning,
		start,
		stop,
		reset,
	};
};
