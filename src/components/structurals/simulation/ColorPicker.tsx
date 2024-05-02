import React from 'react';
import { inventoryProps } from '../../../classes/Inventory';

const ColorPicker: React.FC<inventoryProps> = ({
    currentColor,
    slots,
    changeColor
}) => {
    console.log(slots)
    return (
        <div id="colorPicker">
            <span>Color Picker</span>
            <div>
                {slots.map(slot => (
                    <div
                        key={slot.color.id}
                        className={`color${currentColor.id === slot.color.id ? " selected" : ""}`}
                        onClick={() => changeColor(slot.color)}
                        style={{backgroundColor: slot.color.hex}}
                    >
                        {slot.blockCount}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorPicker;
