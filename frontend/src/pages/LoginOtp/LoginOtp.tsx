import icone from "@/assets/icone.png";
import { Button } from "primereact/button";
import { InputOtp, InputOtpChangeEvent } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sendEmail, validateOtpCode } from "./LoginOtp.controller";
import styles from "./LoginOtp.module.scss";
import { HttpStatus, StatusReturn } from "@/provider/useAuth";
import { useTranslation } from "react-i18next";

export interface ResultLogin extends StatusReturn {
  token: string | null;
}

export default function LoginOtp() {
  const { t } = useTranslation();
  const [emailSend, setEmailSend] = useState(false);
  const [sending, setSending] = useState(false); 

  const [email, setEmail] = useState(() => {
    const storedEmail = sessionStorage.getItem("temp-email");
    if (storedEmail) {
      return storedEmail;
    } else {
      const cookieValue = document.cookie
        .split("; ")
        .find(row => row.startsWith("temp-email="))
        ?.split("=")[1];
      return cookieValue ?? "";
    }
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let redirectTo = searchParams.get('redirect') || '/';

  const [otpCode, setOtpCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const otpCodeRef = useRef<HTMLInputElement | null>(null);
  const toast = useRef<Toast>(null);

  const handleToastShow = () => {
    setTimeout(() => {
      if (otpCodeRef.current) {
        otpCodeRef.current.focus();
      }
    }, 5001);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSending(true); //desativa o botao e liga spinner

    try {
      if (!emailSend) {
        const returnSendEmail = await sendEmail(email, t);

        const msg = returnSendEmail.message;
        const status = returnSendEmail.status == 200 ? "success" : "warn";

        toast.current?.show({ severity: status, summary: msg, life: 5000 });

        if (msg.includes("enviado")) {
          sessionStorage.setItem("temp-email", email);
          setEmailSend(true);
          setError(msg);
        } else {
          setEmailSend(false);
          setError(msg);
        }
      } else {
        const returnValidateOtp = await validateOtpCode(email, otpCode);

        const msg = returnValidateOtp.message;
        const status = returnValidateOtp.status == 200 ? "success" : "warn";

        toast.current?.show({ severity: status, summary: msg, life: 3000 });
        setError(msg);
        
        if (returnValidateOtp.status === HttpStatus.OK) {
          const expDate = new Date();
          expDate.setTime(expDate.getTime() + 180 * 24 * 60 * 60 * 1000); // 180 dias em milissegundos
          document.cookie = `temp-email=${email}; path=/; expires=${expDate.toUTCString()};`;
          if(redirectTo.includes("loginotp")) redirectTo = "/home";
          window.location.href = redirectTo;
        } else if (returnValidateOtp.status != HttpStatus.BAD_REQUEST) {       
          setTimeout(() => {
            setEmailSend(false);
            setError("");
            setOtpCode("");
          }, 4000);
        }
      }
    } catch (error) {
      setEmailSend(false);
      setOtpCode("");
      setError(`Erro ao enviar email ou validar código OTP. ${error}`);
    }
    setSending(false); //turn off spinner
  };

  const handleOtpCodeChange = (e: InputOtpChangeEvent) => {
    const inputValue = e.value ?? "";
    setOtpCode(inputValue.toString());
  };

  const handleVoltar = () => {
    setEmailSend(false);
    setSending(false);
    setOtpCode("");
    setError(null);
  };

  return (
    <main className={styles.container}>
      <img src={icone} alt="Icone" className={styles.icone} />
      <section className={styles.tituloTela}>
        <h1>
          Bem-vindo ao Clubs <br />
          Gerencimento de Clube
        </h1>
      </section>

      <section>
        <Toast ref={toast} onShow={handleToastShow} position="top-center" tabIndex={-1}></Toast>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          {!emailSend ? (
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
              {sending && ( // Show spinner conditionally
                <ProgressSpinner
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "20px",
                    alignSelf: "center",
                  }}
                />
              )}
              <Button className={styles.botao} label="Enviar email" disabled={sending} type="submit" />
              <div className={styles.esqueciEmailLink}>
                {" "}
                {/* Add a container for styling */}
                <Link to="/emailrestore">
                  {" "}
                  <i className="pi pi-external-link" /> Esqueci meu email...
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className={styles.label}>Informe o código OTP:</span>
              <InputOtp
                ref={otpCodeRef}
                className={styles.input}
                value={otpCode}
                onChange={e => handleOtpCodeChange(e)}
                integerOnly
                length={6}
                required
                autoFocus={true}
              />
              {sending && ( // Show spinner conditionally
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
                <Button className={styles.botao} label="Enviar código" type="submit" disabled={sending} />
              </div>
            </>
          )}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </section>
    </main>
  );
}
