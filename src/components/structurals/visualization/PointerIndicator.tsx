import React from 'react';
import { useGlobalState } from '../GlobalStateProvider';

const PointerIndicator: React.FC = () => {
	const { pointer } = useGlobalState().pointer;
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
