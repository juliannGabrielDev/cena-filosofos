import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import type { FC } from 'react';
import logo from '../assets/images/logo.svg';

interface PageRevealProps {
	onComplete: () => void;
}

const PageReveal: FC<PageRevealProps> = ({ onComplete }) => {
	const revealMask = useRef<HTMLDivElement | null>(null);

	useGSAP(() => {
		const maxSize = Math.max(window.innerWidth, window.innerHeight) * 2;

		const timeline = gsap.timeline({
			onComplete,
		});

		timeline.to(revealMask.current, {
			width: maxSize,
			height: maxSize,
			duration: 0.75,
			ease: 'power2.inOut',
		});
	});

	return (
		<div className="page-reveal">
			<div className="content-wrapper">
				<div ref={revealMask} className="reveal-mask">
					<img src={logo} className="mask-svg" alt="Logo" />
				</div>
			</div>
		</div>
	);
};

export default PageReveal;