import React from 'react';
import { Action } from '../../../../enum/Action';
import { useGlobalState } from '../../GlobalStateProvider';

const ActionSelector: React.FC = () => {
	const { action: current, setAction } = useGlobalState().action;
	return (
		<div id="actionSelector" className="module">
			<h3>Action:</h3>
			<div className="buttonsWrapper">
				{Object.values(Action).map((action) => (
					<button
						key={action}
						className={`realisticButton ${action}${current === action ? ' selected' : ''}`}
						onMouseDown={() => setAction(action)}
					>
						{action[0] + action.slice(1).toLowerCase()}
					</button>
				))}
			</div>
		</div>
	);
};

export default ActionSelector;
