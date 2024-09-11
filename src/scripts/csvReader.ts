import { GameLog, worldStateProps } from '../classes/gameLog';
import { COLORS } from '../constants/COLORS';
import { v4 as uuidv4 } from 'uuid';
import { EnvironmentMode } from '../enum/EnvironmentMode';
import { ShapeList } from '../enum/ShapeList';
import { Users } from '../enum/Chat';

export interface csvFormat {
	dial_with_actions: {
		prevMoves: string[];
		prevWorldState: string;
		instruction: string[];
	};
	action_seq: string[];
}

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

			const worldState: worldStateProps = {
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
					const color = COLORS[colorName.toUpperCase() as keyof typeof COLORS];
					worldState.shapeInPlace.push({
						pending: false,
						breakable: false,
						uuid: uuidv4(),
						color,
						shape: ShapeList.CUBE,
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

export function parseInstruction(instruction: string, gameLog: GameLog, environmentMode: EnvironmentMode) {
	const cleanedInstruction = instruction.trim();
	const lastWorldState = gameLog.getLastWorldState();
	if (cleanedInstruction.startsWith('place')) {
		const placement = cleanedInstruction.split(' ');
		if (environmentMode === EnvironmentMode.MINECRAFT) {
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
				shape: ShapeList.CUBE,
			});
		} else if (environmentMode === EnvironmentMode.COCOBOTS) {
			lastWorldState?.shapeInPlace.push({
				pending: false,
				breakable: false,
				uuid: uuidv4(),
				color: COLORS[placement[2].toUpperCase() as keyof typeof COLORS],
				position: {
					x: parseInt(placement[3]),
					y: parseInt(placement[4]),
					z: parseInt(placement[5]),
				},
				shape: ShapeList[placement[1].toUpperCase() as keyof typeof ShapeList],
			});
		}
	} else if (cleanedInstruction.startsWith('pick')) {
		const criteria = cleanedInstruction.split(' ');
		const position = {
			x: parseInt(criteria[1]),
			y: parseInt(criteria[2]),
			z: parseInt(criteria[3]),
		};
		lastWorldState!.shapeInPlace = lastWorldState!.shapeInPlace.filter((shape) => {
			return (
				shape.position.x !== position.x || shape.position.y !== position.y || shape.position.z !== position.z
			);
		});
	} else {
		const message = cleanedInstruction.split(/<(.*)> (.*)/);
		if (message[1] && message[2]) {
			lastWorldState?.chatHistory.push({
				user: Users[message[1].toUpperCase() as keyof typeof Users],
				content: message[2],
			});
		}
	}
	gameLog.addWorldState(lastWorldState!);
}
