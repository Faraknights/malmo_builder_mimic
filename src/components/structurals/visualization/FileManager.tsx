import React, { useEffect, useState } from 'react';
import { chatProps } from '../../../classes/Chat';
import { ShapeInPlaceProps } from '../../../classes/shapeInPlace';
import { parseCSV } from '../../../tools/csvReaded';
import { GameLog } from '../../../classes/gameLog';

export interface FileManagerProps{
    chatHistory: chatProps,
    shapeInPlace: ShapeInPlaceProps
}

const FileManager: React.FC<FileManagerProps> = ({
    chatHistory,
    shapeInPlace
}) => {
    const [gameLogs, setGameLogs] = useState<GameLog[]>([])
    const [currentgameId, setcurrentgameId] = useState<number>(0)
    const [step, setStep] = useState<number>(0)
    
    useEffect(() => {
        setStep(0)
    }, [currentgameId]);

    useEffect(() => {
        if(gameLogs[currentgameId]){
            const worldState = gameLogs[currentgameId].getWorldStateById(step)!
            console.log(worldState)
            if(worldState){
                shapeInPlace.setObjects(worldState.shapeInPlace)
                chatHistory.setChatHistory(worldState.chatHistory)
            }
        }
    }, [currentgameId, step]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0]!;
        if(file){
            try {
                const newGameLogs = await parseCSV(file);
                setGameLogs(prevGameLogs => [...prevGameLogs, ...newGameLogs]);
            } catch (error) {
                console.error('Error parsing CSV:', error);
            }
        }
    };

    return (
        <div id="fileManager">
            <label htmlFor="gameFileInput">Upload Game file</label>
            <input
                id="gameFileInput"
                type="file"
                onChange={handleFileChange}
            />
            <hr />
            <div id='games'>
                {gameLogs.map((GameLog, i) => (
                    <div 
                        className={`game${i === currentgameId ? " selected": ""}`}
                        key={i}
                        onClick={e => {
                            setcurrentgameId(i)
                        }}
                    >
                        {(!GameLog.getWorldStateById(0)?.chatHistory.length && !GameLog.getWorldStateById(0)?.shapeInPlace.length && 
                            <div className="new"></div>
                        ) || (
                            <div className="old"></div>
                        )}
                        <span>Game {i}</span>
                    </div>
                ))}
            </div>
            <hr />
            <div id='gameManager' className={!gameLogs[currentgameId] ? "disabled" : ""}>
                <input 
                    type='range'
                    min={0}
                    step={1}
                    max={gameLogs[currentgameId] ? gameLogs[currentgameId].getLength() - 1: 1}
                    value={step}
                    onChange={e => {
                        setStep(parseInt(e.target.value))
                    }}
                />
                <div
                    className='buttonWrapper'
                >
                    <div
                        className={`previousGame${!!gameLogs[currentgameId] && currentgameId === 0 ? " disabled": ""}`}
                        onClick={e => {
                            setcurrentgameId(prevId => prevId - 1)
                        }}
                    ></div>
                    <div
                        className={`previousStep${!!gameLogs[currentgameId] && step === 0 ? " disabled": ""}`}
                        onClick={e => {
                            setStep(prevStep => prevStep - 1)
                        }}
                    ></div>
                    <div
                        className={`nextStep${!!gameLogs[currentgameId] && step === gameLogs[currentgameId].getLength() - 1 ? " disabled": ""}`}
                        onClick={e => {
                            setStep(prevStep => prevStep + 1)
                        }}
                    ></div>
                    <div
                        className={`nextGame${!!gameLogs[currentgameId] && currentgameId === gameLogs.length - 1 ? " disabled": ""}`}
                        onClick={e => {
                            setcurrentgameId(prevId => prevId + 1)
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default FileManager;
