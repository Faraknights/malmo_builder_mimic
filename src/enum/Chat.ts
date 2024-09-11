export enum Users {
	SYSTEM = 'SYSTEM',
	ARCHITECT = 'ARCHITECT',
	BUILDER = 'BUILDER ',
	NEBULA = 'NEBULA',
}

export interface Message {
	user: Users;
	content: string;
}
