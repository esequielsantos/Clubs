import defaultScreen from "@/default.module.scss";
import SpinnerPrestadores from "./SpinnerClubs";

export default function Loading() {
  return (
    <main className={defaultScreen.container}>
      <SpinnerPrestadores />
    </main>
  );
}
