
import type { ReactNode } from "react";
import { useAuth } from "../provider/useAuth";
import Loading from "./Loading";
import ErrorScreen from "./ErrorScreen";
import DeniedAccess from "./DeniedAccess";
import LoginOtp from "@/pages/LoginOtp/LoginOtp";

export interface AuthGuardProps {
  requestLevel: number;
  children: ReactNode;
}

export default function AuthGuard(props: AuthGuardProps) {
  const { user, loading, error} = useAuth();
  const { requestLevel, children } = props;

  if (loading) {
    return <Loading />;
  }

  if (error !== null) {
    return <ErrorScreen mensagem={error.message}/>;
  }
 
  if(user){
    if(user?.level >= requestLevel){
      return children;
    }else{
      return <DeniedAccess />;
    }
  }else{
    return <LoginOtp />;
  }
}
