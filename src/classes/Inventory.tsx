import { useState } from 'react';
import Color from '../interfaces/Color';
import { COLORS, definedColors } from '../constants/colors';
import { shapeList } from '../constants/shapeList';

export interface inventoryProps {
	currentColor: Color;
	colors: Color[];
	currentShape: shapeList;
	shapes: shapeList[];
	setCurrentColor: React.Dispatch<React.SetStateAction<Color>>;
	setColors: React.Dispatch<React.SetStateAction<Color[]>>;
	setCurrentShape: React.Dispatch<React.SetStateAction<shapeList>>;
	setShapes: React.Dispatch<React.SetStateAction<shapeList[]>>;
	changeColor: (id: definedColors) => void;
}

export const useInventory = (
	selectedColors: Color[],
	selectedShapes: shapeList[]
): inventoryProps => {
	const [currentColor, setCurrentColor] = useState<Color>(selectedColors[0]);
	const [colors, setColors] = useState<Color[]>(selectedColors);
	const [currentShape, setCurrentShape] = useState<shapeList>(
		selectedShapes[0]
	);
	const [shapes, setShapes] = useState<shapeList[]>(selectedShapes);

	const changeColor = (id: definedColors): void => {
		setCurrentColor(COLORS[id]);
	};

	return {
		currentColor,
		colors,
		currentShape,
		shapes,
		setCurrentColor,
		setColors,
		setCurrentShape,
		setShapes,
		changeColor,
	};
};
