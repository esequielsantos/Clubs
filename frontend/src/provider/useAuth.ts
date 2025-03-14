import { createContext, useContext } from "react";

export interface AuthData {
  user: AuthenticatedUser | null;
  loading: boolean;
  error: Error | null;
  logout:
    | ((nextRedirect?: string | null) => Promise<void>)
    | (() => Promise<void>);
}
export type AuthContext = AuthData & {
  logout: () => void;
};

export enum HttpStatus {
  CONTINUE = 100,
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_ACCEPTABLE = 406,
}

export interface AuthenticatedUser {
  id: number;
  level: number;
  name: string;
  email: string;
  status: HttpStatus;
}
export interface ApiResponse {
  credentials: AuthenticatedUser;
}

export interface StatusReturn {
  message: string;
  status: HttpStatus;
}

export const Auth = createContext<AuthContext>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
});

export function useAuth(): AuthContext {
  return useContext(Auth);
}
