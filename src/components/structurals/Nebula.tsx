import React from 'react';
import Environment from './environment';
import Side from './Side';
import ChatComponent, { Users } from './Chat';
import { EnvironmentTypeProps } from '../../classes/EnvironmentMode';
import { useInventory } from '../../classes/Inventory';
import { defaultCameraByEnvironment, ENVIRONMENT_COLORS, ENVIRONMENT_SHAPES } from '../../constants/environment';
import { useShapeInPlace } from '../../classes/shapeInPlace';
import useAction from '../../classes/Action';
import { useChat } from '../../classes/Chat';
import useCamera from '../../classes/Camera';
import { GameMode } from '../../classes/gameMode';
import CameraSelector from './simulation/CameraPicker';

const Nebula: React.FC<EnvironmentTypeProps> = ({ environmentMode }) => {
	const inventory = useInventory(ENVIRONMENT_COLORS[environmentMode], ENVIRONMENT_SHAPES[environmentMode]);
	const shapeInPlace = useShapeInPlace();
	const action = useAction();
	const myCamera = useCamera(defaultCameraByEnvironment[environmentMode]);
	const chat = useChat();
	const gameMode = GameMode.NEBULA;

	return (
		<main>
			<div id="mainView">
				<CameraSelector {...myCamera} />
				<Environment
					gameMode={gameMode}
					shapeInPlace={shapeInPlace}
					inventory={inventory}
					action={action}
					camera={myCamera.current}
					environmentMode={environmentMode}
				/>
			</div>
			<Side>
				<ChatComponent
					chat={chat}
					availableUsers={[Users.ARCHITECT]}
					shapeInPlace={shapeInPlace}
					environmentMode={environmentMode}
					gameMode={gameMode}
				/>
			</Side>
		</main>
	);
};

export default Nebula;
