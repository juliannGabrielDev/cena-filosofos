import type { FC } from 'react';

interface ButtonProps {
	children?: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const Button: FC<ButtonProps> = ({ children, onClick, className }) => {
	return (
		<button
			onClick={onClick}
			className={`${className} w-fit px-4 py-2 text-neutral-50 font-semibold bg-neutral-900 rounded-xl shadow-[0px_5px_0px_0px] shadow-neutral-50 active:shadow-[0px_0px_0px_0px] transition-all active:translate-y-0.5`}
		>
			{children}
		</button>
	);
};

export default Button;
