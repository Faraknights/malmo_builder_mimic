import { CartesianCoordinate } from "../../../interfaces/cartesianCoordinate";
import Color from "../../../interfaces/Color";
import Cube from "./Cube";
//import Diamond from "./Diamond";

export enum shapeList {
    CUBE,
    //DIAMOND
}

export interface shapeComponentProps{
    pending: boolean
    uuid: string
	position: CartesianCoordinate
	color: Color
}

const shapeComponents: { [key in shapeList]: React.ComponentType<shapeComponentProps> } = {
    [shapeList.CUBE]: Cube,
};

export interface shapeProps extends shapeComponentProps{
	shape: shapeList
}

export const Shapes = (props :shapeProps) => {
    const ShapeComponent = shapeComponents[props.shape];
    return <ShapeComponent
        {... props}
    />;
};