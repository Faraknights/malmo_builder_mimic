import { shapeProps } from '../components/modelisation/shapes/Shape';
import { Message } from '../enum/Chat';

//
export interface WorldStateProps {
	timestamp?: Date;
	chatHistory: Message[];
	shapeInPlace: shapeProps[];
}

export class GameLog {
	public gameLog: WorldStateProps[];

	constructor() {
		this.gameLog = [
			{
				chatHistory: [],
				shapeInPlace: [],
				timestamp: new Date(),
			},
		];
	}

	getLength(): number {
		return this.gameLog.length;
	}

	addWorldState(worldState: WorldStateProps): void {
		this.gameLog.push(worldState);
	}

	clear(): void {
		this.gameLog = [];
	}

	getLastWorldState(): WorldStateProps | undefined {
		const lastGame = this.gameLog[this.gameLog.length - 1];
		if (lastGame) {
			if (lastGame.timestamp) {
				return {
					timestamp: lastGame.timestamp,
					chatHistory: [...lastGame.chatHistory],
					shapeInPlace: [...lastGame.shapeInPlace],
				};
			} else {
				return {
					chatHistory: [...lastGame.chatHistory],
					shapeInPlace: [...lastGame.shapeInPlace],
				};
			}
		} else {
			return undefined;
		}
	}

	getWorldStateById(id: number): WorldStateProps | undefined {
		if (id < this.gameLog.length) {
			const game = this.gameLog[id];

			if (game.timestamp) {
				return {
					timestamp: game.timestamp,
					chatHistory: [...game.chatHistory],
					shapeInPlace: [...game.shapeInPlace],
				};
			} else {
				return {
					chatHistory: [...game.chatHistory],
					shapeInPlace: [...game.shapeInPlace],
				};
			}
		} else {
			return undefined;
		}
	}
}
