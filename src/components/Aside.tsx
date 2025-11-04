import { useState, type FC, useRef } from 'react';
import Button from './Button';
import backgroundImage from '../assets/images/bg.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface AsideProps {
	isRunning: boolean;
	onStart: () => void;
	onStop: () => void;
	onReset: () => void;
}

const Aside: FC<AsideProps> = ({ isRunning, onStart, onStop, onReset }) => {
	const [openSection, setOpenSection] = useState<number | null>(null);
	const container = useRef(null);

	useGSAP(
		() => {
			gsap.from('.animate-section', {
				duration: 0.5,
				y: 30,
				opacity: 0,
				stagger: 0.2,
				ease: 'power2.out'
			});
		},
		{ scope: container }
	);

	const toggleSection = (index: number) => {
		setOpenSection(openSection === index ? null : index);
	};

	return (
		<aside
			ref={container}
			className="p-5 flex flex-col h-fit rounded-2xl bg-cover bg-center relative"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className="absolute inset-0 bg-black opacity-20 rounded-2xl"></div>
			<div className="relative z-10">
				{/* Controles de simulación */}
				<div className="mb-6 text-white animate-section">
					<h2 className="text-2xl text-white mb-3 font-bitcount">Controles</h2>
					<div className="flex flex-col gap-2">
						{!isRunning ? (
							<Button onClick={onStart} className="w-full mb-2">
								Iniciar Simulación
							</Button>
						) : (
							<Button onClick={onStop} className="w-full bg-red-950 mb-2">
								Detener Simulación
							</Button>
						)}
						<Button onClick={onReset} className="w-full">
							Reiniciar
						</Button>
					</div>
				</div>

				{/* Leyenda de estados */}
				<div className="mb-6 text-white animate-section">
					<h2 className="text-2xl text-white mb-3 font-bitcount">Estados</h2>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-green-400 rounded"></div>
							<span>Pensando</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-yellow-400 rounded"></div>
							<span>Hambriento</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-red-400 rounded"></div>
							<span>Comiendo</span>
						</div>
					</div>
				</div>

				{/* Section 1: Información */}
				<div className="rounded-t-2xl animate-section">
					<button
						className="w-full text-left px-4 py-2 font-semibold bg-white hover:bg-blue-50 focus:outline-none rounded-t-2xl"
						onClick={() => toggleSection(0)}
					>
						<h2 className="h2 inline-block text-black">Información</h2>
						<span className="float-right"></span>
					</button>
					{openSection === 0 && (
						<div className="p-4 bg-white">
							<p>
								El problema de la cena de los filósofos fue planteado por Edsger
								Dijkstra en 1965 como una metáfora para ilustrar los
								desafíos de la sincronización de procesos y la evitación de
								interbloqueos (deadlocks) en sistemas concurrentes.
							</p>
						</div>
					)}
				</div>

				{/* Section 2: Reglas */}
				<div className="rounded-b-2xl animate-section">
					<button
						className={`w-full text-left px-4 py-2 font-semibold bg-white hover:bg-blue-50 focus:outline-none ${
							openSection === 1 ? 'rounded-0' : 'rounded-b-2xl'
						}`}
						onClick={() => toggleSection(1)}
					>
						<h2 className="h2 inline-block text-black">Reglas</h2>
						<span className="float-right"></span>
					</button>
					{openSection === 1 && (
						<div className="p-4 bg-white">
							<ol className="list-decimal list-inside">
								<li>
									Un filósofo solo puede comer si tiene ambas cucharas (la de
									la izquierda y la de la derecha).
								</li>
								<li>
									Un filósofo solo puede tomar una cuchara si está
									disponible.
								</li>
								<li>
									Después de comer, un filósofo debe dejar ambas cucharas en
									la mesa.
								</li>
								<li>
									Los filósofos piensan cuando no están comiendo.
								</li>
							</ol>
						</div>
					)}
				</div>
			</div>
		</aside>
	);
};

export default Aside;
