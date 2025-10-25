import React from "react";
import { useCounter } from '@hooks';

const CounterApp: React.FC = () => {
	const { count, increment, decrement } = useCounter();

	return (
		<div className="flex flex-col gap-2">
			<h1>Counter: {count}</h1>
			<button className="rounded border border-yellow-500" onClick={increment}>Increment +1</button>
			<button className="rounded border border-yellow-500" onClick={decrement}>Decrement -1 </button>
		</div>
	);
};

export default CounterApp;
