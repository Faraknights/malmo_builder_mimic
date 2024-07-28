import React from 'react';
import { Action, ActionProps } from '../../../classes/Action';

const ActionSelector: React.FC<ActionProps> = ({ current, setCurrent }) => {
	return (
		<div id="actionSelector" className="module">
			<h3>Action:</h3>
			<div className="buttonsWrapper">
				{Object.values(Action).map((action) => (
					<button
						key={action}
						className={`${action}${current === action ? ' selected' : ''}`}
						onClick={() => setCurrent(action)}
					>
						{action[0] + action.slice(1).toLowerCase()}
					</button>
				))}
			</div>
		</div>
	);
};

export default ActionSelector;
