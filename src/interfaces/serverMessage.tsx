export interface ServerMessage {
	type: 'WAIT' | 'RESUME' | 'MESSAGE';
	content: string;
}
