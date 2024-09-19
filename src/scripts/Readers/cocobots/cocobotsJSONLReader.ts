import { GameLog, WorldStateProps } from '../../../classes/GameLog';
import { FileProcessorFunction } from '../../../constants/VISUALIZER_MATCHER';
import { Users } from '../../../enum/Chat';
import { EventCommand, EventJsonl, JsonlEvent } from '../../../interfaces/jsonlDataStructure';
import { COLORS } from '../../../constants/COLORS';
import { ShapeList } from '../../../enum/ShapeList';
import { v4 as uuidv4 } from 'uuid';
import { coordinateAddition } from '../../../interfaces/CartesianCoordinate';
import { shapeHitbox } from '../../../components/modelisation/shapes/Shape';

const cocobotsJSONLReader: FileProcessorFunction = (data, gameLogs) => {
	const gameLog = new GameLog();

	const worldState = {
		chatHistory: [],
		shapeInPlace: [],
		timestamp: new Date(),
	} as WorldStateProps;

	data.split('\n')
		.filter((str) => /\s/.test(str))
		.map((line) => JSON.parse(line) as JsonlEvent)
		.forEach((jsonlEvent) => {
			switch (jsonlEvent.event) {
				case EventJsonl.set_text:
					worldState.chatHistory.push({
						user: Users.SYSTEM,
						content: jsonlEvent.data.text,
					});
					gameLog.addWorldState(structuredClone(worldState));
					break;
				case EventJsonl.text_message:
					if (jsonlEvent.data.html) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(jsonlEvent.data.message, 'text/html');
						if (doc.body.textContent) {
							switch (doc.body.textContent) {
								case 'The current working board was updated for your partner':
									worldState.shapeInPlace = worldState.shapeInPlace.map((shape) => {
										return { ...shape, pending: false };
									});
									gameLog.addWorldState(structuredClone(worldState));
									break;
								case 'Your working board was updated':
									break;
								default:
									worldState.chatHistory.push({
										user: Users.SYSTEM,
										content: doc.body.textContent,
									});
									gameLog.addWorldState(structuredClone(worldState));
									break;
							}
						}
					} else {
						worldState.chatHistory.push({
							user: `User ${jsonlEvent.user_id}` as Users,
							content: jsonlEvent.data.message,
						});
						gameLog.addWorldState(structuredClone(worldState));
					}
					break;
				case EventJsonl.command: {
					switch (jsonlEvent.data.command.event) {
						case EventCommand.confirm_next_episode:
							if (jsonlEvent.data.command.answer === 'yes') {
								worldState.shapeInPlace = [];
							}
							break;
						case EventCommand.clear_board:
							worldState.shapeInPlace = [];
							gameLog.addWorldState(structuredClone(worldState));
							break;
						default:
							break;
					}
					break;
				}
				case EventJsonl.working_board_log: {
					const objs = Object.values(jsonlEvent.data.objs);
					console.log(objs);
					const lastWorldState = gameLog.getLastWorldState()!;
					if (objs.length > lastWorldState.shapeInPlace.length) {
						const newBlock = objs[objs.length - 1];

						const usedCoordinates = lastWorldState.shapeInPlace
							.map((shape) => coordinateAddition(shapeHitbox[shape.shape], shape.position))
							.flat()
							.filter((coordinate) => coordinate.x === newBlock.x && coordinate.z === newBlock.y);

						console.log(usedCoordinates);
						worldState.shapeInPlace.push({
							pending: true,
							breakable: false,
							color: COLORS[newBlock.color[0].toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
							position: {
								x: newBlock.x,
								y: usedCoordinates.length
									? Math.max(...usedCoordinates.map((coordinate) => coordinate.y)) + 1
									: 1,
								z: newBlock.y,
							},
							shape: ShapeList[newBlock.type.toUpperCase() as keyof typeof ShapeList] || ShapeList.CUBE,
							uuid: uuidv4(),
						});
					} else if (objs.length < lastWorldState.shapeInPlace.length) {
						const prevObjs = lastWorldState.shapeInPlace.map((shape) => ({
							x: shape.position.x,
							y: shape.position.z,
						}));
						const removedIndex = prevObjs
							.map((prevObj, index) =>
								!objs.some((obj) => obj.x === prevObj.x && obj.y === prevObj.y) ? index : -1
							)
							.filter((index) => index !== -1)
							.pop();

						if (removedIndex !== undefined) {
							worldState.shapeInPlace.splice(removedIndex, 1);
						}
					}
					gameLog.addWorldState(structuredClone(worldState));
					break;
				}
				default:
					break;
			}
		});

	gameLogs.push(gameLog);

	return gameLogs;
};

export default cocobotsJSONLReader;
