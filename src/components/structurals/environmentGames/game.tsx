import React, { useMemo, useState, useRef } from 'react';
import { shapeHitbox, Shapes } from '../../modelisation/shapes/Shape';
import { GameMode } from '../../../enum/GameMode';
import Board from '../../modelisation/Board';
import { ThreeEvent } from '@react-three/fiber';
import {
	CellBoardUserData,
	GroupUserData,
	Object3DWithUserData,
	ShapeFaceUserData,
	ShapeUserData,
	UserData,
} from '../../../interfaces/userDatas';
import { v4 as uuidv4 } from 'uuid';
import { Intersection, Object3DEventMap } from 'three';
import {
	CartesianCoordinate,
	coordinateAddition,
	coordinatesAreEqual,
	hasCommonCoordinate,
} from '../../../interfaces/CartesianCoordinate';
import Group, { ShapeGroup } from '../../modelisation/shapes/group';
import { Action } from '../../../enum/Action';
import { MESH_DIRECTIONS } from '../../../constants/MESH';
import { BLOCK_SIZE, GAME_RULE } from '../../../constants/ENVIRONMENT_CONSTANTS';
import { useGlobalState } from '../GlobalStateProvider';
import { MeshTypes } from '../../../enum/Mesh';
import { ShapeList } from '../../../enum/ShapeList';

function findParentShape(object: Object3DWithUserData<Object3DEventMap>): Object3DWithUserData<Object3DEventMap> {
	if (object.userData.type === MeshTypes.SHAPE) {
		return object;
	} else if (object.userData.type === MeshTypes.NON_CLICKABLE_FACE || object.userData.type === MeshTypes.SHAPE_FACE) {
		let currentMesh = object;
		while (currentMesh.userData.type !== MeshTypes.SHAPE) {
			if (currentMesh.parent) {
				currentMesh = currentMesh.parent as Object3DWithUserData<Object3DEventMap>;
			}
		}
		return currentMesh;
	} else {
		return object;
	}
}

function getPosition(shape: Object3DWithUserData<Object3DEventMap>): CartesianCoordinate {
	let position = { x: 0, y: 0, z: 0 } as CartesianCoordinate;
	if (shape.userData.type === MeshTypes.SHAPE) {
		const userData = shape.userData as ShapeUserData;
		position = coordinateAddition(position, userData.position) as CartesianCoordinate;
	} else if (shape.userData.type === MeshTypes.GROUP) {
		const userData = shape.userData as GroupUserData;
		position = coordinateAddition(position, userData.position) as CartesianCoordinate;
	}
	const parentShape = shape.parent as Object3DWithUserData<Object3DEventMap>;
	if (parentShape.userData.type === MeshTypes.GROUP) {
		return coordinateAddition(position, getPosition(parentShape)) as CartesianCoordinate;
	} else {
		return position;
	}
}

