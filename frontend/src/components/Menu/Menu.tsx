import { useAuth } from '@/provider/useAuth';
import { nameFormat } from '@/helpers/format';
import { Menubar } from 'primereact/menubar';
import { Tooltip } from 'primereact/tooltip';
import { version } from '@/AppVersion';
import styles from './Menu.module.scss';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Menu() {
  const { logout, user} = useAuth();

  const { t } = useTranslation();

  const deslogar = async () => {
    await logout();
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const pt = {
    root: {
      className: styles.menuBar,
    },
    submenu: {
      className: styles.subMenu,
    },
    label: {
      className: styles.menuLabel,
    },
    content: {
      className: styles.menuContent,
    },
    action: {
      className: styles.menuAction,
    },
  };
  const inicio = (
    <>
      <a href='/' className={styles.headerTitle}>
        <h1>
          <img src='/src/assets/rotary_rotaryorg_favicons/favicon-194x194.png' alt='CLubs' className={styles.logo} />
          Clubs version {version.number}
        </h1>
      </a>
      <br />
    </>
  );

  
  const menus = [];

  if(user){
    const userLevel = user?.level ?? 0;

    if (userLevel! >= 0) {
      const reportsItens = [];

      reportsItens.push({
        icon: 'pi pi-download',
        label: t('menu.cards'),
        url: '/reports/file-reports',
      });

      reportsItens.push({ icon: 'pi pi-graduation-cap', label: t('menu.cost_centres'), url: '/app/file-app' });

      reportsItens.push({
        icon: 'pi pi-list',
        label: t('menu.holders'),
        url: '/reports/fees',
      });

      menus.push({
        label: t('menu.registrations'),
        items: [...reportsItens],
      });
    }

    if (userLevel! >= 0) {   
      const financesItens = [];

      financesItens.push({
        icon: 'pi pi-list',
        label: t('menu.credit_selection'),
        url: '/finances/fees',
      });

      financesItens.push({
        icon: 'pi pi-list',
        label: t('menu.account_statement'),
        url: '/finances/statement',
      });

      financesItens.push({
        icon: 'pi pi-list',
        label: t('menu.bank_orders'),
        url: '/finances/taxes',
      });

      financesItens.push({
        icon: 'pi pi-list',
        label: t('menu.financial_movements'),
        url: '/finances/balance',
      });

      menus.push({
        label: t('menu.movements'),
        items: [...financesItens],
      });
    }

    if (userLevel! >= 4) {
      menus.push({
        label: t('menu.admin'),
        items: [{ icon: 'pi pi-user', label: t('menu.users'), url: '/admin/manage-user' }],
      });
    }
  }
  const final =
    user !== null && user?.level !== null ? (
      <>
        <div className={`${styles.link} flex align-items-center gap-2`}>
          <Tooltip target='.user-tooltip' position='bottom' />
          <span className='user-tooltip' data-pr-tooltip={`${user?.email!} (${user?.level})`}>
            <i className={`${styles.icone} pi pi-user`}></i>
            {nameFormat(user?.name!)}
          </span>

          <span className={styles.link} onClick={deslogar}>
            <i className={`${styles.icone} pi pi-sign-out`}></i>
            {t('menu.logout')}
          </span>
        </div>
      </>
    ) : (
      <div className='flex align-items-center gap-2'>
        <button onClick={() => changeLanguage('en')} className={styles.languageButton}>EN</button>
        <button onClick={() => changeLanguage('pt')} className={styles.languageButton}>PT</button>
        <a href='/finances' className={styles.link}>
          <i className={`${styles.icone} pi pi-sign-out`}></i>
          {t('menu.login')}
        </a>
      </div>
    );

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Menubar pt={pt} model={menus} start={inicio} end={final} />
      </div>
    </header>
  );
}
