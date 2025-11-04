import type { FC } from 'react';
import philosopher from '../assets/images/philosopher.png';
import thinkingFace from '../assets/images/thinking/thinking_face_3d.png';
import thoughtBalloon from '../assets/images/thinking/thought_balloon_3d.png';
import curryRice from '../assets/images/eating/curry_rice_3d.png';
import faceSavoringFood from '../assets/images/eating/face_savoring_food_3d.png';
import tiredFace from '../assets/images/hungry/tired_face_3d.png';

interface PhilosopherProps {
	className?: string;
	state?: 'thinking' | 'hungry' | 'eating';
}

interface StateImage {
	src: string;
	alt: string;
}

interface StateConfig {
	bgColor: string;
	images: StateImage[];
}

const STATE_CONFIG: Record<string, StateConfig> = {
	thinking: {
		bgColor: 'bg-green-400',
		images: [
			{ src: thinkingFace, alt: 'Thinking Face' },
			{ src: thoughtBalloon, alt: 'Thought Balloon' },
		],
	},
	hungry: {
		bgColor: 'bg-yellow-400',
		images: [{ src: tiredFace, alt: 'Tired Face' }],
	},
	eating: {
		bgColor: 'bg-red-400',
		images: [
			{ src: curryRice, alt: 'Curry Rice' },
			{ src: faceSavoringFood, alt: 'Face Savoring Food' },
		],
	},
};

const Philosopher: FC<PhilosopherProps> = ({ className = '', state }) => {
	// Estado por defecto
	if (!state) {
		return (
			<div className={`${className} p-4`}>
				<img className="w-28" src={philosopher} alt="Philosopher" />
			</div>
		);
	}

	const config = STATE_CONFIG[state];
	const containerClasses = `${className} ${config.bgColor} flex p-4 rounded-2xl`;

	return (
		<div className={containerClasses}>
			{config.images.map((image, index) => (
				<img
					key={`${state}-${index}`}
					className="w-28"
					src={image.src}
					alt={image.alt}
				/>
			))}
		</div>
	);
};

export default Philosopher;
