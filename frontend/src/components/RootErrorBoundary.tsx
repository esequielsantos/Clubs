import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import PaginaNaoEncontrada from "./PageNotFound";
import DeniedAccess from "./DeniedAccess";
import InvalidRequest from "./InvalidRequest";
import styles from "@/defaultScreen.module.scss";

export default function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // Verificar o código de status do error
    if (error.status === 404) {
      return <PaginaNaoEncontrada />;
    } else if (error.status === 401 || error.status === 403) {
      return <DeniedAccess />;
    } else if (error.status >= 500 && error.status < 600) {
      return <InvalidRequest />;
    } else {
      return (
        <div className={styles.container}>
            <h1 className={styles.codigoErro}>{error.status}</h1>
            <p className={styles.errorMessage}>{error.statusText}</p>

            <div className={styles.messageAjuda}>
                Ocorreu um error! Caso tenha chegado até aqui a partir
                de uma de nossas aplicações, tente novamente mais tarde.
            </div>
        </div>
      );
    }
  } else {
    return (
      <div>
        <div className={styles.container}>
            <h1 className={styles.codigoErro}>Ops</h1>
            <p className={styles.messageAjuda} style={{ fontSize: '1.5rem' }}>
              {(error as Error).message}
            </p>
            <div className={styles.messageAjuda}>
                Ocorreu um error desconhecido! Caso tenha chegado até aqui a partir
                de uma de nossas aplicações, tente novamente mais tarde.
            </div>
        </div>
    </div>
    );
  }
}