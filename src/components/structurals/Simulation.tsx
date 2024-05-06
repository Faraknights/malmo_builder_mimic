import { useInventory, inventoryProps } from '../../classes/Inventory';
import { useShapeInPlace, ShapeInPlaceProps } from '../../classes/shapeInPlace';
import { COLORS, definedColors } from '../../constants/colors';
import { EnvironmentMode, GameMode } from '../../interfaces/mode';
import Environment from '../modelisation/environment';
import Side from './Side';
import ColorPicker from './simulation/ColorPicker';

const Simulation = () => {
    const inventory: inventoryProps = useInventory(Object.values(definedColors).map(color => COLORS[color]), 20);
    const shapeInPlace: ShapeInPlaceProps = useShapeInPlace();

    return (
		<main>
            <Environment 
				environmentMode={EnvironmentMode.MINECRAFT}
				gameMode={GameMode.SIMULATION}
				shapeInPlace={shapeInPlace}
                inventory={inventory}

			/>
            <Side>
				<ColorPicker {...inventory}/>
                <div id="chatWrapper">
                    <div id="historyChat"></div>
                    <div>
                        <input type="checkbox" id="userSelector" name="userSelector" />
                    </div>
                </div>
                <button id="download">Download</button>
            </Side>
        </main>
    );
};

export default Simulation;
