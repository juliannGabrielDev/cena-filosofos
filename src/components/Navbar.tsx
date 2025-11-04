import githubIcon from '../assets/images/github_light.svg';
import logo from '../assets/images/logo.svg';
import type { FC } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useRef } from 'react';

gsap.registerPlugin(TextPlugin);

const Navbar: FC = () => {
	const githubRef = useRef(null);

	useGSAP(() => {
		gsap.to('h1', {
			duration: 2,
			text: 'La Cena de los Filósofos',
			ease: 'none',
		});

		gsap.from(githubRef.current, {
			duration: 1,
			scale: 0,
			ease: 'back',
		});
	});
	return (
		<header className="flex items-center p-2 sm:p-10 bg-white gap-2 sm:gap-3">
			<img
				src={logo}
				alt="Logo"
				className="w-5 sm:w-6 -translate-y-0.5"
			/>
			<h1 className="text-xl sm:text-2xl font-bitcount leading-normal sm:leading-none"></h1>
			<a
				href="https://github.com/juliannGabrielDev/cena-filosofos"
				target="_blank"
				rel="noopener noreferrer"
				className="ml-auto"
			>
				<img
					ref={githubRef}
					src={githubIcon}
					alt="GitHub"
					className="w-5 h-5 sm:w-6 sm:h-6"
				/>
			</a>
		</header>
	);
};

export default Navbar;
