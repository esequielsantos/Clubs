import telaErro from "@/tela-error.module.scss";

export default function TextoErro(props: { mensagem: string }) {
  return (
    <div className={telaErro.container}>
      <p className={telaErro.mensagemErro}>{props.mensagem}</p>
    </div>
  );
}
