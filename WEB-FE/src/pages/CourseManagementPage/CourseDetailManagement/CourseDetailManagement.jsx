import {
  ArrowLeftOutlined,
  EditOutlined,
  PlayCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { Button, Collapse, List, Popconfirm, Typography, message } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getAllChapterInCourseSelector,
  getAllLessonInCourseSelector,
  getCourseByIdSelector,
  getDetailChapterInCourseSelector,
  getLoadingSelector,
} from "../../../redux/selectors";
import {
  deleteChapterInCourse,
  deleteLessonInChapter,
  fetchCourseIDGraphQL,
  getDetailChapterCourse,
} from "../../../redux/slices/courseSlice";
import AddChapterForm from "./AddChapterForm/AddChapterForm";
import AddLessonForm from "./AddLessonForm/AddLessonForm";
import AddQuizForm from "./AddQuizForm/AddQuizForm";
import { AddVideoForm } from "./AddVideoForm/AddVideoForm";

const { Text, Title } = Typography;

export const CourseDetailManagement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

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
  // const [isOpen, setIsOpen] = useState();

  // console.log("chapterList", chapterList);
  console.log("lessonList", lessonList);
  console.log("chapterDetail", chapterDetail);

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

  const confirm = (id) => {
    console.log("id lesson", id);
    dispatch(deleteLessonInChapter(id)).then(() =>
      dispatch(fetchCourseIDGraphQL(id))
    );
    message.success("Bài học đã được xóa thành công!");
    window.location.reload();
  };
  const cancel = (e) => {
    e.stopPropagation();
    console.log(e);
  };

  const handleCollapseChange = (chapterId) => {
    setActiveKey(activeKey === chapterId ? null : chapterId);
    dispatch(getDetailChapterCourse(chapterId));
    setChapterId(chapterId);
  };

  const onFetch = () => {
    console.log("chạy vô fetch");
    dispatch(fetchCourseIDGraphQL(id));
  };

  console.log("chapters", chapters);

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <Link to="/course-management">
          <Button>
            <ArrowLeftOutlined />
          </Button>
        </Link>
        <Title style={{ margin: "0px 20px" }} level={3}>
          {courses && courses.title}
          <Link to={`/edit-course/${id}`}>
            <EditOutlined style={{ fontSize: "20px" }} />
          </Link>
        </Title>
      </div>

      <Text>{courses && courses.description}</Text>
      <AddChapterForm
        style={{ margin: "20px 0px" }}
        buttonType="primary"
        buttonName="Thêm chương"
        courseId={id}
        disabled={isLoading}
        onFetch={onFetch}
      />

      <Title level={4}>Chương khóa học</Title>

      <div style={{ width: "100%" }}>
        {!chapterList && <Title level={3}>Not chapter exist</Title>}
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

                      <div>
                        <AddChapterForm
                          isEdit={true}
                          style={{ display: "inline-block" }}
                          buttonType="default"
                          buttonName="Sửa Chương"
                          chapterName={chapter.chapter_name}
                          chapterOrder={chapter.chapter_order}
                          chapterId={chapter.id}
                          onFetch={onFetch}
                        />
                        <Popconfirm
                          title="Delete a chapter"
                          description="Are you sure to delete this chapter?"
                          onConfirm={() =>
                            dispatch(deleteChapterInCourse(chapter.id)).then(
                              () => {
                                window.location.reload();
                                message.success(
                                  "Chapter deleted successfully!"
                                );
                              }
                            )
                          }
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            style={{ marginLeft: "10px" }}
                            danger
                          >
                            Xóa
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  ),
                  children: (
                    <>
                      {lessons &&
                        Array.isArray(lessons) &&
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
                            actions={[
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {lessonItem.type_lesson === "video" && (
                                  <AddVideoForm
                                    lessonId={lessonItem.id}
                                    chapterId={lessonItem.course_chapter_id}
                                    courseId={id}
                                  />
                                )}
                                {lessonItem.type_lesson === "quiz" &&
                                lessonItem.video_id === "No Video Available" ? (
                                  <AddQuizForm
                                    isEdit={true}
                                    passCondition={lessonItem.pass_condition}
                                    quiz={lessonItem.quiz}
                                    lessonId={lessonItem.id}
                                  />
                                ) : (
                                  <AddQuizForm
                                    passCondition={lessonItem.pass_condition}
                                    quiz={lessonItem.quiz}
                                    lessonId={lessonItem.id}
                                  />
                                )}
                                <AddLessonForm
                                  isEdit={true}
                                  buttonName="Chỉnh sửa bài học"
                                  lesson={lessonItem}
                                  lessonId={lessonItem.id}
                                />
                                <Popconfirm
                                  title="Xóa bài học"
                                  description="Bạn có chắc chắn xóa bài học này?"
                                  onConfirm={() => confirm(lessonItem.id)}
                                  onCancel={cancel}
                                  okText="Có"
                                  cancelText="Không"
                                >
                                  <Button
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ marginLeft: "10px" }}
                                    danger
                                  >
                                    Xóa
                                  </Button>
                                </Popconfirm>
                              </div>,
                            ]}
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
                      {chapterId && (
                        <AddLessonForm
                          buttonName="Thêm Bài Học"
                          chapterId={chapterId}
                          lessons={lessons}
                          courseId={id}
                          disabled={isLoading}
                          onFetch={onFetch}
                        />
                      )}
                    </>
                  ),
                },
              ]}
            />
          ))}
      </div>
    </div>
  );
};
