import type { FC } from 'react'

interface TableProps {
	className?: string;
}

const Table: FC<TableProps> = ({className}) => {

	return (
		<div className={`${className} size-60 bg-stone-600 rounded-full`}></div>
	)
}

export default Table;