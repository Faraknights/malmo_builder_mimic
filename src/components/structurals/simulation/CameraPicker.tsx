import React from 'react';
import { CameraMode, CameraProps } from '../../../classes/Camera';

const CameraSelector: React.FC<CameraProps> = ({
    current,
    setCurrent
}) => {
    return (
        <div id="cameraSelector" className='module'>
            {Object.values(CameraMode).map(cameraMode => (
                <button 
                    key={cameraMode}
                    className={`${cameraMode}${current === cameraMode ? " selected" : ""}`}
                    onClick={ e => setCurrent(cameraMode)}
                >
                    {cameraMode[0] + cameraMode.slice(1).toLowerCase()}
                </button>
            ))}
        </div>
    );
};

export default CameraSelector;
