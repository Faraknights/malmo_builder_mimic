import React, { useState } from 'react';
import { useRouter } from 'next/router';

//
const Home: React.FC = () => {
	const router = useRouter();
	const [clicked, setClicked] = useState(false);

	const navigateToSimulator = () => {
		setClicked(true);
		router.push('/simulation/minecraft');
	};

	return (
		<div id="homepage">
			<h1>
				Welcome on our simulator for the <br />
				<span>project COCOBOTS</span>
			</h1>
			<img src={`${router.basePath}/assets/images/logo_cocobots.png`} alt="Logo of Cocobots" />
			<button onClick={navigateToSimulator}>
				{clicked ? (
					<img src={`${router.basePath}/assets/images/loading_horizontal.gif`} alt="loading" />
				) : (
					<span>Try it out !</span>
				)}
			</button>
		</div>
	);
};

export default Home;
