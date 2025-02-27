import telaErro from "@/tela-erro.module.scss";


export default function DeniedAccess() {
  return (
    <div className={telaErro.container}>
      <h1 className={telaErro.codigoErro}>403</h1>
      <p className={telaErro.mensagemErro}>Acesso Negado</p>

      <div className={telaErro.mensagemAjuda}>
        Você não tem permissão para acessar esta página. <br/>
        Se você acredita que isso é um erro, por favor, favor informar seu superior imediato.
      </div>
    </div>
  );
}