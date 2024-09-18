import { useState } from 'react';
import Color from '../interfaces/Color';
import { COLORS } from '../constants/COLORS';
import { Colors } from '../enum/Colors';
import { ShapeList } from '../enum/ShapeList';

//
export interface inventoryProps {
	currentColor: Color;
	colors: Color[];
	currentShape: ShapeList;
	shapes: ShapeList[];
	setCurrentColor: React.Dispatch<React.SetStateAction<Color>>;
	setColors: React.Dispatch<React.SetStateAction<Color[]>>;
	setCurrentShape: React.Dispatch<React.SetStateAction<ShapeList>>;
	setShapes: React.Dispatch<React.SetStateAction<ShapeList[]>>;
	changeColor: (id: Colors) => void;
}

export const useInventory = (selectedColors: Color[], selectedShapes: ShapeList[]): inventoryProps => {
	const [currentColor, setCurrentColor] = useState<Color>(selectedColors[0]);
	const [colors, setColors] = useState<Color[]>(selectedColors);
	const [currentShape, setCurrentShape] = useState<ShapeList>(selectedShapes[0]);
	const [shapes, setShapes] = useState<ShapeList[]>(selectedShapes);

	const changeColor = (id: Colors): void => {
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
