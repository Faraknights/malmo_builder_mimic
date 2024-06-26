import Nebula from "../components/structurals/Nebula";
import Simulation from "../components/structurals/Simulation";
import Visualization from "../components/structurals/Visualization";

export enum GameMode {
    SIMULATION = 'SIMULATION',
    VISUALIZATION = 'VISUALIZATION',
    NEBULA = 'NEBULA'
}

export const gameModeComponent: { [key in GameMode]: React.ComponentType<any>} = {
    [GameMode.SIMULATION]: Simulation,
    [GameMode.VISUALIZATION]: Visualization,
    [GameMode.NEBULA]: Nebula
}