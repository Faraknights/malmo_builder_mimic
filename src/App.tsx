import {GameMode} from './classes/gameMode';
import Header from './components/structurals/Header';
import { EnvironmentMode } from './classes/EnvironmentMode';
import { gameModeComponent } from './constants/environment';
import { useState } from 'react';

const App = ({initialEnvironmentMode, initialGameMode}: {
	initialEnvironmentMode: EnvironmentMode,
	initialGameMode: GameMode
}) => {
	const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>(initialEnvironmentMode);
	const [gameMode, setGameMode] = useState<GameMode>(initialGameMode);

    const GameModeComp = gameModeComponent[gameMode];

	return (
		<>
			<Header 
				currentGameMode={gameMode} 
				setGameMode={setGameMode}
				environmentMode={environmentMode}
				setEnvironmentMode={setEnvironmentMode}
			/>
			<GameModeComp environmentMode={environmentMode} />
		</>
	);
}

export default App;
