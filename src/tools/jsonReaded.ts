import { GameLog, worldStateProps } from "../classes/gameLog";
import { COLORS, definedColors } from "../constants/colors";
import { shapeList } from "../constants/shapeList";
import { v4 as uuidv4 } from 'uuid';

export interface csvFormat {
    "worldStates" : {
        "color": string,
        "x": number,
        "y": number,
        "z": number
    }[]
}

export function parseJSON(file: File): Promise<GameLog[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const {worldStates: json} = {"worldStates": JSON.parse(event.target?.result as string)} as csvFormat;

                const worldState = {
                    chatHistory: [],
                    shapeInPlace: [],
                    timestamp: new Date()
                } as worldStateProps;

                const games: GameLog[] = [];
                const game = new GameLog()

                json.forEach(block => {
                    worldState.shapeInPlace.push({
                        color: COLORS[definedColors[block.color.toUpperCase() as keyof typeof definedColors]],
                        breakable: false,
                        pending: false,
                        position:{
                            x: block.x,
                            y: block.y,
                            z: block.z,
                        },
                        shape: shapeList.CUBE,
                        uuid: uuidv4()
                    })
                    const clonedWorldState = JSON.parse(JSON.stringify(worldState))
                    game.addWorldState(clonedWorldState)
                })

                games.push(game)

                resolve(games);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (event) => {
            reject(event.target?.error || new Error("Unknown FileReader error"));
        };

        reader.readAsText(file);
    });
}