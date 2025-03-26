import telaErro from "@/defaultScreen.module.scss";

export default function TextoErro(props: { message: string }) {
  return (
    <div className={telaErro.container}>
      <p className={telaErro.errorMessage}>{props.message}</p>
    </div>
  );
}
