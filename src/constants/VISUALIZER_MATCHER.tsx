import { GameLog } from '../classes/GameLog';
import { EnvironmentMode } from '../enum/EnvironmentMode';
import { FileExtension } from '../enum/FileExtensions';
import cocobotsJSONLReader from '../scripts/Readers/cocobots/cocobotsJSONLReader';
import cocobotsJSONReader from '../scripts/Readers/cocobots/cocobotsJSONReader';
import minecraftCSVReader from '../scripts/Readers/minecraft/minecraftCSVReader';
import minecraftJSONReader from '../scripts/Readers/minecraft/minecraftJSONReader';

export type FileProcessorFunction = (data: string, gameLogs: GameLog[]) => GameLog[];

export const VISUALIZER_MATCHER: {
	[key in EnvironmentMode]: Partial<Record<FileExtension, FileProcessorFunction>>;
} = {
	[EnvironmentMode.MINECRAFT]: {
		[FileExtension.CSV]: minecraftCSVReader,
		[FileExtension.JSON]: minecraftJSONReader,
	},
	[EnvironmentMode.COCORELI]: {
		[FileExtension.JSON]: cocobotsJSONReader,
		[FileExtension.JSONL]: cocobotsJSONLReader,
	},
};
