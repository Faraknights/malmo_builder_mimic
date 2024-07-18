import React, { useEffect, useState } from 'react';
import { chatProps } from '../../../classes/Chat';
import { ShapeInPlaceProps } from '../../../classes/shapeInPlace';
import { parseCSV } from '../../../tools/csvReader';
import { parseJSON } from '../../../tools/jsonReaded';
import { GameLog } from '../../../classes/gameLog';

export interface FileManagerProps {
    chatHistory: chatProps,
    shapeInPlace: ShapeInPlaceProps
}

// Memoized GameComponent to optimize rendering
const GameComponent: React.FC<{ gameLog: GameLog, currentIndex: number, currentgameId: number, onClick: () => void }> = React.memo(({ gameLog, currentIndex, currentgameId, onClick }) => {
    return (
        <div
            className={`game ${currentIndex === currentgameId ? "selected" : ""}`}
            onClick={onClick}
        >
            {(!gameLog.getWorldStateById(0)?.chatHistory.length && !gameLog.getWorldStateById(0)?.shapeInPlace.length &&
                <div className="new"></div>
            ) || (
                <div className="old"></div>
            )}
            <span>Game {currentIndex}</span>
        </div>
    );
});

const FileManager: React.FC<FileManagerProps> = ({
    chatHistory,
    shapeInPlace
}) => {
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [currentgameId, setcurrentgameId] = useState<number>(0);
    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        const lastChangeId = gameLogs[currentgameId]?.gameLog.reduce((acc, cur, idx, arr) => cur.chatHistory.length !== (arr[idx - 1]?.chatHistory.length ?? 0) ? idx : acc, 0);
        setStep(lastChangeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentgameId]);

    useEffect(() => {
        if (gameLogs[currentgameId]) {
            const worldState = gameLogs[currentgameId].getWorldStateById(step)!;
            if (worldState) {
                shapeInPlace.setObjects(worldState.shapeInPlace);
                chatHistory.setChatHistory(worldState.chatHistory);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentgameId, step]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            try {
                if (fileExtension === 'csv') {
                    const newGameLogs = await parseCSV(file);
                    setGameLogs(prevGameLogs => [...prevGameLogs, ...newGameLogs]);
                } else if (fileExtension === 'json') {
                    const newGameLogs = await parseJSON(file);
                    setGameLogs(prevGameLogs => [...prevGameLogs, ...newGameLogs]);
                } else {
                    console.error('Unsupported file type:', fileExtension);
                }
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }
    };
    
    return (
        <div id="fileManager" className='module'>
            <label htmlFor="gameFileInput">Upload Game file</label>
            <input
                id="gameFileInput"
                type="file"
                onChange={handleFileChange}
            />
            <hr />
            <div id='games'>
                {gameLogs.map((gameLog, i) => (
                    <GameComponent
                        key={i}
                        gameLog={gameLog}
                        currentIndex={i}
                        currentgameId={currentgameId}
                        onClick={() => {
                            if (i !== currentgameId) {
                                setcurrentgameId(i);
                            }
                        }}
                    />
                ))}
            </div>
            <hr />
            <div id='gameManager' className={!gameLogs[currentgameId] ? "disabled" : ""}>
                <input 
                    type='range'
                    min={0}
                    step={1}
                    max={gameLogs[currentgameId] ? gameLogs[currentgameId].getLength() - 1 : 1}
                    value={step}
                    onChange={e => {
                        setStep(parseInt(e.target.value))
                    }}
                />
                <div className='buttonWrapper'>
                    <div
                        className={`previousGame${!!gameLogs[currentgameId] && currentgameId === 0 ? " disabled" : ""}`}
                        onClick={e => {
                            setcurrentgameId(prevId => prevId - 1)
                        }}
                    ></div>
                    <div
                        className={`previousStep${!!gameLogs[currentgameId] && step === 0 ? " disabled" : ""}`}
                        onClick={e => {
                            setStep(prevStep => prevStep - 1)
                        }}
                    ></div>
                    <div
                        className={`nextStep${!!gameLogs[currentgameId] && step === gameLogs[currentgameId].getLength() - 1 ? " disabled" : ""}`}
                        onClick={e => {
                            setStep(prevStep => prevStep + 1)
                        }}
                    ></div>
                    <div
                        className={`nextGame${!!gameLogs[currentgameId] && currentgameId === gameLogs.length - 1 ? " disabled" : ""}`}
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
