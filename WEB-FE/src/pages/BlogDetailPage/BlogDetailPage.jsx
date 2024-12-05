import React, { useState } from "react";
import styles from "./BlogDetailPage.module.css";
import {
  EllipsisOutlined,
  HeartFilled,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Modal, Space } from "antd";
import { Link } from "react-router-dom";
import { CommentBlog } from "./CommentBlog/CommentBlog";

const items = [
  {
    key: "1",
    label: <Link to="/blog-detail/edit/1">Chỉnh sửa blog</Link>,
  },
];

export const BlogDetailPage = () => {
  const [like, setLike] = useState(true);
  const [openCmt, setOpenCmt] = useState(false);

  const handleLikeBlog = () => {
    setLike(!like);
  };
  return (
    <div className={styles.blogDetailContainer}>
      <Modal
        title="26 bình luận"
        open={openCmt}
        onOk={() => setOpenCmt(false)}
        onCancel={() => setOpenCmt(false)}
        width={1000}
        footer={null}
      >
        <CommentBlog />
      </Modal>
      <div className={styles.blogDetailLeft}>
        <div>NinhPD</div>
        <div>
          <span>
            <HeartFilled
              onClick={handleLikeBlog}
              className={
                like ? styles.blogIcon : [styles.blogIcon, styles.blogActive]
              }
            />{" "}
            123
          </span>
          <span>
            <MessageOutlined
              onClick={() => setOpenCmt(true)}
              className={styles.blogIcon}
            />{" "}
            200
          </span>
        </div>
      </div>
      <div className={styles.blogDetailCenter}>
        <h2>Cách đưa code lên GitHub và tạo GitHub Pages</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Avatar size="large" icon={<UserOutlined />} />{" "}
            <span style={{ marginLeft: 10, fontWeight: 600 }}>NinhPD</span>
          </div>

          <Dropdown
            menu={{
              items,
            }}
            trigger="click"
          >
            <a style={{ color: "inherit" }} onClick={(e) => e.preventDefault()}>
              <Space>
                <EllipsisOutlined
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className={styles.blogDetailContent}>
          <img
            src="https://files.fullstack.edu.vn/f8-prod/blog_posts/677/615424715714d.png"
            alt=""
          />
          <p>
            Xin các bạn tại F8, khi mình đọc những bài viết trên nhóm F8 thì
            mình thấy có nhiều bạn vẫn không biết đưa code lên GitHub, hoặc bị
            lỗi, hoặc có thể là những bạn mới và đặc biệt là các bạn không biết
            tạo GitHub Pages ( cụ thể là hiển thị ra trang web để cho mọi người
            xem á! ). Ok, hôm nay mình sẽ hướng dẫn cụ thể để cho những bạn
            không biết bấy lâu nay có thể đưa code mình lên GitHub được nhe.
            Mình là Kha, là một thành viên trong nhóm "Học lập trình web (F8 -
            Fullstack.edu.vn)".
          </p>
          <h3>Bước 1: Tạo tài khoản GitHub và download Git</h3>
          <p>
            Ở bước này mình để hai đường dẫn bên dưới các bạn tự thực hiện nhe.
          </p>
          <ul>
            <li>Link GitHub: https://github.com/</li>
            <li>Link download Git: https://git-scm.com/downloads</li>
          </ul>
          <h3>Bước 2: Tạo một repository mới trên Github</h3>
          <p>
            Sau khi các bạn đã thực hiện bước 1 xong, các bạn đăng nhập vào
            GitHub và tạo một repository mới để đưa code lên GitHub. Các bạn
            thực hiện giống như ảnh bên dưới:
          </p>
          <img
            src="https://files.fullstack.edu.vn/f8-prod/blog_posts/677/61542756d65a3.png"
            alt=""
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};
