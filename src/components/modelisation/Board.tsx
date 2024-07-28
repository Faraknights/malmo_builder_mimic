import { CartesianCoordinate } from '../../interfaces/cartesianCoordinate';
import { Edges, Text } from '@react-three/drei';
import { CELL_COLOR, GRID_SIZE } from '../../constants/environment';
import * as THREE from 'three';
import { CellBoardUserData, MeshType } from '../../constants/meshType';
import { EnvironmentMode } from '../../classes/EnvironmentMode';
import React from 'react';

interface cellBoardProps {
	position: CartesianCoordinate;
}

const CellBoard = ({ position }: cellBoardProps) => (
	<mesh
		userData={
			{
				type: MeshType.CELL_BOARD,
				position: position,
			} as CellBoardUserData
		}
		rotation={[-Math.PI / 2, 0, 0]}
		position={[position.x, 1 / 2, position.z]}
	>
		<planeGeometry args={[1, 1]} />
		<Edges linewidth={1} threshold={15} color={'black'} />
		<meshStandardMaterial
			color={[CELL_COLOR.r, CELL_COLOR.g, CELL_COLOR.b]}
			side={THREE.FrontSide}
		/>
	</mesh>
);

const Board = ({ environmentMode }: { environmentMode: EnvironmentMode }) => {
	const gridSize = GRID_SIZE[environmentMode];

	return (
		<>
			{Array.from(
				{ length: gridSize.x.max - gridSize.x.min + 1 },
				(_, i) => gridSize.x.min + i
			).map((x) => (
				<React.Fragment key={x}>
					{Array.from(
						{ length: gridSize.z.max - gridSize.z.min + 1 },
						(_, j) => gridSize.z.min + j
					).map((z) => (
						<CellBoard
							key={`${x},${z}`}
							position={{
								x: x,
								y: 0,
								z: z,
							}}
						/>
					))}
				</React.Fragment>
			))}
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, Math.PI, 0]}
				position={[
					(gridSize.x.max + gridSize.x.min) / 2,
					0.5,
					gridSize.z.min - 2,
				]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				N
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, 0, 0]}
				position={[
					gridSize.x.max + 2,
					0.5,
					(gridSize.z.max + gridSize.z.min) / 2,
				]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				E
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, 0, Math.PI]}
				position={[
					gridSize.x.min - 2,
					0.5,
					(gridSize.z.max + gridSize.z.min) / 2,
				]}
				color="white"
				anchorX="center"
				anchorY="middle"
			>
				W
			</Text>
			<Text
				scale={[1, 1, 1]}
				rotation={[Math.PI / 2, Math.PI, Math.PI]}
				position={[
					(gridSize.x.max + gridSize.x.min) / 2,
					0.5,
					gridSize.z.max + 2,
				]}
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
