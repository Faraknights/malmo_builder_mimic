import { Inventory } from "./components/inventory";
import { WorldState } from "./components/worldState";
import { MalmoBuilder } from "./components/malmoBuilder";
import { Color } from "three";
import { Mode, ModeMaster } from "./components/mode";

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
const currentWorldState = new WorldState();
const currentMode = new ModeMaster()

const malmoBuilder = new MalmoBuilder(20, currentWorldState, inventory, currentMode);

function clearGame(){
    malmoBuilder.clearBoard()
    inventory.clear()
    currentWorldState.clear()
}

document.querySelectorAll("#modeSelector > *").forEach(button => {
    button.addEventListener("click", e => {
        const target = e.target as HTMLElement;
        const newModeStr = target.getAttribute("mode");
        if (newModeStr) {
            const newMode = Mode[newModeStr as keyof typeof Mode];
            currentMode.changeMode(newMode);
            console.log(currentMode)
            clearGame()
        }
    });
});

document.getElementById('download')?.addEventListener("click", e => {
    malmoBuilder.clearBoard()
    inventory.clear()
    currentWorldState.clear()
})