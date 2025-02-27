import telaErro from "@/tela-erro.module.scss";


export default function PaginaNaoEncontrada() {
  return (
    <div className={telaErro.container}>
      <h1 className={telaErro.codigoErro}>404</h1>
      <p className={telaErro.mensagemErro}>Página não encontrada</p>

      <div className={telaErro.mensagemAjuda}>
        Este endereço não foi encontrado. Verifique se não há erros de digitação. Caso tenha chegado até aqui a partir
        de uma de nossas aplicações, tente novamente mais tarde.
      </div>
    </div>
  );
}