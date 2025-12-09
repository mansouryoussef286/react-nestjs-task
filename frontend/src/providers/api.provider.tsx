
import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import { useAPI, type UserAPIHook } from '../hooks/useAPI';

export const ApiContext = createContext<UserAPIHook | undefined>(undefined);

export const ApiProvider = ({ children }: {
  children: ReactNode;
}) => {
  const api = useAPI();

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};
