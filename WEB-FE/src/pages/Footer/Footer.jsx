import React from "react";
import { Layout, Row, Col } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center", backgroundColor: "#f0f0f0" }}>
      <Row justify="center">
        <Col span={8}>
          <h3>About Us</h3>
          <p>Thông tin về dự án O5Course và mục tiêu của chúng tôi.</p>
        </Col>
        <Col span={8}>
          <h3>Contact Us</h3>
          <p>Email: info@o5course.com</p>
          <p>Phone: +1234567890</p>
        </Col>
        <Col span={8}>
          <h3>Follow Us</h3>
          <div>
            <FacebookOutlined
              style={{ fontSize: "24px", marginRight: "8px" }}
            />
            <TwitterOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
            <InstagramOutlined style={{ fontSize: "24px" }} />
          </div>
        </Col>
      </Row>
      <p style={{ marginTop: "24px" }}>© 2024 O5Course. All Rights Reserved.</p>
    </Footer>
  );
};

export default AppFooter;
