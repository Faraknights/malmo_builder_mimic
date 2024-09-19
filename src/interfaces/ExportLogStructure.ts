import { Colors } from '../enum/Colors';

export interface GameLogsProps<T> {
	WorldStates: T[];
}

export interface CocobotsBlocksInGridLog {
	Shape: string;
	Position: {
		X: number;
		Y: number;
		Z: number;
	};
	Color: string;
}

export interface CocobotsLogStructure {
	Timestamp: Date | undefined;
	ChatHistory: string[];
	BlocksInGrid: CocobotsBlocksInGridLog[];
}

export interface MinecraftBlocksInGridLog {
	X: number;
	Y: number;
	Z: number;
	Type: string;
	Colour: Colors;
}

export interface MinecraftLogStructure {
	Timestamp: Date | undefined;
	ChatHistory: string[];
	BlocksInGrid: MinecraftBlocksInGridLog[];
}
