import { v4 as uuidv4 } from 'uuid';
import { WorldStateProps } from '../../../classes/GameLog';
import { COLORS } from '../../../constants/COLORS';
import { ShapeList } from '../../../enum/ShapeList';
import { Users } from '../../../enum/Chat';

export function parseCocobotsInstruction(instruction: string, currentWorldState: WorldStateProps): WorldStateProps {
	const cleanedInstruction = instruction.trim();

	if (cleanedInstruction.startsWith('place')) {
		const placement = cleanedInstruction.split(' ');
		currentWorldState.shapeInPlace.push({
			pending: false,
			breakable: false,
			uuid: uuidv4(),
			color: COLORS[placement[2].toUpperCase() as keyof typeof COLORS] || COLORS.WHITE,
			position: {
				x: parseInt(placement[3], 10),
				y: parseInt(placement[4], 10),
				z: parseInt(placement[5], 10),
			},
			shape: ShapeList[placement[1].toUpperCase() as keyof typeof ShapeList] || ShapeList.CUBE,
		});
	} else if (cleanedInstruction.startsWith('pick')) {
		const criteria = cleanedInstruction.split(' ');
		const position = {
			x: parseInt(criteria[1], 10),
			y: parseInt(criteria[2], 10),
			z: parseInt(criteria[3], 10),
		};
		const index = currentWorldState.shapeInPlace.findIndex(
			(shape) =>
				shape.position.x === position.x && shape.position.y === position.y && shape.position.z === position.z
		);
		if (index !== -1) {
			currentWorldState.shapeInPlace.splice(index, 1);
		} else {
			currentWorldState.chatHistory.push({
				user: Users.SYSTEM,
				content: `An attempt was made to pick at coordinates [x: ${parseInt(criteria[1], 10)}, y: ${parseInt(criteria[2], 10)}, z: ${parseInt(criteria[3], 10)}]`,
			});
		}
	} else {
		const [, user, content] = cleanedInstruction.split(/<(.*)> (.*)/) || [];
		if (user && content) {
			currentWorldState.chatHistory.push({
				user: Users[user.toUpperCase() as keyof typeof Users] || Users.UNKNOWN,
				content,
			});
		}
	}
	return currentWorldState;
}
