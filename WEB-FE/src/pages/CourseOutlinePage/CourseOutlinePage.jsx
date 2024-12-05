import {
  CheckOutlined,
  PlayCircleFilled,
  QuestionCircleFilled,
  ScheduleFilled,
  SketchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Collapse,
  Image,
  List,
  Row,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllChapterInCourseSelector,
  getAllLessonInCourseSelector,
  getCourseByIdSelector,
  getDetailChapterInCourseSelector,
  getLoadingSelector,
} from "../../redux/selectors";
import {
  fetchCourseIDGraphQL,
  getDetailChapterCourse,
} from "../../redux/slices/courseSlice";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const CourseOutlinePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const courseDetail = useSelector(getCourseByIdSelector);
  const chapterDetail = useSelector(getDetailChapterInCourseSelector);
  const chapterList = useSelector(getAllChapterInCourseSelector);
  const isLoading = useSelector(getLoadingSelector);
  const lessonList = useSelector(getAllLessonInCourseSelector);

  const [activeKey, setActiveKey] = useState(null);
  const [courses, setCourses] = useState();
  const [chapters, setChapters] = useState();
  const [chapterId, setChapterId] = useState();
  const [lessons, setLessons] = useState();

  console.log("id", id);
  console.log("courses", courses);
  console.log("chapterDetail", chapterDetail);
  console.log("chapterId", chapterId);

  useEffect(() => {
    dispatch(fetchCourseIDGraphQL(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (courseDetail) {
      setCourses(courseDetail);
      setChapters(chapterList);
    }
  }, [courseDetail, chapterList]);

  useEffect(() => {
    if (lessonList) {
      setLessons(lessonList);
    }
  }, [lessonList]);

  const handleCollapseChange = (chapterId) => {
    setActiveKey(activeKey === chapterId ? null : chapterId);
    dispatch(getDetailChapterCourse(chapterId));
    setChapterId(chapterId);
  };

  const formatDate = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Định dạng ngày/tháng/năm
  };

  if (!courses) return <Spin />;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <Row>
        <Col
          sm={24}
          md={17}
          style={{
            padding: "10px",
          }}
        >
          <Title>{courses.title}</Title>
          <Text>{courses.description}</Text>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              flexWrap: "wrap",
              gap: "5px",
              flex: 1,
            }}
          ></div>
          <Title style={{ marginTop: "2rem" }} level={3}>
            Nội dung khóa học
          </Title>
          <div style={{ width: "100%" }}>
            {!chapters && <Title level={3}>Chương không tồn tại</Title>}
            {chapters &&
              Array.isArray(chapters) &&
              chapters.map((chapter, index) => (
                <Collapse
                  key={chapter.id}
                  activeKey={activeKey ? [`${activeKey}`] : null}
                  collapsible="header"
                  onChange={() => handleCollapseChange(chapter.id)}
                  style={{ marginBottom: "1rem" }}
                  items={[
                    {
                      key: chapter.id,
                      label: (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Title style={{ margin: "0" }} level={5}>
                            {chapter.chapter_order}. {chapter.chapter_name}
                          </Title>
                        </div>
                      ),
                      children: (
                        <>
                          {lessons &&
                            lessons.length > 0 &&
                            lessons.map((lessonItem, index) => (
                              <List.Item
                                key={index + 1}
                                style={{
                                  fontSize: "16px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  paddingLeft: "1rem",
                                  marginBottom: "1rem",
                                }}
                              >
                                <div>
                                  {lessonItem.type_lesson === "video" ? (
                                    <PlayCircleFilled
                                      style={{ color: "#f16239" }}
                                    />
                                  ) : (
                                    <QuestionCircleFilled />
                                  )}
                                  <Text style={{ marginLeft: "10px" }}>
                                    {lessonItem.lesson_order}.{" "}
                                    {lessonItem.lesson_name}
                                  </Text>
                                  <Text>
                                    {" "}
                                    •{" "}
                                    {dayjs(lessonItem.time_expect).format(
                                      "HH:mm:ss"
                                    )}
                                  </Text>
                                </div>
                              </List.Item>
                            ))}
                        </>
                      ),
                    },
                  ]}
                />
              ))}
          </div>
        </Col>
        <Col sm={24} md={7}>
          <Image
            style={{
              borderRadius: "12px",
            }}
            width={"460px"}
            height={"259px"}
            src={courses.thumbnail}
          />
          <Title
            level={4}
            style={{
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            Xem giới thiệu khoá học
            <br />
          </Title>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button
              style={{
                backgroundColor: "#4096ff",
                fontWeight: "bold",
                width: "200px",
                marginTop: "20px",
              }}
              shape="round"
              type="primary"
              size="large"
              danger
              onClick={() => {
                navigate(`/payment/${courses.id}`);
                // console.log("Vào đây");
              }}
            >
              Đăng ký học
            </Button>
          </div>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Button
              style={{
                backgroundColor: "#4096ff",
                fontWeight: "bold",
                width: "200px",
                marginTop: "20px",
              }}
              shape="round"
              type="primary"
              size="large"
              danger
              onClick={() => {
                navigate(`/learn-course/${courses.id}`);
                // console.log("Vào đây");
              }}
            >
              Học
            </Button>
          </div>
          <div
            style={{
              fontSize: "16px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: "5px",
              paddingLeft: "3rem",
              marginTop: "1.5rem",
              color: "#494949",
            }}
          >
            <div>
              <FontAwesomeIcon icon={faGraduationCap} />
              <Text style={{ marginLeft: "10px" }}>Trình độ cơ bản</Text>
            </div>
            <div>
              <TeamOutlined />
              <Text style={{ marginLeft: "10px" }}>
                Số lượng được người đăng ký{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {courses.total_student_join}
                </Text>
              </Text>
            </div>
            <div>
              <SketchOutlined />
              <Text style={{ marginLeft: "10px" }}>Học mọi lúc, mọi nơi</Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
