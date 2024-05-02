import {useEffect, useState } from "react";
import { CartesianCoordinate } from "../../interfaces/cartesianCoordinate";
import * as THREE from 'three'

const CellBoard= ({position}: {position: CartesianCoordinate}) => {
    //const [hovered, setHover] = useState(false)
    //const [active, setActive] = useState(false)
    
	//useEffect(() => {
	//	document.body.style.cursor = hovered ? 'pointer' : 'auto'
	//}, [hovered])
    const cellColor = /*hovered ? new THREE.Color(0xdddddd) :*/ new THREE.Color(0xaaaaaa);
    return (
		<mesh
			position={[position.x, position.y, position.z]}
			//onClick={(event) => setActive(!active)}
			//onPointerOver={(event) => {
			//	setHover(true)
			//	console.log(event)
			//}}
			//onPointerOut={(event) => setHover(false)}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<planeGeometry 
				args={[1, 1]} 
			/>
			<meshStandardMaterial color={[cellColor.r, cellColor.g, cellColor.b]} />
		</mesh>
    )
};

const Board= ({size}: {size: number}) => {
	const cellSize = 1
	const borderThickness = 0.05

	return (
		<>
			{new Array(size).fill(null).map((_, i) => (
				<group key={i}>
					{new Array(size).fill(null).map((_, j) => (
						<CellBoard 
							key={j} 
							position={{
								x: (i - ((size - 1) / 2)) * (cellSize + borderThickness), 
								y: cellSize / 2 - borderThickness, 
								z: (j - ((size - 1) / 2)) * (cellSize + borderThickness)
							}}
						/>
					))}
				</group>
			))}
		</>
	)
};

export default Board