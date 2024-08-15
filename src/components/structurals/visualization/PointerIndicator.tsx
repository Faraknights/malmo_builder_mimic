import React from 'react';
import { PointerProps } from '../Visualization';

interface PointerIndicatorProps {
	pointer: PointerProps | undefined;
}

const PointerIndicator: React.FC<PointerIndicatorProps> = ({ pointer }) => {
	return (
		<>
			{pointer && (
				<div className="pointerIndicator">
					<span className="type">{pointer.type}</span>
					<span>x : {pointer.cartesianCoordinate.x}</span>
					<span>y : {pointer.cartesianCoordinate.y}</span>
					<span>z : {pointer.cartesianCoordinate.z}</span>
				</div>
			)}
		</>
	);
};

export default PointerIndicator;
