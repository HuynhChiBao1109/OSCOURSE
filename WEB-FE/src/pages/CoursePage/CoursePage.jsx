import React, { useEffect, useState } from "react";
import styles from "./CoursePage.module.css";
import {
  Button,
  Carousel,
  Input,
  Pagination,
  Select,
  Spin,
  Typography,
  message,
} from "antd";
import { CourseCategory } from "../../components/CourseCategory/CourseCategory";
import banner from "../../assets/images/banner.jpg";
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";

import { useDispatch, useSelector } from "react-redux";
import { getAllCourseSelector } from "../../redux/selectors";
import { fetchCourseGraphQL } from "../../redux/slices/courseSlice";
import { SearchOutlined } from "@ant-design/icons";

export const CoursePage = () => {
  const dispatch = useDispatch();
  const coursesList = useSelector(getAllCourseSelector);
  const [dataList, setDataList] = useState();
  const [searchName, setSearchName] = useState();
  const [category, setCategory] = useState();
  const [paging, setPaging] = useState();

  const { Title } = Typography;

  const pagination = useSelector((state) => state.courseSlice.courses);

  useEffect(() => {
    dispatch(
      fetchCourseGraphQL({ currentPage: 1, pageSize: 12, searchName, category })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log(coursesList);
    setDataList(coursesList);
    setPaging(pagination?.info);
  }, [coursesList]);

  console.log("coursesList", coursesList);
  const handlePageChange = (page) => {
    dispatch(
      fetchCourseGraphQL({
        currentPage: page,
        pageSize: 12,
        searchName,
        category,
      })
    );
  };

  const handleFilterChange = (value) => {
    setCategory(value);
  };

  const handleSearch = () => {
    dispatch(
      fetchCourseGraphQL({
        currentPage: 1,
        pageSize: 12,
        searchName,
        category,
      })
    );
    message.success("Tìm kiếm thành công");
  };

  if (!dataList)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div className={styles.container}>
      <Carousel autoplay style={{ marginBottom: 20 }}>
        <div>
          <div className={styles.sliderContent}>
            <img src={banner} alt="" />
          </div>
        </div>
        <div>
          <div className={styles.sliderContent}>
            <img src={banner1} alt="" />
          </div>
        </div>
        <div>
          <div className={styles.sliderContent}>
            <img src={banner2} alt="" />
          </div>
        </div>
        <div>
          <div className={styles.sliderContent}>
            <img src={banner} alt="" />
          </div>
        </div>
      </Carousel>
      <Title level={1} color="primary">
        KHÓA HỌC ĐANG HOT
      </Title>
      <div style={{ padding: "20px 0" }}>
        <Input
          style={{ width: "20%", marginRight: "10px" }}
          placeholder="Tìm kiếm khóa học"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Select
          style={{ width: "30%", marginRight: "10px" }}
          placeholder="Phân loại"
          value={category}
          onChange={handleFilterChange}
          allowClear
        >
          <Option value="Frontend">Frontend</Option>
          <Option value="Backend">Backend</Option>
          <Option value="Beginner">Beginner</Option>
          <Option value="Pro">Pro</Option>
        </Select>
        <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "20px 0",
        }}
      >
        {coursesList &&
          dataList.map((item, index) => (
            <CourseCategory key={index} courses={item} />
          ))}{" "}
      </div>
      <Pagination
        current={paging?.currentPage}
        total={paging?.totalPage * paging?.pageSize}
        pageSize={paging?.pageSize}
        onChange={handlePageChange}
        style={{ textAlign: "right" }}
      />
    </div>
  );
};
