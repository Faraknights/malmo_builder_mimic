import { Colors } from '../enum/Colors';

export interface GameLogsProps<T> {
	worldStates: T[];
}

export interface CocobotsBlocksInGridLog {
	shape: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	color: string;
}

export interface CocobotsLogStructure {
	timestamp: Date | undefined;
	chatHistory: string[];
	blocksInGrid: CocobotsBlocksInGridLog[];
}

export interface MinecraftBlocksInGridLog {
	x: number;
	y: number;
	z: number;
	type: string;
	colour: Colors;
}

export interface MinecraftLogStructure {
	timestamp: Date | undefined;
	chatHistory: string[];
	blocksInGrid: MinecraftBlocksInGridLog[];
}
