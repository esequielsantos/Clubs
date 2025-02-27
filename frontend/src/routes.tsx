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
        path: "/acessonegado",
        element: <DeniedAccess />,
      },
      {
        path: "/erro",
        element: <ErrorScreen linkVoltar="/" />,
      },
      {
        path: "/requisicaoinvalida",
        element: <InvalidRequest />,
      },
      {
        path: "/",
        element: <Navigate to="/visaogeral" />, // Redirecionamento para /visaogeral
      },
      {
        path: "/visaogeral",
        element: (
          <AuthGuard perfilRequisito={1}>
            <Suspense fallback={<div>Aguarde, loading...</div>}>
              <Home />
            </Suspense>
          </AuthGuard>
        ),
      },
      {
        path: "/cadastros",
        element: (
          <AuthGuard perfilRequisito={1}>
            {" "}
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Arquivos Prestadores" },
        children: [
          {
            path: "/cadastros/arquivo-prestadores",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <Home />
              </Suspense>
            ),
            handle: { breadcrumb: () => "Arquivo Prestadores" },
          },
        ],
      },
      {
        path: "/movimentacoes",
        element: (
          <AuthGuard perfilRequisito={0}>
            {" "}
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Arquivos Prestadores" },
        children: [
          {
            path: "/movimentacoes/arquivo-prestadores",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <Home />
              </Suspense>
            ),
            handle: { breadcrumb: () => "Arquivo Prestadores" },
          },
        ],
      },
      {
        path: "/relatorios",
        element: (
          <AuthGuard perfilRequisito={0}>
            <Outlet />
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Arquivos APP" },
        children: [
          {
            path: "/relatorios/arquivo-app",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <Home />
              </Suspense>
            ),
            handle: { breadcrumb: () => "Arquivos APP" },
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
        handle: { breadcrumb: () => "Administração" },
        children: [
          {
            path: "/admin/gerenciar-user",
            element: (
              <Suspense fallback={<div>Aguarde, loading...</div>}>
                <GerenciarUser />
              </Suspense>
            ),
            handle: { breadcrumb: () => "Gerenciar Usuário" },
          },
        ],
      },
    ],
  },
  {
    path: "/prestacao-contas",
    element: (
      <Suspense fallback={<div>Aguarde, loading...</div>}>
        <LayoutPrestacaoContas />
      </Suspense>
    ),
    errorElement: <RootErrorBoundary />,
    handle: {
      breadcrumb: () => <Link to="/prestacao-contas/selecao-credito">Início</Link>,
    },
    children: [
      {
        path: "/prestacao-contas",
        element: <Navigate to="/prestacao-contas/login-otp" />, // Redirecionamento para /prestacaoconta
      },
      {
        path: "/prestacao-contas/selecao-credito",
        element: (
          <AuthGuard perfilRequisito={0}>
            <Suspense fallback={<div>Aguarde, loading...</div>}>
              <SelecaoCreditos />
            </Suspense>
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Selecao Credito" },
      },
      {
        path: "/prestacao-contas/login-otp",
        element: (
          <Suspense fallback={<div>Aguarde, loading...</div>}>
            <LoginOtp />
          </Suspense>
        ),
        handle: { breadcrumb: () => "Selecao Credito" },
      },
      {
        path: "/prestacao-contas/recupera-email",
        element: (
          <Suspense fallback={<div>Aguarde, loading...</div>}>
            <EmailRestore />
          </Suspense>
        ),
        handle: { breadcrumb: () => "Selecao Credito" },
      },
      {
        path: "/prestacao-contas/extrato",
        element: (
          <AuthGuard perfilRequisito={0}>
            <Suspense fallback={<div>Aguarde, loading...</div>}>
              <PrestacaoContas />
            </Suspense>
          </AuthGuard>
        ),
        handle: { breadcrumb: () => "Declaração de Gastos" },
      },
      {
        path: "/prestacao-contas/pesquisa-nota-fiscal",
        element: (
          <Suspense fallback={<div>Aguarde, loading...</div>}>
            <PesquisaNotaFiscal />
          </Suspense>
        ),
        handle: { breadcrumb: () => "Declaração de Gastos" },
      },
    ],
  },
] satisfies AppRoute[]);

export default function PrestadoresRouter() {
  return <RouterProvider router={router} />;
}
