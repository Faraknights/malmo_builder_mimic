import React from 'react';
import Header from './components/structurals/Header';
import { EnvironmentMode } from './enum/EnvironmentMode';
import { GlobalStateProvider } from './components/structurals/GlobalStateProvider';
import GameCompSelector from './components/structurals/GameCompSelector';
import { GameMode } from './enum/GameMode';

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
