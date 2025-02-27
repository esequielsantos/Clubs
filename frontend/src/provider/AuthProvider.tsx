import { environment } from "@/env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState, type ReactNode } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Auth, type AuthData, type UserAutenticado, HttpStatus } from "./useAuth";

export interface AuthProviderProps {
  children: ReactNode;
}

interface RetornoCredenciais {
  credenciais: UserAutenticado | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = props => {
  const [aguardandoLogin, setAguardandoLogin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const rotaPc = location.href.split('/')[3];
  const urlCredenciais = (rotaPc == "prestacao-contas") ? "/auth/credenciaisportador" : "/auth/credenciais";
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery<RetornoCredenciais>({
    queryKey: ["credenciais"],
    queryFn: ({ signal }) =>
      fetch(environment.api + urlCredenciais, {
        credentials: "include",
        signal,
      }).then(res => res.json()),
  });
  
  const logout = useCallback(async (proximoRedirect? : string | null) => {
    if(!proximoRedirect){
      proximoRedirect = location.href.toString(); //ver pq trouxe objeto ao sair normal
    }
    
    await fetch(environment.api + "/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    
    await queryClient.clear();
    await queryClient.cancelQueries({ queryKey: ["credenciais"] });
    await queryClient.invalidateQueries({ queryKey: ["credenciais"] });
    document.cookie = "cpesc-temp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;";

    location.href = environment.sauUrlLogout + proximoRedirect;
    
    if (rotaPc == "prestacao-contas") {
      navigate('/prestacao-contas/selecao-credito');
    }   
  }, [navigate, queryClient]);

  const login = useCallback(async (ticket: string) => {    
    setAguardandoLogin(true);

    if (rotaPc == "prestacao-contas") {
      navigate('/prestacao-contas/login-otp');
    } else {         
      const rota = location.href.split(/[?#]/)[0];
      const retornoLogin = await fetch(environment.api + "/auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ rota, ticket }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let proximoRedirect = location.href.toString();

      if(retornoLogin.status === HttpStatus.BAD_REQUEST || retornoLogin.status === HttpStatus.UNAUTHORIZED){
        proximoRedirect = location.origin + "/invalidrequest";
        void logout(proximoRedirect);
        return;
      }else if(retornoLogin.status === HttpStatus.FORBIDDEN){
        proximoRedirect = location.origin + "/deniedaccess";
        void logout(proximoRedirect);
        return;
      }else if(retornoLogin.status === HttpStatus.NOT_FOUND){
        void logout();
        return;
      }else if(retornoLogin.status === HttpStatus.OK){
        await queryClient.cancelQueries({ queryKey: ["credenciais"] });
        await queryClient.invalidateQueries({ queryKey: ["credenciais"] });
        setAguardandoLogin(false);
        await refetch();
      }else {
        proximoRedirect = location.origin + "/error";
        void logout(proximoRedirect);
      }
    }
  },[queryClient, logout, refetch],);

  useEffect(() => {
    const ticket = searchParams.get("ticket");
    
    if ((rotaPc != "prestacao-contas") && (ticket !== null)) {
      searchParams.delete("ticket");
      setSearchParams(new URLSearchParams(searchParams));
      void login(ticket ?? "");
    }
  }, [searchParams, setSearchParams, login]);

  useEffect(() => {
      if ((rotaPc !== "prestacao-contas") || !data) {
        return;
      }
      
      async function fetchData() {
        await queryClient.cancelQueries({ queryKey: ["credenciais"] });
        await queryClient.invalidateQueries({ queryKey: ["credenciais"] });
        setAguardandoLogin(false);
      }    
  
      if(data?.credenciais?.status === HttpStatus.OK){      
        void fetchData();
      }
    }, [data, queryClient]);

  // Utilizado isLoading ao invés de isPending para impedir que atualizações automáticas das
  // credenciais bloqueem a tela atual.
  const loading = isLoading || aguardandoLogin;
  
  let authData: AuthData;

  if (loading) {
    authData = { user: null, loading: true, error: null , rota: rotaPc, logout: async () => {}};
  } else if (isError) {
    authData = { user: null, loading: false, error: error, rota: rotaPc, logout: async () => {} };
  } else {
    authData = { user: data?.credenciais ?? null, loading: false, error: null, rota: rotaPc, logout: async () => {} };
  }
  
  return <Auth.Provider value={{ ...authData, logout }}>{props.children}</Auth.Provider>;
};
