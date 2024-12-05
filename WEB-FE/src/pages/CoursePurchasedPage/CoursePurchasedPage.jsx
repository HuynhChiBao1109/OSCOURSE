import React from "react";
import { CourseCard } from "./CourseCategory/CourseCategory";

export const CoursePurchasedPage = () => {
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
      {
        title: "NodeJS Pro",
        progress: 10,
      },
    ],
  };
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <CourseCard
        coursePurchased={true}
        title={coursePurchased.title}
        courses={coursePurchased.courses}
      />
    </div>
  );
};
