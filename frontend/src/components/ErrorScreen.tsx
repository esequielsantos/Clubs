import telaErro from "@/tela-erro.module.scss";

export default function ErrorScreen(props: { linkVoltar?: string; mensagemErro?: string; mensagem?: string } | null) {
  return (
    <div className={telaErro.container}>
      <h1 className={`${telaErro.codigoErro} pi pi-exclamation-triangle`}></h1>
      <p className={telaErro.mensagemErro}>{props?.mensagemErro ?? "Falha ao obter os dados"}</p>
      {props?.linkVoltar && (
        <div className={telaErro.linkVoltar}>
          <a href={props.linkVoltar}>Clique aqui para voltar</a>
        </div>
      )}      
      <div className={telaErro.mensagem}>
         {props?.mensagem ?? "Ocorreu um erro ao obter os dados. Verifique se você está logado. Também verifique sua conexão com a internet e tente novamente."}
      </div>
      
    </div>
  );
}
