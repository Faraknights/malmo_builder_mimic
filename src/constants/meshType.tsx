import { DIRECTION } from "../components/modelisation/shapes/Cube"
import { CartesianCoordinate } from "../interfaces/cartesianCoordinate"

export enum MeshType{
    CELL_BOARD = "CELL_BOARD",
    CUBE = "CUBE",
    CUBE_FACE = "CUBE_FACE"
}

export interface UserData{
    type: MeshType
}

export interface CellBoardUserData extends UserData{
    type: MeshType.CELL_BOARD
    position: CartesianCoordinate
}

export interface CubeUserData extends UserData{
    type: MeshType.CUBE
    position: CartesianCoordinate
    pending: boolean
}

export interface CubeFaceUserData extends UserData{
    type: MeshType.CUBE_FACE
    faceDirection: DIRECTION
}