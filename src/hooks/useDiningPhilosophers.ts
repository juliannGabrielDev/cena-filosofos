import { useState, useEffect, useCallback, useRef } from 'react';

// Estado posible de cada filósofo
type PhilosopherState = 'thinking' | 'hungry' | 'eating' | undefined;

// Constantes de la simulación
const NUM_PHILOSOPHERS = 5;
const THINKING_TIME = 5000; // tiempo (ms) que pasa pensando
const EATING_TIME = 4000; // tiempo (ms) que pasa comiendo
const RETRY_TIME = 800; // tiempo (ms) antes de reintentar tomar cucharas

/**
 * Hook que simula el problema de los filósofos comensales.
 * Retorna el estado de los filósofos, el estado de las cucharas y funciones
 * para controlar la simulación (start, stop, reset).
 *
 * Contrato (entrada/salida):
 * - Entrada: ninguna.
 * - Salida: { philosophers, spoons, isRunning, start, stop, reset }
 *   - philosophers: array con el estado de cada filósofo
 *   - spoons: array booleano indicando si cada cuchara está disponible
 *   - isRunning: booleano indicando si la simulación está activa
 *   - start/stop/reset: controladores de la simulación
 */
export const useDiningPhilosophers = () => {
	// Estado local: estados de cada filósofo (thinking/hungry/eating/undefined)
	const [philosophers, setPhilosophers] = useState<PhilosopherState[]>(
		Array(NUM_PHILOSOPHERS).fill(undefined)
	);

	// Estado local: disponibilidad de cucharas (true = disponible)
	// Hay tantas cucharas como filósofos (una entre cada par adyacente)
	const [spoons, setSpoons] = useState<boolean[]>(
		Array(NUM_PHILOSOPHERS).fill(true)
	);

	// Indica si la simulación está corriendo
	const [isRunning, setIsRunning] = useState(false);

	// Referencia para almacenar timeouts por filósofo y poder limpiarlos
	const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

	// Referencia mutable para leer rápidamente si la simulación está activa
	// dentro de callbacks asincrónicos sin depender de closures
	const isRunningRef = useRef(isRunning);

	// Sincroniza la ref cuando cambia el estado isRunning normal
	useEffect(() => {
		isRunningRef.current = isRunning;
	}, [isRunning]);

	// Índice de la cuchara izquierda para un filósofo dado (misma posición)
	const getLeftSpoon = (philosopherIndex: number): number => {
		return philosopherIndex;
	};

	// Índice de la cuchara derecha (siguiente, con wrap-around)
	const getRightSpoon = (philosopherIndex: number): number => {
		return (philosopherIndex + 1) % NUM_PHILOSOPHERS;
	};

	/**
	 * Ciclo de vida de un filósofo:
	 * - Si está undefined: lo inicializamos como 'thinking' y programamos siguiente paso
	 * - Si está 'thinking': pasa a 'hungry' y trata inmediatamente de tomar cucharas
	 * - Si está 'hungry': intenta tomar ambas cucharas; si puede, cambia a 'eating'
	 *   y programa terminar de comer; si no puede, reintenta tras RETRY_TIME
	 */
	const runPhilosopherCycle = useCallback((philosopherIndex: number) => {
		// Si la simulación ya no corre, no hacemos nada
		if (!isRunningRef.current) return;

		// Limpiar timeout anterior para evitar duplicados
		const existingTimeout = timeoutsRef.current.get(philosopherIndex);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
		}

		setPhilosophers((prev) => {
			const newState = [...prev];
			const currentState = prev[philosopherIndex];

			// Estado inicial: pasar a pensando
			if (currentState === undefined) {
				newState[philosopherIndex] = 'thinking';

				// Después de THINKING_TIME vuelve a ejecutar su ciclo
				const timeout = setTimeout(() => {
					runPhilosopherCycle(philosopherIndex);
				}, THINKING_TIME);
				timeoutsRef.current.set(philosopherIndex, timeout);

				return newState;
			} else if (currentState === 'thinking') {
				// Termina de pensar -> tiene hambre
				newState[philosopherIndex] = 'hungry';

				// Intentar inmediatamente recoger cucharas (pequeña demora para dar tiempo a otros)
				const timeout = setTimeout(() => {
					runPhilosopherCycle(philosopherIndex);
				}, 100);
				timeoutsRef.current.set(philosopherIndex, timeout);

				return newState;
			} else if (currentState === 'hungry') {
				// Intentar coger la cuchara izquierda y derecha
				const leftSpoonIndex = getLeftSpoon(philosopherIndex);
				const rightSpoonIndex = getRightSpoon(philosopherIndex);

				setSpoons((currentSpoons) => {
					// Si ambas cucharas están disponibles, las toma y comienza a comer
					if (
						currentSpoons[leftSpoonIndex] &&
						currentSpoons[rightSpoonIndex]
					) {
						const newSpoons = [...currentSpoons];
						newSpoons[leftSpoonIndex] = false;
						newSpoons[rightSpoonIndex] = false;

						// Cambiar estado a 'eating'
						setPhilosophers((p) => {
							const updated = [...p];
							updated[philosopherIndex] = 'eating';
							return updated;
						});

						// Programar fin de comer: soltar cucharas y volver a 'thinking'
						const timeout = setTimeout(() => {
							// Devolver las cucharas
							setSpoons((s) => {
								const updatedSpoons = [...s];
								updatedSpoons[leftSpoonIndex] = true;
								updatedSpoons[rightSpoonIndex] = true;
								return updatedSpoons;
							});

							// Volver a pensar
							setPhilosophers((p) => {
								const updated = [...p];
								updated[philosopherIndex] = 'thinking';
								return updated;
							});

							// Tras THINKING_TIME, continuar ciclo
							const thinkTimeout = setTimeout(() => {
								runPhilosopherCycle(philosopherIndex);
							}, THINKING_TIME);
							timeoutsRef.current.set(philosopherIndex, thinkTimeout);
						}, EATING_TIME);

						timeoutsRef.current.set(philosopherIndex, timeout);

						return newSpoons;
					} else {
						// Alguna cuchara no está disponible: reintentar tras RETRY_TIME
						const timeout = setTimeout(() => {
							runPhilosopherCycle(philosopherIndex);
						}, RETRY_TIME);
						timeoutsRef.current.set(philosopherIndex, timeout);

						// No cambiamos el estado de las cucharas
						return currentSpoons;
					}
				});

				return newState;
			}

			return newState;
		});
	}, []);

	// Iniciar la simulación: cambia el flag isRunning
	const start = useCallback(() => {
		setIsRunning(true);
	}, []);

	// Parar la simulación: limpia timeouts y resetea el estado de filósofos
	const stop = useCallback(() => {
		setIsRunning(false);
		// Limpiar todos los timeouts activos
		timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
		timeoutsRef.current.clear();
		// Reiniciar estado de filósofos (vuelve a undefined)
		setPhilosophers(Array(NUM_PHILOSOPHERS).fill(undefined));
	}, []);

	// Reset completo: parar y restaurar cucharas y filósofos
	const reset = useCallback(() => {
		stop();
		setPhilosophers(Array(NUM_PHILOSOPHERS).fill(undefined));
		setSpoons(Array(NUM_PHILOSOPHERS).fill(true));
	}, [stop]);

	// Efecto que arranca/para la simulación y programa el inicio de cada filósofo
	useEffect(() => {
		if (isRunning) {
			// Arrancar cada filósofo con un pequeño desfase para reducir contención
			for (let i = 0; i < NUM_PHILOSOPHERS; i++) {
				const delay = i * 800; // retraso entre cada filósofo al iniciar
				const timeout = setTimeout(() => {
					runPhilosopherCycle(i);
				}, delay);
				timeoutsRef.current.set(i, timeout);
			}
		} else {
			// Si no está corriendo, limpiar todos los timeouts
			timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
			timeoutsRef.current.clear();
		}

		// Limpieza al desmontar o al cambiar isRunning
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
