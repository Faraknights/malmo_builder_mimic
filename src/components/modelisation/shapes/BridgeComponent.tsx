import * as THREE from 'three'
import { shapeComponentProps } from "./Shape";
import { Edges } from "@react-three/drei";
import { OPACITY_PENDING_OBJECT } from "../../../constants/environment";
import { ShapeFaceUserData, MeshType, NonClickableFaceUserData } from "../../../constants/meshType";
import { DIRECTION } from "../../../constants/direction";

interface CubeFaceDirectionProperties {
    translation: THREE.Vector3;
    rotation: THREE.Euler;
    type: MeshType;
}

export const CubeFaceDirection: Record<DIRECTION, CubeFaceDirectionProperties> = {
    [DIRECTION.FRONT]: {
        translation: new THREE.Vector3(0, 0, 1/2),
        rotation: new THREE.Euler(0, 0, 0),
        type: MeshType.NON_CLICKABLE_FACE

    },
    [DIRECTION.BACK]: {
        translation: new THREE.Vector3(0, 0, -1/2),
        rotation: new THREE.Euler(0, Math.PI, 0),
        type: MeshType.NON_CLICKABLE_FACE
    },
    [DIRECTION.TOP]: {
        translation: new THREE.Vector3(0, 1/2, 0),
        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
        type: MeshType.SHAPE_FACE
    },
    [DIRECTION.BOTTOM]: {
        translation: new THREE.Vector3(0, -1/2, 0),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        type: MeshType.SHAPE_FACE
    },
    [DIRECTION.LEFT]: {
        translation: new THREE.Vector3(1/2, 0, 0),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
        type: MeshType.NON_CLICKABLE_FACE
    },
    [DIRECTION.RIGHT]: {
        translation: new THREE.Vector3(-1/2, 0, 0),
        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
        type: MeshType.NON_CLICKABLE_FACE
    },
}

interface CubeFaceProps{
	color: THREE.Color
	opacity: number
	facingDirection: DIRECTION
}

const CubeFace = (props: CubeFaceProps) => {
	const properties = CubeFaceDirection[props.facingDirection]
	return (
		<mesh 
			position={properties.translation} 
			rotation={properties.rotation} 
			userData={properties.type === MeshType.SHAPE_FACE ? {
				type: MeshType.SHAPE_FACE,
				faceDirection: props.facingDirection
			} as ShapeFaceUserData : {
				type: MeshType.NON_CLICKABLE_FACE,
			} as NonClickableFaceUserData}
		>
			<planeGeometry attach="geometry" args={[1, 1]}/>
			{props.opacity === 1 && (
				<Edges linewidth={1} threshold={15} color={props.color} />
			)}
			<meshStandardMaterial attach="material" color={props.color}  transparent={props.opacity !== 1} opacity={props.opacity}/>
		</mesh>
	);
};

export interface BridgeComponentProps extends shapeComponentProps {
    rotation: "HORIZONTAL" | "VERTICAL";
}

const BridgeComponent = ({pending, color, rotation} : BridgeComponentProps) => {
	const cubeColor = new THREE.Color(color.hex)
	return <mesh
        scale={[rotation === "HORIZONTAL" ? 1 : 0.6, 1, rotation === "HORIZONTAL" ? 0.6 : 1]}
    >
		{ Object.entries(DIRECTION).map(([key, properties]) => (
			<CubeFace 
				key={key}
				color={cubeColor} 
				opacity={pending ? OPACITY_PENDING_OBJECT: 1}
				facingDirection={properties}
			/>
		))}
	</mesh>
};

export default BridgeComponent