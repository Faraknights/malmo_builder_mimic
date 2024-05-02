import { useEffect } from "react";
import { ShapeInPlaceProps } from "../../classes/shapeInPlace";
import { shapeList, Shapes } from "./shapes/Shape";

const Minecraft: React.FC<ShapeInPlaceProps> = ({
    objects, addObject
}) => {

    useEffect(() => {
        console.log(objects)
    }, [objects])
    
	return (
        <>
            {objects.map(object => (
                <Shapes
                    key={`${object.position.x},${object.position.y},${object.position.z}`}
                    shape={object.shape} 
                    position={object.position}
                    color={object.color}
                />
            ))}
        </>
	)
};

export default Minecraft