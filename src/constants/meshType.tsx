import { Object3D, Object3DEventMap } from 'three';
import { CartesianCoordinate } from '../interfaces/cartesianCoordinate';
import { DIRECTION } from './direction';
import { shapeList } from './shapeList';

export enum MeshType {
	CELL_BOARD = 'CELL_BOARD',
	SHAPE = 'SHAPE',
	SHAPE_FACE = 'SHAPE_FACE',
	GROUP = 'GROUP',
	NON_CLICKABLE_FACE = 'NON_CLICKABLE_FACE',
	SCENE = 'SCENE',
}

export interface UserData {
	type: MeshType;
}

export interface CellBoardUserData extends UserData {
	type: MeshType.CELL_BOARD;
	position: CartesianCoordinate;
}

export interface ShapeUserData extends UserData {
	type: MeshType.SHAPE;
	position: CartesianCoordinate;
	pending: boolean;
	shape: shapeList;
}

export interface ShapeFaceUserData extends UserData {
	type: MeshType.SHAPE_FACE;
	faceDirection: DIRECTION;
}

export interface GroupUserData extends UserData {
	type: MeshType.GROUP;
	position: CartesianCoordinate;
	pending: boolean;
}

export interface NonClickableFaceUserData extends UserData {
	type: MeshType.NON_CLICKABLE_FACE;
}

export interface Object3DWithUserData<T extends Object3DEventMap>
	extends Object3D<T> {
	userData: UserData;
}
