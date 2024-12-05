import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import userLoginSlice, {
  loginChildrenGraphQL,
} from "../../redux/slices/userLoginSlice";
import { toast } from "react-toastify";
import { Checkbox } from "antd";
import { loginUserGraphQL } from "../../redux/slices/userLoginSlice";

const LoginForm = ({
  isLoginModalOpen,
  handleLoginOk,
  handleLoginCancel,
  openForgotPasswordModal,
  openRegisterModal,
}) => {
  const successfulLoginData = {
    userId: "Ninh ",
    name: "",
    email: "admin@gmail.com",
    password: "123",
    role: "admin",
    token: "absdhjabsdjhbs",
    refreshToken: "",
    // Các thông tin khác của người dùng (nếu có):
    // ...
  };
  const [form] = Form.useForm();
  const [isChildren, setIsChildren] = useState(false);

  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    console.log(isChildren);
    if (isChildren) {
      dispatch(loginChildrenGraphQL(values)).then((res) => {
        console.log(res);
        if (
          res.payload == "Invalid password" ||
          res.payload == "You have not registered yet"
        ) {
          toast.error("Sai mật khẩu hoặc Sai username!");
        }

        if (res.payload == "Op your account is inactive") {
          toast.error("Tài khoản bạn đã bị khóa!");
        }
        if (res.payload.loginByChildren.Children) {
          const user = {
            ...res.payload.loginByChildren.Children,
            token: res.payload.loginByChildren.token,
          };
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Đăng nhập thành công!");
          window.location.reload(true);

          // Xử lý logic đăng nhập
          form.resetFields();
          handleLoginOk();
        }
      });
    } else {
      dispatch(loginUserGraphQL(values)).then((res) => {
        console.log(res);
        if (res.payload == "Your account is inactive") {
          toast.error("Tài khoản bạn đã bị khóa!");
        }
        if (
          res.payload == "Invalid password" ||
          res.payload == "No such user found"
        ) {
          toast.error("Email hoặc mật khẩu không đúng!");
        }
        if (res.payload.loginByUser && res.payload.loginByUser.User) {
          toast.success("Đăng nhập thành công!");
          // Xử lý logic đăng nhập
          const user = {
            ...res.payload.loginByUser.User,
            token: res.payload.loginByUser.token,
          };
          localStorage.setItem("user", JSON.stringify(user));
          window.location.reload(true);
          form.resetFields();
          handleLoginOk();
        }
      });
    }
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

  const onChange = (e) => {
    if (!isChildren) {
      message.info("Hãy đăng nhập với account của học sinh");
    } else {
      message.info("Hãy đăng nhập với email");
    }
    setIsChildren(!isChildren);
  };

  return (
    <Modal
      title={<p style={{ textAlign: "center" }}>Đăng nhập vào O5Course </p>}
      visible={isLoginModalOpen}
      onOk={handleLoginOk}
      onCancel={handleLoginCancel}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <p style={{ marginBottom: "20px", textAlign: "center" }}>
        Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng
        chung có thể sẽ bị khóa
      </p>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item>
          <Checkbox style={{ marginLeft: "2px" }} onChange={onChange}>
            Bạn là học sinh ?
          </Checkbox>
        </Form.Item>

        {isChildren ? (
          <>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên người dùng của bạn!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username của bạn"
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Thông tin E-mail đầu vào không hợp lệ !",
                },
                {
                  required: true,
                  message: "Vui lòng nhập Email của bạn!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email của bạn "
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Mật khẩu của bạn!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <a
            className="login-form-forgot"
            href="#"
            onClick={openForgotPasswordModal}
          >
            Quên mật khẩu
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ marginBottom: "20px" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Đăng nhập
          </Button>
          <div>
            Bạn chưa có tài khoản ?{" "}
            <a href="#" onClick={openRegisterModal}>
              Đăng kí
            </a>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginForm;
