import { useEffect, useState } from "react";
import styles from "./OrderModal.module.css";

const OrderCountdown = ({ onClose }) => {
  const [countdown, setCountdown] = useState(900);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(interval);
          onClose();
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div>
      <div className={styles.loading}>
        <span
          className={`${styles.paymentContent_modalSubtitle} ${styles.paymentContent_waitingTitle}`}
        >
          Đang chờ thanh toán
          <span style={{ display: "inherit" }}>
            <span className={styles.pulseLoader}></span>
            <span className={styles.pulseLoader}></span>
            <span className={styles.pulseLoader}></span>
          </span>
        </span>
      </div>
      <div>
        <h1 className={styles.paymentContent_timeCount}>
          <p>{formatTime(countdown)}</p>
        </h1>
      </div>
      <hr className={styles.paymentContent_divider} />
    </div>
  );
};

export default OrderCountdown;
