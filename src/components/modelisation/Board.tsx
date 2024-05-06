import { CartesianCoordinate } from "../../interfaces/cartesianCoordinate";
import { Edges } from "@react-three/drei";
import { CELL_COLOR, MINECRAFT_BLOCK_SIZE } from "../../constants/environment";
import * as THREE from "three"
import { CellBoardUserData, MeshType } from "../../constants/meshType";

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
			position.x * MINECRAFT_BLOCK_SIZE.x,
			MINECRAFT_BLOCK_SIZE.y / 2,
			position.z * MINECRAFT_BLOCK_SIZE.z
		]}
	>
		<planeGeometry args={[MINECRAFT_BLOCK_SIZE.x, MINECRAFT_BLOCK_SIZE.z]} />
		<Edges linewidth={1} threshold={15} color={"black"} />
		<meshStandardMaterial 
			color={[CELL_COLOR.r, CELL_COLOR.g, CELL_COLOR.b]} 
			side={THREE.FrontSide}
		/>
	</mesh>
)

interface boardProps{
	size?: number,
}

const Board = ({ size = 11 }: boardProps) => (
	<>
		{Array.from({ length: size * size }, (_, index) => {
			const i = Math.floor(index / size);
			const j = index % size;
			return (
				<CellBoard
					key={index}
					position={{
					x: i - (size - 1) / 2,
					y: 0,
					z: j - (size - 1) / 2,
					}}
				/>
			)
		})}
	</>
  );

export default Board