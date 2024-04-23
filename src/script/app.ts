import { Inventory } from "./components/inventory";
import { WorldState } from "./components/worldState";
import { MalmoBuilder } from "./components/malmoBuilder";
import { Color } from "three";
import { Mode, ModeMaster } from "./components/mode";

export type BlockPlacementFunction = (x: number, y: number, z: number) => void;
export type BlockBreakingFunction = (x: number, y: number, z: number) => void;

function placeBlockSimulator(x:number, y:number, z:number): void{
    malmoBuilder.placeBlock(x, y, z, currentColor)
    currentWorldState.addBlock({
        color: currentColor,
        position: {
            x: x,
            y: y,
            z: z
        }
    })
    inventory.decreaseColor(currentColor.id)
    console.log(currentWorldState)
}

function breakBlockSimulator(x:number, y:number, z:number): void{
    malmoBuilder.breakBlock(x, y, z)
    currentWorldState.removeBlock(x, y, z)
    inventory.increaseColor(currentColor.id)
}

const inventory = new Inventory(
    [
        { id: "RED", hex: "#c0392b" },
        { id: "BLUE", hex: "#3498db" },
        { id: "ORANGE", hex: "#e67e22" },
        { id: "PURPLE", hex: "#9b59b6" },
        { id: "YELLOW", hex: "#f1c40f" },
        { id: "GREEN", hex: "#27ae60" } 
    ], 
    20,
    document.querySelector('#colorPickerWrapper')!
);

let currentColor = inventory.getAllColors()[0].color;
const currentWorldState = new WorldState();
const malmoBuilder = new MalmoBuilder(20, placeBlockSimulator, breakBlockSimulator);

const mode = new ModeMaster(Mode.SIMULATION)
document.querySelector("#modeSelector .simulator")?.addEventListener("click", () => mode.changeMode(Mode.SIMULATION));
document.querySelector("#modeSelector .visualizer")?.addEventListener("click", () => mode.changeMode(Mode.VISUALIZATION));

document.getElementById('download')?.addEventListener("click", e => {
    malmoBuilder.clearBoard()
    inventory.clear()
    currentWorldState.clear()
})
