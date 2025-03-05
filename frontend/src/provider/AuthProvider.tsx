import { environment } from '@/env';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Auth, type AuthData, type AuthenticatedUser, HttpStatus } from './useAuth';

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = props => {
  const [aguardandoLogin, setWaiting] = useState(false);
  const queryClient = useQueryClient();
  
  const urlCredentials = '/auth/credentials';
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery<AuthenticatedUser | null>({
    queryKey: ['credentials'],
    queryFn: ({ signal }) =>
      fetch(environment.api + urlCredentials, {
        credentials: 'include',
        signal,
      }).then(res => res.json()),
  });
  
  const logout = useCallback(async (nextRedirect? : string | null) => {
    if(!nextRedirect){
      nextRedirect = location.href.toString(); //ver pq trouxe objeto ao sair normal
    }
    
    await fetch(environment.api + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    
    await queryClient.clear();
    await queryClient.cancelQueries({ queryKey: ['credentials'] });
    await queryClient.invalidateQueries({ queryKey: ['credentials'] });
    document.cookie = 'temp-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;';

    void login(nextRedirect);

  }, [navigate, queryClient]);

  const login = useCallback(async (nextRedirect? : string | null) => {    
    setWaiting(true);

    nextRedirect ? nextRedirect : location.href.toString();
    navigate(`/login-otp&redirect=${nextRedirect}`);
      
  },[queryClient, logout, refetch],);

  useEffect(() => {
      if (!data) {
        return;
      }
      
      async function fetchData() {
        await queryClient.cancelQueries({ queryKey: ['credentials'] });
        await queryClient.invalidateQueries({ queryKey: ['credentials'] });
        setWaiting(false);
      }; 
  
      if(data?.status === HttpStatus.OK){      
        void fetchData();
      }else{
        void login();
      }
    }, [data, queryClient]);

  // Utilizado isLoading ao invés de isPending para impedir que atualizações automáticas das
  // credentials bloqueem a tela atual.
  const loading = isLoading || aguardandoLogin;
  
  let authData: AuthData;

  if (loading) {
    authData = { user: null, loading: true, error: null, logout: async () => {}};
  } else if (isError) {
    authData = { user: null, loading: false, error: error, logout: async () => {} };
  } else {
    authData = { user: data ?? null, loading: false, error: null, logout: async () => {} };
  }
  
  return <Auth.Provider value={{ ...authData, logout }}>{props.children}</Auth.Provider>;
};
