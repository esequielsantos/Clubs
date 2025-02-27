import { useAuth } from "@/provider/useAuth";
import { nameFormat } from "@/helpers/format";
import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { version } from "@/AppVersion";
import styles from "./Menu.module.scss";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function Menu() {
  const { logout, user, rota } = useAuth();
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
      <a href="/" className={styles.headerTitle}>
        <h1>
          <img src="/src/assets/icone.png" alt="CLubs" className={styles.logo} />
          Clubs version {version.number}
        </h1>
      </a>
      <br />
    </>
  );

  // Caso a variável 'perfil' não estiver definida, defina-a para 0
  const perfilValor = user?.perfil ?? 0;

  const menus = [];

  if (perfilValor! >= 3) {
    const itemsCadastros = [];

    itemsCadastros.push({
      icon: "pi pi-download",
      label: t('menu.cards'),
      url: "/prestadores/arquivo-prestadores",
    });

    itemsCadastros.push({ icon: "pi pi-graduation-cap", label: t('menu.cost_centres'), url: "/app/arquivo-app" });

    itemsCadastros.push({
      icon: "pi pi-list",
      label: t('menu.holders'),
      url: "/sequestrosjudiciais/sequestros-judiciais",
    });

    menus.push({
      label: t('menu.registrations'),
      items: [...itemsCadastros],
    });
  }

  if (perfilValor! >= 2) {
    const itemsRelatorios = [];

    itemsRelatorios.push({
      icon: "pi pi-list",
      label: t('menu.financial_movements'),
      url: "/sequestrosjudiciais/sequestros-judiciais",
    });

    itemsRelatorios.push({
      icon: "pi pi-list",
      label: t('menu.bank_orders'),
      url: "/sequestrosjudiciais/sequestros-judiciais",
    });

    menus.push({
      label: t('menu.reports'),
      items: [...itemsRelatorios],
    });
  }

  if (perfilValor! >= 1) {
    const itemsMovimentacoes = [];

    itemsMovimentacoes.push({
      icon: "pi pi-list",
      label: t('menu.credit_selection'),
      url: "/prestacao-contas/selecao-credito",
    });

    itemsMovimentacoes.push({
      icon: "pi pi-list",
      label: t('menu.account_statement'),
      url: "/prestacao-contas/extrato",
    });

    itemsMovimentacoes.push({
      icon: "pi pi-list",
      label: t('menu.invoice_search'),
      url: "/prestacao-contas/pesquisa-nota-fiscal",
    });

    menus.push({
      label: t('menu.movements'),
      items: [...itemsMovimentacoes],
    });
  }

  if (perfilValor! >= 4) {
    menus.push({
      label: t('menu.admin'),
      items: [{ icon: "pi pi-user", label: t('menu.users'), url: "/admin/gerenciar-user" }],
    });
  }
  const final =
    user !== null && user?.perfil !== null ? (
      <>
        <div className={`${styles.link} flex align-items-center gap-2`}>
          <Tooltip target=".user-tooltip" position="bottom" />
          <span className="user-tooltip" data-pr-tooltip={`${user?.email!} (${user?.perfil})`}>
            <i className={`${styles.icone} pi pi-user`}></i>
            {nameFormat(user?.nome!)}
          </span>

          <span className={styles.link} onClick={deslogar}>
            <i className={`${styles.icone} pi pi-sign-out`}></i>
            {t('menu.logout')}
          </span>
        </div>
      </>
    ) : (
      <div className="flex align-items-center gap-2">
        <button onClick={() => changeLanguage('en')} className={styles.languageButton}>EN</button>
        <button onClick={() => changeLanguage('pt')} className={styles.languageButton}>PT</button>
        <a href={rota !== "prestacao-contas" ? "/" : `/${rota}`} className={styles.link}>
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
