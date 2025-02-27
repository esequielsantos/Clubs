
import type { ReactNode } from "react";
import { useAuth } from "../provider/useAuth";
import Loading from "./Loading";
import ErrorScreen from "./ErrorScreen";
import DeniedAccess from "./DeniedAccess";

export interface AuthGuardProps {
  perfilRequisito: number;
  children: ReactNode;
}

export default function AuthGuard(props: AuthGuardProps) {
  const { user, loading, error, rota } = useAuth();
  const { perfilRequisito, children } = props;

  if (loading) {
    return <Loading />;
  }

  if (error !== null || !rota) {
    return <ErrorScreen mensagem={error.message}/>;
  }
 
  if(user && user?.perfil >= perfilRequisito){
    return children;
  }else{
    return <DeniedAccess />;
  }
}
