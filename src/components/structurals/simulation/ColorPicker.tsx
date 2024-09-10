import React from 'react';
import { useGlobalState } from '../GlobalStateProvider';

const ColorPicker: React.FC = () => {
	const { currentColor, colors, changeColor } = useGlobalState().inventory;

	const nbColorByRow = 3;
	const ColorsByRow = [];
	for (let i = 0; i < colors.length; i += nbColorByRow) {
		ColorsByRow.push(colors.slice(i, i + nbColorByRow));
	}
	return (
		<div id="colorPicker" className="module">
			<h3>Color Picker</h3>
			<div id="colorList">
				{ColorsByRow.map((rowOfColor, i) => (
					<div key={i}>
						{rowOfColor.map((color) => (
							<div
								key={color.id}
								className={`color${currentColor.id === color.id ? ' selected' : ''}`}
								onClick={() => changeColor(color.id)}
							>
								<div style={{ backgroundColor: color.hex }}></div>
								<span>{color.id[0] + color.id.slice(1).toLowerCase()}</span>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default ColorPicker;
