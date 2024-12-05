import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/slices/userLoginSlice";

const ForgotPasswordForm = ({
  isForgotPasswordModalOpen,
  handleForgotPasswodOk,
  handleForgotPasswordCancel,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    setIsLoading(true);
    dispatch(forgotPassword(values)).then((res) => {
      if (res.payload == "Email is not exist") {
        setIsLoading(false);
        toast.warning("Email này không tồn tại");
      }

      if (
        res.payload?.forgotPassword?.message ==
        "Check your mail to get new password"
      ) {
        setIsLoading(false);
        toast.info("Đã reset password hãy vào email nhận mật khẩu mới");
        form.setFieldValue();
        handleForgotPasswordCancel();
      }
    });

    // Xử lý logic lấy lại mật khẩu
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Modal
      title={<p style={{ textAlign: "center" }}>Lấy lại mật khẩu</p>}
      visible={isForgotPasswordModalOpen}
      onOk={handleForgotPasswodOk}
      onCancel={handleForgotPasswordCancel}
      cancelButtonProps={{ style: { display: "none", fontWeight: "bolder" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <p style={{ marginBottom: "20px", textAlign: "center" }}>
        Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng
        chung có thể sẽ bị khóa
      </p>
      <Form
        form={form}
        {...formItemLayout}
        name="forgot_password"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
          >
            <Input style={{ width: "400px" }} placeholder="Email của bạn" />
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </div>
        {/* <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item> */}
        {/* <Form.Item
          name="code"
          rules={[
            {
              required: true,
              message: "Please input the verification code!",
            },
          ]}
        >
          <Input.Group compact>
            <div style={{ width: "475px" }}>
              <Input placeholder="Nhập mã xác nhận" style={{ width: "70%" }} />
              <Button
                type="primary"
                style={{ width: "30%", background: "#f05123" }}
              >
                Gửi mã
              </Button>
            </div>
          </Input.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ForgotPasswordForm;
