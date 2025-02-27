import styles from "@/defaultScreen.module.scss";


export default function PaginaNaoEncontrada() {
  return (
    <div className={styles.container}>
      <h1 className={styles.codigoErro}>404</h1>
      <p className={styles.mensagemErro}>Página não encontrada</p>

      <div className={styles.mensagemAjuda}>
        Este endereço não foi encontrado. Verifique se não há erros de digitação. Caso tenha chegado até aqui a partir
        de uma de nossas aplicações, tente novamente mais tarde.
      </div>
    </div>
  );
}