import { Typography, Button, Form, Input, Select, Space } from "antd";
import React, { useEffect } from "react";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import styles from "./EditBlogPage.module.css";
import { Link, useParams } from "react-router-dom";

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 15,
    span: 5,
  },
};

const blogDetails = {
  title: "Cách đưa code lên GitHub và tạo GitHub Pages",
  content:
    "Xin các bạn tại F8, khi mình đọc những bài viết trên nhóm F8 thì\nmình thấy có nhiều bạn vẫn không biết đưa code lên GitHub, hoặc bị\nlỗi, hoặc có thể là những bạn mới và đặc biệt là các bạn không biết\ntạo GitHub Pages ( cụ thể là hiển thị ra trang web để cho mọi người\nxem á! ). Ok, hôm nay mình sẽ hướng dẫn cụ thể để cho những bạn\nkhông biết bấy lâu nay có thể đưa code mình lên GitHub được nhe.\nMình là Kha, là một thành viên trong nhóm Học lập trình web (F8 -\nFullstack.edu.vn).",
};

export const EditBlogPage = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const blogId = params.id;

  useEffect(() => {
    form.setFieldValue("Title", blogDetails.title);
    form.setFieldValue("Content", blogDetails.content);
  }, []);

  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        <Link to={`/blog-detail/${blogId}`} className={styles.arrowIcon}>
          <ArrowLeftOutlined />
        </Link>
        <Title style={{ marginBottom: "0" }} level={4}>
          Chỉnh sửa blog
        </Title>
      </div>
      <Form
        {...layout}
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "50px",
          marginTop: "2rem",
        }}
      >
        <Form.Item
          name="Title"
          label={
            <Title style={{ marginBottom: "0" }} level={5}>
              Tiêu đề
            </Title>
          }
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Blog title" />
        </Form.Item>
        <Form.Item
          name="Content"
          label={
            <Title style={{ marginBottom: "0" }} level={5}>
              Nội dung
            </Title>
          }
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea rows={10} placeholder="Blog content" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};