const Game: React.FC = () => {
	const {
		gameMode: { gameMode },
		environmentMode: { environmentMode },
		pointer: { setPointer },
		shapeInPlace,
		inventory,
		action,
	} = useGlobalState();

	const { objects, pending } = shapeInPlace;
	const [mouseDownPosition, setMouseDownPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	const handlePendingPlacement = (position: CartesianCoordinate, shape: ShapeList, skipCheckBelow?: boolean) => {
		const newShape = {
			uuid: uuidv4(),
			pending: true,
			breakable: false,
			color: inventory!.currentColor,
			position,
			shape,
		};
		return GAME_RULE[environmentMode](
			newShape,
			coordinateAddition(
				shapeHitbox[newShape.shape] as CartesianCoordinate[],
				newShape.position
			) as CartesianCoordinate[],
			shapeInPlace.getPosition(),
			skipCheckBelow
		);
	};
	//getPosition
	const placingObject = (e: ThreeEvent<PointerEvent>) => {
		const firstPendingMesh = e.intersections[0].object as Object3DWithUserData<Object3DEventMap>;
		const pendingShape = findParentShape(firstPendingMesh) as Object3DWithUserData<Object3DEventMap>;
		//?.userData as ShapeUserData
		if (firstPendingMesh.userData.type === MeshTypes.SHAPE_FACE) {
			const userData = firstPendingMesh.userData as ShapeFaceUserData;
			const pendingPosition = coordinateAddition(
				getPosition(pendingShape),
				MESH_DIRECTIONS[userData.faceDirection]
			) as CartesianCoordinate;
			shapeInPlace.confirmPending(handlePendingPlacement(pendingPosition, inventory!.currentShape, true));
		} else {
			shapeInPlace.confirmPending();
		}
		e.stopPropagation();
	};

	const removingObject = (e: ThreeEvent<PointerEvent>) => {
		if (e.intersections[0]) {
			let pointedMesh = findParentShape(e.intersections[0].object as Object3DWithUserData<Object3DEventMap>);
			if (pointedMesh.userData.type === MeshTypes.SHAPE) {
				while (pointedMesh.parent?.userData.type === MeshTypes.GROUP) {
					pointedMesh = pointedMesh.parent as Object3DWithUserData<Object3DEventMap>;
				}
				const position = getPosition(pointedMesh);
				shapeInPlace.removeObject(position.x, position.y, position.z);
			}
			handleBreakingBlock(e.intersections.slice(1));
		}
		e.stopPropagation();
	};

	const lastIntersectionsRef = useRef<string[]>([]);

	const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
		const intersectionWithoutPending = e.intersections.filter((intersection) => {
			const shape = findParentShape(intersection.object as Object3DWithUserData<Object3DEventMap>);
			if (shape.userData.type === MeshTypes.SHAPE) {
				const userData = shape.userData as ShapeUserData;
				return !userData.pending;
			} else {
				return true;
			}
		});
		console.log(intersectionWithoutPending[0]);
		const currentIntersectionUuids = intersectionWithoutPending.map((elem) => elem.object.uuid).sort();

		if (JSON.stringify(currentIntersectionUuids) === JSON.stringify(lastIntersectionsRef.current)) {
			return;
		}
		lastIntersectionsRef.current = currentIntersectionUuids;

		if (action.action === Action.PLACE) {
			handlePendingBlock(intersectionWithoutPending);
		} else {
			handleBreakingBlock(intersectionWithoutPending);
		}
		e.stopPropagation();
	};

	const handlePendingBlock = (intersections: Intersection[]) => {
		if (intersections[0]) {
			const pointedMesh = intersections[0].object as Object3DWithUserData<Object3DEventMap>;
			if (pointedMesh.userData.type === MeshTypes.CELL_BOARD) {
				const cellBoardUserData = pointedMesh.userData as CellBoardUserData;
				const currentPending = shapeInPlace.pending;
				const pendingPosition = {
					...cellBoardUserData.position,
					y: cellBoardUserData.position.y + 1,
				};
				if (currentPending) {
					const currentPendingPosition =
						currentPending instanceof ShapeGroup ? currentPending.startingPoint : currentPending.position;
					if (!coordinatesAreEqual(currentPendingPosition, pendingPosition)) {
						shapeInPlace.setPending(handlePendingPlacement(pendingPosition, inventory!.currentShape));
					}
				} else {
					shapeInPlace.setPending(handlePendingPlacement(pendingPosition, inventory!.currentShape));
				}
			} else if (pointedMesh.userData.type === MeshTypes.SHAPE_FACE) {
				const userData = pointedMesh.userData as ShapeFaceUserData;
				const shape = findParentShape(pointedMesh) as Object3DWithUserData<Object3DEventMap>;
				const shapeUserData = shape?.userData as ShapeUserData;
				if (!shapeUserData.pending) {
					const currentPending = shapeInPlace.pending;
					const pendingPosition = coordinateAddition(
						getPosition(shape),
						MESH_DIRECTIONS[userData.faceDirection]
					) as CartesianCoordinate;

					if (currentPending) {
						const currentPendingPosition =
							currentPending instanceof ShapeGroup
								? currentPending.startingPoint
								: currentPending.position;

						if (!hasCommonCoordinate([currentPendingPosition], [pendingPosition])) {
							shapeInPlace.setPending(handlePendingPlacement(pendingPosition, inventory!.currentShape));
						}
					} else {
						shapeInPlace.setPending(handlePendingPlacement(pendingPosition, inventory!.currentShape));
					}
				}
			} else {
				shapeInPlace.setPending(undefined);
			}
		}
	};

	const handleBreakingBlock = (intersections: Intersection[]) => {
		console.log('change');
		if (intersections[0]) {
			let pointedMesh = findParentShape(intersections[0].object as Object3DWithUserData<Object3DEventMap>);
			if (pointedMesh.userData.type === MeshTypes.SHAPE) {
				while (pointedMesh.parent?.userData.type === MeshTypes.GROUP) {
					pointedMesh = pointedMesh.parent as Object3DWithUserData<Object3DEventMap>;
				}
				const position = getPosition(pointedMesh);
				const currentShape = shapeInPlace.getObjectAtPosition(position.x, position.y, position.z);
				if (currentShape?.position != position) {
					shapeInPlace.removeBreaking();
					shapeInPlace.setBreaking(position);
				} else {
					return;
				}
				if (setPointer) {
					setPointer({
						cartesianCoordinate: position,
						type: MeshTypes.SHAPE,
					});
				}
			} else if (pointedMesh.userData.type === MeshTypes.CELL_BOARD) {
				const cell = pointedMesh.userData as CellBoardUserData;
				if (setPointer) {
					setPointer({
						cartesianCoordinate: cell.position,
						type: MeshTypes.CELL_BOARD,
					});
				}
			}
		}
	};

	const eventHandlers = {
		onPointerDown: (e: ThreeEvent<PointerEvent>) => setMouseDownPosition({ x: e.clientX, y: e.clientY }),
		onPointerMove: handlePointerMove,
		onPointerOut: (e: ThreeEvent<PointerEvent>) => {
			if (e.intersections.length === 0) {
				shapeInPlace.setPending(undefined);
				shapeInPlace.removeBreaking();
				if (setPointer) {
					setPointer(undefined);
				}
			}
		},
		onPointerUp: (e: ThreeEvent<PointerEvent>) => {
			if (mouseDownPosition && (gameMode === GameMode.SIMULATION || gameMode === GameMode.MULTIMODAL)) {
				const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
				const deltaY = Math.abs(e.clientY - mouseDownPosition.y);
				if (deltaX < 5 && deltaY < 5) {
					if (action.action === Action.PLACE) {
						if (shapeInPlace.pending) {
							placingObject(e);
						}
					} else if (action.action === Action.BREAK) {
						removingObject(e);
					}
				}
			}
			setMouseDownPosition(null);
		},
	};

	const renderedObjects = useMemo(() => {
		return objects.map((object) =>
			object instanceof ShapeGroup ? (
				<Group key={`${object.uuid}-${object.breakable}-${object.pending}`} shapeGroup={{ ...object }} />
			) : (
				<Shapes key={`${object.uuid}-${object.breakable}-${object.pending}`} {...object} />
			)
		);
	}, [objects]);

	const pendingObject = useMemo(
		() =>
			pending &&
			(gameMode === GameMode.SIMULATION || gameMode === GameMode.MULTIMODAL) &&
			(pending instanceof ShapeGroup ? (
				<Group key={pending.uuid} shapeGroup={pending} />
			) : (
				<Shapes key={pending.uuid} {...pending} />
			)),
		[pending, gameMode]
	);

	return (
		<mesh
			{...eventHandlers}
			scale={[BLOCK_SIZE[environmentMode].x, BLOCK_SIZE[environmentMode].y, BLOCK_SIZE[environmentMode].z]}
			userData={
				{
					type: MeshTypes.SCENE,
				} as UserData
			}
		>
			<Board key={environmentMode} environmentMode={environmentMode} />
			{renderedObjects}
			{pendingObject}
		</mesh>
	);
};

export default Game;
