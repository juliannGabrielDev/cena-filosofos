import type { FC } from 'react';
import Philosopher from './components/Philosopher';
import Aside from './components/Aside';
import Table from './components/Table';
import Spoon from './components/Spoon';
import { useDiningPhilosophers } from './hooks/useDiningPhilosophers';
import logo from './assets/images/logo.svg';
import Footer from './components/Footer';
import githubIcon from './assets/images/github_light.svg';

const App: FC = () => {
	const { philosophers, spoons, isRunning, start, stop, reset } =
		useDiningPhilosophers();

	return (
		<>
			<div className="max-w-7xl mx-auto">
				<header className="flex items-center p-2 sm:p-10 bg-white gap-2 sm:gap-3">
					<img
						src={logo}
						alt="Logo"
						className="w-5 sm:w-6 -translate-y-0.5"
					/>
					<h1 className="text-xl sm:text-2xl font-bitcount leading-normal sm:leading-none">
						La Cena de los Filósofos
					</h1>
					<a
						href="https://github.com/juliannGabrielDev/ram-simulator"
						target="_blank"
						rel="noopener noreferrer"
						className="ml-auto"
					>
						<img
							src={githubIcon}
							alt="GitHub"
							className="w-5 h-5 sm:w-6 sm:h-6"
						/>
					</a>
				</header>
				<div className="grid grid-cols-[300px_1fr] gap-6 bg-white p-6 pt-0 font-inter">
					<Aside
						isRunning={isRunning}
						onStart={start}
						onStop={stop}
						onReset={reset}
					/>
					<div className="relative flex items-center justify-center h-screen border-2 border-[rgb(156_163_175)] bg-white overflow-hidden">
						{/* Mesa en el centro */}
						<Table className="z-10" />

						{/* Cucharas distribuidas entre los filósofos */}
						{/* Cuchara 0 - Entre filósofo 0 y 1 (arriba derecha) */}
						<Spoon
							className="absolute top-[10%] right-[25%] z-20"
							available={spoons[0]}
						/>

						{/* Cuchara 1 - Entre filósofo 1 y 2 (derecha) */}
						<Spoon
							className="absolute top-1/2 -translate-y-1/2 right-[8%] z-20"
							available={spoons[1]}
						/>

						{/* Cuchara 2 - Entre filósofo 2 y 3 (abajo centro) */}
						<Spoon
							className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20"
							available={spoons[2]}
						/>

						{/* Cuchara 3 - Entre filósofo 3 y 4 (izquierda) */}
						<Spoon
							className="absolute top-1/2 -translate-y-1/2 left-[8%] z-20"
							available={spoons[3]}
						/>

						{/* Cuchara 4 - Entre filósofo 4 y 0 (arriba izquierda) */}
						<Spoon
							className="absolute top-[10%] left-[25%] z-20"
							available={spoons[4]}
						/>

						{/* Filósofos distribuidos en círculo alrededor de la mesa */}
						{/* Filósofo 0 - Arriba */}
						<Philosopher
							className="absolute top-[5%] left-1/2 -translate-x-1/2"
							state={philosophers[0]}
						/>

						{/* Filósofo 1 - Derecha superior */}
						<Philosopher
							className="absolute top-[18%] right-[15%]"
							state={philosophers[1]}
						/>

						{/* Filósofo 2 - Derecha inferior */}
						<Philosopher
							className="absolute bottom-[15%] right-[15%]"
							state={philosophers[2]}
						/>

						{/* Filósofo 3 - Izquierda inferior */}
						<Philosopher
							className="absolute bottom-[15%] left-[15%]"
							state={philosophers[3]}
						/>

						{/* Filósofo 4 - Izquierda superior */}
						<Philosopher
							className="absolute top-[18%] left-[15%]"
							state={philosophers[4]}
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default App;
