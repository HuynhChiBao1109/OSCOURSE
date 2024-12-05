import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, Space, Typography } from "antd";
import React from "react";

const { Text, Title, Paragraph } = Typography;

export const ListBlogItem = ({ blog }) => {
  return (
    <Card
      style={{
        width: "100%",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ width: "60%" }}>
          <Avatar shape="circle" size={34} src={blog.author.avatar} />
          <Text strong style={{ marginLeft: "0.5rem" }}>
            {blog.author.name}
          </Text>
          <Title style={{ marginTop: "0.5rem" }} level={4}>
            {blog.title}
          </Title>
          <Paragraph
            ellipsis={{
              rows: 2,
            }}
            style={{ width: "100%", fontSize: "16px" }}
          >
            {blog.overviewContent}
          </Paragraph>
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            {blog.categoryList.map((category, index) => (
              <span
                style={{
                  marginRight: "5px",
                  padding: "5px 10px",
                  fontWeight: "bold",
                  borderRadius: "1rem",
                  backgroundColor: "#f5f5f5",
                  width: "fit-content",
                }}
              >
                {category}
              </span>
            ))}
            &nbsp;&bull;&nbsp;
            <Text>{blog.time}</Text>
            &nbsp;&bull;&nbsp;
            <Text>{blog.readingTime}</Text>
          </div>
        </div>
        <div style={{ width: "40%" }}>
          <img
            style={{
              float: "right",
              borderRadius: "1rem",
              width: "12rem",
              height: "7rem",
              objectPosition: "center",
              objectFit: "cover",
            }}
            src={blog.imagePoster}
            alt="poster"
          />
        </div>
      </div>
    </Card>
  );
};
