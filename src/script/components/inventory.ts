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
  currentColor: Color;
  private slots: InventorySlot[];
  private nbBlocks: number;
  private wrapperElement: Element;

  constructor(colors: Color[], nbBlocks: number = 20, wrapperElement: Element) {
    this.currentColor = colors[0]
    this.nbBlocks = nbBlocks;
    this.slots = colors.map(color => ({
      color,
      blockCount: nbBlocks
    }));
    this.wrapperElement = document.querySelector("#colorPickerWrapper")!

    const wrapper = document.querySelector("#colorPickerWrapper")
    this.createColorPicker()
  }

  private colorExists(id: string): boolean {
    return this.slots.some(slot => slot.color.id === id);
  }

  private ensureColorExists(id: string): void {
    if (!this.colorExists(id)) {
      throw new Error(`Color with ID ${id} does not exist in the inventory.`);
    }
  }

  private createColorPicker(){
    this.getAllColors().forEach(slot => {
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color");
        colorDiv.setAttribute("color", slot.color.id);
        colorDiv.style.background = slot.color.hex;
        colorDiv.textContent = String(slot.blockCount);
        colorDiv.addEventListener("click", () => {
            document.querySelectorAll(".color").forEach(div => {
                div.classList.remove("selected");
            });
            this.changeColor(this.getColorSlot(slot.color.id).color)
            colorDiv.classList.add("selected");
        });
        this.wrapperElement.appendChild(colorDiv);
    });
    this.wrapperElement.querySelector(".color")?.classList.add("selected")
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
      document.querySelector(`.color[color="${id}"]`)!.textContent = String(slot.blockCount)
    }
  }

  increaseColor(id: string): void {
    const slot = this.getColorSlot(id);
    slot.blockCount++;
    document.querySelector(`.color[color="${id}"]`)!.textContent = String(slot.blockCount)
  }

  clear(): void {
    this.slots.map(slot => {
      slot.blockCount = this.nbBlocks;
    });
  }

  changeColor(newColor: Color){
    this.currentColor = newColor
  }
}