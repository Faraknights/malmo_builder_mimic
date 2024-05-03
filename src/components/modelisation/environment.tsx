import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color } from 'three';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import Minecraft from './Minecraft';
import { GameMode, EnvironmentMode } from '../../interfaces/mode';
import { inventoryProps } from '../../classes/Inventory';

interface EnvironmentProps {
    shapeInPlace: ShapeInPlaceProps,
    environmentMode: EnvironmentMode,
    gameMode: GameMode,
    inventory?: inventoryProps
}

const Scene: React.FC<EnvironmentProps> = ({ shapeInPlace, environmentMode, gameMode }) => {

    return (
        <>
            { environmentMode === EnvironmentMode.MINECRAFT && (
                <Minecraft 
                    shapeInPlace={shapeInPlace}
                    gameMode={gameMode}
                />
            )}
            { gameMode === GameMode.VISUALIZATION && (
                <axesHelper args={[5]} position={[0, 1, 0]} />
            )}
        </>
    );
};

const App: React.FC<EnvironmentProps> = (props) => {
    const bgColor = new Color(0x1a1b1e);

    return (
        <Canvas frameloop="demand" camera={{ position: [0, 5, 10], far: 1000}}>
            <Scene {...props}/>
            <OrbitControls />
            <fog attach="fog" args={["white", 20, 1000]} />
            <ambientLight intensity={1}/>
            <pointLight color="white" position={[3, 10, 3]} intensity={200} />
            <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]}/>
        </Canvas>
    )
}

export default App;
