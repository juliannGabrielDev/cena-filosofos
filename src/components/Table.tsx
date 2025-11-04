import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { FC } from 'react';
import { useRef } from 'react';

interface TableProps {
	className?: string;
	startAnimation: boolean;
}

const Table: FC<TableProps> = ({ className, startAnimation }) => {
	const tableRef = useRef(null);

	useGSAP(
		() => {
			if (startAnimation) {
				gsap.from(tableRef.current, {
					duration: 1,
					scale: 0,
					ease: 'back',
					delay: 0.5,
				});
			}
		},
		{ dependencies: [startAnimation] }
	);

	return (
		<div
			ref={tableRef}
			className={`${className} size-60 bg-stone-600 rounded-full`}
		></div>
	);
};

export default Table;