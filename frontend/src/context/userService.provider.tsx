
import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import { useUserService, type UserServiceHook } from '../hooks/useUserService';

export const UserServiceContext = createContext<UserServiceHook | undefined>(undefined);

export const UserServiceProvider = ({ children }: {
  children: ReactNode;
}) => {
  const userService = useUserService();

  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};
