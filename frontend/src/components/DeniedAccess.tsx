import styles from "@/defaultScreen.module.scss";


export default function DeniedAccess() {
  return (
    <div className={styles.container}>
      <h1 className={styles.codigoErro}>403</h1>
      <p className={styles.errorMessage}>Acesso Negado</p>

      <div className={styles.messageAjuda}>
        Você não tem permissão para acessar esta página. <br/>
        Se você acredita que isso é um error, favor informar seu superior imediato.
      </div>
    </div>
  );
}