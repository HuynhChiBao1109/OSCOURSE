import { Card, Progress, Skeleton } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatPrice, increaseBy40Percent } from "../../utils";

import styles from "./CourseCategory.module.css";

export const CourseCategory = ({ courses, coursePurchased }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const progressColor = {
    "0%": "#ff4d4f",
    "50%": "#1677ff",
    "100%": "#52c41a",
  };

  setTimeout(() => {
    setLoading(false);
  }, 100);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className={styles.courseContainer}>
      <Card
        className={styles.courseCard}
        cover={
          <img
            alt="example"
            style={{ width: 250, height: 120, objectFit: "cover" }}
            src={courses.thumbnail}
          />
        }
        onClick={() => navigate(`/course/course-outline/${courses.id}`)}
      >
        <Meta
          className={styles.courseCardBody}
          title={<div className={styles.courseTitle}>{courses.title}</div>}
          description={
            courses.price ? (
              <div className={styles.coursePrice}>
                <span style={{ marginRight: 10 }}>
                  {formatPrice(increaseBy40Percent(courses.price))} đ
                </span>
                <span>{formatPrice(courses.price)} đ</span>
              </div>
            ) : (
              <Progress
                percent={courses.progress}
                strokeColor={progressColor}
                showInfo={false}
                status="active"
              />
            )
          }
        />
      </Card>
    </div>
  );
};
