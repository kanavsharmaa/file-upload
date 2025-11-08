import { createContext } from 'react';
// 1. We import the 'type' helpers separately using "import type"
import type { Dispatch, SetStateAction } from 'react';

// 2. Define the roles.
// We use 'as const' to make this a fixed, read-only list.
export const ROLES = ["A1", "D1", "D2", "R1"] as const;

// 3. Create a TypeScript 'type' from that list.
// This will be "A1" | "D1" | "D2" | "R1"
export type Role = typeof ROLES[number];

// 4. Define the "shape" of the data we will share in our context.
// We'll share the current user's role and the function to change it.
export interface IUserContext {
  currentUser: Role;
  setCurrentUser: Dispatch<SetStateAction<Role>>;
}

// 5. Create the actual context.
// We disable the ESLint rule here. This file correctly exports
// context and types, not a React component, so the rule doesn't apply.
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<IUserContext | null>(null);