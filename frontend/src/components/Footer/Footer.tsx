import { version } from "@/AppVersion";
import logo from "../../assets/marca-digital-sc.png";
import styles from "./Footer.module.scss";
export default function Footer() {
  return (
    <footer>
      <section className={styles.info}>
        <div className={styles.footerContent}>
          <div className={styles.footerBlock}>
            <div className={styles.logo}>
              <img src={logo} alt="Image" width="150" />
            </div>
            <div className={styles.footerAddress}>
              <div>Rotary Club International</div>
            </div>
            <div className={styles.footerAddress}>
              <div>Development in Brazil</div>
            </div>
            <div className={styles.contato}>
              <div>
                <a href="tel:48-999092698" className={styles.link}>
                  <span className="pi pi-phone" />
                  <span className={styles.space}>(48) 48-99909-2698</span>
                </a>
              </div>
              <div>
                <a href="mailto:essoftwares@hotmail.com" className={styles.link}>
                  <span className="pi pi-at" />
                  <span className={styles.space}>essoftwares@hotmail.com</span>
                </a>
              </div>
              <div>
                <span className="pi pi-user" />
                <span className={styles.space}>From 08:00h at 18:00h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.copyright}>
        <div className={styles.footerContent}>
          <div className={styles.footerBlock}>
            <div>
              2025 - <span property="dct:title"> Clubs (Management) </span> -
              <a href="https://www.sef.sc.gov.br/" property="cc:attributionName" rel="cc:attributionURL">
                ES SOFTWARES
              </a>
            </div>
            <div className={styles.development}>
              <div>
                Development<div className={styles.ico}></div>
              </div>

              <div>
                <small>
                  Version {version.number} - {version.date}
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
