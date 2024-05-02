import { CartesianCoordinate } from "../../../interfaces/cartesianCoordinate";
import Color from "../../../interfaces/Color";
import * as THREE from 'three'
import { shapeComponentProps } from "./Shape";
import { Edges } from "@react-three/drei";

const CubeFace = ({ position , rotation, color }: { position :any, rotation :any, color :any}) => {// Optional: Add texture
	return (
		<mesh position={position} rotation={rotation}>
			<planeGeometry attach="geometry" args={[1, 1]} />
      		<Edges linewidth={2} threshold={15} color={"white"} />
			<meshStandardMaterial attach="material" color={color} />
		</mesh>
	);
};

const Cube = ({position, color} : shapeComponentProps) => {
	const cellSize = 1
	const borderThickness = 0.05

	const cubeColor =  new THREE.Color(color.hex)
	return (
		<mesh position={[
			position.x * (cellSize + borderThickness), 
			position.y + position.y * borderThickness, 
			position.z * (cellSize + borderThickness)
		]}>
			{/* Front */}
			<CubeFace position={[0, 0, 0.5]} rotation={[0, 0, 0]} color={cubeColor} />
			{/* Back */}
			<CubeFace position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]} color={cubeColor} />
			{/* Top */}
			<CubeFace position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} color={cubeColor} />
			{/* Bottom */}
			<CubeFace position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]} color={cubeColor} />
			{/* Right */}
			<CubeFace position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} color={cubeColor} />
			{/* Left */}
			<CubeFace position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color={cubeColor} />
		</mesh>
	)
};

export default Cube