import React from 'react';
import { GameMode } from '../../interfaces/mode';
import { EnvironmentMode, useEnvironmentState } from '../../classes/EnvironmentMode';

interface HeaderProps {
  currentGameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
}

const Header: React.FC<HeaderProps> = (props) => {
  const {currentGameMode, setGameMode} = props
  const {environmentMode, setEnvironmentMode} = useEnvironmentState()
  return (
    <header>
      <nav id="modeSelector">
        {Object.keys(GameMode).map((gameModeKey: string) => {
          const gameMode = GameMode[gameModeKey as keyof typeof GameMode];
          return (
            <div
              key={gameMode}
              onClick={() => setGameMode(gameMode)}
              className={currentGameMode === gameMode ? 'selected' : ''}
            >
              {gameMode}
            </div>
          );
        })}
      </nav>
      <button 
        onClick={() => {
          setEnvironmentMode(Object.keys(EnvironmentMode)[(Object.keys(EnvironmentMode).findIndex(x => x === environmentMode) + 1) % Object.keys(EnvironmentMode).length] as EnvironmentMode)
        }}
        id='environmentMode'
      >
        {environmentMode}
      </button>
    </header>
  );
};

export default Header;
