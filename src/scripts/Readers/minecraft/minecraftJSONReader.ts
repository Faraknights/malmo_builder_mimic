import { GameLog, WorldStateProps } from '../../../classes/GameLog';
import { shapeProps } from '../../../components/modelisation/shapes/Shape';
import { COLORS } from '../../../constants/COLORS';
import { FileProcessorFunction } from '../../../constants/VISUALIZER_MATCHER';
import { Message } from '../../../enum/Chat';
import { ShapeList } from '../../../enum/ShapeList';
import { GameLogsProps, MinecraftBlocksInGridLog, MinecraftLogStructure } from '../../../interfaces/ExportLogStructure';
import { v4 as uuidv4 } from 'uuid';

const chatParser = /^<([^>]+)> (.+)$/;

const minecraftJSONReader: FileProcessorFunction = (data, gameLogs) => {
	const json: GameLogsProps<MinecraftLogStructure> | MinecraftBlocksInGridLog[] = JSON.parse(data);
	if ('WorldStates' in json) {
		return gameLogReader(json, gameLogs);
	} else {
		return worldStateReader(json, gameLogs);
	}
};

export type worldStateProcessorFunction = (json: MinecraftBlocksInGridLog[], gameLogs: GameLog[]) => GameLog[];

const worldStateReader: worldStateProcessorFunction = (json, gameLogs) => {
	const gameLog = new GameLog();
	gameLog.clear();

	const worldState = {
		chatHistory: [],
		shapeInPlace: [],
		timestamp: new Date(),
	} as WorldStateProps;

	json.forEach((block) => {
		worldState.shapeInPlace.push({
			color: COLORS[block.Colour.toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
			breakable: false,
			pending: false,
			position: {
				x: block.X,
				y: block.Y,
				z: block.Z,
			},
			shape: ShapeList.CUBE,
			uuid: uuidv4(),
		});

		gameLog.addWorldState(structuredClone(worldState));
	});

	gameLogs.push(gameLog);

	return gameLogs;
};

export type gameLogProcessorFunction = (json: GameLogsProps<MinecraftLogStructure>, gameLogs: GameLog[]) => GameLog[];

const gameLogReader: gameLogProcessorFunction = (json, gameLogs) => {
	const gameLog = new GameLog();
	gameLog.clear();

	json.WorldStates.forEach((logStructure) => {
		gameLog.addWorldState({
			chatHistory: logStructure.ChatHistory.map((message) => {
				const messageSplit = message.match(chatParser);
				return {
					user: messageSplit![1],
					content: messageSplit![2],
				} as Message;
			}),
			shapeInPlace: logStructure.BlocksInGrid.map((block) => {
				return {
					breakable: false,
					pending: false,
					color: COLORS[block.Colour.toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
					position: {
						x: block.X,
						y: block.Y,
						z: block.Z,
					},
					shape: ShapeList.CUBE,
					uuid: uuidv4(),
				} as shapeProps;
			}),
			timestamp: new Date(),
		});
	});

	gameLogs.push(gameLog);

	return gameLogs;
};

export default minecraftJSONReader;