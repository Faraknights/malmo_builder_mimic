import React from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
	const router = useRouter();

	const navigateToSimulator = () => {
		router.push('/simulation/minecraft');
	};

	return (
		<div>
			<h1>Welcome on our simulator for the project COCOPIL and COCOBOTS</h1>
			<div>
				<div>
					<h2>If you want to see more</h2>
				</div>
				<div>
					<h2>Access the simulator</h2>
					<button onClick={navigateToSimulator}>Access</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
