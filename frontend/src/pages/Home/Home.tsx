import TextError from '@/components/TextError';
import { useAuth } from '@/provider/useAuth';
import styles from '@/defaultScreen.module.scss';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className={styles.container}>
      <section className={styles.pageTitle}>
        <h1>Home</h1>
      </section>
      <div className='flex'>
        {!user} <TextError mensagem='Tela em construção...' />
      </div>
    </main>
  );
}
