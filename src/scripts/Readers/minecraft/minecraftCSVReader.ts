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
