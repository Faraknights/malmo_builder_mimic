import { MeshType } from '../constants/meshType';
import { CartesianCoordinate } from './cartesianCoordinate';

export interface PointerProps {
	cartesianCoordinate: CartesianCoordinate;
	type: MeshType;
}
