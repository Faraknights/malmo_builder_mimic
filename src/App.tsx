import React, { useState } from 'react';
import './styles/app.scss';
import {GameMode} from './interfaces/mode';
import Header from './components/structurals/Header';
import Simulation from './components/structurals/Simulation';
import Visualization from './components/structurals/Visualization';
import { GlobalEnvironmentModeProvider } from './classes/EnvironmentMode';

const App = () => {
    const [gameMode, setGameMode] = useState<GameMode>(GameMode.VISUALIZATION);

	return (
		<GlobalEnvironmentModeProvider>
			<>
				<Header 
					currentGameMode={gameMode} 
					setGameMode={setGameMode}
				/>
				{gameMode === GameMode.SIMULATION && 
					<Simulation />
				}
				{gameMode === GameMode.VISUALIZATION && 
					<Visualization />
				}
			</>
		</GlobalEnvironmentModeProvider>
	);
}

export default App;
