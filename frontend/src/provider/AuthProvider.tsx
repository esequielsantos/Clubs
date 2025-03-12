import { environment } from '@/env';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Auth, AuthData, AuthenticatedUser, HttpStatus } from './useAuth';
export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = props => {
  const [waiting, setWaiting] = useState(false);
  const queryClient = useQueryClient();
  
  const urlCredentials = '/auth/credentials';
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError, error, refetch } = useQuery<AuthenticatedUser | null>({
    queryKey: ['credentials'],
    queryFn: ({ signal }) =>
      fetch(environment.api + urlCredentials, {
        credentials: 'include',
        signal,
      }).then(res => res.json()),
  });
  
  const logout = useCallback(async (nextRedirect? : string | null) => {
    const redirectTo = nextRedirect ?? location.pathname;
    
    await fetch(environment.api + '/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    
    await queryClient.clear();
    await queryClient.cancelQueries({ queryKey: ['credentials'] });
    await queryClient.invalidateQueries({ queryKey: ['credentials'] });
    document.cookie = 'temp-cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/auth;';

    void login(redirectTo);

  }, [navigate, queryClient]);

  const login = useCallback(async (nextRedirect? : string | null) => {    
    setWaiting(true);

    const redirectTo = nextRedirect ?? location.pathname;
    navigate(`/loginotp?redirect=${encodeURIComponent(redirectTo)}`);
      
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

    const loading = isLoading || waiting;
  
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
