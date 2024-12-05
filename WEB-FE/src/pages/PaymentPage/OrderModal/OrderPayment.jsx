import { Image, QRCode, Spin, Typography } from "antd";
import React, { useEffect } from "react";
import styles from "./OrderModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentStatus } from "../../../redux/slices/transactionSlice";
import { toast } from "react-toastify";

const fakeData = {
  courseName: "HTML CSS PRO",
  productCode: "F8C1Q5NK",
  price: "5000",
};

const OrderPayment = () => {
  const { Paragraph } = Typography;

  const infoPayment = useSelector((state) => state.transactionSlice);

  if (!infoPayment)
    return (
      <div>
        {" "}
        <Spin size="large" />
      </div>
    );

  const dispatch = useDispatch();
  setInterval(() => {
    dispatch(
      getPaymentStatus({
        content: infoPayment?.infoPayment?.payCourse?.content,
      })
    ).then((res) => {
      if (res.payload?.getPaymentStatus?.status == "success") {
        toast.success("Thanh toán thành công");
      }
    });
  }, 3000);

  console.log("infoPayment:  " + infoPayment.infoPayment.payCourse.content);
  const imageQR = `https://api.vietqr.io/image/970422-39397979112001-u7Yboza.jpg?accountName=LY%20TUAN%20KIET&amount=${infoPayment.infoPayment.payCourse.amount}&addInfo=${infoPayment.infoPayment.payCourse.content}`;

  return (
    <div>
      <h2 className={`${styles.paymentContent_title} ${styles.title_wrapper}`}>
        <p>Chuyển khoản bằng QR</p>
      </h2>
      <div className={styles.paymentContent_bankDetail}>
        <div className={styles.paymentContent_qrCode}>
          <Image src={imageQR} />
        </div>
        <ul className={styles.paymentContent_introduction}>
          <li>Bước 1: Mở app ngân hàng và quét mã QR.</li>
          <li>
            Bước 2: Đảm bảo nội dung chuyển khoản là{" "}
            <span>{infoPayment.infoPayment.payCourse.content}</span>.
          </li>
          <li>Bước 3: Thực hiện thanh toán.</li>
        </ul>
      </div>
      {/* <h2 className={`${styles.paymentContent_title} ${styles.title_wrapper}`}>
        <p>Chuyển khoản thủ công</p>
      </h2>
      <div className={styles.paymentContent_bankInfo}>
        <div className={styles.paymentContent_row}>
          <div className={styles.paymentContent_bankInfoItem}>
            <div className={styles.paymentContent_label}>Số tài khoản:</div>
            <div className={styles.paymentContent_content}>
              <Paragraph
                copyable
                style={{
                  color: "#dae4f0",
                  fontSize: "1.2rem",
                  lineHeight: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  margin: 0,
                }}
              >
                <>123456789</>
              </Paragraph>
            </div>
          </div>
          <div className={styles.paymentContent_bankInfoItem}>
            <div className={styles.paymentContent_label}>Tên tài khoản</div>
            <div className={styles.paymentContent_content}>VÕ TẤN TÀI</div>
          </div>
        </div>
        <div className={styles.paymentContent_row}>
          <div className={styles.paymentContent_bankInfoItem}>
            <div className={styles.paymentContent_label}>Nội dung</div>
            <div className={styles.paymentContent_content}>
              <Paragraph
                copyable
                style={{
                  color: "#dae4f0",
                  fontSize: "1.2rem",
                  lineHeight: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  margin: 0,
                }}
              >
                <p>{fakeData.productCode}</p>
              </Paragraph>
            </div>
          </div>
          <div className={styles.paymentContent_bankInfoItem}>
            <div className={styles.paymentContent_label}>Chi nhánh</div>
            <div className={styles.paymentContent_content}>
              Vietcombank Hồ Chí Minh
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default OrderPayment;
