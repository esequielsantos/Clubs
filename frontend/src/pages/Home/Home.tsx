import { useState } from 'react';
import TextError from '@/components/TextError';
import { useAuth } from '@/provider/useAuth';
import styles from '@/defaultScreen.module.scss';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import DynamicForm from '@/components/Forms/DynamicForm';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.pageTitle}>
        <h1>Home</h1>
      </section>
      <div className='flex'>
        {!user ? (
          <TextError message='Tela em construção...' />
        ) : (
          <>
            <Button label= {t('home.open_for')} onClick={openModal} />
            <Dialog header={t('home.open_for')} visible={visible} onHide={closeModal}>
              <DynamicForm fieldsEndpoint="monthly-fee" dataEndpoint="1" />
            </Dialog>
          </>
        )}
      </div>
    </main>
  );
}