export enum EventJsonl {
	join = 'join',
	set_text = 'set_text',
	set_attribute = 'set_attribute',
	text_message = 'text_message',
	command = 'command',
	target_board_log = 'target_board_log',
	mouse = 'mouse',
	user_selection = 'user_selection',
	working_board_log = 'working_board_log',
	points = 'points',
	survey_result = 'survey_result',
	confirmation_log = 'confirmation_log',
	leave = 'leave',
}

export enum EventCommand {
	init = 'init',
	instruction = 'instruction',
	typing = 'typing',
	show_progress = 'show_progress',
	next_state = 'next_state',
	confirm_next_episode = 'confirm_next_episode',
	survey = 'survey',
	submit_survey = 'submit_survey',
}

interface JsonlEventDefault {
	id: number | null;
	receiver_id: number | null;
	room_id: number | null;
	user_id: number | null;
	date_created: Date;
	date_modified: Date;
}

export type JsonlEvent =
	| (JsonlEventDefault & {
			event: EventJsonl.join;
			data: Record<string, never>;
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.set_text;
			data: {
				id: string;
				text: string;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.set_attribute;
			data: {
				id: string;
				attribute: string;
				value: string;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.text_message;
			data: {
				broadcast: boolean;
				html: boolean;
				message: string;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.command;
			data: {
				broadcast: boolean;
				command:
					| {
							event: EventCommand.init;
							golmi_rooms: {
								player_working: string;
								selector: string;
								target: string;
								wizard_working: string;
							};
							instruction: string;
							password: string;
							role: string;
							room_id: string;
							url: string;
					  }
					| {
							event: EventCommand.instruction;
							base: string;
							extra: string[];
					  }
					| {
							event: EventCommand.typing;
							value: boolean;
					  }
					| {
							event: EventCommand.show_progress;
					  }
					| {
							event: EventCommand.next_state;
					  }
					| {
							event: EventCommand.confirm_next_episode;
					  }
					| {
							event: EventCommand.survey;
							survey: string;
					  }
					| {
							event: EventCommand.submit_survey;
							answers: {
								'1. Rate your playing experience': '1' | '2' | '3' | '4' | '5';
								'2. Did you encounter any problems?': '1' | '2' | '3' | '4' | '5';
								'3. What is your best guess, was your partner': 'robot' | 'human';
							};
					  };
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.target_board_log;
			data: object;
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.mouse;
			data: object;
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.user_selection;
			data: object;
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.working_board_log;
			data: {
				grid_config: {
					height: number;
					move_step: number;
					prevent_overlap: boolean;
					width: number;
				};
				grippers: object;
				objs: {
					[key: number]: {
						block_matrix: any[];
						color: [string, string, [number, number, number]];
						id_n: string;
						rotation: number;
						type: string;
						x: number;
						y: number;
					};
				};
				objs_grid: object;
				state_id: any;
				targets: object;
				targets_grid: object;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.points;
			data: object;
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.survey_result;
			data: {
				'1. Rate your playing experience': '1' | '2' | '3' | '4' | '5';
				'2. Did you encounter any problems?': '1' | '2' | '3' | '4' | '5';
				'3. What is your best guess, was your partner': 'robot' | 'human';
				user_id: number;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.confirmation_log;
			data: {
				completion_token: string;
				reward: number;
				status_txt: string;
				user_id: number;
			};
	  })
	| (JsonlEventDefault & {
			event: EventJsonl.leave;
			data: Record<string, never>;
	  });
