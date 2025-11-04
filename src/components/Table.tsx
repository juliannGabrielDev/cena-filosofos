import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { FC } from 'react';
import { useRef } from 'react';

interface TableProps {
	className?: string;
}

const Table: FC<TableProps> = ({ className }) => {
	const tableRef = useRef(null);

	useGSAP(() => {
		gsap.from(tableRef.current, {
			duration: 1,
			scale: 0,
			ease: 'back',
		});
	});

	return (
		<div
			ref={tableRef}
			className={`${className} size-60 bg-stone-600 rounded-full`}
		></div>
	);
};

export default Table;