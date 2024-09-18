import { CartesianCoordinate, hasCommonCoordinate } from '../interfaces/CartesianCoordinate';
import * as THREE from 'three';
import { EnvironmentMode } from '../enum/EnvironmentMode';
import { COLORS } from './COLORS';
import Color from '../interfaces/Color';
import { shapeProps } from '../components/modelisation/shapes/Shape';
import { GameLog } from '../classes/GameLog';
import Simulation from '../components/structurals/environmentGames/Simulation';
import Visualization from '../components/structurals/environmentGames/Visualization';
import Nebula from '../components/structurals/environmentGames/Nebula';
import { GameMode } from '../enum/GameMode';
import { Colors } from '../enum/Colors';
import { ShapeList } from '../enum/ShapeList';
import { CameraMode } from '../enum/CameraMode';
import { Action } from '../enum/Action';

export const BLOCK_SIZE: { [key in EnvironmentMode]: CartesianCoordinate } = {
	[EnvironmentMode.MINECRAFT]: { x: 1, y: 1, z: 1 },
	[EnvironmentMode.COCOBOTS]: { x: 1, y: 0.3, z: 1 },
};

export const ENVIRONMENT_COLORS: { [key in EnvironmentMode]: Color[] } = {
	[EnvironmentMode.MINECRAFT]: [
		COLORS[Colors.GREEN],
		COLORS[Colors.BLUE],
		COLORS[Colors.PURPLE],
		COLORS[Colors.RED],
		COLORS[Colors.ORANGE],
		COLORS[Colors.YELLOW],
	],
	[EnvironmentMode.COCOBOTS]: [COLORS[Colors.GREEN], COLORS[Colors.BLUE], COLORS[Colors.RED], COLORS[Colors.YELLOW]],
};

export const ENVIRONMENT_SHAPES: { [key in EnvironmentMode]: ShapeList[] } = {
	[EnvironmentMode.MINECRAFT]: [ShapeList.CUBE],
	[EnvironmentMode.COCOBOTS]: [
		ShapeList.NUT,
		ShapeList.WASHER,
		ShapeList.SCREW,
		ShapeList.HORIZONTAL_BRIDGE,
		ShapeList.VERTICAL_BRIDGE,
	],
};

interface gridSizeProps {
	x: { min: number; max: number };
	y: { min: number; max: number };
	z: { min: number; max: number };
}

export const GRID_SIZE: { [key in EnvironmentMode]: gridSizeProps } = {
	[EnvironmentMode.MINECRAFT]: {
		x: { min: -5, max: 5 },
		y: { min: 1, max: 11 },
		z: { min: -5, max: 5 },
	},
	[EnvironmentMode.COCOBOTS]: {
		x: { min: 0, max: 7 },
		y: { min: 1, max: 8 },
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
				shape: `${(Object.values(ShapeList)[shape.shape] as string)[0]}${(Object.values(ShapeList)[shape.shape] as string).slice(1).toLowerCase()}`,
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
	[EnvironmentMode.MINECRAFT]: [GameMode.SIMULATION, GameMode.VISUALIZATION, GameMode.NEBULA],
	[EnvironmentMode.COCOBOTS]: [GameMode.SIMULATION, GameMode.VISUALIZATION, GameMode.NEBULA],
};

export const defaultCameraByEnvironment: { [key in EnvironmentMode]: CameraMode } = {
	[EnvironmentMode.MINECRAFT]: CameraMode.FREE,
	[EnvironmentMode.COCOBOTS]: CameraMode.UPPER_VIEW,
};

export const defaultActionByGameMode: { [key in GameMode]: Action } = {
	[GameMode.SIMULATION]: Action.PLACE,
	[GameMode.VISUALIZATION]: Action.BREAK,
	[GameMode.NEBULA]: Action.BREAK,
};

export const gameModeComponent: {
	[key in GameMode]: React.FC;
} = {
	[GameMode.SIMULATION]: Simulation,
	[GameMode.VISUALIZATION]: Visualization,
	[GameMode.NEBULA]: Nebula,
};

export const OPACITY_PENDING_OBJECT = 0.4;

export const CELL_COLOR = new THREE.Color(0xaaaaaa);
