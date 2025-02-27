import { filters } from "@/helpers/filters";
import type { RouteData } from "@/routes";
import React from "react";
import { useMatches } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";

export default function Breadcrumb() {
  const matches = useMatches();
  const breadcrumb = matches
    .map(match => match.handle as RouteData | undefined)
    .map(handle => handle?.breadcrumb?.())
    .filter(filters.isNotUndefined);

  return (
    <nav className={styles.breadcrumb}>
      {breadcrumb.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <i className={`${styles.separador} pi pi-chevron-right`}></i>}
          <div className={styles.item}>{item}</div>
        </React.Fragment>
      ))}
    </nav>
  );
}
