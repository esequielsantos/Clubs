import telaErro from "@/tela-erro.module.scss";

export default function InvalidRequest() {
  return (
    <div className={telaErro.container}>
      <h1 className={`${telaErro.codigoErro}`}>400</h1>
      <p className={telaErro.mensagemErro}>Falha ao obter os dados</p>

      <div className={telaErro.mensagemAjuda}>
        A requisição pode estar malformada ou possui dados inválidos (ex: ticket inválido...).
      </div>
    </div>
  );
}
