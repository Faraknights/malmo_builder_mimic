import React from 'react';
import Environment from './environment';
import Side from './Side';
import ChatComponent, { Users } from './Chat';
import CameraSelector from './simulation/CameraPicker';

const Nebula: React.FC = () => {
	return (
		<main>
			<div id="mainView">
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
