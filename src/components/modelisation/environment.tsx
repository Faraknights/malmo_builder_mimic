import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useHelper } from '@react-three/drei';
import { Group, PointLight, PointLightHelper, Color } from 'three'; // Import specific components from 'three'
import Board from './Board';
import Cube from './shapes/Cube';
import { CartesianCoordinate } from '../../interfaces/cartesianCoordinate';
import { ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { shapeList, Shapes } from './shapes/Shape';
import Minecraft from './Minecraft';

interface MalmoBuilderProps {
    shapeInPlace: ShapeInPlaceProps;
}

const Scene: React.FC<MalmoBuilderProps> = ({ shapeInPlace }) => {
    const bgColor = new Color(0x1a1b1e);

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5}/>
            <pointLight color="white" position={[3, 10, 3]} intensity={300} />
            <color attach="background" args={[bgColor.r, bgColor.g, bgColor.b]}/>
            <axesHelper args={[5]} position={[0, 1, 0]} />
            <Board size={11}/>
            <Minecraft {...shapeInPlace}/>
        </>
    );
};

const App: React.FC<MalmoBuilderProps> = ({ shapeInPlace }) => {
    return (
        <Canvas 
            camera={{
                position: [0, 5, 10],
                far: 1000,
            }}
        >
            <fog attach="fog" args={["white", 20, 1000]} />
            <Scene shapeInPlace={shapeInPlace}/>
        </Canvas>
    )
  }

export default App;
