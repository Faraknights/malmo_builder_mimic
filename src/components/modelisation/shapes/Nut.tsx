import * as THREE from 'three'
import { shapeComponentProps } from './Shape';
import { MeshType, NonClickableFaceUserData, ShapeFaceUserData } from '../../../constants/meshType';
import { DIRECTION } from '../../../constants/direction';
import { OPACITY_PENDING_OBJECT } from '../../../constants/environment';
import { Edges } from '@react-three/drei';

function Nut({pending, position, color} : shapeComponentProps) {
	const path = new THREE.LineCurve3(
		new THREE.Vector3(0, -0.5, 0), // Start point
		new THREE.Vector3(0, 0.5, 0) // End point
	);
	const nutColor = new THREE.Color(color.hex)
    const opacity = pending ? OPACITY_PENDING_OBJECT: 1
    
    const material = <meshStandardMaterial attach="material" color={nutColor} side={THREE.FrontSide}  transparent={opacity !== 1} opacity={opacity}/>
	return (
		<mesh 
            userData={{
                type: MeshType.NON_CLICKABLE_FACE,
            } as NonClickableFaceUserData}
            scale={[1.1, 1, 1.1]}
            rotation={[0, -Math.PI / 4, 0]}
        >
            <mesh 
                position={[0, 0.5, 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                userData={{
                    type: MeshType.SHAPE_FACE,
                    faceDirection: DIRECTION.TOP
                } as ShapeFaceUserData}
            >
                <circleGeometry args={[0.5, 4]} />
                {material}
            </mesh>
            <mesh 
                position={[0, -0.5, 0]} 
                rotation={[Math.PI / 2, 0, 0]}
                userData={{
                    type: MeshType.SHAPE_FACE,
                    faceDirection: DIRECTION.BOTTOM
                } as ShapeFaceUserData}
            >
                <circleGeometry args={[0.5, 4]} />
                {material}	
            </mesh>
            <mesh
                userData={{
                    type: MeshType.NON_CLICKABLE_FACE,
                    position: position,
                    pending: pending
                } as NonClickableFaceUserData}
            >
                <tubeGeometry args={[path, 1, 0.5, 4, false]} />
                {opacity === 1 && <Edges linewidth={1} color={nutColor.clone().addScalar(0.2)}/>}
                {material}
            </mesh>
        </mesh>
	);
}

export default Nut;
