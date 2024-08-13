import { CartesianCoordinate, hasCommonCoordinate } from '../interfaces/cartesianCoordinate';
import * as THREE from 'three';
import { EnvironmentMode, EnvironmentTypeProps } from '../classes/EnvironmentMode';
import { COLORS, definedColors } from './colors';
import Color from '../interfaces/Color';
import { shapeList } from './shapeList';
import { shapeProps } from '../components/modelisation/shapes/Shape';
import { GameLog } from '../classes/gameLog';
import Simulation from '../components/structurals/Simulation';
import Visualization from '../components/structurals/Visualization';
import Nebula from '../components/structurals/Nebula';
import { GameMode } from '../classes/gameMode';

export const BLOCK_SIZE: { [key in EnvironmentMode]: CartesianCoordinate } = {
	[EnvironmentMode.MINECRAFT]: { x: 1, y: 1, z: 1 },
	[EnvironmentMode.COCOBOTS]: { x: 1, y: 0.3, z: 1 },
};

export const ENVIRONMENT_COLORS: { [key in EnvironmentMode]: Color[] } = {
	[EnvironmentMode.MINECRAFT]: [
		COLORS[definedColors.GREEN],
		COLORS[definedColors.BLUE],
		COLORS[definedColors.PURPLE],
		COLORS[definedColors.RED],
		COLORS[definedColors.ORANGE],
		COLORS[definedColors.YELLOW],
	],
	[EnvironmentMode.COCOBOTS]: [
		COLORS[definedColors.GREEN],
		COLORS[definedColors.BLUE],
		COLORS[definedColors.RED],
		COLORS[definedColors.YELLOW],
		COLORS[definedColors.NEW],
	],
};

export const ENVIRONMENT_SHAPES: { [key in EnvironmentMode]: shapeList[] } = {
	[EnvironmentMode.MINECRAFT]: [shapeList.CUBE],
	[EnvironmentMode.COCOBOTS]: [
		shapeList.NUT,
		shapeList.WASHER,
		shapeList.SCREW,
		shapeList.HORIZONTAL_BRIDGE,
		shapeList.VERTICAL_BRIDGE,
	],
};

interface gridSizeProps {
	x: {
		min: number;
		max: number;
	};
	y: {
		min: number;
		max: number;
	};
	z: {
		min: number;
		max: number;
	};
}

export const GRID_SIZE: { [key in EnvironmentMode]: gridSizeProps } = {
	[EnvironmentMode.MINECRAFT]: {
		x: { min: -5, max: 5 },
		y: { min: 1, max: 11 },
		z: { min: -5, max: 5 },
	},
	[EnvironmentMode.COCOBOTS]: {
		x: { min: 0, max: 7 },
		y: { min: 1, max: 11 },
		z: { min: 0, max: 7 },
	},
};

const isWithinLimits = (coordinates: CartesianCoordinate[], gridSize: gridSizeProps): boolean => {
	return coordinates.every(
		(coord) =>
			coord.x >= gridSize.x.min &&
			coord.x <= gridSize.x.max &&
			coord.y >= gridSize.y.min &&
			coord.y <= gridSize.y.max &&
			coord.z >= gridSize.z.min &&
			coord.z <= gridSize.z.max
	);
};

const hasCoordinateBelow = (coordinate: CartesianCoordinate, placedCoordinates: CartesianCoordinate[]): boolean => {
	return (
		coordinate.y === 1 ||
		placedCoordinates.some(
			(placedCoord) =>
				placedCoord.x === coordinate.x && placedCoord.y === coordinate.y - 1 && placedCoord.z === coordinate.z
		)
	);
};

export const GAME_RULE: {
	[key in EnvironmentMode]: (
		shape: shapeProps,
		newCoordinates: CartesianCoordinate[],
		placedCoordinates: CartesianCoordinate[],
		skipCheckBelow?: boolean
	) => shapeProps | undefined;
} = {
	[EnvironmentMode.MINECRAFT]: (shape, newCoordinates, placedCoordinates) => {
		//const newCoordinates = coordinateAddition(shapeHitbox[shape.shape] as CartesianCoordinate[], shape.position) as CartesianCoordinate[];
		//const placedCoordinates = shapeInPlace.getPosition();
		if (
			!hasCommonCoordinate(newCoordinates, placedCoordinates) &&
			isWithinLimits(newCoordinates, GRID_SIZE[EnvironmentMode.MINECRAFT])
		)
			return shape;
		return undefined;
	},
	[EnvironmentMode.COCOBOTS]: (shape, newCoordinates, placedCoordinates, skipCheckBelow?) => {
		//const newCoordinates = coordinateAddition(shapeHitbox[shape.shape] as CartesianCoordinate[], shape.position) as CartesianCoordinate[];
		//const placedCoordinates = shapeInPlace.getPosition();
		if (
			!hasCommonCoordinate(newCoordinates, placedCoordinates) &&
			isWithinLimits(newCoordinates, GRID_SIZE[EnvironmentMode.COCOBOTS]) &&
			(skipCheckBelow || newCoordinates.every((coord) => hasCoordinateBelow(coord, placedCoordinates)))
		)
			return shape;
		return undefined;
	},
};

export const EXPORT_GAME_LOG: {
	[key in EnvironmentMode]: (gameLog: GameLog) => object;
} = {
	[EnvironmentMode.MINECRAFT]: (gameLog: GameLog) => ({
		WorldStates: gameLog.gameLog.map((worldState) => ({
			Timestamp: worldState.timestamp,
			ChatHistory: worldState.chatHistory.map(
				(message) => `<${message.user[0]}${message.user.slice(1).toLowerCase()}> ${message.content}`
			),
			BlocksInGrid: worldState.shapeInPlace.map((block) => ({
				X: block.position.x,
				Y: block.position.y,
				Z: block.position.z,
				Type: 'wool',
				Colour: block.color.id,
			})),
		})),
	}),
	[EnvironmentMode.COCOBOTS]: (gameLog: GameLog) => ({
		worldStates: gameLog.gameLog.map((worldState) => ({
			timestamp: worldState.timestamp,
			chatHistory: worldState.chatHistory.map(
				(message) => `<${message.user[0]}${message.user.slice(1).toLowerCase()}> ${message.content}`
			),
			blocksInGrid: worldState.shapeInPlace.map((shape) => ({
				shape: `${(Object.values(shapeList)[shape.shape] as string)[0]}${(Object.values(shapeList)[shape.shape] as string).slice(1).toLowerCase()}`,
				position: {
					x: shape.position.x,
					y: shape.position.y,
					z: shape.position.z,
				},
				color: `${shape.color.id[0]}${shape.color.id.slice(1).toLowerCase()}`,
			})),
		})),
	}),
};

export const gameModesAvailable: { [key in EnvironmentMode]: GameMode[] } = {
	[EnvironmentMode.MINECRAFT]: [GameMode.SIMULATION, GameMode.VISUALIZATION],
	[EnvironmentMode.COCOBOTS]: [GameMode.SIMULATION, GameMode.NEBULA],
};

export const gameModeComponent: {
	[key in GameMode]: React.ComponentType<EnvironmentTypeProps>;
} = {
	[GameMode.SIMULATION]: Simulation,
	[GameMode.VISUALIZATION]: Visualization,
	[GameMode.NEBULA]: Nebula,
};

export const OPACITY_PENDING_OBJECT = 0.4;

export const CELL_COLOR = new THREE.Color(0xaaaaaa);
