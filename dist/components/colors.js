export class Inventory {
    constructor(Colors, nbBlock = 20) {
        this.slots = Colors.map(color => ({
            color,
            blockCount: nbBlock
        }));
    }
    colorExists(id) {
        return this.slots.some(slot => slot.color.id === id);
    }
    ensureColorExists(id) {
        if (!this.colorExists(id)) {
            throw new Error(`Color with ID ${id} does not exist in the inventory.`);
        }
    }
    getColorSlot(id) {
        const slot = this.slots.find(slot => slot.color.id === id);
        if (!slot) {
            throw new Error(`Color with ID ${id} does not exist in the inventory.`);
        }
        return slot;
    }
    hasBlocksLeft(id) {
        this.ensureColorExists(id);
        return this.getColorSlot(id).blockCount > 0;
    }
    getAllColors() {
        return this.slots;
    }
    decreaseColor(id) {
        if (this.hasBlocksLeft(id)) {
            const slot = this.getColorSlot(id);
            slot.blockCount--;
        }
    }
    increaseColor(id) {
        const slot = this.getColorSlot(id);
        slot.blockCount++;
    }
}
//# sourceMappingURL=colors.js.map