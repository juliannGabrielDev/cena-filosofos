import type { FC } from 'react';
import spoon from '../assets/images/spoon_3d.png';

interface SpoonProps {
	className?: string;
	available?: boolean;
}

const Spoon: FC<SpoonProps> = ({ className, available = true }) => {
	return (
		<div className={className}>
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
