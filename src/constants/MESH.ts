import { MeshDirections } from '../enum/Mesh';
import { CartesianCoordinate } from '../interfaces/CartesianCoordinate';

export const MESH_DIRECTIONS: Record<MeshDirections, CartesianCoordinate> = {
	[MeshDirections.FRONT]: { x: 0, y: 0, z: 1 },
	[MeshDirections.BACK]: { x: 0, y: 0, z: -1 },
	[MeshDirections.TOP]: { x: 0, y: 1, z: 0 },
	[MeshDirections.BOTTOM]: { x: 0, y: -1, z: 0 },
	[MeshDirections.LEFT]: { x: 1, y: 0, z: 0 },
	[MeshDirections.RIGHT]: { x: -1, y: 0, z: 0 },
};
