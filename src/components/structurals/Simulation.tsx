import { useInventory, inventoryProps } from '../../classes/Inventory';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { EnvironmentMode, GameMode } from '../../interfaces/mode';
import Environment from '../modelisation/environment';
import ColorPicker from './simulation/ColorPicker';

const Simulation = () => {
    const inventory: inventoryProps = useInventory([
        { id: "RED", hex: "#c0392b" },
        { id: "BLUE", hex: "#3498db" },
        { id: "ORANGE", hex: "#e67e22" },
        { id: "PURPLE", hex: "#9b59b6" },
        { id: "YELLOW", hex: "#f1c40f" },
        { id: "GREEN", hex: "#27ae60" } 
    ], 20);
    const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();

    return (
        <>
            <Environment 
				shapeInPlace = {{...shapeInPlace}}
				environmentMode={EnvironmentMode.MINECRAFT}
				gameMode={GameMode.SIMULATION}
			/>
            <div id="side">
				<ColorPicker {...inventory}/>
                <div id="chatWrapper">
                    <div id="historyChat"></div>
                    <div>
                        <input type="checkbox" id="userSelector" name="userSelector" />
                    </div>
                </div>
                <button id="download">Download</button>
            </div>
        </>
    );
};

export default Simulation;
