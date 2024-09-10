import React from 'react';
import { GameMode } from './classes/gameMode';
import Header from './components/structurals/Header';
import { EnvironmentMode } from './classes/EnvironmentMode';
import { gameModeComponent } from './constants/environment';
import { GlobalStateProvider } from './components/structurals/GlobalStateProvider';
import GameCompSelector from './components/structurals/GameCompSelector';

const App = ({
	initialEnvironmentMode,
	initialGameMode,
}: {
	initialEnvironmentMode: EnvironmentMode;
	initialGameMode: GameMode;
}) => {
	return (
		<GlobalStateProvider initialEnvironmentMode={initialEnvironmentMode} initialGameMode={initialGameMode}>
			<Header />
			<GameCompSelector />
		</GlobalStateProvider>
	);
};

export default App;
