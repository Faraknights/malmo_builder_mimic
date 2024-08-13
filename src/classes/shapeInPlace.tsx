import { useState } from 'react';
import { shapeHitbox, shapeProps } from '../components/modelisation/shapes/Shape';
import { ShapeGroup } from '../components/modelisation/shapes/group';
import { CartesianCoordinate, coordinateAddition, coordinatesAreEqual } from '../interfaces/cartesianCoordinate';

export interface ShapeInPlaceProps {
	objects: (shapeProps | ShapeGroup)[];
	pending: (shapeProps | ShapeGroup) | undefined;
	setObjects: React.Dispatch<React.SetStateAction<(shapeProps | ShapeGroup)[]>>;
	setPending: React.Dispatch<React.SetStateAction<(shapeProps | ShapeGroup) | undefined>>;
	nbObjects: () => number;
	objectExists: (x: number, y: number, z: number) => boolean;
	addObject: (object: shapeProps) => void;
	removeObject: (x: number, y: number, z: number) => void;
	clear: () => void;
	confirmPending: (newPending?: shapeProps) => void;
	setBreaking: (position: CartesianCoordinate) => void;
	removeBreaking: () => void;
	getPosition: () => CartesianCoordinate[];
}

export const useShapeInPlace = (): ShapeInPlaceProps => {
	const [objects, setObjects] = useState<(shapeProps | ShapeGroup)[]>([]);
	const [pending, setPending] = useState<shapeProps | ShapeGroup | undefined>();

	const nbObjects = (): number => {
		let count = 0;
		for (const shape of objects) {
			if (shape instanceof ShapeGroup) {
				count += shape.nbObjects();
			} else {
				count++;
			}
		}
		return count;
	};

	const objectExists = (x: number, y: number, z: number): boolean => {
		for (const shape of objects) {
			if (shape instanceof ShapeGroup) {
				if (shape.objectExists(x, y, z)) {
					return true;
				}
			} else {
				if (x === shape.position.x && y === shape.position.y && z === shape.position.z) {
					return true;
				}
			}
		}
		return false;
	};

	const addObject = (object: shapeProps | ShapeGroup): void => {
		setObjects((prevObject) => [...prevObject, object]);
	};

	const removeObject = (x: number, y: number, z: number): void => {
		setObjects((prevObjects) => {
			return prevObjects.filter((shape) => {
				if (shape instanceof ShapeGroup) {
					if (shape.objectExists(x, y, z)) {
						return false;
					}
				} else {
					if (shape.position.x === x && shape.position.y === y && shape.position.z === z) {
						return false;
					}
				}
				return true;
			});
		});
	};

	const clear = (): void => {
		setObjects([]);
	};

	const confirmPending = (newPending?: shapeProps | ShapeGroup): void => {
		if (pending) {
			const updatedPending =
				pending instanceof ShapeGroup
					? new ShapeGroup(pending.startingPoint, pending.shapes, false, pending.breakable)
					: { ...pending, pending: false };
			addObject(updatedPending);
		}
		setPending(newPending);
	};

	const setBreaking = (position: CartesianCoordinate) => {
		const updateShape = (shape: shapeProps | ShapeGroup): shapeProps | ShapeGroup => {
			if (shape.breakable) return shape;
			if (shape instanceof ShapeGroup) {
				return new ShapeGroup(shape.startingPoint, shape.shapes.map(updateShape), shape.pending, true);
			} else {
				return { ...shape, breakable: true };
			}
		};

		setObjects((prevObjects) =>
			prevObjects.map((shape) => {
				if (shape instanceof ShapeGroup && coordinatesAreEqual(shape.startingPoint, position)) {
					return updateShape(shape);
				} else if ('position' in shape && coordinatesAreEqual(shape.position, position)) {
					return updateShape(shape);
				} else {
					return shape;
				}
			})
		);
	};

	const removeBreaking = () => {
		const updateShape = (shape: shapeProps | ShapeGroup): shapeProps | ShapeGroup => {
			if (shape instanceof ShapeGroup) {
				return new ShapeGroup(shape.startingPoint, shape.shapes.map(updateShape), shape.pending, false);
			} else {
				return { ...shape, breakable: false };
			}
		};

		setObjects((prevObjects) =>
			prevObjects.map((shape) => {
				if (shape.breakable) {
					return updateShape(shape);
				} else {
					return shape;
				}
			})
		);
	};

	const getPosition = (): CartesianCoordinate[] => {
		return objects.flatMap((object) => {
			if (object instanceof ShapeGroup) {
				return object.getPositions();
			} else {
				return coordinateAddition(
					shapeHitbox[object.shape] as CartesianCoordinate[],
					object.position
				) as CartesianCoordinate[];
			}
		});
	};

	return {
		objects,
		pending,
		setObjects,
		setPending,
		nbObjects,
		objectExists,
		addObject,
		removeObject,
		clear,
		confirmPending,
		setBreaking,
		removeBreaking,
		getPosition,
	};
};
