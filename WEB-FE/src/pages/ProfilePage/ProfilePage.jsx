import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfilePage.module.css";
import { Button, Card, Col, Row } from "antd";
import { CameraOutlined } from "@ant-design/icons";

export const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(
    localStorage.getItem("selectedImage") || null
  );
  const [data, setData] = useState([
    {
      title: "Lập Trình JavaScript Cơ Bản",
      description:
        "Khóa học JavaScript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.",
      image:
        "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
    },
    {
      title: "HTML CSS từ Zero đến Hero",
      description:
        "Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee",
      image:
        "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
    },
  ]);

  useEffect(() => {
    // Save the selected image to localStorage when it changes
    localStorage.setItem("selectedImage", selectedImage);
  }, [selectedImage]);

  const handleButtonClick = () => {
    // Trigger the click event on the file input
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Read the file path and update the state
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className={styles.upc}>
      <div className={styles.gradiant}>
        <img
          src={
            selectedImage ||
            "https://assets.digitalocean.com/articles/eng_javascript/js-console/javascript-alert.png"
          }
          alt=""
        />
        <Button onClick={handleButtonClick}>
          <CameraOutlined /> Chỉnh sửa ảnh bìa
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Button>
      </div>
      <div>
        <div className={styles.profileDown}>
          <img
            src="https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg"
            alt=""
          />
          <div className={styles.profileName}>Admin</div>
        </div>
      </div>
      <div style={{ marginTop: "20px", display: "flex" }}>
        <div>
          <div
            style={{
              padding: "20px",
              background: "#fff",
              width: "450px",
              height: "80px",
              boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <h3>Giới thiệu</h3>
            Thành viên của F8 - Học lập trình để đi làm từ một năm trước
          </div>
        </div>
        <div>
          <div
            style={{
              marginLeft: "30px",
              padding: "20px",
              background: "#fff",
              width: "620px",
              height: "auto",
              boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <h3>Các khóa học đã tham gia</h3>
            <div>
              <Row>
                {data.map((item, index) => (
                  <div key={item.id}>
                    <Card
                      className={styles.myCard}
                      bodyStyle={{ padding: "0" }}
                      cover={
                        <img
                          src={item.image}
                          alt="img"
                          style={{
                            width: "250px",
                            height: "150px",
                            marginRight: "50px",
                            border: "none",
                            marginBottom: "20px",
                            borderRadius: "20px",
                          }}
                        />
                      }
                    >
                      <h3>{item.title}</h3>
                      {item.description}
                    </Card>
                    {index < data.length - 1 && <hr />}
                  </div>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default ProfilePage
