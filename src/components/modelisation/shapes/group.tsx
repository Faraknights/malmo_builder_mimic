import React from 'react';
import { GroupUserData, MeshType } from '../../../constants/meshType';
import { CartesianCoordinate, coordinateAddition } from '../../../interfaces/cartesianCoordinate';
import { shapeHitbox, shapeProps, Shapes } from './Shape';
import { v4 as uuidv4 } from 'uuid';

export class ShapeGroup {
	public uuid: string;
	public pending: boolean;
	public startingPoint: CartesianCoordinate;
	public shapes: (shapeProps | ShapeGroup)[];
	public breakable: boolean;

	constructor(
		startingPoint: CartesianCoordinate,
		shapes: (shapeProps | ShapeGroup)[],
		pending: boolean,
		breakable?: boolean
	) {
		this.startingPoint = startingPoint;
		this.shapes = shapes.map((shape) => ({
			...shape,
			breakable: !!breakable,
		}));
		this.uuid = uuidv4();
		this.pending = pending;
		this.breakable = !!breakable;
	}

	nbObjects = (): number => {
		let count = 0;
		for (const shape of this.shapes) {
			if (shape instanceof ShapeGroup) {
				count += shape.nbObjects();
			} else {
				count++;
			}
		}
		return count;
	};

	objectExists = (x: number, y: number, z: number): boolean => {
		for (const shape of this.shapes) {
			if (shape instanceof ShapeGroup) {
				if (shape.objectExists(x - this.startingPoint.x, y - this.startingPoint.y, z - this.startingPoint.z)) {
					return true;
				}
			} else {
				if (
					x === shape.position.x + this.startingPoint.x &&
					y === shape.position.y + this.startingPoint.y &&
					z === shape.position.z + this.startingPoint.z
				) {
					return true;
				}
			}
		}
		return false;
	};

	getPositions = (): CartesianCoordinate[] => {
		return this.shapes.flatMap((shape) => {
			if (shape instanceof ShapeGroup) {
				return shape.getPositions();
			} else {
				return coordinateAddition(
					shapeHitbox[shape.shape] as CartesianCoordinate[],
					shape.position
				) as CartesianCoordinate[];
			}
		});
	};
}

export const Group = ({ shapeGroup }: { shapeGroup: ShapeGroup }) => {
	const renderShapes = (shapes: (shapeProps | ShapeGroup)[]) => {
		return shapes.map((shape, index) => {
			if (shape instanceof ShapeGroup) {
				return (
					<Group
						key={`group-${index}`}
						shapeGroup={{
							...shape,
							breakable: shapeGroup.breakable,
						}}
					/>
				);
			} else {
				return <Shapes key={`shape-${index}`} {...{ ...shape, breakable: shapeGroup.breakable }} />;
			}
		});
	};

	return (
		<mesh
			userData={
				{
					type: MeshType.GROUP,
					position: shapeGroup.startingPoint,
					pending: shapeGroup.pending,
				} as GroupUserData
			}
		>
			{renderShapes(shapeGroup.shapes)}
		</mesh>
	);
};

export default Group;
