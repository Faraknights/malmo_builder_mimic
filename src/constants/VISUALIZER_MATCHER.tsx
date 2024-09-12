import { GameLog } from '../classes/GameLog';
import { EnvironmentMode } from '../enum/EnvironmentMode';
import { FileExtension } from '../enum/FileExtensions';

type FileProcessorFunction = (file: File, gameLog: GameLog[]) => void;

export const VISUALIZER_MATCHER: {
	[key in EnvironmentMode]: Partial<Record<FileExtension, FileProcessorFunction>>;
} = {
	[EnvironmentMode.MINECRAFT]: {
		[FileExtension.CSV]: (file: File, gameLog: GameLog[]) => {
			console.log(file, gameLog);
		},
		[FileExtension.JSON]: (file: File, gameLog: GameLog[]) => {
			console.log(file, gameLog);
		},
	},
	[EnvironmentMode.COCOBOTS]: {
		[FileExtension.CSV]: (file: File, gameLog: GameLog[]) => {
			console.log(file, gameLog);
		},
		[FileExtension.JSON]: (file: File, gameLog: GameLog[]) => {
			console.log(file, gameLog);
		},
		[FileExtension.JSONL]: (file: File, gameLog: GameLog[]) => {
			console.log(file, gameLog);
		},
	},
};
