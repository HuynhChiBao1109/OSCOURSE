import React from "react";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import Languages from "../../i18n/Languages";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t("heading")}</h1>
      <p className={styles.paragraph}>{t("paragraph")}</p>
      <Link to={"/"}>{t("backToLogin")}</Link>
    </div>
  );
};

export default HomePage;
