import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Camera, Color, Vector3 } from 'three';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import Game from './game';
import { GameMode } from '../../interfaces/mode';
import { inventoryProps } from '../../classes/Inventory';
import { ActionProps } from '../../classes/Action';
import { useEnvironmentState } from '../../classes/EnvironmentMode';
import { GRID_SIZE } from '../../constants/environment';
import { CameraMode, CameraProps, CanvasCameraSettings } from '../../classes/Camera';


interface EnvironmentProps {
    shapeInPlace: ShapeInPlaceProps,
    gameMode: GameMode,
    inventory?: inventoryProps,
    action?: ActionProps
    camera: CameraMode
}

const Scene: React.FC<EnvironmentProps> = ({ shapeInPlace, gameMode, inventory, action }) => {
    const {environmentMode} = useEnvironmentState()
    const gridSize = GRID_SIZE[environmentMode]
    return (
        <mesh
            position={[-(gridSize.x.max + gridSize.x.min) / 2, 1, -(gridSize.z.max + gridSize.z.min) / 2]}
        >
            <Game 
                shapeInPlace={shapeInPlace}
                gameMode={gameMode}
                inventory={inventory}
                action={action}
            />
            { gameMode === GameMode.VISUALIZATION && (
                <axesHelper args={[5]} position={[(gridSize.x.max + gridSize.x.min) / 2, 1, (gridSize.z.max + gridSize.z.min) / 2]} />
            )}
        </mesh>
    );
};

const App: React.FC<EnvironmentProps> = (props) => {
    const bgColor = new Color(0x1a1b1e);
    const aspect = window.innerWidth / window.innerHeight;
    const d = 10; // Adjust this value to zoom in or out
    const orthographicCameraSettings = {
        left: -d * aspect,
        right: d * aspect,
        top: d,
        bottom: -d,
        near: 0.1,
        far: 1000,
        position: [0, 5, 10]
    };


    return (
        
        <Canvas 
            key={props.camera}
            frameloop="demand"
            orthographic={CanvasCameraSettings[props.camera].orthographic}
            camera={CanvasCameraSettings[props.camera].cameraSettings}
        >
            <Scene {...props}/>
            <OrbitControls 
                enablePan={false}
                minPolarAngle={CanvasCameraSettings[props.camera].polarAngle.min}
                maxPolarAngle={CanvasCameraSettings[props.camera].polarAngle.max}
                minAzimuthAngle={CanvasCameraSettings[props.camera].azimuthAngle?.min}
                maxAzimuthAngle={CanvasCameraSettings[props.camera].azimuthAngle?.max} 
            />
            <fog attach="fog" args={["white", 20, 1000]} />
            <ambientLight intensity={1}/>
            <pointLight color="white" position={[3, 10, 3]} intensity={200} />
            <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]}/>
        </Canvas>
    )
}

export default App;
