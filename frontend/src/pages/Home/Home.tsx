import TextoErro from "@/components/TextoErro";
import { useAuth } from "@/contexts/auth/useAuth";
import default from "@/default.module.scss";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className={default.container}>
      <section className={default.pageTitle}>
        <h1>Visão Geral</h1>
      </section>
      <div className="flex">
        {!user} <TextoErro mensagem="Tela em construção..." />
      </div>
    </main>
  );
}
