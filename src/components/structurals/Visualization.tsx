import { chatProps, useChat } from '../../classes/Chat';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { GameMode } from '../../classes/gameMode';
import Environment from './environment';
import ChatComponent from './Chat';
import Side from './Side';
import FileManager from './visualization/FileManager';
import { CameraMode } from '../../classes/Camera';
import { EnvironmentTypeProps } from '../../classes/EnvironmentMode';

const Visualization: React.FC<EnvironmentTypeProps> = ({environmentMode}) => {
	const chat: chatProps = useChat();
	const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();

	return (
		<main>
			<Environment 
				environmentMode={environmentMode}
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
