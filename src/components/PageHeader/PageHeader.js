import React from "react";
import styles from "./PageHeader.module.css";

const PageHeader = props => (
  <header className={styles.header}>
    <h2 className={styles.headerTitle}>{props.title}</h2>
    <p className={styles.headerSubtitle}>{props.subtitle}</p>
  </header>
);

export default PageHeader;
