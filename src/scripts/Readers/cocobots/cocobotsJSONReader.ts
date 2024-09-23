import { GameLog, WorldStateProps } from '../../../classes/GameLog';
import { shapeProps } from '../../../components/modelisation/shapes/Shape';
import { COLORS } from '../../../constants/COLORS';
import { FileProcessorFunction } from '../../../constants/VISUALIZER_MATCHER';
import { Message } from '../../../enum/Chat';
import { ShapeList } from '../../../enum/ShapeList';
import { GameLogsProps, CocobotsBlocksInGridLog, CocobotsLogStructure } from '../../../interfaces/ExportLogStructure';
import { v4 as uuidv4 } from 'uuid';

const chatParser = /^<([^>]+)> (.+)$/;

const cocobotsJSONReader: FileProcessorFunction = (data, gameLogs) => {
	const json: GameLogsProps<CocobotsLogStructure> | CocobotsBlocksInGridLog[] = JSON.parse(data);
	if ('worldStates' in json) {
		return gameLogReader(json, gameLogs);
	} else {
		return worldStateReader(json, gameLogs);
	}
};

export type worldStateProcessorFunction = (json: CocobotsBlocksInGridLog[], gameLogs: GameLog[]) => GameLog[];

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
			color: COLORS[block.color.toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
			breakable: false,
			pending: false,
			position: {
				x: block.position.x,
				y: block.position.y,
				z: block.position.z,
			},
			shape: ShapeList[block.shape.toUpperCase() as keyof typeof ShapeList] || ShapeList.CUBE,
			uuid: uuidv4(),
		});

		gameLog.addWorldState(structuredClone(worldState));
	});

	gameLogs.push(gameLog);

	return gameLogs;
};

export type gameLogProcessorFunction = (json: GameLogsProps<CocobotsLogStructure>, gameLogs: GameLog[]) => GameLog[];

const gameLogReader: gameLogProcessorFunction = (json, gameLogs) => {
	const gameLog = new GameLog();
	gameLog.clear();

	json.worldStates.forEach((logStructure) => {
		gameLog.addWorldState({
			chatHistory: logStructure.chatHistory.map((message) => {
				const messageSplit = message.match(chatParser);
				return {
					user: messageSplit![1],
					content: messageSplit![2],
				} as Message;
			}),
			shapeInPlace: logStructure.blocksInGrid.map((block) => {
				return {
					breakable: false,
					pending: false,
					color: COLORS[block.color.toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
					position: {
						x: block.position.x,
						y: block.position.y,
						z: block.position.z,
					},
					shape: ShapeList[block.shape.toUpperCase() as keyof typeof ShapeList] || ShapeList.CUBE,
					uuid: uuidv4(),
				} as shapeProps;
			}),
			timestamp: new Date(),
		});
	});

	gameLogs.push(gameLog);

	return gameLogs;
};

export default cocobotsJSONReader;
