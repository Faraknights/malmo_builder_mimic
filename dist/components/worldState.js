/*


export class Block {
    private position: BlockPosition;
    private color: Color;
    
    constructor(x: number, y: number, z: number, color: Color) {
        this.position = {
            x: x,
            y: y,
            z: z
        };
        this.color = color
      }
}

*/
export class WorldState {
    constructor() {
        this.existingBlocks = [];
    }
    nbBlocks() {
        return this.existingBlocks.length;
    }
    blockExists(x, y, z) {
        return this.existingBlocks.some(block => block.position.x === x && block.position.y === y && block.position.z === z);
    }
    addBlock(block) {
        if (!this.blockExists(block.position.x, block.position.y, block.position.z)) {
            this.existingBlocks.push(block);
        }
        else {
            console.error("Error: Block already exists at this position.");
        }
    }
    removeBlock(x, y, z) {
        const index = this.existingBlocks.findIndex(block => block.position.x === x && block.position.y === y && block.position.z === z);
        if (index !== -1) {
            this.existingBlocks.splice(index, 1);
        }
        else {
            console.error("Error: Block does not exist at this position.");
        }
    }
}
//# sourceMappingURL=worldState.js.map