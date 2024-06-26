import { chatProps, useChat } from '../../classes/Chat';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import Environment from '../modelisation/environment';
import Chat from './Chat';
import Side from './Side';
import FileManager from './visualization/FileManager';

const Visualization = () => {
	const chat: chatProps = useChat();
	const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();

	return (
		<main>
			<Environment 
				shapeInPlace = {{...shapeInPlace}}
			/>
			<Side>
				<FileManager 
					chatHistory={chat}
					shapeInPlace={shapeInPlace}
				/>
				<Chat {... chat}/>
			</Side>
		</main>
	);
};

export default Visualization;
