import React from 'react';
import reportWebVitals from '../../src/reportWebVitals';
import { GameMode } from '../../src/classes/gameMode';
import { EnvironmentMode } from '../../src/classes/EnvironmentMode';
import { gameModesAvailable } from '../../src/constants/environment';
import App from '../../src/App';

interface PageProps {
	initialGameMode: GameMode;
	initialEnvironmentMode: EnvironmentMode;
}

const Root: React.FC<PageProps> = ({
	initialGameMode,
	initialEnvironmentMode,
}) => {
	return (
		<div id="root">
			<App
				initialEnvironmentMode={initialEnvironmentMode}
				initialGameMode={initialGameMode}
			/>
		</div>
	);
};

export default Root;

reportWebVitals();

export async function getStaticPaths() {
	type Path = {
		params: {
			gameMode: string;
			environmentMode: string;
		};
	};

	const paths: Path[] = [];
	for (const environmentMode of Object.values(EnvironmentMode)) {
		for (const gameMode of gameModesAvailable[environmentMode]) {
			paths.push({
				params: {
					gameMode: gameMode.toLowerCase(),
					environmentMode: environmentMode.toLowerCase(),
				},
			});
		}
	}

	return {
		paths,
		fallback: false, // Indicates to Next.js to return a 404 error if the path is not predefined
	};
}

export async function getStaticProps({
	params,
}: {
	params: { gameMode: string; environmentMode: string };
}) {
	const { gameMode, environmentMode } = params;

	// Convert the string parameters back to the appropriate enum values
	const initialGameMode = gameMode.toUpperCase() as GameMode;
	const initialEnvironmentMode =
		environmentMode.toUpperCase() as EnvironmentMode;

	return {
		props: {
			initialGameMode,
			initialEnvironmentMode,
		},
	};
}
