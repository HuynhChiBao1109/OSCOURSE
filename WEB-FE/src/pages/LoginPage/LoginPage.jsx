import React, { useState } from "react";
import { Button } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import userLoginSlice from "../../redux/slices/userLoginSlice";
import { getUserLoginSelector } from "../../redux/selectors";
import { useSelector } from "react-redux";

const ModalPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const userSelecter = useSelector(getUserLoginSelector);

  const handleLoginOk = (info) => {
    setIsLoginModalOpen(false);
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleRegisterOk = () => {
    setIsRegisterModalOpen(false);
  };

  const handleRegisterCancel = () => {
    setIsRegisterModalOpen(false);
  };

  const handleForgotPasswordOk = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const handleForgotPasswordCancel = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const openForgotPasswordModal = () => {
    handleLoginCancel();
    setIsForgotPasswordModalOpen(true);
  };

  return (
    <div>
      {!userSelecter?.id ? (
        <>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={openLoginModal}
          >
            Đăng nhập
          </Button>
          <Button type="primary" onClick={openRegisterModal}>
            Đăng ký
          </Button>
        </>
      ) : (
        ""
      )}

      {/* Modal đăng nhập */}
      <LoginForm
        isLoginModalOpen={isLoginModalOpen}
        handleLoginOk={handleLoginOk}
        handleLoginCancel={handleLoginCancel}
        openForgotPasswordModal={openForgotPasswordModal}
        openRegisterModal={openRegisterModal}
      />

      {/* Modal đăng ký */}
      <RegisterForm
        isRegisterModalOpen={isRegisterModalOpen}
        handleRegisterOk={handleRegisterOk}
        handleRegisterCancel={handleRegisterCancel}
        openLoginModal={openLoginModal}
      />

      {/* Modal quên mật khẩu */}
      <ForgotPasswordForm
        isForgotPasswordModalOpen={isForgotPasswordModalOpen}
        handleForgotPasswordOk={handleForgotPasswordOk}
        handleForgotPasswordCancel={handleForgotPasswordCancel}
      />
    </div>
  );
};

export default ModalPage;
