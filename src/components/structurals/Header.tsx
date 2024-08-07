import React, { useEffect } from 'react';
import { GameMode } from '../../classes/gameMode';
import { EnvironmentMode } from '../../classes/EnvironmentMode';
import { gameModesAvailable } from '../../constants/environment';

interface HeaderProps {
  currentGameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  environmentMode: EnvironmentMode;
  setEnvironmentMode: React.Dispatch<React.SetStateAction<EnvironmentMode>>;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { currentGameMode, setGameMode, environmentMode, setEnvironmentMode } = props;

  useEffect(() => {
    if (!gameModesAvailable[environmentMode].includes(currentGameMode)) {
      setGameMode(gameModesAvailable[environmentMode][0]);
    }
  }, [environmentMode, currentGameMode, setGameMode]);

  const handleEnvironmentModeChange = () => {
    const modes = Object.keys(EnvironmentMode) as EnvironmentMode[];
    const currentIndex = modes.indexOf(environmentMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setEnvironmentMode(nextMode);
  };

  return (
    <header>
      <nav id="modeSelector">
        {gameModesAvailable[environmentMode].map((gameModeKey) => {
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
      <button onClick={handleEnvironmentModeChange} id='environmentMode'>
        {environmentMode}
      </button>
    </header>
  );
};

export default Header;
