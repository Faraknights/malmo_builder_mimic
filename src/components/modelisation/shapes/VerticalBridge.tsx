import React from 'react';
import { ShapeList } from '../../../enum/ShapeList';
import Group, { ShapeGroup } from './group';
import { shapeComponentProps, shapeProps } from './Shape';
import { v4 as uuidv4 } from 'uuid';

//
export const VerticalBridge = ({ color, pending, position, breakable }: shapeComponentProps) => {
	const group = new ShapeGroup(
		position,
		[
			{
				color: color,
				pending: pending,
				position: {
					x: 0,
					y: 0,
					z: 0,
				},
				shape: ShapeList.VERTICAL_BRIDGE_COMPONENT,
				uuid: uuidv4(),
			} as shapeProps,
			{
				color: color,
				pending: pending,
				position: {
					x: 0,
					y: 0,
					z: 1,
				},
				shape: ShapeList.VERTICAL_BRIDGE_COMPONENT,
				uuid: uuidv4(),
			} as shapeProps,
		],
		pending,
		breakable
	);
	return <Group shapeGroup={group} />;
};
