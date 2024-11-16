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

    // Géométrie des faces avant/arriere
    const sideGeometryX = React.useMemo(() => {
        const width = RECTANGLE_DIMENSIONS.width;
        const depth = RECTANGLE_DIMENSIONS.depth;
        return new THREE.PlaneGeometry(width, depth);
    }, []);

    // Géométrie des faces latérales
    const sideGeometryY = React.useMemo(() => {
        const height = RECTANGLE_DIMENSIONS.height;
        const depth = RECTANGLE_DIMENSIONS.depth;
        return new THREE.PlaneGeometry(height, depth);
    }, []);

    const material = (
        <meshStandardMaterial
            attach="material"
            color={cubeColor}
            side={THREE.DoubleSide}
            transparent={opacity !== 1}
            opacity={opacity}
        />
    );

    return (
        <mesh 
			userData={{ type: MeshTypes.NON_CLICKABLE_FACE, pending }}
			scale={[1, 1, 1]}
			rotation={rotation === 'VERTICAL' ? [0,0,0] : [0, Math.PI / 2, 0]}
		>
            {/* Faces du rectangle */}
            <mesh
                position={[0, RECTANGLE_DIMENSIONS.height / 2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                userData={{
                    type: MeshTypes.SHAPE_FACE,
                    faceDirection: MeshDirections.TOP,
                } as ShapeFaceUserData}
                geometry={faceGeometry}
            >
                {material}
            </mesh>
            <mesh
                position={[0, -RECTANGLE_DIMENSIONS.height / 2, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                userData={{
                    type: MeshTypes.SHAPE_FACE,
                    faceDirection: MeshDirections.BOTTOM,
                } as ShapeFaceUserData}
                geometry={faceGeometry}
            >
                {material}
            </mesh>
            {/* Tube (corps) du rectangle */}
            <mesh
                userData={{
                    type: MeshTypes.NON_CLICKABLE_FACE,
                    pending: pending,
                } as NonClickableFaceUserData}
            >
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
            {/* Faces latérales */}
            {/* Avant */}
            <mesh
                position={[0, 0, RECTANGLE_DIMENSIONS.depth / 2]}
                rotation={[0, 0, 0]} // Face orientée vers l'avant
                geometry={sideGeometryX}
            >
                {material}
            </mesh>
            {/* Arrière */}
            <mesh
                position={[0, 0, -RECTANGLE_DIMENSIONS.depth / 2]}
                rotation={[0, Math.PI, 0]} // Face orientée vers l'arrière
                geometry={sideGeometryX}
            >
                {material}
            </mesh>
            {/* Gauche */}
            <mesh
                position={[-RECTANGLE_DIMENSIONS.width / 2, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]} // Face orientée vers la gauche
                geometry={sideGeometryY}
            >
                {material}
            </mesh>
            {/* Droite */}
            <mesh
                position={[RECTANGLE_DIMENSIONS.width / 2, 0, 0]}
                rotation={[0, Math.PI / 2, 0]} // Face orientée vers la droite
                geometry={sideGeometryY}
            >
                {material}
            </mesh>
        </mesh>
    );
};

export default BridgeComponent;