import React from 'react';
import { Mode } from '../../interfaces/mode';

interface HeaderProps {
  currentMode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  return (
    <header>
      <nav id="modeSelector">
        {Object.keys(Mode).map((modeKey: string) => {
          const mode = Mode[modeKey as keyof typeof Mode];
          return (
            <div
              key={mode}
              onClick={() => setMode(mode)}
              className={currentMode === mode ? 'selected' : ''}
            >
              {mode}
            </div>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
