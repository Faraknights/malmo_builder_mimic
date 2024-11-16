import React from 'react';
import * as THREE from 'three';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData, ShapeFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { MeshDirections, MeshTypes } from '../../../enum/Mesh';

function Gasket({ pending, position, color }: shapeComponentProps) {
  const gasketColor = new THREE.Color(color.hex);
  const opacity = pending ? OPACITY_PENDING_OBJECT : 1;

  return (
    <mesh
        userData={{
        type: MeshTypes.SHAPE_FACE,
        faceDirection: MeshDirections.TOP,
        } as ShapeFaceUserData}
      scale={[1, 1, 5]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <torusGeometry args={[0.4, 0.1, 8, 16]} />
      <meshStandardMaterial
        color={gasketColor}
        side={THREE.DoubleSide}
        transparent={opacity !== 1}
        opacity={opacity}
      />
    </mesh>
  );
}

export default Gasket;
