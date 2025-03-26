import styles from "@/defaultScreen.module.scss";

export default function ErrorScreen(props: { returnUrl?: string; errorMessage?: string; message?: string } | null) {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.codigoErro} pi pi-exclamation-triangle`}></h1>
      <p className={styles.errorMessage}>{props?.errorMessage ?? "Falha ao obter os dados"}</p>
      {props?.returnUrl && (
        <div className={styles.returnUrl}>
          <a href={props.returnUrl}>Clique aqui para voltar</a>
        </div>
      )}      
      <div className={styles.message}>
         {props?.message ?? "Ocorreu um error ao obter os dados. Verifique se você está logado. Também verifique sua conexão com a internet e tente novamente."}
      </div>
      
    </div>
  );
}
