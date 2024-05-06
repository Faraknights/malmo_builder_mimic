import React, { useMemo, useState } from "react";
import { ShapeInPlaceProps } from "../../classes/shapeInPlace";
import { shapeList, Shapes } from "./shapes/Shape";
import { GameMode } from "../../interfaces/mode";
import Board from "./Board";
import { inventoryProps } from "../../classes/Inventory";
import { ThreeEvent } from "@react-three/fiber";
import { CellBoardUserData, CubeFaceUserData, CubeUserData, MeshType } from "../../constants/meshType";
import { DirectionInfo } from "./shapes/Cube";
import { COLORS } from "../../constants/colors";
import { v4 as uuidv4 } from 'uuid';
import { Intersection } from "three";

interface MinecraftProps {
	shapeInPlace: ShapeInPlaceProps
	gameMode: GameMode
	inventory?: inventoryProps
}

const Minecraft: React.FC<MinecraftProps> = ({
	shapeInPlace,
	gameMode,
	inventory
}) => {
	const { objects, pending } = shapeInPlace;
	const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);

	const CallBackwatchPendingBlock = (intersections: Intersection[]) =>{
		for (const pointedMesh of intersections.map(mesh => mesh.object)) {
			if (pointedMesh.userData && 'type' in pointedMesh.userData){
				if(pointedMesh.userData.type === MeshType.CUBE_FACE) {
					const cubeFaceUserData = pointedMesh.userData as CubeFaceUserData
					const cubeUserData = pointedMesh.parent?.userData as CubeUserData
					if (!cubeUserData.pending) {
						shapeInPlace.setPending({
							uuid: uuidv4(),
							pending: true,
							color: inventory!.currentColor,
							position: {
								x: cubeUserData.position.x + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.x,
								y: cubeUserData.position.y + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.y,
								z: cubeUserData.position.z + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.z,
							},
							shape: shapeList.CUBE
						})
						break
					}
				}

				if(pointedMesh.userData.type === MeshType.CELL_BOARD){
					const cellBoardUserData = pointedMesh.userData as CellBoardUserData
					shapeInPlace.setPending({
						uuid: uuidv4(),
						pending: true,
						color: inventory!.currentColor,
						position: {
							x: cellBoardUserData.position.x,
							y: cellBoardUserData.position.y + 1,
							z: cellBoardUserData.position.z
						},
						shape: shapeList.CUBE
					})
					break;
				}
			}
		} 
	}

	const handleRightClick = (e: ThreeEvent<PointerEvent>) => {
		//if the first object intersected is a cube then check if it's a pending block
		const pointedMesh = e.intersections[0].object
		if (pointedMesh.userData && 'type' in pointedMesh.userData && pointedMesh.userData.type === MeshType.CUBE_FACE) {
			const cubeFaceUserData = pointedMesh.userData as CubeFaceUserData
			const cubeUserData = pointedMesh.parent?.userData as CubeUserData
			//if it is a pending block then we can put it in the list of our placed blocks
			if (cubeUserData.pending) {
				shapeInPlace.confirmPending({
					uuid: uuidv4(),
					pending: true,
					color: inventory!.currentColor,
					position: {
						x: cubeUserData.position.x + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.x,
						y: cubeUserData.position.y + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.y,
						z: cubeUserData.position.z + DirectionInfo[cubeFaceUserData.faceDirection].pendingBlock.z,
					},
					shape: shapeList.CUBE
				})
			}
		}
	}

	const handleLeftClick = (e: ThreeEvent<PointerEvent>) => {
		// if the left button is clicked the we break the block
	    let i = 0;
		const intersections = e.intersections;
		while (i < intersections.length) {
        	const pointedMesh = intersections[i].object;
			if (pointedMesh.userData && 'type' in pointedMesh.userData){
				if(pointedMesh.userData.type === MeshType.CUBE_FACE) {
					const cubeUserData = pointedMesh.parent?.userData as CubeUserData
					if (!cubeUserData.pending) {
						shapeInPlace.removeObject(
							cubeUserData.position.x,
							cubeUserData.position.y,
							cubeUserData.position.z
						)
						break
					}
				}
			}
			i++
		}
		CallBackwatchPendingBlock(e.intersections.filter((inter, j) => j > i))
	}

	const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
		CallBackwatchPendingBlock(e.intersections)
	}

	// Déclaration des gestionnaires d'événements
	const eventHandlers = {
		onPointerDown: (e: ThreeEvent<PointerEvent>) => setMouseDownPosition({ x: e.clientX, y: e.clientY }),
		onPointerMove: handlePointerMove,
		onPointerOut: ((e: ThreeEvent<PointerEvent>) => {
			e.stopPropagation()
			shapeInPlace.setPending(undefined)
		}),
		onPointerUp: ((e: ThreeEvent<PointerEvent>) => {
			e.stopPropagation()
			if (mouseDownPosition) {
				const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
				const deltaY = Math.abs(e.clientY - mouseDownPosition.y);
				if (deltaX < 5 && deltaY < 5) {
					if (e.button === 2) {
						handleRightClick(e);
					} else if (e.button === 0) {
						handleLeftClick(e);
					}
				}
			}
			setMouseDownPosition(null);
		}),
	};

	// Utilisation de useMemo pour optimiser le rendu des formes
	const renderedObjects = useMemo(() => {
		return objects.map(object => (
			<Shapes
				key={object.uuid}
				{...object}
			/>
		));
	}, [objects]);

	return (
		<mesh {...(gameMode === GameMode.SIMULATION ? eventHandlers : {})}>
			<Board />
			{renderedObjects}
			{pending && gameMode === GameMode.SIMULATION && (
				<Shapes
					key={pending.uuid}
					{...pending}
				/>
			)}
		</mesh>
	);
};

export default Minecraft;