import { Block } from "./worldState";

interface WorldState {
    ChatHistory: string[];
    Timestamp: string;
    BlocksInGrid: {
        X: number;
        Y: number;
        Z: number;
        Type: string;
        Colour: string;
    }[];
}

class Logger {
    private logs: { WorldStates: WorldState[] } = { WorldStates: [] };

    private formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public addEntryToLogs(historyChat: string[], placedBlocks: Block[]): void {
        const newWorldState: WorldState = {
            ChatHistory: [...historyChat],
            Timestamp: this.formatDateTime(new Date()),
            BlocksInGrid: placedBlocks.map(block => ({
                X: block.position.x,
                Y: block.position.z,
                Z: block.position.y,
                Type: "wool",
                Colour: block.color.id 
            }))
        };

        this.logs.WorldStates.push(newWorldState);
    }

    public getLogs(): { WorldStates: WorldState[] } {
        return this.logs;
    }
}
