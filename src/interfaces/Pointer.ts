import { MeshTypes } from '../enum/Mesh';
import { CartesianCoordinate } from './CartesianCoordinate';

export interface Pointer {
	cartesianCoordinate: CartesianCoordinate;
	type: MeshTypes;
}
