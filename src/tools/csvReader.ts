import { GameLog, worldStateProps } from '../classes/gameLog';
import { COLORS } from '../constants/colors';
import { v4 as uuidv4 } from 'uuid';
import { shapeList } from '../constants/shapeList';

export interface csvFormat {
	dial_with_actions: {
		prevMoves: string[];
		prevWorldState: string;
		instruction: string[];
	};
	action_seq: string[];
}

export function parseCSV(file: File): Promise<GameLog[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const csv = event.target?.result as string;
				const games: GameLog[] = [];

				const csvSplitter = /"(.+?)","?(.*?)"?(?=(\n"|$))/gs;
				const dialSplitter =
					/((?:^(?:(?:place|pick) .*?\n)*|EMPTY))(.*?)(<.*)/s;

				let match;
				while ((match = csvSplitter.exec(csv)) !== null) {
					const [dialWithActions, actionSeq] = [match[1], match[2]];

					const dialSplit = dialWithActions.match(dialSplitter)!;

					const prevWorldState = dialSplit[2]
						.trim()
						.replace(/^"+|"+$/g, '');
					const instructions = dialSplit[3].trim().split('\n');

					const worldState: worldStateProps = {
						chatHistory: [],
						shapeInPlace: [],
					};

					parseWorldState(prevWorldState, worldState);

					const gameLog = new GameLog();
					gameLog.addWorldState(worldState);

					instructions.forEach((instruction) => {
						parseInstruction(instruction.trim(), gameLog);
					});

					actionSeq.split('\n').forEach((instruction) => {
						parseInstruction(instruction.trim(), gameLog);
					});

					games.push(gameLog);
				}

				resolve(games);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = (event) => {
			reject(
				event.target?.error || new Error('Unknown FileReader error')
			);
		};

		reader.readAsText(file);
	});
}

function parseWorldState(prevWorldState: string, worldState: worldStateProps) {
	if (prevWorldState !== 'EMPTY' && prevWorldState) {
		const worldStateSplitted = prevWorldState.split(':');
		worldStateSplitted.forEach((blockStr) => {
			const matches = blockStr.match(/(\d+) (\w+) (.*)/);
			if (matches) {
				const [, , colorName, positionsStr] = matches;
				const positions = positionsStr.split(',');

				positions.forEach((position) => {
					const [x, y, z] = position.trim().split(' ');
					const color =
						COLORS[colorName.toUpperCase() as keyof typeof COLORS];
					worldState.shapeInPlace.push({
						pending: false,
						breakable: false,
						uuid: uuidv4(),
						color,
						shape: shapeList.CUBE,
						position: {
							x: parseInt(x),
							y: parseInt(y),
							z: parseInt(z),
						},
					});
				});
			}
		});
	}
}

function parseInstruction(instruction: string, gameLog: GameLog) {
	const cleanedInstruction = instruction.trim();
	const lastWorldState = gameLog.getLastWorldState();
	if (cleanedInstruction.startsWith('place')) {
		const placement = cleanedInstruction.split(' ');
		lastWorldState?.shapeInPlace.push({
			pending: false,
			breakable: false,
			uuid: uuidv4(),
			color: COLORS[placement[1].toUpperCase() as keyof typeof COLORS],
			position: {
				x: parseInt(placement[2]),
				y: parseInt(placement[3]),
				z: parseInt(placement[4]),
			},
			shape: shapeList.CUBE,
		});
	} else if (cleanedInstruction.startsWith('pick')) {
		const criteria = cleanedInstruction.split(' ');
		const position = {
			x: parseInt(criteria[1]),
			y: parseInt(criteria[2]),
			z: parseInt(criteria[3]),
		};
		lastWorldState!.shapeInPlace = lastWorldState!.shapeInPlace.filter(
			(shape) => {
				return (
					shape.position.x !== position.x ||
					shape.position.y !== position.y ||
					shape.position.z !== position.z
				);
			}
		);
	} else {
		const message = cleanedInstruction.split(/<(.*)> (.*)/);
		lastWorldState?.chatHistory.push({
			user: message[1],
			content: message[2],
		});
	}
	gameLog.addWorldState(lastWorldState!);
}
