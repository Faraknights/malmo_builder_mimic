import React from 'react';
import Environment from './environment';
import Side from '../side/Side';
import ChatComponent from '../side/general/Chat';
import CameraSelector from '../side/general/CameraPicker';
import { Users } from '../../../enum/Chat';
import PointerIndicator from '../side/visualization/PointerIndicator';

const Nebula: React.FC = () => {
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

export default Nebula;
