import { GameLog } from '../classes/GameLog';
import { EnvironmentMode } from '../enum/EnvironmentMode';
import { FileExtension } from '../enum/FileExtensions';
import minecraftCSVReader from '../scripts/Readers/minecraft/minecraftCSVReader';

export type FileProcessorFunction = (data: string, gameLogs: GameLog[]) => GameLog[];

export const VISUALIZER_MATCHER: {
	[key in EnvironmentMode]: Partial<Record<FileExtension, FileProcessorFunction>>;
} = {
	[EnvironmentMode.MINECRAFT]: {
		[FileExtension.CSV]: minecraftCSVReader,
		[FileExtension.JSON]: (data: string, gameLog: GameLog[]) => {
			console.log(data, gameLog);
			return gameLog;
		},
	},
	[EnvironmentMode.COCOBOTS]: {
		[FileExtension.JSON]: (data: string, gameLog: GameLog[]) => {
			console.log(data, gameLog);
			return gameLog;
		},
		[FileExtension.JSONL]: (data: string, gameLog: GameLog[]) => {
			console.log(data, gameLog);
			return gameLog;
		},
	},
};
