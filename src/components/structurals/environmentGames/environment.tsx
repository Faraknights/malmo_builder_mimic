import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color } from 'three';
import Game from './game';
import { GRID_SIZE } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { CanvasCameraSettings, CanvasCameraSettingsProps } from '../../../interfaces/Camera';
import { useGlobalState } from '../GlobalStateProvider';

const Scene: React.FC = () => {
	const {
		environmentMode: { environmentMode },
	} = useGlobalState();

	const gridSize = GRID_SIZE[environmentMode];
	return (
		<mesh position={[-(gridSize.x.max + gridSize.x.min) / 2, 1, -(gridSize.z.max + gridSize.z.min) / 2]}>
			<Game />
		</mesh>
	);
};

const App: React.FC = () => {
	const bgColor = new Color(0x1a1b1e);
	const { camera } = useGlobalState().camera;

	// Get the camera settings, either by invoking the function or directly accessing the object
	const cameraSettings =
		typeof CanvasCameraSettings[camera] === 'function'
			? (CanvasCameraSettings[camera] as () => CanvasCameraSettingsProps)()
			: CanvasCameraSettings[camera];

	if (cameraSettings && 'orthographic' in cameraSettings) {
		return (
			<Canvas
				key={camera}
				gl={{ preserveDrawingBuffer: true }}
				frameloop="demand"
				orthographic={cameraSettings.orthographic}
				camera={cameraSettings.cameraSettings}
			>
				<Scene />
				<OrbitControls
					enablePan={false}
					minPolarAngle={cameraSettings.polarAngle.min}
					maxPolarAngle={cameraSettings.polarAngle.max}
					minAzimuthAngle={cameraSettings.azimuthAngle?.min}
					maxAzimuthAngle={cameraSettings.azimuthAngle?.max}
				/>
				<fog attach="fog" args={['white', 20, 1000]} />
				<ambientLight intensity={1} />
				<pointLight color="white" position={[3, 10, 3]} intensity={200} />
				<color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
			</Canvas>
		);
	} else {
		return null;
	}
};

export default App;
