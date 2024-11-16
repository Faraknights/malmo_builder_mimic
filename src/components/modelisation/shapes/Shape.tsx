import React from 'react';
import { CartesianCoordinate } from '../../../interfaces/CartesianCoordinate';
import Color from '../../../interfaces/Color';
import Cube from './Cube';
import Nut from './Nut';
import Screw from './Screw';
import { HorizontalBridge } from './HorizontalBridge';
import Washer from './Washer';
import { ShapeUserData } from '../../../interfaces/userDatas';
import BridgeComponent from './BridgeComponent';
import { VerticalBridge } from './VerticalBridge';
import { COLORS } from '../../../constants/COLORS';
import { MeshTypes } from '../../../enum/Mesh';
import { ShapeList } from '../../../enum/ShapeList';
import Bolt from './bolt';
import Gasket from './gasket';
import HexNut from './hex_nut';
import SquareNut from './square_nut';

//
export interface shapeComponentProps {
	pending: boolean;
	breakable: boolean;
	uuid: string;
	position: CartesianCoordinate;
	color: Color;
}

const shapeComponents: {
	[key in ShapeList]: React.ComponentType<shapeComponentProps>;
} = {
	[ShapeList.CUBE]: Cube,
	[ShapeList.SCREW]: Screw,
	[ShapeList.NUT]: Nut,
	[ShapeList.HORIZONTAL_BRIDGE]: HorizontalBridge,
	[ShapeList.VERTICAL_BRIDGE]: VerticalBridge,
	[ShapeList.HBRIDGE]: HorizontalBridge,
	[ShapeList.VBRIDGE]: VerticalBridge,
	[ShapeList.WASHER]: Washer,
	[ShapeList.HORIZONTAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => (
		<BridgeComponent {...props} rotation={'HORIZONTAL'} />
	),
	[ShapeList.VERTICAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => (
		<BridgeComponent {...props} rotation={'VERTICAL'} />
	),
	[ShapeList.BOLT] : Bolt,
	[ShapeList.GASKET] : Gasket,
	[ShapeList.HEX_NUT] : HexNut,
	[ShapeList.SQUARE_NUT] : SquareNut
};

export const shapeHitbox: { [key in ShapeList]: CartesianCoordinate[] } = {
	[ShapeList.CUBE]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.SCREW]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.NUT]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.HORIZONTAL_BRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 1, y: 0, z: 0 },
	],
	[ShapeList.VERTICAL_BRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 0, y: 0, z: 1 },
	],
	[ShapeList.HBRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 1, y: 0, z: 0 },
	],
	[ShapeList.VBRIDGE]: [
		{ x: 0, y: 0, z: 0 },
		{ x: 0, y: 0, z: 1 },
	],
	[ShapeList.WASHER]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.HORIZONTAL_BRIDGE_COMPONENT]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.VERTICAL_BRIDGE_COMPONENT]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.BOLT]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.GASKET]: [{ x: 0, y: 0, z: 0 }],
	[ShapeList.HEX_NUT] : [{ x: 0, y: 0, z: 0 }],
	[ShapeList.SQUARE_NUT] : [{ x: 0, y: 0, z: 0 }]
};

export interface shapeProps extends shapeComponentProps {
	shape: ShapeList;
}

const interpolateColor = (initial: string, final: string, percent: number): string => {
	const hexToRGB = (hex: string): number[] => [
		parseInt(hex.slice(1, 3), 16),
		parseInt(hex.slice(3, 5), 16),
		parseInt(hex.slice(5, 7), 16),
	];

	const rgbToHex = (rgb: number[]): string =>
		'#' + rgb.map((component) => component.toString(16).padStart(2, '0')).join('');

	const initialRGB = hexToRGB(initial);
	const finalRGB = hexToRGB(final);

	const intermediateRGB = initialRGB.map((component, index) =>
		Math.max(0, Math.min(255, Math.round(component + ((finalRGB[index] - component) * percent) / 100)))
	);

	return rgbToHex(intermediateRGB);
};

export const Shapes = (props: shapeProps) => {
	const ShapeComponent = shapeComponents[props.shape];
	return (
		<mesh
			userData={
				{
					type: MeshTypes.SHAPE,
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
							hex: interpolateColor(props.color.hex, COLORS.WHITE.hex, 40),
							id: COLORS.WHITE.id,
						} as Color
					}
				/>
			)) || <ShapeComponent {...props} />}
		</mesh>
	);
};
