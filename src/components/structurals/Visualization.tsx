import React, { useState } from 'react';
import { chatProps, useChat } from '../../classes/Chat';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { GameMode } from '../../classes/gameMode';
import Environment from './environment';
import ChatComponent from './Chat';
import Side from './Side';
import FileManager from './visualization/FileManager';
import { CameraMode } from '../../classes/Camera';
import { EnvironmentTypeProps } from '../../classes/EnvironmentMode';
import PointerIndicator from './visualization/PointerIndicator';
import { CartesianCoordinate } from '../../interfaces/cartesianCoordinate';
import { MeshType } from '../../constants/meshType';

export interface PointerProps {
	cartesianCoordinate: CartesianCoordinate;
	type: MeshType;
}

const Visualization: React.FC<EnvironmentTypeProps> = ({ environmentMode }) => {
	const chat: chatProps = useChat();
	const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();
	const [pointer, setPointer] = useState<PointerProps | undefined>(undefined);
	const gameMode = GameMode.VISUALIZATION;

	return (
		<main>
			<div id="mainView">
				<PointerIndicator pointer={pointer} />
				<Environment
					environmentMode={environmentMode}
					shapeInPlace={{ ...shapeInPlace }}
					gameMode={gameMode}
					camera={CameraMode.FREE}
					setPointer={setPointer}
				/>
			</div>
			<Side>
				<FileManager chatHistory={chat} shapeInPlace={shapeInPlace} environmentMode={environmentMode} />
				<ChatComponent
					chat={chat}
					environmentMode={environmentMode}
					availableUsers={[]}
					shapeInPlace={shapeInPlace}
					gameMode={gameMode}
				/>
			</Side>
		</main>
	);
};

export default Visualization;
