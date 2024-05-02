import { useState } from 'react';
import { shapeProps } from '../components/modelisation/shapes/Shape';

export interface ShapeInPlaceProps {
    objects: shapeProps[];
    setObjects: React.Dispatch<React.SetStateAction<shapeProps[]>>;
    nbObjects: () => number;
    objectExists: (x: number, y: number, z: number) => boolean;
    addObject: (object: shapeProps) => void;
    removeObject: (x: number, y: number, z: number) => void;
    clear: () => void;
}

export const useShapeInPlace = (): ShapeInPlaceProps => {
    const [objects, setObjects] = useState<shapeProps[]>([]);

    const nbObjects = (): number => {
        return objects.length;
    };

    const objectExists = (x: number, y: number, z: number): boolean => {
        return objects.some(object => object.position.x === x && object.position.y === y && object.position.z === z);
    };

    const addObject = (object: shapeProps): void => {
        if (!objectExists(object.position.x, object.position.y, object.position.z)) {
            setObjects(prevObject => [...prevObject, object]);
        } else {
            console.error('Error: Object already exists at this position.');
        }
    };

    const removeObject = (x: number, y: number, z: number): void => {
        setObjects(prevObject =>
            prevObject.filter(object => !(object.position.x === x && object.position.y === y && object.position.z === z))
        );
    };

    const clear = (): void => {
        setObjects([]);
    };

    return {
        objects,
        setObjects,
        nbObjects,
        objectExists,
        addObject,
        removeObject,
        clear
    };
};
