import React, { useState } from 'react';
import './styles/app.scss';
import {Mode} from './interfaces/mode';
import Header from './components/structurals/Header';
import Simulation from './components/structurals/Simulation';
import Visualization from './components/structurals/Visualization';

const App = () => {
    const [mode, setMode] = useState<Mode>(Mode.VISUALIZATION);

	return (
		<>
			<Header currentMode={mode} setMode={setMode} />
			{mode === Mode.SIMULATION && 
				<Simulation />
			}
			{mode === Mode.VISUALIZATION && 
				<Visualization />
			}
		</>
	);
}

export default App;
