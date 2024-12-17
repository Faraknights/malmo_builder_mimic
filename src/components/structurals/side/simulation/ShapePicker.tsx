import React from 'react';
import { useGlobalState } from '../../GlobalStateProvider';
import { ShapeList } from '../../../../enum/ShapeList';
import { useRouter } from 'next/router';

const ShapePicker: React.FC = () => {
	const {
		inventory: { currentColor, currentShape, shapes, setCurrentShape },
	} = useGlobalState();
	const router = useRouter();

	const nbShapeByRow = 3;
	const ShapesByRow = [];
	for (let i = 0; i < shapes.length; i += nbShapeByRow) {
		ShapesByRow.push(shapes.slice(i, i + nbShapeByRow));
	}
	return (
		(shapes.length > 1 && (
			<div id="shapePicker" className="module">
				<h3>Shape Picker</h3>
				<div id="colorList">
					{ShapesByRow.map((rowOfShape, i) => (
						<div key={i}>
							{rowOfShape.map((shapeId) => {
								const imageName = `${ShapeList[shapeId]}-${currentColor.id}`;
								return (
									<div
										key={shapeId}
										className={`color${currentShape === shapeId ? ' selected' : ''}`}
										onClick={() => setCurrentShape(shapeId)}
									>
										<img
											src={`${router.basePath}/assets/icons/shapes/${imageName}.png`}
											alt={imageName}
										/>
										<span>
											{ShapeList[shapeId][0] +
												ShapeList[shapeId].slice(1).toLowerCase().replace('_', ' ')}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		)) || <></>
	);
};

export default ShapePicker;
