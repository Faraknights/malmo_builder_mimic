import { chatProps, useChat } from '../../classes/Chat';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { GameMode } from '../../interfaces/mode';
import Environment from './environment';
import ChatComponent from './Chat';
import Side from './Side';
import FileManager from './visualization/FileManager';
import { CameraMode } from '../../classes/Camera';

const Visualization = () => {
	const chat: chatProps = useChat();
	const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();

	return (
		<main>
			<Environment 
				shapeInPlace = {{...shapeInPlace}}
				gameMode={GameMode.VISUALIZATION}
				camera={CameraMode.FREE}
			/>
			<Side>
				<FileManager 
					chatHistory={chat}
					shapeInPlace={shapeInPlace}
				/>
				<ChatComponent chat={chat} readOnly={true}/>
			</Side>
		</main>
	);
};

export default Visualization;
