import { shapeProps } from "../components/modelisation/shapes/Shape";
import { Message } from "./Chat";

export interface worldStateProps {
    timestamp?: Date;
    chatHistory: Message[];
    shapeInPlace: shapeProps[];
}

export class GameLog {
    private gameLog: worldStateProps[];

    constructor() {
        this.gameLog = [];
    }

    getLength(): number{
        return this.gameLog.length
    }

    addWorldState(worldState: worldStateProps): void {
        this.gameLog.push(worldState);
    }

    clear(): void {
        this.gameLog = [];
    }

    getLastWorldState(): worldStateProps | undefined {
        const lastGame = this.gameLog[this.gameLog.length - 1]
    
        if(lastGame.timestamp){
            return {
                timestamp: lastGame.timestamp,
                chatHistory: [...lastGame.chatHistory],
                shapeInPlace: [...lastGame.shapeInPlace]
            }
        } else {
            return {
                chatHistory: [...lastGame.chatHistory],
                shapeInPlace: [...lastGame.shapeInPlace]
            }
        }
    }

    getWorldStateById(id: number): worldStateProps | undefined {
        if(id < this.gameLog.length){
            const game = this.gameLog[id]
        
            if(game.timestamp){
                return {
                    timestamp: game.timestamp,
                    chatHistory: [...game.chatHistory],
                    shapeInPlace: [...game.shapeInPlace]
                }
            } else {
                return {
                    chatHistory: [...game.chatHistory],
                    shapeInPlace: [...game.shapeInPlace]
                }
            }
        } else {
            return undefined
        }
    }
}
