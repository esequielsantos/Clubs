import styles from "@/defaultScreen.module.scss";

export default function InvalidRequest() {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.codigoErro}`}>400</h1>
      <p className={styles.errorMessage}>Falha ao obter os dados</p>

      <div className={styles.messageAjuda}>
        A requisição pode estar malformada ou possui dados inválidos (ex: ticket inválido...).
      </div>
    </div>
  );
}
