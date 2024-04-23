import { Color } from "./inventory";

export interface CartesianCoordinate {
    x: number
    y: number
    z: number
}

export interface Block {
    position: CartesianCoordinate;
    color: Color;
}

export class WorldState {
  private existingBlocks : Block[];

  constructor() {
    this.existingBlocks = [];
  }

  nbBlocks() : number{
    return this.existingBlocks.length
  }
  
  blockExists(x: number, y: number, z: number): boolean {
    return this.existingBlocks.some(block => block.position.x === x && block.position.y === y && block.position.z === z);
  }

  addBlock(block: Block): void {
    if (!this.blockExists(block.position.x, block.position.y, block.position.z)) {
      this.existingBlocks.push(block);
    } else {
      console.error("Error: Block already exists at this position.");
    }
  }

  removeBlock(x: number, y: number, z: number): void {
    const index = this.existingBlocks.findIndex(block => block.position.x === x && block.position.y === y && block.position.z === z);
    if (index !== -1) {
      this.existingBlocks.splice(index, 1);
    } else {
      console.error("Error: Block does not exist at this position.");
    }
  }

  clear(){
    this.existingBlocks = []
  }
}