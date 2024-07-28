import React from 'react';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { Edges } from '@react-three/drei';
import { OPACITY_PENDING_OBJECT } from '../../../constants/environment';
import { ShapeFaceUserData, MeshType } from '../../../constants/meshType';
import { DIRECTION } from '../../../constants/direction';

interface CubeFaceDirectionProperties {
	translation: THREE.Vector3;
	rotation: THREE.Euler;
}

const CubeFaceDirection: Record<DIRECTION, CubeFaceDirectionProperties> = {
	[DIRECTION.FRONT]: {
		translation: new THREE.Vector3(0, 0, 1 / 2),
		rotation: new THREE.Euler(0, 0, 0),
	},
	[DIRECTION.BACK]: {
		translation: new THREE.Vector3(0, 0, -1 / 2),
		rotation: new THREE.Euler(0, Math.PI, 0),
	},
	[DIRECTION.TOP]: {
		translation: new THREE.Vector3(0, 1 / 2, 0),
		rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
	},
	[DIRECTION.BOTTOM]: {
		translation: new THREE.Vector3(0, -1 / 2, 0),
		rotation: new THREE.Euler(Math.PI / 2, 0, 0),
	},
	[DIRECTION.LEFT]: {
		translation: new THREE.Vector3(1 / 2, 0, 0),
		rotation: new THREE.Euler(0, Math.PI / 2, 0),
	},
	[DIRECTION.RIGHT]: {
		translation: new THREE.Vector3(-1 / 2, 0, 0),
		rotation: new THREE.Euler(0, -Math.PI / 2, 0),
	},
};

interface CubeFaceProps {
	color: THREE.Color;
	opacity: number;
	facingDirection: DIRECTION;
}

const CubeFace = (props: CubeFaceProps) => {
	const properties = CubeFaceDirection[props.facingDirection];
	return (
		<mesh
			position={properties.translation}
			rotation={properties.rotation}
			userData={
				{
					type: MeshType.SHAPE_FACE,
					faceDirection: props.facingDirection,
				} as ShapeFaceUserData
			}
		>
			<planeGeometry attach="geometry" args={[1, 1]} />
			{props.opacity === 1 && (
				<Edges linewidth={1} threshold={15} color={props.color} />
			)}
			<meshStandardMaterial
				attach="material"
				color={props.color}
				transparent={props.opacity !== 1}
				opacity={props.opacity}
			/>
		</mesh>
	);
};

const Cube = ({ pending, color }: shapeComponentProps) => {
	const cubeColor = new THREE.Color(color.hex);
	return (
		<>
			{Object.entries(DIRECTION).map(([key, properties]) => (
				<CubeFace
					key={key}
					color={cubeColor}
					opacity={pending ? OPACITY_PENDING_OBJECT : 1}
					facingDirection={properties}
				/>
			))}
		</>
	);
};

export default Cube;
