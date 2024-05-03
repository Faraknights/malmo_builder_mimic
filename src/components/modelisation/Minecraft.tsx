import { ShapeInPlaceProps } from "../../classes/shapeInPlace";
import { Shapes } from "./shapes/Shape";
import { GameMode } from "../../interfaces/mode";
import Board from "./Board";
import { inventoryProps } from "../../classes/Inventory";

interface MinecraftProps{
    shapeInPlace: ShapeInPlaceProps
    gameMode: GameMode
    inventory?: inventoryProps
}

const Minecraft: React.FC<MinecraftProps> = ({
    shapeInPlace,
    gameMode //will use it later
}) => {
    const { objects, pending } = shapeInPlace
	return (
        <mesh onPointerMove={gameMode === GameMode.SIMULATION ? (e => {
            console.log(e)
        }): undefined}>
            <Board />
            {objects.map(object => (
                <Shapes
                    key={object.uuid}
                    {...object}
                />
            ))}
            {pending && gameMode === GameMode.SIMULATION && (
                <Shapes
                    key={pending.uuid}
                    {...pending}
                />
            )}
        </mesh>
	)
};

export default Minecraft