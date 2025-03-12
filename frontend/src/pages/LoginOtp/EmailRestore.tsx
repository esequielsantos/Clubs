import { useState } from 'react';
import { InputMask, type InputMaskChangeEvent } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import styles from "./LoginOtp.module.scss";
import { ProgressSpinner } from 'primereact/progressspinner';
import { environment } from '@/env';


export default function EmailRestore() {
  const [docId, setdocId] = useState('');
  const [cartaoCpesc, setCartaoCpesc] = useState('');
  const [sending, setSending] = useState(false);
  const [temEmail, setTemEmail] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);


  const handledocIdChange = (e: InputMaskChangeEvent) => {
      setdocId((e.target as HTMLInputElement).value);
  };

  const handleCartaoChange = (e: InputMaskChangeEvent) => {
    setCartaoCpesc((e.target as HTMLInputElement).value);
  };

  const handleLocalizarEmail = async () => {
    setSending(true);
    setMensagem(null);
    setTemEmail(false);

    try{
      const cleanId = docId.replace(/\D/g, '');
      const cartaoLimpo = cartaoCpesc.replace(/\D/g, '');

      const response = await fetch(environment.api + "/auth/recoveremail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId: cleanId, cartao: cartaoLimpo }),
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
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 >Recuperar Email</h1>
      <form className={styles.formulario}>
        <div className={styles.botaoContainer}>
          <label htmlFor="docId" className={styles.labelRight}>docId:</label>
            <InputMask
              id="docId"
              mask="999.999.999-99"
              value={docId}
              onChange={handledocIdChange}
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
        {sending && ( // Show spinner conditionally
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
            {temEmail && <span> O email registrado para docId e Cartão é <br/></span>}
            [{mensagem}]
          </div>}
        <Button 
          label="Localizar Email"
          onClick={handleLocalizarEmail} 
          type="button"
          disabled={sending}
          className={styles.botao} />
      </form>
    </div>
  );
}