import {
  BellFilled,
  BellOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Modal, Space, message } from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { imageExporter } from "../../assets/images";
import { Link, useNavigate } from "react-router-dom";
import { CoursePurchased } from "../CoursePurchased/CoursePurchased";
// import LoginPage from "../../pages/LoginPage/LoginPage";
import ModalPage from "../../pages/LoginPage/LoginPage";

import Languages from "../../i18n/Languages";

import { useDispatch, useSelector } from "react-redux";
import userLoginSlice from "../../redux/slices/userLoginSlice";

import { getUserLoginSelector } from "../../redux/selectors";
import { supabase } from "../../services/notification.services";
import { toast } from "react-toastify";

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userSelector = useSelector(getUserLoginSelector);

  const onFinish = () => {
    setIsLoggedIn(true);
  };
  const createChannel = async (user_id) => {
    try {
      supabase
        .channel("notification")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notification",
          },
          (payload) => {
            if (
              payload.new.user_id === user_id ||
              payload.new.user_id === "All"
            )
              message.info(payload.new.message);
          }
        )
        .subscribe();
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  useEffect(() => {
    const user_id = "65f2f632f08b5c0d2a5dff86"; // Pass the user ID here
    const unsubscribe = createChannel(user_id); // Create the channel

    // Cleanup function to unsubscribe when component unmounts
    // return () => {
    //   unsubscribe();
    // };
  }, [userSelector]);

  const avatarMenu = [
    {
      key: "1",
      label: <Link to="profile">Trang cá nhân</Link>,
    },
    {
      key: "3",
      label: <Link to="/my-certificate">Thành tích</Link>,
    },
    {
      key: "4",
      label: <Link to="/setting">Cài đặt</Link>,
    },
    {
      key: "5",
      label: (
        <p
          onClick={() => {
            console.log("logout");
            const resetData = {
              userId: "",
              name: "",
              userName: "",
              role: "",
              token: "",
              refreshToken: "",
            };
            dispatch(userLoginSlice.actions.setUser(resetData));
            localStorage.clear();
            toast.success("Logout successful!");
            navigate("/course");
          }}
        >
          Đăng xuất
        </p>
      ),
    },
  ];
  const coursePurchased = {
    title: "Khóa học đã mua",
    courses: [
      {
        title: "HTML CSS Pro",
        progress: 80,
      },
      {
        title: "Javascript Pro",
        progress: 90,
      },
      {
        title: "ReactJS Pro",
        progress: 40,
      },
    ],
  };

  const menuMyCourse = coursePurchased.courses.map((course, index) => ({
    label: <CoursePurchased course={course} />,
    key: index + 1,
  }));
  // menuMyCourse.unshift({
  //   label: <div style={{fontWeight:'bold',textAlign:'right', color:"#142232",padding:10}} onClick={() => navigate("/course-purchased")}>See detail</div>,
  //   key: "1",
  // });
  menuMyCourse.unshift({
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 18, color: "#142232" }}>
          Khóa học của tôi
        </div>
        <Button onClick={() => navigate("/course-purchased")}>
          Xem tất cả
        </Button>
      </div>
    ),
    key: "1",
  });

  useEffect(() => {
    console.log("user header", userSelector);
  }, [userSelector]);

  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        padding: "0px 20px",
        background: "#142232",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f5f5f5",
      }}
    >
      <Link
        to="/"
        style={{
          width: "100px",
          height: "100%",
        }}
      >
        <img
          src={imageExporter.logo}
          style={{
            width: "70%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt="logo"
        />
      </Link>

      <Search
        placeholder="Tìm kiếm khóa học"
        style={{
          width: 500,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          color: "white",
        }}
      >
        {userSelector.id && (
          <>
            <Dropdown
              menu={{ items: menuMyCourse }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <a
                style={{
                  color: "inherit",
                  fontWeight: "bold",
                  fontSize: "16px",
                  margin: "0 20px",
                }}
                onClick={(e) => e.preventDefault()}
              >
                <Space>Khóa học của tôi</Space>
              </a>
            </Dropdown>

            {/* Dropdown cho Notification Bell */}
            {/* <Dropdown menu={{ items: menuMyCourse }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <BellFilled
                    style={{
                      fontSize: "20px",
                      color: "#fff",
                      margin: "0px 20px",
                      cursor: "pointer",
                    }}
                  />
                </Space>
              </a>
            </Dropdown> */}

            {/* Dropdown cho Avatar */}
            <Dropdown menu={{ items: avatarMenu }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar shape="circle" size={34} src={userSelector.avatar} />
                </Space>
              </a>
            </Dropdown>
          </>
        )}

        <ModalPage onLogin={onFinish} />
      </div>
    </div>
  );
};
