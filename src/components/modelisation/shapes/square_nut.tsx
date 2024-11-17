import React from 'react';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData, ShapeFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { Edges } from '@react-three/drei';
import { MeshDirections, MeshTypes } from '../../../enum/Mesh';

//
function SquareNut({ pending, position, color }: shapeComponentProps) {
	const squareNutColor = new THREE.Color(color.hex);
	const opacity = pending ? OPACITY_PENDING_OBJECT : 1;

	// Hexagon with a hole
	const faceGeometry = React.useMemo(() => {
		const outerShape = new THREE.Shape();
		const radius = 0.5;

		// Hexagon shape
		for (let i = 0; i < 4; i++) {
			const angle = (i / 4) * Math.PI * 2;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			if (i === 0) outerShape.moveTo(x, y);
			else outerShape.lineTo(x, y);
		}
		outerShape.closePath();

		// Inner circular hole
		const holePath = new THREE.Path();
		holePath.absarc(0, 0, 0.2, 0, Math.PI * 2, false);
		outerShape.holes.push(holePath);

		return new THREE.ShapeGeometry(outerShape);
	}, []);

	const material = (
		<meshStandardMaterial
			attach="material"
			color={squareNutColor}
			side={THREE.DoubleSide}
			transparent={opacity !== 1}
			opacity={opacity}
		/>
	);

	return (
		<mesh
			userData={
				{
					type: MeshTypes.NON_CLICKABLE_FACE,
					position: position,
					pending: pending,
				} as NonClickableFaceUserData
			}
			scale={[1, 1, 1]}
			rotation={[0, -Math.PI / 2, 0]}
		>
			{/* Top Face */}
			<mesh
				position={[0, 0.5, 0]}
				rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
				userData={
					{
						type: MeshTypes.SHAPE_FACE,
						faceDirection: MeshDirections.TOP,
					} as ShapeFaceUserData
				}
				geometry={faceGeometry}
			>
				{material}
			</mesh>

			{/* Bottom Face */}
			<mesh
				position={[0, -0.5, 0]}
				rotation={[Math.PI / 2, 0, Math.PI / 2]}
				userData={
					{
						type: MeshTypes.SHAPE_FACE,
						faceDirection: MeshDirections.BOTTOM,
					} as ShapeFaceUserData
				}
				geometry={faceGeometry}
			>
				{material}
			</mesh>

			{/* Tube (Body) */}
			<mesh
				userData={
					{
						type: MeshTypes.NON_CLICKABLE_FACE,
						position: position,
						pending: pending,
					} as NonClickableFaceUserData
				}
			>
				<tubeGeometry
					args={[
						new THREE.LineCurve3(new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)),
						1,
						0.5,
						4,
						false,
					]}
				/>
				{opacity === 1 && <Edges linewidth={1} color={squareNutColor.clone().addScalar(0.2)} />}
				{material}
			</mesh>

			{/* Inner Tube */}
			<mesh
				userData={
					{
						type: MeshTypes.NON_CLICKABLE_FACE,
						position: position,
						pending: pending,
					} as NonClickableFaceUserData
				}
			>
				<tubeGeometry
					args={[
						new THREE.LineCurve3(new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 0.5, 0)),
						1,
						0.2,
						20,
						false,
					]}
				/>
				{material}
			</mesh>
		</mesh>
	);
}

export default SquareNut;
