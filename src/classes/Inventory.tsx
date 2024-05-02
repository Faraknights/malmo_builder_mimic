import { useState } from 'react';
import Color from '../interfaces/Color';

export interface InventorySlot {
    color: Color;
    blockCount: number;
}

export interface inventoryProps {
    currentColor: Color;
    slots: { color: Color, blockCount: number }[];
    setCurrentColor: React.Dispatch<React.SetStateAction<Color>>;
    setSlots: React.Dispatch<React.SetStateAction<InventorySlot[]>>;
	getColorSlot: (id: string) => InventorySlot | undefined,
    hasBlocksLeft: (id: string) => boolean;
    decreaseColor: (id: string) => void;
    increaseColor: (id: string) => void;
    clear: () => void;
    changeColor: (color: Color) => void;
}

export const useInventory = (colors: Color[], nbBlocks: number = 20): inventoryProps => {
    const [currentColor, setCurrentColor] = useState<Color>(colors[0]);
    const [slots, setSlots] = useState<InventorySlot[]>(() => (
        colors.map(color => ({
            color,
            blockCount: nbBlocks
        }))
    ));

    const getColorSlot = (id: string): InventorySlot | undefined => {
        return slots.find(slot => slot.color.id === id);
    };

    const hasBlocksLeft = (id: string): boolean => {
        const slot = getColorSlot(id);
        return slot ? slot.blockCount > 0 : false;
    };

    const decreaseColor = (id: string): void => {
        setSlots(prevSlots =>
            prevSlots.map(slot => {
                if (slot.color.id === id && slot.blockCount > 0) {
                    return { ...slot, blockCount: slot.blockCount - 1 };
                }
                return slot;
            })
        );
    };

    const increaseColor = (id: string): void => {
        setSlots(prevSlots =>
            prevSlots.map(slot => {
                if (slot.color.id === id) {
                    return { ...slot, blockCount: slot.blockCount + 1 };
                }
                return slot;
            })
        );
    };

    const clear = (): void => {
        setSlots([]);
    };

    const changeColor = (color: Color): void => {
        setCurrentColor(color);
    };

    return {
        currentColor,
        slots,
        setCurrentColor,
        setSlots,
        getColorSlot,
        hasBlocksLeft,
        decreaseColor,
        increaseColor,
        clear,
        changeColor
    };
};