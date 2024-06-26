import { GameMode } from '../../interfaces/mode';
import Environment from './environment';
import Side from './Side';
import ChatComponent from './Chat';
import { useEnvironmentState } from '../../classes/EnvironmentMode';
import { useInventory } from '../../classes/Inventory';
import { ENVIRONMENT_COLORS, ENVIRONMENT_SHAPES } from '../../constants/environment';
import { useShapeInPlace } from '../../classes/shapeInPlace';
import useAction from '../../classes/Action';
import { useChat } from '../../classes/Chat';
import useCamera from '../../classes/Camera';

const Nebula = () => {
    const {environmentMode} = useEnvironmentState()
    const inventory = useInventory( 
        ENVIRONMENT_COLORS[environmentMode],
        ENVIRONMENT_SHAPES[environmentMode]
    );
    const shapeInPlace = useShapeInPlace();
    const action = useAction()
    const camera = useCamera()
	const chat = useChat();    
    
    return (
		<main>
            <div id='mainView'>
                <Environment 
                    gameMode={GameMode.NEBULA}
                    shapeInPlace={shapeInPlace}
                    inventory={inventory}
                    action={action}
                    camera={camera.current}
                />
            </div>
            <Side>
				<ChatComponent chat={chat} readOnly={false}/>
            </Side>
        </main>
    );
};

export default Nebula;
