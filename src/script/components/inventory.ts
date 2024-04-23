// Color.ts
export interface Color {
  id: string;
  hex: string;
}

export interface InventorySlot {
  color: Color;
  blockCount: number;
}

export class Inventory {
  private slots: InventorySlot[];
  private nbBlocks: number;
  private wrapperElement: Element

  constructor(colors: Color[], nbBlocks: number = 20, wrapperElement: Element) {
    this.nbBlocks = nbBlocks;
    this.slots = colors.map(color => ({
      color,
      blockCount: nbBlocks
    }));
    this.wrapperElement = wrapperElement
  }

  private colorExists(id: string): boolean {
    return this.slots.some(slot => slot.color.id === id);
  }

  private ensureColorExists(id: string): void {
    if (!this.colorExists(id)) {
      throw new Error(`Color with ID ${id} does not exist in the inventory.`);
    }
  }

  getColorSlot(id: string): InventorySlot{
    const slot = this.slots.find(slot => slot.color.id === id);
    if (!slot) {
      throw new Error(`Color with ID ${id} does not exist in the inventory.`);
    }
    return slot;
  }

  hasBlocksLeft(id: string): boolean {
    this.ensureColorExists(id)
    return this.getColorSlot(id).blockCount > 0;
  }

  getAllColors(): InventorySlot[] {
    return this.slots;
  }

  decreaseColor(id: string): void {
    if (this.hasBlocksLeft(id)) {
      const slot = this.getColorSlot(id);
      slot.blockCount--;
    }
  }

  increaseColor(id: string): void {
    const slot = this.getColorSlot(id);
    slot.blockCount++;
  }

  clear(): void {
    this.slots.map(slot => {
      slot.blockCount = this.nbBlocks;
    });
  }
}