//
export enum Users {
	SYSTEM = 'SYSTEM',
	ARCHITECT = 'ARCHITECT',
	BUILDER = 'BUILDER',
	NEBULA = 'NEBULA',
	UNKNOWN = 'UNKNOWN',
}

export interface Message {
	user: Users;
	content: string;
}
