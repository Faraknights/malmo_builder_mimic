import { Inventory } from "./components/colors";
import { WorldState } from "./components/worldState";
import { MalmoBuilder } from "./components/malmoBuilder";
const inventory = new Inventory([
    { id: "RED", hex: "#c0392b" },
    { id: "BLUE", hex: "#3498db" },
    { id: "ORANGE", hex: "#e67e22" },
    { id: "PURPLE", hex: "#9b59b6" },
    { id: "YELLOW", hex: "#f1c40f" },
    { id: "GREEN", hex: "#27ae60" }
], 20);
let currentColor = inventory.getAllColors()[0].color;
let currentWorldState = new WorldState();
const malmoBuilder = new MalmoBuilder(inventory, currentColor, currentWorldState);
//# sourceMappingURL=app.js.map