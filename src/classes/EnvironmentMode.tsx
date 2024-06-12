import React, { createContext, useContext, useState } from 'react';

export enum EnvironmentMode {
    MINECRAFT = "MINECRAFT",
    COCOBOTS = "COCOBOTS"
}

// Create the context
const GlobalEnvironmentModeContext = createContext<{ 
    environmentMode: EnvironmentMode; 
    setEnvironmentMode: React.Dispatch<React.SetStateAction<EnvironmentMode>>
}>({
  environmentMode: EnvironmentMode.MINECRAFT,
  setEnvironmentMode: () => {},
});

// Create a provider component
export const GlobalEnvironmentModeProvider = ({ children }: {children: React.ReactElement}) => {
  const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>(EnvironmentMode.MINECRAFT);

  return (
    <GlobalEnvironmentModeContext.Provider value={{ environmentMode, setEnvironmentMode }}>
      {children}
    </GlobalEnvironmentModeContext.Provider>
  );
};

// Custom hook to use the global state
export const useEnvironmentState = () => {
  return useContext(GlobalEnvironmentModeContext);
};