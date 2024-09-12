import React from 'react';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData, ShapeFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { Edges } from '@react-three/drei';
import { MeshDirections, MeshTypes } from '../../../enum/Mesh';

//
function Screw({ pending, position, color }: shapeComponentProps) {
	const path = new THREE.LineCurve3(
		new THREE.Vector3(0, -0.5, 0), // Start point
		new THREE.Vector3(0, 0.5, 0) // End point
	);
	const nutColor = new THREE.Color(color.hex);
	const opacity = pending ? OPACITY_PENDING_OBJECT : 1;
	const material = (
		<meshStandardMaterial
			attach="material"
			color={nutColor}
			side={THREE.FrontSide}
			transparent={opacity !== 1}
			opacity={opacity}
		/>
	);
	return (
		<mesh
			userData={
				{
					type: MeshTypes.NON_CLICKABLE_FACE,
				} as NonClickableFaceUserData
			}
			scale={[0.65, 1, 0.65]}
		>
			<mesh
				position={[0, 0.5, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
				userData={
					{
						type: MeshTypes.SHAPE_FACE,
						faceDirection: MeshDirections.TOP,
					} as ShapeFaceUserData
				}
			>
				<circleGeometry args={[0.5, 25]} />
				{material}
			</mesh>
			<mesh
				position={[0, -0.5, 0]}
				rotation={[Math.PI / 2, 0, 0]}
				userData={
					{
						type: MeshTypes.SHAPE_FACE,
						faceDirection: MeshDirections.BOTTOM,
					} as ShapeFaceUserData
				}
			>
				<circleGeometry args={[0.5, 25]} />
				{material}
			</mesh>
			<mesh
				userData={
					{
						type: MeshTypes.NON_CLICKABLE_FACE,
						position: position,
						pending: pending,
					} as NonClickableFaceUserData
				}
			>
				<tubeGeometry args={[path, 1, 0.5, 25, false]} />
				{opacity === 1 && <Edges linewidth={1} color={nutColor.clone().addScalar(0.2)} />}
				{material}
			</mesh>
		</mesh>
	);
}

export default Screw;
