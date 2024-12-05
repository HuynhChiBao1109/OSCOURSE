import { EllipsisOutlined, MoreOutlined } from "@ant-design/icons";
import { Card, Progress, Tooltip, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { Link } from "react-router-dom";
import AddStudentForm from "./AddStudentForm/AddStudentForm";

const { Title, Text, Paragraph } = Typography;

const fakeData = [
  {
    id: "1",
    title: "HTML & CSS",
    description:
      "This is HTML & CSS course. It contains html, CSS and javascript basic to design the website",
    studentName: "Ninh 8 tuổi",
    progress: 92,
    expiredAt: "12/05/2024",
    thumbnail:
      "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
  },
  {
    id: "2",
    title: "HTML & CSS",
    description:
      "This is HTML & CSS course. It contains html, CSS and javascript basic to design the website",
    studentName: "Ninh 8 tuổi",
    progress: 92,
    expiredAt: "12/05/2024",
    thumbnail:
      "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
  },
  {
    id: "3",
    title: "HTML & CSS",
    description:
      "This is HTML & CSS course. It contains html, CSS and javascript basic to design the website",
    studentName: "",
    progress: 0,
    expiredAt: "12/05/2024",
    thumbnail:
      "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
  },
  {
    id: "4",
    title: "HTML & CSS",
    description:
      "This is HTML & CSS course. It contains html, CSS and javascript basic to design the website",
    studentName: "Ninh 8 tuổi",
    progress: 92,
    expiredAt: "12/05/2024",
    thumbnail:
      "https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png",
  },
];

export const CoursePurchasedParent = () => {
  return (
    <>
      <Title style={{ marginBottom: "40px" }} level={2}>
        Khóa học đã mua
      </Title>

      <div style={{ display: "flex", gap: "20px" }}>
        {fakeData.length > 0 &&
          fakeData.map((course) => (
            <div style={{ position: "relative" }}>
              <AddStudentForm progress={course.progress} />

              <Link to={`/course/course-outline/${course.id}`}>
                <Card
                  hoverable
                  style={{
                    width: 300,
                  }}
                  cover={<img alt="example" src={course.thumbnail} />}
                >
                  <Meta
                    title={course.title}
                    description={
                      <Tooltip title={course.description}>
                        <Paragraph type="secondary">
                          {course.description.length > 100
                            ? course.description.slice(0, 100) + "..."
                            : course.description}
                        </Paragraph>
                        {course.studentName !== "" && (
                          <Text type="warning">
                            Learner: {course.studentName}
                          </Text>
                        )}
                        <br />
                        <Text type="danger">
                          Expired on: {course.expiredAt}
                        </Text>
                      </Tooltip>
                    }
                  />

                  <Progress
                    style={{ marginTop: "10px" }}
                    percent={course.progress}
                    status="active"
                  />
                </Card>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};
