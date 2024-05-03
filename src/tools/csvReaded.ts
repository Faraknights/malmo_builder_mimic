import { GameLog, worldStateProps } from "../classes/gameLog";
import { shapeList } from "../components/modelisation/shapes/Shape";
import { COLORS } from "../constants/colors";

export interface csvFormat{
    dial_with_actions: {
        prevMoves: String[]
        prevWorldState: String
        instruction: String[]
    }
    action_seq: String[]
}

export function parseCSV(file: File): Promise<GameLog[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const csv = event.target?.result as string;
            const games: GameLog[] = []

            let match;
            const csv_spliter = /"(.+?)","?(.*?)"?(?=(\n"|$))/gs;
            const dial_spliter = /((?:^(?:(?:place|pick) .*?\n)*|EMPTY))(.*?)(<.*)/s
            while ((match = csv_spliter.exec(csv)) !== null) {
                const dial_with_actions = match[1].replace(/\r$/, "").replace(/"$/, "").replace(/^"/, "").replace(/^\s/, "")
                const action_seq = match[2].replace(/\r$/, "").replace(/"$/, "").replace(/^"/, "").trim().split("\n")
                
                const dial_split = dial_with_actions.match(dial_spliter)!
                
                const prevMoves = dial_split[1].trim().split("\n")
                const prevWorldState = dial_split[2].trim().replace(/^"+/, '').replace(/"+$/, '')
                const instructions = dial_split[3].trim().split("\n")
                
                const worldState: worldStateProps = {
                    chatHistory: [],
                    shapeInPlace: []
                }

                if(prevMoves[0] !== "EMPTY" && prevWorldState !== "EMPTY" && prevWorldState){   
                    const worldStateSplitted = prevWorldState.split(":");
    
                    worldStateSplitted.forEach(blockStr => {
                        
                        const matches = blockStr.split(/(\d+) (\w+) (.*)/gm)
                        const positions = matches[3].split(',');
                        
                        positions.forEach(position => {
                            const newPositions = position.trim().split(" ");
                            const colorName = matches[2].toUpperCase();
                            worldState.shapeInPlace.push({
                                color: COLORS[colorName as keyof typeof COLORS],
                                shape: shapeList.CUBE,
                                position: {
                                    x: parseInt(newPositions[0]),
                                    y: parseInt(newPositions[1]),
                                    z: parseInt(newPositions[2])
                                }
                            })
                        });
                    });
                }

                const gameLog = new GameLog()

                gameLog.addWorldState(worldState)
                
                instructions.forEach(instruction => {
                    const cleanedInstruction = instruction.trim()
                    const lastWorldState = gameLog.getLastWorldState()
                    if(cleanedInstruction.startsWith("place")){
                        
                        const placement = cleanedInstruction.split(" ")
                        lastWorldState?.shapeInPlace.push({
                            color: COLORS[placement[1].toUpperCase() as keyof typeof COLORS],
                            position: {
                                x: parseInt(placement[2]),
                                y: parseInt(placement[3]),
                                z: parseInt(placement[4])
                            },
                            shape: shapeList.CUBE
                        })
                    } else if (cleanedInstruction.startsWith("pick")){

                        
                        const criteria = cleanedInstruction.split(" ");
                        const position = {
                            x: parseInt(criteria[1]),
                            y: parseInt(criteria[2]),
                            z: parseInt(criteria[3])
                        };

                        lastWorldState!.shapeInPlace = lastWorldState!.shapeInPlace.filter(shape => {
                            return shape.position.x !== position.x ||
                                    shape.position.y !== position.y ||
                                    shape.position.z !== position.z;
                        });
                    } else {
                        
                        const message = cleanedInstruction.split(/<(.*)> (.*)/gm)
                        lastWorldState?.chatHistory.push({
                            user: message[1],
                            content: message[2]
                        })
                    }
                    gameLog.addWorldState(lastWorldState!)
                })
                
                action_seq.forEach(instruction => {
                    const cleanedInstruction = instruction.trim()
                    const lastWorldState = gameLog.getLastWorldState()
                    if(cleanedInstruction.startsWith("place")){
                        
                        const placement = cleanedInstruction.split(" ")
                        lastWorldState?.shapeInPlace.push({
                            color: COLORS[placement[1].toUpperCase() as keyof typeof COLORS],
                            position: {
                                x: parseInt(placement[2]),
                                y: parseInt(placement[3]),
                                z: parseInt(placement[4])
                            },
                            shape: shapeList.CUBE
                        })
                    } else if (cleanedInstruction.startsWith("pick")){
                        
                        const criteria = cleanedInstruction.split(" ");
                        const position = {
                            x: parseInt(criteria[1]),
                            y: parseInt(criteria[2]),
                            z: parseInt(criteria[3])
                        };

                        lastWorldState!.shapeInPlace = lastWorldState!.shapeInPlace.filter(shape => {
                            return shape.position.x !== position.x ||
                                    shape.position.y !== position.y ||
                                    shape.position.z !== position.z;
                        });
                    }

                    gameLog.addWorldState(lastWorldState!)
                })

                games.push(gameLog)
            }

            resolve(games)
        };

        reader.onerror = (event) => {
            reject(event.target?.error || new Error('Unknown FileReader error'));
        };

        reader.readAsText(file);
    })
}