import React, { useState } from 'react';
import { useRouter } from 'next/router';

//
const Home: React.FC = () => {
	const router = useRouter();
	const [clicked, setClicked] = useState(false);

	const navigateToSimulator = () => {
		setClicked(true);
		router.push('/simulation/cocoreli');
	};

	return (
		<div id="homepage">
			<h1>
				Welcome to the simulator for the <br />
				<span>project COCORELI</span>
			</h1>
			<img src={`${router.basePath}/assets/images/logo_cocoreli.png`} alt="Logo of ENVIRONMENT" />
			<button onMouseDown={navigateToSimulator}>
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
