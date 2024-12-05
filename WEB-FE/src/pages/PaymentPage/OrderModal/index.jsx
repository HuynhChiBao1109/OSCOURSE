import { Modal } from "antd";
import React from "react";
import OrderCountdown from "./OrderCountdown";
import OrderDetails from "./OrderDetails";
import styles from "./OrderModal.module.css";
import OrderNoteContact from "./OrderNoteContact";
import OrderPayment from "./OrderPayment";
import { useSelector } from "react-redux";

const OrderModal = ({ onClose }) => {
  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      width="100%"
      style={{ top: 0, height: "100vh", margin: 0 }}
      className={styles.modalContainer}
    >
      <div className={styles.paymentContent_containerModal}>
        <div className={styles.paymentContent_leftModal}>
          <OrderCountdown onClose={onClose} />
          <OrderDetails />
        </div>
        <div className={styles.paymentContent_rightModal}>
          <OrderPayment />
          <OrderNoteContact />
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
