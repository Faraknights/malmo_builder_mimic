import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { shapeComponentProps } from './Shape';
import { NonClickableFaceUserData, ShapeFaceUserData } from '../../../interfaces/userDatas';
import { OPACITY_PENDING_OBJECT } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { MeshDirections, MeshTypes } from '../../../enum/Mesh';

function Screw({ pending, position, color }: shapeComponentProps) {
  const nutColor = new THREE.Color(color.hex);
  const opacity = pending ? OPACITY_PENDING_OBJECT : 1;
  
  // Material for the screw
  const material = (
    <meshStandardMaterial
      attach="material"
      color={nutColor}
      side={THREE.FrontSide}
      transparent={opacity !== 1}
      opacity={opacity}
    />
  );

  // Use useMemo to create the geometry only once
  const screwGeometry = useMemo(() => {
    // Create the main hemisphere geometry
    const hemisphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    );
    
    // Create two box geometries for the cross hole
    const box1Geometry = new THREE.BoxGeometry(0.1, 0.5, 0.2);
    box1Geometry.translate(0, 0, -0.4); // Move the box upwards before creating the mesh
    box1Geometry.rotateX(Math.PI / 2); // Rotate the box to align with the sphere
    const box1 = new THREE.Mesh(box1Geometry);
    
    const box2Geometry = new THREE.BoxGeometry(0.5, 0.2, 0.1);
    box2Geometry.translate(0, 0.4, 0); // Move the box upwards before creating the mesh
    const box2 = new THREE.Mesh(box2Geometry);
    
    // Use CSG to subtract the boxes from the hemisphere
    const hemisphereCSG = CSG.fromMesh(hemisphere);
    const box1CSG = CSG.fromMesh(box1);
    const box2CSG = CSG.fromMesh(box2);
    const resultCSG = hemisphereCSG
      .subtract(box1CSG)
      .subtract(box2CSG);
    
    // Convert back to mesh
    const resultMesh = CSG.toMesh(resultCSG, hemisphere.matrixWorld);
    return resultMesh.geometry;
  }, []);

  // Bottom face geometry (flat face for the bottom)
  const faceGeometry = useMemo(() => {
    return new THREE.CircleGeometry(0.5, 32); // Create a circular face with the same radius
  }, []);

  return (
    <mesh
      userData={{
        type: MeshTypes.NON_CLICKABLE_FACE,
      } as NonClickableFaceUserData}
      scale={[1, 2, 1]} // Full 1x1x1 scale
    >
      {/* Hemisphere with cross hole */}
      <mesh
        position={[0, -0.25, 0]} // Offset the sphere to start from the bottom
        userData={{
			type: MeshTypes.NON_CLICKABLE_FACE,
			position: position,
		  } as NonClickableFaceUserData}
        geometry={screwGeometry} // Use the CSG-modified geometry here
      >
        {material}
      </mesh>

      {/* Bottom Face */}
      <mesh
        position={[0, -0.25, 0]} // Position at the bottom of the screw
        rotation={[Math.PI / 2, 0, 0]} // Rotate to face the bottom
        userData={{
          type: MeshTypes.SHAPE_FACE,
          faceDirection: MeshDirections.BOTTOM,
        } as ShapeFaceUserData}
        geometry={faceGeometry} // Circular bottom face
      >
        {material}
      </mesh>
    </mesh>
  );
}

export default Screw;