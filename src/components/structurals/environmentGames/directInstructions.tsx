import React from 'react';
import Environment from './environment';
import ChatComponent from '../side/general/Chat';
import Side from '../side/Side';
import PointerIndicator from '../side/visualization/PointerIndicator';
import CameraSelector from '../side/general/CameraPicker';
import { Users } from '../../../enum/Chat';

const DirectInstructions: React.FC = () => {
	return (
		<main>
			<div id="mainView">
				<PointerIndicator />
				<CameraSelector />
				<Environment />
			</div>
			<Side>
				<ChatComponent availableUsers={[Users.ARCHITECT]} />
			</Side>
		</main>
	);
};

export default DirectInstructions;
