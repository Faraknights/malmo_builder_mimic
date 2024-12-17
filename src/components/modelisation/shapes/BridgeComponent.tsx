import React from 'react';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData, ShapeFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { Edges } from '@react-three/drei';
import { MeshDirections, MeshTypes } from '../../../enum/Mesh';

// Définir les dimensions du rectangle et du trou
const RECTANGLE_DIMENSIONS = {
	width: 0.8,
	height: 1,
	depth: 1,
	holeRadius: 0.2, // Rayon du trou
	holeHeight: 1.2, // Hauteur du trou (doit être plus grande que la profondeur du rectangle)
};

export interface BridgeComponentProps extends shapeComponentProps {
	rotation: 'HORIZONTAL' | 'VERTICAL';
}

const BridgeComponent = ({ pending, color, rotation }: BridgeComponentProps) => {
	const cubeColor = new THREE.Color(color.hex);
	const opacity = pending ? OPACITY_PENDING_OBJECT : 1;

	// Création du rectangle avec un trou
	const faceGeometry = React.useMemo(() => {
		const outerShape = new THREE.Shape();
		const width = RECTANGLE_DIMENSIONS.width;
		const height = RECTANGLE_DIMENSIONS.height;

		// Rectangle externe
		outerShape.moveTo(-width / 2, -height / 2);
		outerShape.lineTo(width / 2, -height / 2);
		outerShape.lineTo(width / 2, height / 2);
		outerShape.lineTo(-width / 2, height / 2);
		outerShape.closePath();

		// Trou circulaire au centre
		const holePath = new THREE.Path();
		holePath.absarc(0, 0, RECTANGLE_DIMENSIONS.holeRadius, 0, Math.PI * 2, false);
		outerShape.holes.push(holePath);

		return new THREE.ShapeGeometry(outerShape, 64); // Augmentation des segments
	}, []);

	// Géométrie des faces avant/arrière
	const sideGeometryX = React.useMemo(
		() => new THREE.PlaneGeometry(RECTANGLE_DIMENSIONS.width, RECTANGLE_DIMENSIONS.depth),
		[]
	);
	// Géométrie des faces latérales
	const sideGeometryY = React.useMemo(
		() => new THREE.PlaneGeometry(RECTANGLE_DIMENSIONS.height, RECTANGLE_DIMENSIONS.depth),
		[]
	);

	const material = (
		<meshStandardMaterial
			attach="material"
			color={cubeColor}
			side={THREE.DoubleSide}
			transparent={opacity !== 1}
			opacity={opacity}
		/>
	);

	// Définir un userData commun de base
	const baseUserData: NonClickableFaceUserData = {
		type: MeshTypes.NON_CLICKABLE_FACE,
	};

	// Composant pour une face réutilisable
	const Face = ({
		position,
		rotation,
		geometry,
		userData,
	}: {
		position: [number, number, number];
		rotation: [number, number, number];
		geometry: any;
		userData: any;
	}) => (
		<mesh position={position} rotation={rotation} userData={userData} geometry={geometry}>
			{material}
		</mesh>
	);
	const faceDetails: {
		position: [number, number, number];
		rotation: [number, number, number];
		geometry: THREE.PlaneGeometry;
	}[] = [
		{ position: [0, 0, RECTANGLE_DIMENSIONS.depth / 2], rotation: [0, 0, 0], geometry: sideGeometryX },
		{ position: [0, 0, -RECTANGLE_DIMENSIONS.depth / 2], rotation: [0, Math.PI, 0], geometry: sideGeometryX },
		{ position: [-RECTANGLE_DIMENSIONS.width / 2, 0, 0], rotation: [0, -Math.PI / 2, 0], geometry: sideGeometryY },
		{ position: [RECTANGLE_DIMENSIONS.width / 2, 0, 0], rotation: [0, Math.PI / 2, 0], geometry: sideGeometryY },
	];
	return (
		<mesh
			userData={{ ...baseUserData }}
			scale={[1, 1, 1]}
			rotation={rotation === 'VERTICAL' ? [0, 0, 0] : [0, Math.PI / 2, 0]}
		>
			{/* Faces du rectangle */}
			<Face
				position={[0, RECTANGLE_DIMENSIONS.height / 2, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
				geometry={faceGeometry}
				userData={
					{
						...baseUserData,
						type: MeshTypes.SHAPE_FACE,
						faceDirection: MeshDirections.TOP,
					} as ShapeFaceUserData
				}
			/>
			<Face
				position={[0, -RECTANGLE_DIMENSIONS.height / 2, 0]}
				rotation={[Math.PI / 2, 0, 0]}
				geometry={faceGeometry}
				userData={{ ...baseUserData }}
			/>
			<mesh userData={{ ...baseUserData }}>
				<tubeGeometry
					args={[
						new THREE.LineCurve3(
							new THREE.Vector3(0, -RECTANGLE_DIMENSIONS.depth / 2, 0),
							new THREE.Vector3(0, RECTANGLE_DIMENSIONS.depth / 2, 0)
						),
						64,
						RECTANGLE_DIMENSIONS.holeRadius,
						64,
						false,
					]}
				/>
				{opacity === 1 && <Edges linewidth={1} color={cubeColor.clone().addScalar(0.2)} />}
				{material}
			</mesh>
			{faceDetails.map((face, index) => (
				<Face
					key={index}
					position={face.position}
					rotation={face.rotation}
					geometry={face.geometry}
					userData={{ ...baseUserData }}
				/>
			))}
		</mesh>
	);
};

export default BridgeComponent;
