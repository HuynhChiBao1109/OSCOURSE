import {
  BookOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloudOutlined,
  CommentOutlined,
  HddOutlined,
  IdcardOutlined,
  LayoutOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styles from "./PaymentPage.module.css";
import OrderModal from "./OrderModal";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchCourseIDGraphQL,
  fetchListChilByID,
} from "../../redux/slices/courseSlice";
import { getCourseByIdSelector } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin } from "antd";
import { formatPrice, increaseBy40Percent } from "../../utils";
import { payCourse } from "../../redux/slices/transactionSlice";
import { toast } from "react-toastify";

export const PaymentPage = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const dispatch = useDispatch();
  const [listChildren, setListChildren] = useState([]);
  const [infoPayment, setInfoPayment] = useState("ninh");
  const [selectedOption, setSelectedOption] = useState(null);

  console.log(userLocal.id);
  console.log(id);
  const courseDetail = useSelector(getCourseByIdSelector);
  useEffect(() => {
    dispatch(fetchCourseIDGraphQL(id));
    dispatch(fetchListChilByID(userLocal.id)).then((res) => {
      setListChildren(res.payload.getListChildrenByParentId);
    });
  }, [dispatch, id]);

  const handleOpenModal = () => {
    if (!selectedOption) {
      toast.warning("Chọn học sinh để tham gia khóa học");
      return;
    }
    dispatch(payCourse({ courseId: id, childrenId: selectedOption })).then(
      (res) => {
        setInfoPayment(res.data);
        // if (!res.data) return toast.info("Hãy thanh toán đơn cũ");
        console.log("info payment: " + res.data);
        toast.info("Hãy thanh toán để sở hữu");
        setModalVisible(true);
      }
    );
  };

  console.log("courseDetail", courseDetail);
  if (!courseDetail)
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };
  return (
    <div className={styles.payment_wrapper}>
      <div>
        <h1 className={styles.payment_title}>Mở khóa toàn bộ khóa học</h1>
        <div className={styles.paymentContent_wrapper}>
          <div className={styles.paymentContent_left}>
            <div className={styles.paymentContent_description}>
              <p>
                Sở hữu khóa học{" "}
                <em>
                  <strong>{courseDetail.title}</strong>
                </em>{" "}
                nhất bạn có thể tìm thấy trên Internet 🙌
              </p>
              <p>
                Có tới{" "}
                <em>
                  <strong>hàng chục bài tập</strong>
                </em>{" "}
                thực hành sau mỗi bài học và bạn sẽ được (bao gồm video, bài
                tập, thử thách, flashcards, v.v) sẽ giúp bạn nắm kiến thức nền
                tảng vô cùng chắc chắn.
              </p>
            </div>
            <div className={styles.paymentContent_price}>
              <div className={styles.paymentContent_priceContainer}>
                <span className={styles.paymentContent_priceTitle}>
                  Giá bán:
                </span>
                <div className={styles.paymentContent_priceWrapper}>
                  <del>
                    {formatPrice(increaseBy40Percent(courseDetail.price))}
                  </del>
                  <span>{formatPrice(courseDetail.price)}đ</span>
                </div>
              </div>
              <div className={styles.paymentContent_divider}></div>
              <div className={styles.paymentContent_priceContainer}>
                <span className={styles.paymentContent_totalPrice}>
                  Tổng tiền:
                </span>
                <div className={styles.paymentContent_priceFinal}>
                  <span>{formatPrice(courseDetail.price)}đ</span>
                </div>
              </div>
            </div>

            <div className={styles.payment_getInfoPayment}>
              <a className={styles.btnWrapper} onClick={handleOpenModal}>
                Lấy thông tin thanh toán
              </a>
            </div>
          </div>
          <div className={styles.paymentContent_right}>
            <h2
              className={styles.paymentContent_benefitTitle}
              style={{ color: "black", margin: 0 }}
            >
              Chọn học sinh để tham gia khóa học
            </h2>
            <Select
              defaultValue="Select an option"
              value={selectedOption}
              onChange={handleSelectChange}
              style={{ width: "100%", margin: "10px 0" }}
              allowClear="true"
              placeholder="Chọn học sinh"
            >
              {listChildren.map((child) => (
                <Option value={child.id}>{child.name}</Option>
              ))}
            </Select>
            <div className={styles.paymentContent_benefit}>
              <div className={styles.paymentContent_benefitWrapper}>
                <h2 className={styles.paymentContent_benefitTitle}>
                  Bạn sẽ nhận được gì?
                </h2>
                <section>
                  <section>
                    <div className={styles.paymentContent_benefitItem}>
                      <span className={styles.paymentContent_icon}>
                        <CheckCircleOutlined />
                      </span>
                      <div>
                        Truy cập toàn bộ khóa{" "}
                        <strong>{courseDetail.title}</strong>
                      </div>
                    </div>
                    <div className={styles.paymentContent_benefitItem}>
                      <span className={styles.paymentContent_icon}>
                        <HddOutlined />
                      </span>
                      <div>
                        Hàng <strong>chục</strong> bài học
                      </div>
                    </div>

                    <div className={styles.paymentContent_benefitItem}>
                      <span className={styles.paymentContent_icon}>
                        <CommentOutlined />
                      </span>
                      <div>Kênh hỏi đáp, hỗ trợ</div>
                    </div>
                    <div className={styles.paymentContent_benefitItem}>
                      <span className={styles.paymentContent_icon}>
                        <CheckOutlined />
                      </span>
                      <div>Đáp án cho mọi thử thách</div>
                    </div>
                    <div className={styles.paymentContent_benefitItem}>
                      <span className={styles.paymentContent_icon}>
                        <SafetyCertificateOutlined />
                      </span>
                      <div>Nhận chứng chỉ khi hoàn thành</div>
                    </div>
                  </section>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <OrderModal infoPayment={infoPayment} onClose={handleCloseModal} />
      )}
    </div>
  );
};
