import { Divider } from "antd";
import React from "react";
import styles from "./NotFoundPage.module.css";
import Title from "antd/es/typography/Title";

export const NotFoundPage = () => {
  return (
    <div className={styles.notFoundMessage}>
      <div className={styles.title}>
        <Title style={{ color: "#A6425E" }}>
          BẠN KHÔNG CÓ QUYỀN TRUY CẬP TRANG NÀY HOẶC TRANG KHÔNG TỒN TẠI
        </Title>
        <Divider></Divider>
      </div>
    </div>
  );
};
