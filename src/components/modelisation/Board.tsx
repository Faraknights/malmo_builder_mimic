import { CartesianCoordinate } from '../../interfaces/CartesianCoordinate';
import { Text } from '@react-three/drei';
import { CELL_COLOR, GRID_SIZE } from '../../constants/ENVIRONMENT_CONSTANTS';
import React from 'react';
import { EnvironmentMode } from '../../enum/EnvironmentMode';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { CellBoardUserData } from '../../interfaces/userDatas';
import { MeshTypes } from '../../enum/Mesh';

interface BoardProps {
	environmentMode: EnvironmentMode;
}

const Board = ({ environmentMode }: BoardProps) => {
	const gridSize = GRID_SIZE[environmentMode];
	const positions: CartesianCoordinate[] = [];

	for (let x = gridSize.x.min; x <= gridSize.x.max; x++) {
		for (let z = gridSize.z.min; z <= gridSize.z.max; z++) {
			positions.push({ x, y: 0, z });
		}
	}

	return (
		<>
			<Instances rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]} limit={positions.length}>
				<planeGeometry args={[1, 1]} />
				<meshStandardMaterial color={[CELL_COLOR.r, CELL_COLOR.g, CELL_COLOR.b]} />
				{positions.map(({ x, z }, index) => (
					<Instance
						userData={
							{
								type: MeshTypes.CELL_BOARD,
								position: { x: x, y: 0, z: z }, // You can include position or other custom data
							} as CellBoardUserData
						}
						key={index}
						position={[x, -z, 0]}
					>
						{/* Set the userData on the instance, not the geometry */}
						<lineSegments raycast={() => null}>
							<edgesGeometry attach="geometry" args={[new THREE.PlaneGeometry(1, 1)]} />
							<lineBasicMaterial color="black" />
						</lineSegments>
					</Instance>
				))}
			</Instances>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, Math.PI, 0]}
				position={[(gridSize.x.max + gridSize.x.min) / 2, 0.5, gridSize.z.min - 2]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				N
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, 0, 0]}
				position={[gridSize.x.max + 2, 0.5, (gridSize.z.max + gridSize.z.min) / 2]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				E
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, 0, Math.PI]}
				position={[gridSize.x.min - 2, 0.5, (gridSize.z.max + gridSize.z.min) / 2]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				W
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, Math.PI, Math.PI]}
				position={[(gridSize.x.max + gridSize.x.min) / 2, 0.5, gridSize.z.max + 2]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				S
			</Text>
		</>
	);
};

export default Board;
