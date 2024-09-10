import React from 'react';
import { useEffect } from 'react';
import Environment from './environment';
import Side from './Side';
import ColorPicker from './simulation/ColorPicker';
import ActionSelector from './simulation/ActionSelector';
import ShapePicker from './simulation/ShapePicker';
import { EXPORT_GAME_LOG } from '../../constants/environment';
import ChatComponent, { Users } from './Chat';
import CameraSelector from './simulation/CameraPicker';
import { useGlobalState } from './GlobalStateProvider';

const Simulation: React.FC = () => {
	const {
		shapeInPlace,
		inventory,
		environmentMode: { environmentMode },
		gameLog: { gameLog },
		chat,
	} = useGlobalState();

	useEffect(() => {
		if (shapeInPlace.pending) {
			document.body.style.cursor = 'pointer';
		} else {
			document.body.style.cursor = 'auto';
		}
	}, [shapeInPlace]);

	return (
		<main>
			<div id="mainView">
				<CameraSelector />
				<Environment />
			</div>
			<Side>
				<ActionSelector />
				<ColorPicker {...inventory} />
				<ShapePicker />
				<ChatComponent availableUsers={[Users.ARCHITECT, Users.BUILDER]} />
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
