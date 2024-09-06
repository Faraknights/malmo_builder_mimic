import React from 'react';
import { useEffect, useState } from 'react';
import { useInventory } from '../../classes/Inventory';
import { useShapeInPlace } from '../../classes/shapeInPlace';
import { GameMode } from '../../classes/gameMode';
import Environment from './environment';
import Side from './Side';
import ColorPicker from './simulation/ColorPicker';
import useAction from '../../classes/Action';
import ActionSelector from './simulation/ActionSelector';
import ShapePicker from './simulation/ShapePicker';
import { EnvironmentTypeProps } from '../../classes/EnvironmentMode';
import { ENVIRONMENT_COLORS, ENVIRONMENT_SHAPES, EXPORT_GAME_LOG } from '../../constants/environment';
import { useChat } from '../../classes/Chat';
import ChatComponent, { Users } from './Chat';
import { GameLog, worldStateProps } from '../../classes/gameLog';
import CameraSelector from './simulation/CameraPicker';
import useCamera from '../../classes/Camera';

const Simulation: React.FC<EnvironmentTypeProps> = ({ environmentMode }) => {
	const inventory = useInventory(ENVIRONMENT_COLORS[environmentMode], ENVIRONMENT_SHAPES[environmentMode]);

	const shapeInPlace = useShapeInPlace();
	const action = useAction();
	const myCamera = useCamera();
	const chat = useChat();
	const [gameLog, setGameLog] = useState<GameLog>(new GameLog());
	const gameMode = GameMode.SIMULATION;

	useEffect(() => {
		if (shapeInPlace.pending) {
			document.body.style.cursor = 'pointer';
		} else {
			document.body.style.cursor = 'auto';
		}
	}, [shapeInPlace]);

	useEffect(() => {
		shapeInPlace.setObjects([]);
		inventory.setColors(ENVIRONMENT_COLORS[environmentMode]);
		inventory.setCurrentColor(ENVIRONMENT_COLORS[environmentMode][0]);
		inventory.setShapes(ENVIRONMENT_SHAPES[environmentMode]);
		inventory.setCurrentShape(ENVIRONMENT_SHAPES[environmentMode][0]);
		setGameLog(new GameLog());
		chat.setChatHistory([]);
	}, [environmentMode]);

	useEffect(() => {
		const lastWolrdState = gameLog.getLastWorldState();
		if (lastWolrdState) {
			if (
				shapeInPlace.objects.length !== lastWolrdState.shapeInPlace.length ||
				chat.chatHistory.length !== lastWolrdState.chatHistory.length
			) {
				gameLog.addWorldState({
					timestamp: new Date(),
					chatHistory: [...chat.chatHistory],
					shapeInPlace: [...shapeInPlace.objects],
				} as worldStateProps);
				setGameLog(gameLog);
			}
		} else {
			if (shapeInPlace.objects.length !== 0 || chat.chatHistory.length !== 0) {
				gameLog.addWorldState({
					timestamp: new Date(),
					chatHistory: [...chat.chatHistory],
					shapeInPlace: [...shapeInPlace.objects],
				} as worldStateProps);
				setGameLog(gameLog);
			}
		}
	}, [shapeInPlace.objects, chat.chatHistory]);

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
				<ActionSelector {...action} />
				<ColorPicker {...inventory} />
				<ShapePicker inventory={inventory} environmentMode={environmentMode} />
				<ChatComponent
					chat={chat}
					availableUsers={[Users.ARCHITECT, Users.BUILDER]}
					shapeInPlace={shapeInPlace}
					environmentMode={environmentMode}
					gameMode={gameMode}
				/>
				<div id="gameButtons">
					<button
						id="download"
						onClick={() => {
							const gameLogJson = JSON.stringify(EXPORT_GAME_LOG[environmentMode](gameLog));
							const blob = new Blob([gameLogJson], {
								type: 'application/json',
							});
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = 'gameLog.json';
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							URL.revokeObjectURL(url);
						}}
					>
						Download json
					</button>
					<button
						id="download"
						onClick={() => {
							const canvas = document.querySelector<HTMLCanvasElement>(
								'canvas[data-engine="three.js r164"]'
							);

							if (canvas) {
								const image = canvas.toDataURL('image/png');
								const a = document.createElement('a');
								a.href = image;
								a.download = 'canvas-image.png';
								document.body.appendChild(a);
								a.click();
								document.body.removeChild(a);
							} else {
								console.error('Canvas element not found');
							}
						}}
					>
						Download png
					</button>
					<button
						id="reset"
						onClick={() => {
							shapeInPlace.clear();
							chat.clear();
						}}
					>
						Clear Board
					</button>
				</div>
			</Side>
		</main>
	);
};

export default Simulation;
