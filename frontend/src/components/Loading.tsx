import styles from "@/defaultScreen.module.scss";
import SpinnerPrestadores from "./SpinnerClubs";

export default function Loading() {
  return (
    <main className={styles.container}>
      <SpinnerPrestadores />
    </main>
  );
}
