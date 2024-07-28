import React from 'react';
import { CartesianCoordinate } from '../../../interfaces/cartesianCoordinate';
import Color from '../../../interfaces/Color';
import Cube from './Cube';
import Nut from './Nut';
import Screw from './Screw';
import { HorizontalBridge } from './HorizontalBridge';
import Washer from './Washer';
import { MeshType, ShapeUserData } from '../../../constants/meshType';
import BridgeComponent from './BridgeComponent';
import { VerticalBridge } from './VerticalBridge';
import { shapeList } from '../../../constants/shapeList';
import { COLORS, definedColors } from '../../../constants/colors';
//import Diamond from "./Diamond";

export interface shapeComponentProps {
	pending: boolean;
	breakable: boolean;
	uuid: string;
	position: CartesianCoordinate;
	color: Color;
}

const shapeComponents: {
	[key in shapeList]: React.ComponentType<shapeComponentProps>;
} = {
	[shapeList.CUBE]: Cube,
	[shapeList.SCREW]: Screw,
	[shapeList.NUT]: Nut,
	[shapeList.HORIZONTAL_BRIDGE]: HorizontalBridge,
	[shapeList.VERTICAL_BRIDGE]: VerticalBridge,
	[shapeList.WASHER]: Washer,
	[shapeList.HORIZONTAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => (
		<BridgeComponent {...props} rotation={'HORIZONTAL'} />
	),
	[shapeList.VERTICAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => (
		<BridgeComponent {...props} rotation={'VERTICAL'} />
	),
};

export const shapeHitbox: { [key in shapeList]: CartesianCoordinate[] } = {
	[shapeList.CUBE]: [{ x: 0, y: 0, z: 0 }],
	[shapeList.SCREW]: [{ x: 0, y: 0, z: 0 }],
	[shapeList.NUT]: [{ x: 0, y: 0, z: 0 }],
	[shapeList.HORIZONTAL_BRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 1, y: 0, z: 0 },
	],
	[shapeList.VERTICAL_BRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 0, y: 0, z: 1 },
	],
	[shapeList.WASHER]: [{ x: 0, y: 0, z: 0 }],
	[shapeList.HORIZONTAL_BRIDGE_COMPONENT]: [{ x: 0, y: 0, z: 0 }],
	[shapeList.VERTICAL_BRIDGE_COMPONENT]: [{ x: 0, y: 0, z: 0 }],
};

export interface shapeProps extends shapeComponentProps {
	shape: shapeList;
}

const interpolateColor = (
	initial: string,
	final: string,
	percent: number
): string => {
	const hexToRGB = (hex: string): number[] => [
		parseInt(hex.slice(1, 3), 16),
		parseInt(hex.slice(3, 5), 16),
		parseInt(hex.slice(5, 7), 16),
	];

	const rgbToHex = (rgb: number[]): string =>
		'#' +
		rgb
			.map((component) => component.toString(16).padStart(2, '0'))
			.join('');

	const initialRGB = hexToRGB(initial);
	const finalRGB = hexToRGB(final);

	const intermediateRGB = initialRGB.map((component, index) =>
		Math.max(
			0,
			Math.min(
				255,
				Math.round(
					component + ((finalRGB[index] - component) * percent) / 100
				)
			)
		)
	);

	return rgbToHex(intermediateRGB);
};

export const Shapes = (props: shapeProps) => {
	const ShapeComponent = shapeComponents[props.shape];
	return (
		<mesh
			userData={
				{
					type: MeshType.SHAPE,
					position: props.position,
					pending: props.pending,
					shape: props.shape,
				} as ShapeUserData
			}
			position={[props.position.x, props.position.y, props.position.z]}
		>
			{(props.breakable && (
				<ShapeComponent
					{...props}
					color={
						{
							hex: interpolateColor(
								props.color.hex,
								COLORS.WHITE.hex,
								40
							),
							id: definedColors.WHITE,
						} as Color
					}
				/>
			)) || <ShapeComponent {...props} />}
		</mesh>
	);
};
