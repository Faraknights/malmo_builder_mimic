import { GameLog, WorldStateProps } from '../classes/GameLog';
import { COLORS } from '../constants/COLORS';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../enum/Colors';
import { ShapeList } from '../enum/ShapeList';

export interface csvFormat {
	worldStates: {
		shape?: string;
		color: string;
		x: number;
		y: number;
		z: number;
	}[];
}

export function parseJSON(file: File): Promise<GameLog[]> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const { worldStates: json } = {
					worldStates: JSON.parse(event.target?.result as string),
				} as csvFormat;

				const worldState = {
					chatHistory: [],
					shapeInPlace: [],
					timestamp: new Date(),
				} as WorldStateProps;

				const games: GameLog[] = [];
				const game = new GameLog();

				json.forEach((block) => {
					worldState.shapeInPlace.push({
						color: COLORS[Colors[block.color.toUpperCase() as keyof typeof Colors]],
						breakable: false,
						pending: false,
						position: {
							x: block.x,
							y: block.y,
							z: block.z,
						},
						shape: block.shape
							? ShapeList[block.shape.toUpperCase() as keyof typeof ShapeList]
							: ShapeList.CUBE,
						uuid: uuidv4(),
					});
					const clonedWorldState = JSON.parse(JSON.stringify(worldState));
					game.addWorldState(clonedWorldState);
				});

				games.push(game);

				resolve(games);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = (event) => {
			reject(event.target?.error || new Error('Unknown FileReader error'));
		};

		reader.readAsText(file);
	});
}
