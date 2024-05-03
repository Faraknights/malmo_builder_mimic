import { CartesianCoordinate } from "../../../interfaces/cartesianCoordinate";
import * as THREE from 'three'
import { shapeComponentProps } from "./Shape";
import { Edges } from "@react-three/drei";
import { MINECRAFT_BLOCK_SIZE, OPACITY_PENDING_OBJECT } from "../../../constants/environment";

enum DIRECTION {
	FRONT = "FRONT",
	BACK = "BACK",
	TOP = "TOP",
	BOTTOM = "BOTTOM",
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

interface DirectionProperties {
    facingDirection: DIRECTION;
    translation: THREE.Vector3;
    rotation: THREE.Euler;
	geometry: [number, number]
    pendingBlock: CartesianCoordinate;
}

const DirectionInfo: Record<DIRECTION, DirectionProperties> = {
    [DIRECTION.FRONT]: {
        facingDirection: DIRECTION.FRONT,
        translation: new THREE.Vector3(0, 0, MINECRAFT_BLOCK_SIZE.z/2),
        rotation: new THREE.Euler(0, 0, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.x, MINECRAFT_BLOCK_SIZE.y],
        pendingBlock: {x:0, y:0, z:1},

    },
    [DIRECTION.BACK]: {
        facingDirection: DIRECTION.BACK,
        translation: new THREE.Vector3(0, 0, -MINECRAFT_BLOCK_SIZE.z/2),
        rotation: new THREE.Euler(0, Math.PI, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.x, MINECRAFT_BLOCK_SIZE.y],
        pendingBlock: {x:0, y:0, z:-1},
    },
    [DIRECTION.TOP]: {
        facingDirection: DIRECTION.TOP,
        translation: new THREE.Vector3(0, MINECRAFT_BLOCK_SIZE.y/2, 0),
        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.x, MINECRAFT_BLOCK_SIZE.z],
        pendingBlock: {x:0, y:1, z:0},
    },
    [DIRECTION.BOTTOM]: {
        facingDirection: DIRECTION.BOTTOM,
        translation: new THREE.Vector3(0, -MINECRAFT_BLOCK_SIZE.y/2, 0),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.x, MINECRAFT_BLOCK_SIZE.z],
        pendingBlock: {x:0, y:-1, z:0},
    },
    [DIRECTION.LEFT]: {
        facingDirection: DIRECTION.LEFT,
        translation: new THREE.Vector3(MINECRAFT_BLOCK_SIZE.x/2, 0, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.z, MINECRAFT_BLOCK_SIZE.y],
        pendingBlock: {x:1, y:0, z:0},
    },
    [DIRECTION.RIGHT]: {
        facingDirection: DIRECTION.RIGHT,
        translation: new THREE.Vector3(-MINECRAFT_BLOCK_SIZE.x/2, 0, 0),
        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
		geometry: [MINECRAFT_BLOCK_SIZE.z, MINECRAFT_BLOCK_SIZE.y],
        pendingBlock: {x:-1, y:0, z:0},
    },
}

interface CubeFaceProps{
	position: CartesianCoordinate
	color: THREE.Color
	opacity: number
	facingDirection: DIRECTION
}

const CubeFace = (props: CubeFaceProps) => {
	const properties = DirectionInfo[props.facingDirection]
	return (
		<mesh 
			position={properties.translation} 
			rotation={properties.rotation} 
			userData={{
				position: props.position,
				facingDirection: props.facingDirection,
			}}
		>
			<planeGeometry attach="geometry" args={properties.geometry}/>
			{props.opacity === 1 && (
				<Edges linewidth={1} threshold={15} color={props.color} />
			)}
			<meshStandardMaterial attach="material" color={props.color}  transparent={props.opacity !== 1} opacity={props.opacity}/>
		</mesh>
	);
};

const Cube = ({pending, position, color} : shapeComponentProps) => {
	const cubeColor = new THREE.Color(color.hex)
	console.log("cube spawned")
	return (
		<mesh 
			userData={{
				color: color,
				position: position,
				pending: pending
			} as shapeComponentProps}
			position={[
				position.x * MINECRAFT_BLOCK_SIZE.x, 
				position.y * MINECRAFT_BLOCK_SIZE.y, 
				position.z * MINECRAFT_BLOCK_SIZE.z
			]}
		>
			{ Object.entries(DirectionInfo).map(([key, properties]) => (
				<CubeFace 
					key={key}
					position={position}
					color={cubeColor} 
					opacity={pending ? OPACITY_PENDING_OBJECT: 1}
					facingDirection={properties.facingDirection}
				/>
			))}
		</mesh>
	)
};

export default Cube