import React from 'react'
import styles from "./CoursePurchased.module.css"
import { Avatar, Card, Progress, Skeleton } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';

export const CoursePurchased = ({
    course
}) => {
   
  const handleOpenCourse = () => {
        console.log("Open course")
  }

  return (
    <div>
         {/* <Card
            onClick={handleOpenCourse}
            className={styles.courseCard}
            style={{ width: 250}}
            cover={
            <img
                style={{height:100,objectFit:'cover'}}
                alt="example"
                src="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
            />
            }
        >
            <Meta
            
            title={course.title}
            description={
                <Progress percent={course.progress} showInfo={false} />
            }
            />
        </Card> */}
        <div className={styles.courseCard}>
            <img
                alt="example"
                src="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
            />
            <div style={{width:200}}>
                <div>{course.title}</div>
                <p>Học cách đây 2 tuần</p>
                <Progress percent={course.progress} showInfo={false} />
            </div>
        </div>
    </div>
  )
}
