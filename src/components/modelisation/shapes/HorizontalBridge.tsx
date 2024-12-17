import React from 'react';
import { ShapeList } from '../../../enum/ShapeList';
import Group, { ShapeGroup } from './group';
import { shapeComponentProps, shapeProps } from './Shape';
import { v4 as uuidv4 } from 'uuid';

//
export const HorizontalBridge = ({ color, pending, position, breakable }: shapeComponentProps) => {
	const shapes: shapeProps[] = [
		[0, 0, 0],
		[1, 0, 0],
	].map(([x, y, z]) => ({
		color,
		pending,
		position: { x, y, z },
		shape: ShapeList.HORIZONTAL_BRIDGE_COMPONENT,
		uuid: uuidv4(),
		breakable: breakable,
	}));

	const group = new ShapeGroup(position, shapes, pending, breakable);

	return <Group shapeGroup={group} />;
};
