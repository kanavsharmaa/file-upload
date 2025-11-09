import { createContext, useContext } from 'react';
import type { IUserContext, Role } from '@/types';

export const ROLES: readonly Role[] = ['A1', 'D1', 'D2', 'R1'] as const;

export const UserContext = createContext<IUserContext | null>(null);

export const useUserContext = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContext.Provider');
  }
  return context;
};