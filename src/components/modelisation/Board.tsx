import { CartesianCoordinate } from "../../interfaces/cartesianCoordinate";
import { Edges } from "@react-three/drei";
import { CELL_COLOR, GRID_SIZE } from "../../constants/environment";
import * as THREE from "three"
import { CellBoardUserData, MeshType } from "../../constants/meshType";
import { useEnvironmentState } from "../../classes/EnvironmentMode";

interface cellBoardProps{
	position: CartesianCoordinate,
}

const CellBoard= ({position}: cellBoardProps) => (
	<mesh
		userData={{ 
			type: MeshType.CELL_BOARD,
			position: position 
		} as CellBoardUserData}
		rotation={[-Math.PI / 2, 0, 0]}
		position={[
			position.x,
			1 / 2,
			position.z
		]}
	>
		<planeGeometry args={[1, 1]} />
		<Edges linewidth={1} threshold={15} color={"black"} />
		<meshStandardMaterial 
			color={[CELL_COLOR.r, CELL_COLOR.g, CELL_COLOR.b]} 
			side={THREE.FrontSide}
		/>
	</mesh>
)

const Board = () => {
	const {environmentMode} = useEnvironmentState()
	const gridSize = GRID_SIZE[environmentMode]
	 
	return <>
		{Array.from({ length: (gridSize.x.max - gridSize.x.min) + 1 }, (_, i) => gridSize.x.min + i).map(x => 
			<>
				{Array.from({ length: (gridSize.z.max - gridSize.z.min) + 1 }, (_, i) => gridSize.z.min + i).map(z => (
					<>
						<CellBoard
							key={(`${x}, ${z}`)}
							position={{
							x: x,
							y: 0,
							z: z,
							}}
						/>
					</>
				))}
			</>
		)}
	</>
	};

export default Board