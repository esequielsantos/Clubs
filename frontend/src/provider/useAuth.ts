import { createContext, useContext } from "react";

export interface AuthData {
  user: UserAutenticado | null;
  loading: boolean;
  error: Error | null;
  rota: string;
  logout: ((proximoRedirect?: string | null) => Promise<void>) | (() => Promise<void>);
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
export interface UserAutenticado {
  id: number;
  perfil: number;
  nome: string;
  email: string;
  status: HttpStatus;
}

export const Auth = createContext<AuthContext>({
  user: null,
  loading: true,
  error: null,
  rota: "",
  logout: async () => {},
});

export function useAuth(): AuthContext {
  return useContext(Auth);
}
