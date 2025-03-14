import { lazy, Suspense, type ReactNode } from 'react';
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  type NonIndexRouteObject,
} from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import InvalidRequest from './components/InvalidRequest';
import DeniedAccess from './components/DeniedAccess';
import ErrorScreen from './components/ErrorScreen';
import RootErrorBoundary from './components/RootErrorBoundary'; 
// dont import pages where --> do at lazy import 

interface AppRoute extends NonIndexRouteObject {
  handle?: RouteData;
  children?: AppRoute[];
}

export interface RouteData {
  breadcrumb?: () => ReactNode;
}

/**
 * Componentes representando cada página do sistema. As páginas são carregadas de forma lazy, ou seja, só são
 * carregadas quando a página é acessada. Isso melhora a performance do carregamento inicial da aplicação.
 */

const DefaultLayout = lazy(() => import('./pages/DefaultLayout/DefaultLayout'));
const Home = lazy(() => import('./pages/Home/Home'));
const App = lazy(() => import('./App'));

const LoginOtp = lazy(() => import('./pages/LoginOtp/LoginOtp'));
const EmailRestore = lazy(() => import('./pages/LoginOtp/EmailRestore'));


/**
/**
 * Rotas da aplicação. Utilizar a versão lazy de cada página (acima) para não prejudicar a performance.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Wait, loading...</div>}>
        <DefaultLayout />
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
    handle: {
      breadcrumb: () => <Link to='/'>Home</Link>,
    },
    children: [
      {
        path: '/deniedaccess',
        element: <DeniedAccess />,
      },
      {
        path: '/error',
        element: <ErrorScreen linkVoltar='/' />,
      },
      {
        path: '/invalidrequest',
        element: <InvalidRequest />,
      },
      {
        path: '/',
        element: <Navigate to='/home' />, // Redirect to /home
      },
      {
        path: '/loginotp',
        element: (
            <Suspense fallback={<div>Wait, loading...</div>}>
              <LoginOtp />
            </Suspense>
        ),
      },
      {
        path: '/emailrestore',
        element: (
            <Suspense fallback={<div>Wait, loading...</div>}>
              <EmailRestore />
            </Suspense>
        ),
      },
      {
        path: '/home',
        element: (
          <AuthGuard requestLevel={0}>
            <Suspense fallback={<div>Wait, loading...</div>}>
              <Home />
            </Suspense>
          </AuthGuard>
        ),
      },
    ],
  },
] satisfies AppRoute[]);

export default function ClubsRouter() {
  return <RouterProvider router={router} />;
}
