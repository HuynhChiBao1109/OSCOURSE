import { useState } from "react";
import styles from "./OrderModal.module.css";
import {
  formatCurrency,
  formatPrice,
  increaseBy40Percent,
} from "../../../utils";
import { getCourseByIdSelector } from "../../../redux/selectors";
import { useSelector } from "react-redux";

const fakeData = {
  courseName: "HTML CSS PRO",
  productCode: "F8C1Q5NK",
  price: "100000",
  discountPrice: "50000",
};

const OrderDetails = () => {
  const [promoCode, setPromoCode] = useState("");

  console.log("promo", promoCode);

  const handleInputChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleApplyPromoCode = () => {
    console.log("Vào đây");
  };
  const courseDetail = useSelector(getCourseByIdSelector);

  console.log("courseDetail", courseDetail);

  const infoPayment = useSelector((state) => state.transactionSlice);

  if (!infoPayment || !courseDetail)
    return (
      <div style={{ textAlign: "center" }}>
        {" "}
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <div className={styles.courseName}>
        <span className={styles.paymentContent_modalSubtitle}>
          Tên khóa học:
        </span>
        <h2 className={styles.paymentContent_subtitle}>
          <p>{courseDetail.title}</p>
        </h2>
      </div>
      <div className={styles.paymentContent_oderCode}>
        <span className={styles.paymentContent_modalSubtitle}>
          Mã đơn hàng:
        </span>
        <h2
          className={styles.paymentContent_subtitle}
          style={{ color: "#fa8c16" }}
        >
          <p>{infoPayment?.infoPayment?.payCourse?.content}</p>
        </h2>
      </div>
      <hr className={styles.paymentContent_divider} />
      {/* <div className={styles.paymentContent_giftCode}>
        <input
          placeholder="Nhập mã khuyến mãi"
          value={promoCode}
          onChange={handleInputChange}
        />
        <button
          className={`${styles.paymentContent_submitBtn} ${
            promoCode ? styles["button-enabled"] : styles["button-disabled"]
          }`}
          disabled={!promoCode}
          onClick={handleApplyPromoCode}
        >
          <span>Áp dụng</span>
        </button>
      </div> */}
      <hr className={styles.paymentContent_divider} />
      <div className={styles.paymentContent_modalPrice}>
        <span className={styles.paymentContent_modalSubtitle}>
          Chi tiết thanh toán:
        </span>
        <div className={styles.paymentContent_priceWrapper}>
          <div className={styles.paymentContent_priceBox}>
            <span className={styles.paymentContent_priceDesc}>Giá bán:</span>
            <span className={styles.paymentContent_priceDetail}>
              <del>
                {formatPrice(increaseBy40Percent(courseDetail.price))} đ
              </del>
              <span>{formatPrice(courseDetail.price)}đ</span>
            </span>
          </div>
          <div className={styles.paymentContent_divider}></div>
          <div
            className={`${styles.paymentContent_priceBox} ${styles.paymentContent_totalPrice}`}
          >
            <span className={styles.paymentContent_priceDesc}>Tổng tiền:</span>
            <span className={styles.paymentContent_priceFinal}>
              {formatPrice(courseDetail.price)}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
