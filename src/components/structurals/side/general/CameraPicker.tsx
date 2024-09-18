import React from 'react';
import { useGlobalState } from '../../GlobalStateProvider';
import { CameraMode } from '../../../../enum/CameraMode';

const CameraSelector: React.FC = () => {
	const camera = useGlobalState().camera;
	return (
		<div id="cameraSelector" className="module">
			{Object.values(CameraMode).map((cameraMode) => (
				<button
					key={cameraMode}
					className={`${cameraMode}${camera.camera === cameraMode ? ' selected' : ''}`}
					onClick={() => camera.setCamera(cameraMode)}
				>
					{cameraMode[0] + cameraMode.slice(1).toLowerCase()}
				</button>
			))}
		</div>
	);
};

export default CameraSelector;
