import type { FC } from 'react';
import spoon from '../assets/images/spoon_3d.png';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

interface SpoonProps {
	className?: string;
	available?: boolean;
}

const Spoon: FC<SpoonProps> = ({ className, available = true }) => {
	const spoonRef = useRef(null);

	useGSAP(() => {
		gsap.from(spoonRef.current, {
			duration: 1,
			scale: 0,
			ease: 'back',
		});
	});

	return (
		<div ref={spoonRef} className={className}>
			<img
				src={spoon}
				alt="Spoon"
				className={`w-16 transition-all duration-300 ${
					available ? 'opacity-100 scale-100' : 'opacity-30 scale-75 grayscale'
				}`}
			/>
		</div>
	);
};

export default Spoon;
