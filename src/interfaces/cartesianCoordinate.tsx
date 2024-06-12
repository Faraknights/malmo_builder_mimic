export interface CartesianCoordinate {
    x: number;
    y: number;
    z: number;
}

export function coordinatesAreEqual(coord1: CartesianCoordinate, coord2: CartesianCoordinate): boolean {
    return coord1.x === coord2.x && coord1.y === coord2.y && coord1.z === coord2.z;
}

export function hasCommonCoordinate(array1: CartesianCoordinate[], array2: CartesianCoordinate[]): boolean {
    for (const coord1 of array1) {
        for (const coord2 of array2) {
            if (coordinatesAreEqual(coord1, coord2)) {
                return true;
            }
        }
    }
    return false;
}

export function coordinateAddition(
    coordinate: CartesianCoordinate | CartesianCoordinate[],
    addition: CartesianCoordinate
): CartesianCoordinate | CartesianCoordinate[] {
    const addCoordinates = (coord1: CartesianCoordinate, coord2: CartesianCoordinate): CartesianCoordinate => {
        return {
            x: coord1.x + coord2.x,
            y: coord1.y + coord2.y,
            z: coord1.z + coord2.z
        };
    };

    if (Array.isArray(coordinate)) {
        return coordinate.map(coord => addCoordinates(coord, addition));
    } else {
        return addCoordinates(coordinate, addition);
    }
}