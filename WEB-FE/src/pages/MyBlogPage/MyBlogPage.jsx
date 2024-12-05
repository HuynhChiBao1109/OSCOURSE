import { Pagination, Space, Typography } from "antd";
import React from "react";
import { BlogItem } from "./BlogItem/BlogItem";
import { Link } from "react-router-dom";

const { Title } = Typography;

const blogList = [
  {
    id: "1",
    title: "Authentication & Authorization trong ReactJS",
    author: {
      name: "John",
      avatar:
        "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
      categoryList: ["ReactJS"],
      readingTime: "2 phút",
      time: "9 tháng trước",
    },
    overviewContent:
      "Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.",
    imagePoster:
      "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
    categoryList: ["ReactJS"],
    readingTime: "2 phút",
    time: "9 tháng trước",
  },
  {
    id: "2",
    title: "Authentication & Authorization trong ReactJS",
    author: {
      name: "John",
      avatar:
        "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
      categoryList: ["ReactJS"],
      readingTime: "2 phút",
      time: "9 tháng trước",
    },
    overviewContent:
      "Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.",
    imagePoster:
      "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
    categoryList: ["ReactJS"],
    readingTime: "2 phút",
    time: "9 tháng trước",
  },
  {
    id: "3",
    title: "Authentication & Authorization trong ReactJS",
    author: {
      name: "John",
      avatar:
        "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
      categoryList: ["ReactJS"],
      readingTime: "2 phút",
      time: "9 tháng trước",
    },
    overviewContent:
      "Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.",
    imagePoster:
      "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
    categoryList: ["ReactJS"],
    readingTime: "2 phút",
    time: "9 tháng trước",
  },
  {
    id: "4",
    title: "Authentication & Authorization trong ReactJS",
    author: {
      name: "John",
      avatar:
        "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
      categoryList: ["ReactJS"],
      readingTime: "2 phút",
      time: "9 tháng trước",
    },
    overviewContent:
      "Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.",
    imagePoster:
      "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
    categoryList: ["ReactJS"],
    readingTime: "2 phút",
    time: "9 tháng trước",
  },
  {
    id: "5",
    title: "Authentication & Authorization trong ReactJS",
    author: {
      name: "John",
      avatar:
        "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
      categoryList: ["ReactJS"],
      readingTime: "2 phút",
      time: "9 tháng trước",
    },
    overviewContent:
      "Authentication và Authorization là một phần quan trọng trong việc phát triển phần mềm, giúp chúng ta xác thực và phân quyền người dùng trước khi cho người dùng truy cập vào tài nguyên của ứng dụng.",
    imagePoster:
      "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
    categoryList: ["ReactJS"],
    readingTime: "2 phút",
    time: "9 tháng trước",
  },
];

export const MyBlogPage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Title>Bài viết của tôi</Title>
      <Space direction="vertical" size={24} style={{ margin: "2rem 0" }}>
        {blogList.map((blog, index) => (
          <Link to={`/blog-detail/${blog.id}`}>
            <BlogItem key={index} blog={blog} />
          </Link>
        ))}
      </Space>
      <Pagination style={{ float: "right" }} defaultCurrent={1} total={50} />
    </div>
  );
};
