import React from "react";
import { PhoneOutlined, MailOutlined, MediumOutlined } from "@ant-design/icons";
import styles from "./OrderModal.module.css";

const OrderNoteContact = () => {
  return (
    <div className={styles.paymentContent_rightModalBottom}>
      <h2 className={`${styles.paymentContent_title} ${styles.title_wrapper}`}>
        <p style={{ marginBottom: "20px" }}>Lưu ý</p>
      </h2>
      <p className={styles.paymentContent_rightModalBottomDesc}>
        Tối đa 5 phút sau thời gian chuyển khoản, nếu hệ thống không phản hồi
        vui lòng liên hệ ngay bộ phận hỗ trợ của O5Course.
      </p>
      <div className={styles.contact}>
        <div className={styles.paymentContent_contactItem}>
          <span className={styles.paymentContent_icon}>
            <PhoneOutlined />
            <a className={styles.paymentContent_text}>0123.456.789</a>
          </span>
        </div>
        <div className={styles.paymentContent_contactItem}>
          <span className={styles.paymentContent_icon}>
            <MailOutlined />
            <a className={styles.paymentContent_text}>
              votantai.07092002@gmail.com
            </a>
          </span>
        </div>
        <div className={styles.paymentContent_contactItem}>
          <span className={styles.paymentContent_icon}>
            <MediumOutlined />
            <a className={styles.paymentContent_text}>
              Huyện Bình Chánh, TP. Hồ Chí Minh
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderNoteContact;
