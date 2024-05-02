import { CartesianCoordinate } from "../../../interfaces/cartesianCoordinate";
import Color from "../../../interfaces/Color";
import Cube from "./Cube";
//import Diamond from "./Diamond";

export enum shapeList {
    CUBE,
    //DIAMOND
}

export interface shapeComponentProps{
	position: CartesianCoordinate,
	color: Color
}

// Define a mapping object to associate enum values with components
const shapeComponents: { [key in shapeList]: React.ComponentType<shapeComponentProps> } = {
    [shapeList.CUBE]: Cube,
    //[shapes.DIAMOND]: Diamond
};

export interface shapeProps extends shapeComponentProps{
	shape: shapeList
}
// Usage example
export const Shapes = ({shape , position, color }:shapeProps) => {
    const ShapeComponent = shapeComponents[shape];
    return <ShapeComponent 
        position={{x: position.x, y: position.y, z: position.z} as CartesianCoordinate}
        color={color}
    />;
};

// Usage:
//<MyComponent shape={shapes.CUBE} /> // Renders Cube component
//<MyComponent shape={shapes.DIAMOND} />