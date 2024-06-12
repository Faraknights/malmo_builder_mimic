import { CartesianCoordinate } from "../../../interfaces/cartesianCoordinate";
import Color from "../../../interfaces/Color";
import Cube from "./Cube";
import Nut from "./Nut";
import Screw from "./Screw";
import { HorizontalBridge } from "./HorizontalBridge";
import Washer from "./Washer";
import { MeshType, ShapeUserData } from "../../../constants/meshType";
import BridgeComponent from "./BridgeComponent";
import { VerticalBridge } from "./VerticalBridge";
import { BlinkingCubeWrapper } from "./BlinkingWrapper";
import { shapeList } from "../../../constants/shapeList";
//import Diamond from "./Diamond";

export interface shapeComponentProps{
    pending: boolean
    breakable: boolean
    uuid: string
	position: CartesianCoordinate
	color: Color
}

const shapeComponents: { [key in shapeList]: React.ComponentType<shapeComponentProps> } = {
    [shapeList.CUBE]: Cube,
    [shapeList.SCREW]: Screw,
    [shapeList.NUT]: Nut,
    [shapeList.HORIZONTAL_BRIDGE]: HorizontalBridge,
    [shapeList.VERTICAL_BRIDGE]: VerticalBridge,
    [shapeList.WASHER]: Washer,
    [shapeList.HORIZONTAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => <BridgeComponent {...props} rotation={"HORIZONTAL"} />,
    [shapeList.VERTICAL_BRIDGE_COMPONENT]: (props: shapeComponentProps) => <BridgeComponent {...props} rotation={"VERTICAL"} />
};

export const shapeHitbox: {[key in shapeList]: CartesianCoordinate[]} = {
    [shapeList.CUBE]:[{x:0,y:0,z:0}],
    [shapeList.SCREW]: [{x:0,y:0,z:0}],
    [shapeList.NUT]: [{x:0,y:0,z:0}],
    [shapeList.HORIZONTAL_BRIDGE]: [{x:0,y:0,z:0}, {x:1,y:0,z:0}],
    [shapeList.VERTICAL_BRIDGE]: [{x:0,y:0,z:0}, {x:0,y:0,z:1}],
    [shapeList.WASHER]: [{x:0,y:0,z:0}],
    [shapeList.HORIZONTAL_BRIDGE_COMPONENT]: [{x:0,y:0,z:0}],
    [shapeList.VERTICAL_BRIDGE_COMPONENT]: [{x:0,y:0,z:0}]
};

export interface shapeProps extends shapeComponentProps{
	shape: shapeList
}

export const Shapes = (props :shapeProps) => {
    const ShapeComponent = shapeComponents[props.shape];
    return (
        <mesh 
            userData={{
                type: MeshType.SHAPE,
                position: props.position,
                pending: props.pending,
                shape: props.shape
            } as ShapeUserData}
            position={[
                props.position.x, 
                props.position.y, 
                props.position.z
            ]}
        >
            { (props.breakable && (
                <BlinkingCubeWrapper>
                    <ShapeComponent{... props}/>
                </BlinkingCubeWrapper>
            )) || (
                <ShapeComponent{... props}/>
            ) }
        </mesh>
    );
};