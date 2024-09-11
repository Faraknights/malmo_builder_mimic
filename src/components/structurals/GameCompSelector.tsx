import React from 'react';
import { gameModeComponent } from '../../constants/ENVIRONMENT_CONSTANTS';
import { useGlobalState } from './GlobalStateProvider';

const GameCompSelector: React.FC = () => {
	const {
		gameMode: { gameMode },
	} = useGlobalState();

	const GameModeComp = gameModeComponent[gameMode];

	return <GameModeComp />;
};

export default GameCompSelector;
