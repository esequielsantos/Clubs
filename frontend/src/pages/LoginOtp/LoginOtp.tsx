import icone from "@/assets/icone.png";
import { Button } from "primereact/button";
import { InputOtp, InputOtpChangeEvent } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { enviarEmail, validarCodigoOtp } from "./LoginOtp.controller";
import styles from "./LoginOtp.module.scss";

export default function LoginOtp() {
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false); //se email ja foi enviado pede codigo OTP

  const [email, setEmail] = useState(() => {
    //busca email no sessionStorage ou nos cookies
    const storedEmail = sessionStorage.getItem("cpesc-pc-email");
    if (storedEmail) {
      return storedEmail;
    } else {
      // Se não encontrar no sessionStorage, verifica nos cookies
      const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith("cpesc-pc-email="))
        ?.split("=")[1];
      return cookieValue ?? "";
    }
  });
  const [codigoOtp, setCodigoOtp] = useState<string>("");
  const [error, setErro] = useState<string | null>(null);

  const codigoOtpRef = useRef<HTMLInputElement | null>(null);

  const toast = useRef<Toast>(null);

  const handleToastShow = () => {
    setTimeout(() => {
      if (codigoOtpRef.current) {
        codigoOtpRef.current.focus();
      }
    }, 5001);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);
    setEnviando(true); //desativa o botao e liga spinner

    try {
      if (!emailEnviado) {
        const msg = await enviarEmail(email);

        toast.current?.show({ severity: "success", summary: msg, life: 5000 });

        if (msg.includes("enviado")) {
          sessionStorage.setItem("cpesc-pc-email", email);
          setEmailEnviado(true);
          setErro(msg);
        } else {
          setEmailEnviado(false);
          setErro(msg);
        }
      } else {
        //email ja enviado... agora enviar o codigo OTP

        const msg = await validarCodigoOtp(email, codigoOtp);

        toast.current?.show({ severity: "success", summary: msg, life: 3000 });
        setErro(msg);

        //login com sucesso
        if (msg.includes("Sucesso")) {
          const expDate = new Date();
          expDate.setTime(expDate.getTime() + 180 * 24 * 60 * 60 * 1000); // 180 dias em milissegundos
          document.cookie = `cpesc-pc-email=${email}; path=/prestacao-contas; expires=${expDate.toUTCString()};`;

          //redirecionar para a tela correta
          window.location.href = "/prestacao-contas/selecao-credito";
        } else if (!msg.includes("inválido")) {
          //volta sozinho para tela de login email
          setTimeout(() => {
            setEmailEnviado(false);
            setErro("");
            setCodigoOtp("");
          }, 4000);
        }
      }
    } catch (error) {
      setEmailEnviado(false);
      setCodigoOtp("");
      setErro(`Erro ao enviar email ou validar código OTP. ${error}`);
    }
    setEnviando(false); //desliga spinner
  };

  const handleCodigoOtpChange = (e: InputOtpChangeEvent) => {
    const inputValue = e.value ?? "";
    setCodigoOtp(inputValue.toString());
  };

  const handleVoltar = () => {
    setEmailEnviado(false);
    setEnviando(false);
    setCodigoOtp("");
    setErro(null);
  };

  return (
    <main className={styles.container}>
      <img src={icone} alt="Icone" className={styles.icone} />
      <section className={styles.tituloTela}>
        <h1>
          Bem-vindo à Prestação <br />
          de Contas do CPESC
        </h1>
      </section>

      <section>
        <Toast ref={toast} onShow={handleToastShow} position="top-center" tabIndex={-1}></Toast>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          {!emailEnviado ? (
            <>
              <span className={styles.label}>Informe seu e-mail:</span>
              <InputText
                className={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
              />
              {enviando && ( // Show spinner conditionally
                <ProgressSpinner
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "20px",
                    alignSelf: "center",
                  }}
                />
              )}
              <Button className={styles.botao} label="Enviar email" disabled={enviando} type="submit" />
              <div className={styles.esqueciEmailLink}>
                {" "}
                {/* Add a container for styling */}
                <Link to="/prestacao-contas/recupera-email">
                  {" "}
                  <i className="pi pi-external-link" /> Esqueci meu email...
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className={styles.label}>Informe o código OTP:</span>
              <InputOtp
                ref={codigoOtpRef}
                className={styles.input}
                value={codigoOtp}
                onChange={e => handleCodigoOtpChange(e)}
                integerOnly
                length={6}
                required
                autoFocus={true}
              />
              {enviando && ( // Show spinner conditionally
                <ProgressSpinner
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "20px",
                    alignSelf: "center",
                  }}
                />
              )}
              <div className={styles.botaoContainer}>
                <Button className={styles.botao} label="Voltar" type="button" onClick={handleVoltar} />
                <Button className={styles.botao} label="Enviar código" type="submit" disabled={enviando} />
              </div>
            </>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </section>
    </main>
  );
}
