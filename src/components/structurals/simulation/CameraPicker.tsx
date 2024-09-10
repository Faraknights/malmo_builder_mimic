import React from 'react';
import { CameraMode } from '../../../classes/Camera';
import { useGlobalState } from '../GlobalStateProvider';

const CameraSelector: React.FC = () => {
	const camera = useGlobalState().camera;
	return (
		<div id="cameraSelector" className="module">
			{Object.values(CameraMode).map((cameraMode) => (
				<button
					key={cameraMode}
					className={`${cameraMode}${camera.current === cameraMode ? ' selected' : ''}`}
					onClick={() => camera.setCurrent(cameraMode)}
				>
					{cameraMode[0] + cameraMode.slice(1).toLowerCase()}
				</button>
			))}
		</div>
	);
};

export default CameraSelector;
