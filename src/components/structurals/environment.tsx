import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color } from 'three';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import Game from './game';
import { GameMode } from '../../classes/gameMode';
import { inventoryProps } from '../../classes/Inventory';
import { ActionProps } from '../../classes/Action';
import { EnvironmentMode } from '../../classes/EnvironmentMode';
import { GRID_SIZE } from '../../constants/environment';
import { CameraMode, CanvasCameraSettings } from '../../classes/Camera';
import { PointerProps } from './Visualization';

interface EnvironmentProps {
	shapeInPlace: ShapeInPlaceProps;
	gameMode: GameMode;
	environmentMode: EnvironmentMode;
	inventory?: inventoryProps;
	action?: ActionProps;
	setPointer?: React.Dispatch<React.SetStateAction<PointerProps | undefined>>;
	camera: CameraMode;
}

const Scene: React.FC<EnvironmentProps> = (props) => {
	const gridSize = GRID_SIZE[props.environmentMode];
	return (
		<mesh position={[-(gridSize.x.max + gridSize.x.min) / 2, 1, -(gridSize.z.max + gridSize.z.min) / 2]}>
			<Game {...props} />
		</mesh>
	);
};

const App: React.FC<EnvironmentProps> = (props) => {
	const bgColor = new Color(0x1a1b1e);

	const scene = useMemo(() => <Scene {...props} />, [props]);

	return (
		<Canvas
			key={props.camera}
			gl={{ preserveDrawingBuffer: true }}
			frameloop="demand"
			orthographic={CanvasCameraSettings[props.camera].orthographic}
			camera={CanvasCameraSettings[props.camera].cameraSettings}
		>
			{scene}
			<OrbitControls
				enablePan={false}
				minPolarAngle={CanvasCameraSettings[props.camera].polarAngle.min}
				maxPolarAngle={CanvasCameraSettings[props.camera].polarAngle.max}
				minAzimuthAngle={CanvasCameraSettings[props.camera].azimuthAngle?.min}
				maxAzimuthAngle={CanvasCameraSettings[props.camera].azimuthAngle?.max}
			/>
			<fog attach="fog" args={['white', 20, 1000]} />
			<ambientLight intensity={1} />
			<pointLight color="white" position={[3, 10, 3]} intensity={200} />
			<color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]} />
		</Canvas>
	);
};

export default App;
