import React from 'react';
import { useEffect } from 'react';
import Environment from './environment';
import Side from '../side/Side';
import ColorPicker from '../side/simulation/ColorPicker';
import ActionSelector from '../side/simulation/ActionSelector';
import ShapePicker from '../side/simulation/ShapePicker';
import { EXPORT_GAME_LOG } from '../../../constants/ENVIRONMENT_CONSTANTS';
import ChatComponent from '../side/general/Chat';
import CameraSelector from '../side/general/CameraPicker';
import { useGlobalState } from '../GlobalStateProvider';
import { Users } from '../../../enum/Chat';

//Assets
import DownloadSVG from '../../../../public/assets/svg/download.svg';
import ScreenshotSVG from '../../../../public/assets/svg/screenshot.svg';
import ClearSVG from '../../../../public/assets/svg/clear.svg';

const Simulation: React.FC = () => {
	const {
		shapeInPlace,
		environmentMode: { environmentMode },
		gameLog: { gameLog },
		clear,
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
				<ColorPicker />
				<ShapePicker />
				<ChatComponent availableUsers={[Users.ARCHITECT, Users.BUILDER]} />
				<div id="gameButtons">
					<button
						className="realisticButton"
						onMouseDown={() => {
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
						<DownloadSVG />
					</button>
					<button
						className="realisticButton"
						onMouseDown={() => {
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
						<ScreenshotSVG />
					</button>
					<button className="realisticButton warning" onMouseDown={clear}>
						<ClearSVG />
					</button>
				</div>
			</Side>
		</main>
	);
};

export default Simulation;
