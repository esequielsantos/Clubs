import { lazy, Suspense, type ReactNode } from "react";
import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  type NonIndexRouteObject,
} from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import InvalidRequest from "./components/InvalidRequest";
import DeniedAccess from "./components/DeniedAccess";
import ErrorScreen from "./components/ErrorScreen";
import RootErrorBoundary from "./components/RootErrorBoundary"; // Importar erros
import App from "./App";
// não importa as paginas aqui --> faze fazer no lazy import LayoutPrestacaoContas from "./pages/LayoutPrestacaoConta/LayoutPrestacaoConta";

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

const DefaultLayout = lazy(() => import("./pages/DefaultLayout/DefaultLayout"));
const Home = lazy(() => import("./pages/Home/Home"));

const LoginOtp = lazy(() => import("./pages/LoginOtp/LoginOtp"));
const EmailRestore = lazy(() => import("./pages/LoginOtp/EmailRestore"));


/**
/**
 * Rotas da aplicação. Utilizar a versão lazy de cada página (acima) para não prejudicar a performance.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Aguarde, loading...</div>}>
        <DefaultLayout />
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
    handle: {
      breadcrumb: () => <Link to="/">Início</Link>,
    },
    children: [
      {
        path: "/deniedaccess",
        element: <DeniedAccess />,
      },
      {
        path: "/error",
        element: <ErrorScreen linkVoltar="/" />,
      },
      {
        path: "/invalidrequest",
        element: <InvalidRequest />,
      },
      {
        path: "/",
        element: <Navigate to="/home" />, // Redirecionamento para /home
      },
      {
        path: "/home",
        element: (
          <AuthGuard perfilRequisito={1}>
            <Suspense fallback={<div>Aguarde, loading...</div>}>
              <Home />
            </Suspense>
          </AuthGuard>
        ),
      },
      {
        path: "/registrations",
        element: (
          <AuthGuard perfilRequisito={1}>
            {" "}
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "files Prestadores" },
        children: [
          {
            path: "/registrations/file-prestadores",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <Home />
              </Suspense>
            ),
            handle: { breadcrumb: () => "file Prestadores" },
          },
        ],
      },
      {
        path: "/reports",
        element: (
          <AuthGuard perfilRequisito={0}>
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "files APP" },
        children: [
          {
            path: "/reports/file-app",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <Home />
              </Suspense>
            ),
            handle: { breadcrumb: () => "files APP" },
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <AuthGuard perfilRequisito={0}>
            {" "}
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Management" },
        children: [
          {
            path: "/admin/manage-user",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <App />
              </Suspense>
            ),
            handle: { breadcrumb: () => "User manage" },
          },
        ],
      },
    ],
  },
] satisfies AppRoute[]);

export default function ClubsRouter() {
  return <RouterProvider router={router} />;
}
