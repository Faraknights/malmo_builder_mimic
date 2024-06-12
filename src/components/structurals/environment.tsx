import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Color, Vector3 } from 'three';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import Game from './game';
import { GameMode } from '../../interfaces/mode';
import { inventoryProps } from '../../classes/Inventory';
import { ActionProps } from '../../classes/Action';
import { useEnvironmentState } from '../../classes/EnvironmentMode';
import { GRID_SIZE } from '../../constants/environment';


interface EnvironmentProps {
    shapeInPlace: ShapeInPlaceProps,
    gameMode: GameMode,
    inventory?: inventoryProps,
    action?: ActionProps
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
    const { x, y, z } = new Vector3(5, 5, 5);

    return (
        <Canvas 
            frameloop="demand" 
            camera={{ 
                position: [0, 5, 10], 
                far: 1000,
            }}
        >
            <orthographicCamera onUpdate={self => self.lookAt(100,2,3)} />
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
