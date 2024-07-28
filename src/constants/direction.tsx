import { CartesianCoordinate } from '../interfaces/cartesianCoordinate';

export enum DIRECTION {
	FRONT = 'FRONT',
	BACK = 'BACK',
	TOP = 'TOP',
	BOTTOM = 'BOTTOM',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
}

export const pendingDirection: Record<DIRECTION, CartesianCoordinate> = {
	[DIRECTION.FRONT]: { x: 0, y: 0, z: 1 },
	[DIRECTION.BACK]: { x: 0, y: 0, z: -1 },
	[DIRECTION.TOP]: { x: 0, y: 1, z: 0 },
	[DIRECTION.BOTTOM]: { x: 0, y: -1, z: 0 },
	[DIRECTION.LEFT]: { x: 1, y: 0, z: 0 },
	[DIRECTION.RIGHT]: { x: -1, y: 0, z: 0 },
};
