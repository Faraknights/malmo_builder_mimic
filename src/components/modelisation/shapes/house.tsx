import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { MeshTypes } from '../../../enum/Mesh';
import { useRouter } from 'next/router';

function House({ pending, position, color }: shapeComponentProps) {
	const houseColor = useMemo(() => new THREE.Color(color.hex), [color.hex]);
	const opacity = pending ? OPACITY_PENDING_OBJECT : 1;
	const router = useRouter();

	// Load the 3D model only once
	const { scene: originalScene } = useGLTF(`${router.basePath}/assets/gltf/house.gltf`); // Replace with the actual model path

	// Create a cloned scene for this instance
	const clonedScene = useMemo(() => {
		const cloned = originalScene.clone(true); // Clone the scene deeply
		cloned.traverse((child) => {
			if ((child as THREE.Mesh).isMesh) {
				const mesh = child as THREE.Mesh;
				mesh.material = new THREE.MeshStandardMaterial({
					color: houseColor,
					side: THREE.DoubleSide,
					transparent: opacity < 1,
					opacity,
				});
				mesh.castShadow = true;
				mesh.receiveShadow = true;
			}
		});
		return cloned;
	}, [originalScene, houseColor, opacity]);

	return (
		<mesh
			userData={
				{
					type: MeshTypes.NON_CLICKABLE_FACE,
					position,
					pending,
				} as NonClickableFaceUserData
			}
			scale={[0.045, 0.1, 0.04]}
			position={[3, -1.4, 0.6]}
		>
			{/* Render the cloned scene */}
			<primitive object={clonedScene} />
		</mesh>
	);
}

export default House;
