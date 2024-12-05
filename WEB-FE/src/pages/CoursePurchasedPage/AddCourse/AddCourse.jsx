import React from 'react'
import styles from "./AddCourse.module.css"
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export const AddCourse = () => {
    const navigate = useNavigate()
  return (
    <div className={styles.addCourse}>
        <PlusCircleOutlined style={{marginBottom:20, fontSize:20}} />
        <Button onClick={() => navigate("/course")}>Thêm Khóa Học</Button>
    </div>
  )
}
