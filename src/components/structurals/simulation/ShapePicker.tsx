import React from 'react';
import { inventoryProps } from '../../../classes/Inventory';
import { shapeHitbox, Shapes } from '../../modelisation/shapes/Shape';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EnvironmentMode } from '../../../classes/EnvironmentMode';
import { BLOCK_SIZE } from '../../../constants/environment';
import { shapeList } from '../../../constants/shapeList';
import { CartesianCoordinate } from '../../../interfaces/cartesianCoordinate';

const ShapePicker: React.FC<{
    inventory: inventoryProps,
    environmentMode: EnvironmentMode
}> = ({
    inventory: {
        currentColor,
        currentShape,
        shapes,
        setCurrentShape,
    },
    environmentMode
}) => {
    const nbShapeByRow = 2
    const ShapesByRow = [];
    for (let i = 0; i < shapes.length; i += nbShapeByRow) {
        ShapesByRow.push(shapes.slice(i, i + nbShapeByRow));
    }
    return (
        (shapes.length > 1 && <div id="shapePicker" className='module'>
        <h3>Shape Picker</h3>
        <div id="colorList">
            {ShapesByRow.map((rowOfShape, i) => (
                <div key={i}>
                    {rowOfShape.map(shapeId => {
                        const hitbox = shapeHitbox[shapeId] as CartesianCoordinate[]

                        const xValues = hitbox.map(coordinate => coordinate.x);
                        const minX = Math.min(...xValues);
                        const maxX = Math.max(...xValues);

                        const zValues = hitbox.map(coordinate => coordinate.z);
                        const minZ = Math.min(...zValues);
                        const maxZ = Math.max(...zValues);
                        
                        return (
                        <div
                            key={shapeId}
                            className={`color${currentShape === shapeId ? " selected" : ""}`}
                            onClick={() => setCurrentShape(shapeId)}
                        >
                            <Canvas
                                frameloop="demand" 
                                camera={{ position: [0, 2, 0], far: 1000}}
                            >
                                <mesh 
                                    scale={[BLOCK_SIZE[environmentMode].x, BLOCK_SIZE[environmentMode].y, BLOCK_SIZE[environmentMode].z]}
                                    position={[-((maxX - minX) / 2),0,-((maxZ - minZ) / 2)]}>
                                    <Shapes
                                        breakable={false}
                                        pending={false}
                                        color={currentColor}
                                        position={{x:0,y:0,z:0}}
                                        shape={shapeId}
                                        uuid={shapeList[shapeId]}
                                    />
                                </mesh>
                                <OrbitControls />
                                <fog attach="fog" args={["white", 20, 1000]} />
                                <ambientLight intensity={1}/>
                                <pointLight color="white" position={[3, 10, 3]} intensity={200} />
                            </Canvas>
                            <span>{shapeList[shapeId][0] + shapeList[shapeId].slice(1).toLowerCase().replace("_", " ")}</span>
                        </div>
                    )})}
                </div>
            ))}
        </div>
    </div>) || <></>    
    );
};

export default ShapePicker;
