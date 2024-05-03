import React from 'react';
import { GameMode } from '../../interfaces/mode';

interface HeaderProps {
  currentMode: GameMode;
  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
}

const Header: React.FC<HeaderProps> = ({ currentMode, setMode }) => {
  return (
    <header>
      <nav id="modeSelector">
        {Object.keys(GameMode).map((gameModeKey: string) => {
          const gameMode = GameMode[gameModeKey as keyof typeof GameMode];
          return (
            <div
              key={gameMode}
              onClick={() => setMode(gameMode)}
              className={currentMode === gameMode ? 'selected' : ''}
            >
              {gameMode}
            </div>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;
