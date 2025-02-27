import Menu from "@/components/Menu/Menu";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import { AuthProvider } from "@/provider/AuthProvider";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.scss";

export default function DefaultLayout() {
  return (
    <AuthProvider>
      <div className={styles.layout}>
        <Menu />
        <ErrorBoundary fallback={<ErrorScreen mensagem=""/>}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    </AuthProvider>
  );
}
