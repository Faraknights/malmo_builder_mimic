import { useEffect, useState } from 'react';
import { useInventory } from '../../classes/Inventory';
import { useShapeInPlace } from '../../classes/shapeInPlace';
import { GameMode } from '../../interfaces/mode';
import Environment from './environment';
import Side from './Side';
import ColorPicker from './simulation/ColorPicker';
import useAction from '../../classes/Action';
import ActionSelector from './simulation/ActionSelector';
import ShapePicker from './simulation/ShapePicker';
import { useEnvironmentState } from '../../classes/EnvironmentMode';
import { ENVIRONMENT_COLORS, ENVIRONMENT_SHAPES, EXPORT_GAME_LOG } from '../../constants/environment';
import { useChat } from '../../classes/Chat';
import ChatComponent from './Chat';
import { GameLog, worldStateProps } from '../../classes/gameLog';
import CameraSelector from './simulation/CameraPicker';
import useCamera from '../../classes/Camera';

const Simulation = () => {
    const {environmentMode} = useEnvironmentState()
    const inventory = useInventory( 
        ENVIRONMENT_COLORS[environmentMode],
        ENVIRONMENT_SHAPES[environmentMode]
    );
    const shapeInPlace = useShapeInPlace();
    const action = useAction()
    const camera = useCamera()
	const chat = useChat();
    const [gameLog, setGameLog] = useState<GameLog>(new GameLog())

    useEffect(() => {
        if(!!shapeInPlace.pending){
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto'
        }
    }, [shapeInPlace])

    useEffect(() => {
        shapeInPlace.setObjects([])
        inventory.setColors(ENVIRONMENT_COLORS[environmentMode])
        inventory.setCurrentColor(ENVIRONMENT_COLORS[environmentMode][0])
        inventory.setShapes(ENVIRONMENT_SHAPES[environmentMode])
        inventory.setCurrentShape(ENVIRONMENT_SHAPES[environmentMode][0])
        setGameLog(new GameLog())
        chat.setChatHistory([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environmentMode])
    
    useEffect(() => {
        const lastWolrdState = gameLog.getLastWorldState()
        if(lastWolrdState){          
            if(shapeInPlace.objects.length !== lastWolrdState.shapeInPlace.length || chat.chatHistory.length !== lastWolrdState.chatHistory.length){
                gameLog.addWorldState({
                    timestamp: new Date(),
                    chatHistory: [...chat.chatHistory],
                    shapeInPlace: [...shapeInPlace.objects]
                } as worldStateProps)
                setGameLog(gameLog);
            }
        } else {
            if(shapeInPlace.objects.length !== 0 || chat.chatHistory.length !== 0){
                gameLog.addWorldState({
                    timestamp: new Date(),
                    chatHistory: [...chat.chatHistory],
                    shapeInPlace: [...shapeInPlace.objects]
                } as worldStateProps)
                setGameLog(gameLog);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapeInPlace.objects, chat.chatHistory])
    

    return (
		<main>
            <div id='mainView'>
                <CameraSelector {...camera}/>
                <Environment 
                    gameMode={GameMode.SIMULATION}
                    shapeInPlace={shapeInPlace}
                    inventory={inventory}
                    action={action}
                    camera={camera.current}
                />
            </div>
            <Side>
                <ActionSelector {...action}/>
				<ColorPicker {...inventory}/>
                <ShapePicker {...inventory}/>
				<ChatComponent chat={chat} readOnly={false}/>
                <div id="gameButtons">
                    <button 
                        id="download"
                        onClick={e => {
                            const gameLogJson = JSON.stringify(EXPORT_GAME_LOG[environmentMode](gameLog));
                            const blob = new Blob([gameLogJson], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'gameLog.json';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                    >Download</button>
                    <button 
                        id="reset"
                        onClick={e => {
                            shapeInPlace.clear()
                            chat.clear()
                        }}
                    >Clear Board</button>
                </div>
            </Side>
        </main>
    );
};

export default Simulation;
