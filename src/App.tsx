import { useState } from 'react';
import './styles/app.scss';
import {GameMode, gameModeComponent} from './interfaces/mode';
import Header from './components/structurals/Header';
import { GlobalEnvironmentModeProvider } from './classes/EnvironmentMode';

const App = () => {
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.VISUALIZATION);
    const GameModeComp = gameModeComponent[gameMode];

	return (
		<GlobalEnvironmentModeProvider>
			<>
				<Header 
					currentGameMode={gameMode} 
					setGameMode={setGameMode}
				/>
				<GameModeComp />
			</>
		</GlobalEnvironmentModeProvider>
	);
}

export default App;
