import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color } from 'three';
import Game from './game';
import { GRID_SIZE } from '../../constants/environment';
import { CanvasCameraSettings } from '../../classes/Camera';
import { useGlobalState } from './GlobalStateProvider';

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
	const camera = useGlobalState().camera;

	const scene = useMemo(() => <Scene />, []);

	return (
		<Canvas
			key={camera.current}
			gl={{ preserveDrawingBuffer: true }}
			frameloop="demand"
			orthographic={CanvasCameraSettings[camera.current].orthographic}
			camera={CanvasCameraSettings[camera.current].cameraSettings}
		>
			{scene}
			<OrbitControls
				enablePan={false}
				minPolarAngle={CanvasCameraSettings[camera.current].polarAngle.min}
				maxPolarAngle={CanvasCameraSettings[camera.current].polarAngle.max}
				minAzimuthAngle={CanvasCameraSettings[camera.current].azimuthAngle?.min}
				maxAzimuthAngle={CanvasCameraSettings[camera.current].azimuthAngle?.max}
			/>
			<fog attach="fog" args={['white', 20, 1000]} />
			<ambientLight intensity={1} />
			<pointLight color="white" position={[3, 10, 3]} intensity={200} />
			<color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
		</Canvas>
	);
};

export default App;
