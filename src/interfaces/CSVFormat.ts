export interface csvFormat {
	dial_with_actions: {
		prevMoves: string[];
		prevWorldState: string;
		instruction: string[];
	};
	action_seq: string[];
}

export interface csvFormat {
	worldStates: {
		shape?: string;
		color: string;
		x: number;
		y: number;
		z: number;
	}[];
}
