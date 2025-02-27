import styles from "@/defaultScreen.module.scss";

export default function ErrorScreen(props: { linkVoltar?: string; mensagemErro?: string; mensagem?: string } | null) {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.codigoErro} pi pi-exclamation-triangle`}></h1>
      <p className={styles.mensagemErro}>{props?.mensagemErro ?? "Falha ao obter os dados"}</p>
      {props?.linkVoltar && (
        <div className={styles.linkVoltar}>
          <a href={props.linkVoltar}>Clique aqui para voltar</a>
        </div>
      )}      
      <div className={styles.mensagem}>
         {props?.mensagem ?? "Ocorreu um error ao obter os dados. Verifique se você está logado. Também verifique sua conexão com a internet e tente novamente."}
      </div>
      
    </div>
  );
}
