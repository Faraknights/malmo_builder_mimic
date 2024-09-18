import { GameLog } from '../../../classes/GameLog';
import { FileProcessorFunction } from '../../../constants/VISUALIZER_MATCHER';
import { parseMinecraftInstruction } from './parseMinecraftInstruction';

const minecraftCSVReader: FileProcessorFunction = (data, gameLogs) => {
	const csvSplitter = /"(.+?)","?(.*?)"?(?=(\n"|$))/gs;

	let match;
	while ((match = csvSplitter.exec(data)) !== null) {
		const [dialWithActions, actionSeq] = [match[1], match[2]];

		const instructions = dialWithActions.split('\n').map((string) => string.trim());

		const gameLog = new GameLog();

		[...instructions, ...actionSeq].forEach((instruction) => {
			gameLog.addWorldState(parseMinecraftInstruction(instruction.trim(), gameLog.getLastWorldState()!));
		});

		gameLogs.push(gameLog);
	}
	return gameLogs;
};

export default minecraftCSVReader;
/*
export function parseCSV(csv: string, environmentMode: EnvironmentMode): GameLog[] {
	try {
		const games: GameLog[] = [];

		const csvSplitter = /"(.+?)","?(.*?)"?(?=(\n"|$))/gs;
		const dialSplitter = /((?:^(?:(?:place|pick) .*?\n)*|EMPTY))(.*?)(<.*)/s;

		let match;
		while ((match = csvSplitter.exec(csv)) !== null) {
			const [dialWithActions, actionSeq] = [match[1], match[2]];

			const dialSplit = dialWithActions.match(dialSplitter)!;

			const prevWorldState = dialSplit[2].trim().replace(/^"+|"+$/g, '');
			const instructions = dialSplit[3].trim().split('\n');

			const worldState: WorldStateProps = {
				chatHistory: [],
				shapeInPlace: [],
			};

			parseWorldState(prevWorldState, worldState);

			const gameLog = new GameLog();
			gameLog.addWorldState(worldState);

			instructions.forEach((instruction) => {
				parseInstruction(instruction.trim(), gameLog, environmentMode);
			});

			actionSeq.split('\n').forEach((instruction) => {
				parseInstruction(instruction.trim(), gameLog, environmentMode);
			});

			games.push(gameLog);
		}

		return games;
	} catch (error: any) {
		throw new Error(`Error parsing CSV: ${error.message}`);
	}
}


*/
