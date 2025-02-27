import { useState } from 'react';
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import styles from "./LoginOtp.module.scss";
import { ProgressSpinner } from 'primereact/progressspinner';
import { environment } from '@/env';


export default function EmailRestore() {
  const [cpf, setCpf] = useState('');
  const [cartaoCpesc, setCartaoCpesc] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [temEmail, setTemEmail] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);


  const handleCpfChange = (e: InputMaskChangeEvent) => {
      setCpf((e.target as HTMLInputElement).value);
  };

  const handleCartaoChange = (e: InputMaskChangeEvent) => {
    setCartaoCpesc((e.target as HTMLInputElement).value);
  };

  const handleLocalizarEmail = async () => {
    setEnviando(true);
    setMensagem(null);
    setTemEmail(false);

    try{
      const cpfLimpo = cpf.replace(/\D/g, '');
      const cartaoLimpo = cartaoCpesc.replace(/\D/g, '');

      const response = await fetch(environment.api + "/auth/recuperaemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf: cpfLimpo, cartao: cartaoLimpo }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem(data.message);
        setTemEmail(true);
      } else {
        const errorData = await response.json(); // Get error data from the response
        const errorMessage = errorData.message || `Erro na requisição: ${response.status} - ${response.statusText}`;
        setMensagem(errorMessage);
        setTemEmail(false);
      }
    }catch (error){
      setMensagem(`Erro ao tentar recuperar o email. Por favor, tente novamente mais tarde.\n${error}}`); // Generic error message
    } finally {
      setEnviando(false);
    }
    console.log('CPF:', cpf);
    console.log('Cartão CPESC:', cartaoCpesc);
  };

  return (
    <div className={styles.container}>
      <h1 >Recuperar Email</h1>
      <form className={styles.formulario}>
        <div className={styles.botaoContainer}>
          <label htmlFor="cpf" className={styles.labelRight}>CPF:</label>
            <InputMask
              id="cpf"
              mask="999.999.999-99"
              value={cpf}
              onChange={handleCpfChange}
              className={styles.inputShort}
              placeholder="___.___.___-__"
              maxLength={14} // Conforme a máscara com pontos e hífen
            />
        </div>

        <div className={styles.botaoContainer}> {/* Use CSS module for styling */}
            <label htmlFor="cartaoCpesc" className={styles.labelRight}>Número do Cartão CPESC:</label>
            <InputMask
              id="cartaoCpesc"
              mask="9999 9999 9999 9999"
              value={cartaoCpesc}
              onChange={handleCartaoChange}
              className={styles.inputShort}
              placeholder="____ ____ ____ ____"
              maxLength={19} //  Espaços entre os grupos de 4 dígitos
            
            />
        </div>
        {enviando && ( // Show spinner conditionally
          <ProgressSpinner
            style={{
              width: '40px',
              height: '40px',
              margin: '20px',
              alignSelf: 'center',
            }}
          />
        )}
        {mensagem && <div className={styles.message}>
            {temEmail && <span> O email registrado para CPF e Cartão é <br/></span>}
            [{mensagem}]
          </div>}
        <Button 
          label="Localizar Email"
          onClick={handleLocalizarEmail} 
          type="button"
          disabled={enviando}
          className={styles.botao} />
      </form>
    </div>
  );
}