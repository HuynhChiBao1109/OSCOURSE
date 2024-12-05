import {
  BookOutlined,
  CreditCardOutlined,
  CrownOutlined,
  FormOutlined,
  InboxOutlined,
  PieChartOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import AppFooter from "../../pages/Footer/Footer";
import userLoginSlice from "../../redux/slices/userLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { getUserLoginSelector, getUserSelector } from "../../redux/selectors";
const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectMenu, setSelectMenu] = useState(location.pathname);

  const userForRedux = useSelector(getUserLoginSelector);

  useEffect(() => {
    setSelectMenu(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      console.log("get user from local storage");
      dispatch(userLoginSlice.actions.setUser(JSON.parse(user)));
    }
  }, []);

  const [itemMenu, setItemMenu] = useState([]);

  const userSelector = useSelector(getUserSelector);
  const userLocal =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));

  const userRef = userLocal || userSelector || "";

  const items = [
    //User
    getItem("Khóa học", "/course", <UnorderedListOutlined />),
    userRef?.role == "children" &&
      userRef?.role &&
      getItem(
        "Chứng chỉ của bạn",
        "/my-certificate",
        <SafetyCertificateOutlined />
      ),
    userRef?.role == "parent" &&
      userRef?.role &&
      getItem(
        "Khóa học đã mua",
        "/course-purchased-parent",
        <ShoppingCartOutlined />
      ),

    //Admin screen
    userRef?.role == "admin" &&
      userRef?.role &&
      getItem("Quản lí khóa học", "/course-management", <BookOutlined />),
    userRef?.role == "admin" &&
      userRef?.role &&
      getItem(
        "Quản lí tài khoản",
        "/manage-account",
        <FontAwesomeIcon icon={faUser} />
      ),
    userRef?.role == "admin" &&
      getItem(
        "Quản lí giao dịch",
        "/manage-transaction",
        <CreditCardOutlined />
      ),
  ];

  //handle save menu and redirect
  const onClick = (e) => {
    console.log("click ", e.key);
    setSelectMenu(e.key);
    navigate(e.key);
  };
  const [collapsed, setCollapsed] = useState(false);
  console.log(location.pathname);
  //pages have menu sided bar
  const pageLocation = [
    "/",
    "/course",
    "/course-purchased",
    "/course-outline",
    "/my-blog",
    "/manage-account",
    "/listblog",
    "/course-management",
    "/course-purchased-parent",
    "/manage-transaction",
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header />

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          style={{
            display: pageLocation.includes(location.pathname)
              ? "block"
              : "none",
          }}
        >
          <Menu
            onClick={onClick}
            theme="light"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectMenu]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "16px",
            }}
          >
            <div
              style={{
                minHeight: 360,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            O5COURSE ©{new Date().getFullYear()} Created by O5Course
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
