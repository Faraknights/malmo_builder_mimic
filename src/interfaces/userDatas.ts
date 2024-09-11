import { Object3D, Object3DEventMap } from 'three';
import { CartesianCoordinate } from './CartesianCoordinate';
import { MeshDirections, MeshTypes } from '../enum/Mesh';
import { ShapeList } from '../enum/ShapeList';

export interface UserData {
	type: MeshTypes;
}

export interface CellBoardUserData extends UserData {
	type: MeshTypes.CELL_BOARD;
	position: CartesianCoordinate;
}

export interface ShapeUserData extends UserData {
	type: MeshTypes.SHAPE;
	position: CartesianCoordinate;
	pending: boolean;
	shape: ShapeList;
}

export interface ShapeFaceUserData extends UserData {
	type: MeshTypes.SHAPE_FACE;
	faceDirection: MeshDirections;
}

export interface GroupUserData extends UserData {
	type: MeshTypes.GROUP;
	position: CartesianCoordinate;
	pending: boolean;
}

export interface NonClickableFaceUserData extends UserData {
	type: MeshTypes.NON_CLICKABLE_FACE;
}

export interface Object3DWithUserData<T extends Object3DEventMap> extends Object3D<T> {
	userData: UserData;
}
