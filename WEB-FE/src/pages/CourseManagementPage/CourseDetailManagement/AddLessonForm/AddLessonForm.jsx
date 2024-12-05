import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  TimePicker,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLessonInCourseSelector,
  getCourseByIdSelector,
} from "../../../../redux/selectors";
import {
  addLessonCourse,
  getDetailChapterCourse,
  putLessonCourse,
} from "../../../../redux/slices/courseSlice";

const { Option } = Select;
const { Title, Text } = Typography;

const AddLessonForm = ({
  buttonName,
  buttonType,
  isEdit,
  lesson,
  chapterId,
  lessons,
  onFetch,
  lessonId,
  lessonName,
}) => {
  const [form] = Form.useForm();
  const [lessonType, setLessonType] = useState(null);
  const [lessonCourse, setLessonCourse] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonExist, setLessonExist] = useState(false);
  const [questions, setQuestions] = useState([{ id: 1 }]);

  console.log("Edit có không", isEdit);

  const dispatch = useDispatch();
  const courseDetail = useSelector(getCourseByIdSelector);

  useEffect(() => {
    if (courseDetail) {
      setLessonCourse(courseDetail.chapter.lessons);
    }
  }, []);

  useEffect(() => {
    if (chapterId) {
      dispatch(getDetailChapterCourse(chapterId));
    }
  }, [dispatch, chapterId]);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        lesson_name: lesson.lesson_name,
        type_lesson: lesson.type_lesson,
      });
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onTypeChange = (value) => {
    setLessonType(value);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values) => {
    if (isEdit) {
      const updateData = {
        ...values,
        id: lessonId,
      };
      console.log("lessons", updateData);
      dispatch(putLessonCourse(updateData));
      form.resetFields();
      setIsModalOpen(false);
      message.success("Update lesson successfully!");
      window.location.reload();
    }
    const lessonOrderInput = lessons.length + 1;

    const newData = {
      ...values,
      lesson_order: lessonOrderInput,
      course_chapter_id: chapterId,
    };
    console.log("lessons", newData);
    dispatch(addLessonCourse(newData));
    form.resetFields();
    setIsModalOpen(false);
    message.success("Create lesson successfully!");
    window.location.reload();
  };

  return (
    <>
      <Button
        style={{ display: "inline-block" }}
        type={buttonType}
        onClick={showModal}
      >
        {buttonName}
      </Button>
      <Modal
        destroyOnClose={true}
        title={
          <Title level={3}>{isEdit ? "Sửa bài học" : "Thêm bài học"}</Title>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        maskClosable={false}
        width={1000}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
      >
        <Form
          form={form}
          layout="vertical"
          name="addLessonForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Lesson Name"
            name="lesson_name"
            rules={[{ required: true, message: "Vui lòng nhập tên bài học!" }]}
          >
            <Input size="large" />
          </Form.Item>

          {!isEdit && (
            <>
              <Form.Item
                label="Time expect"
                name="time_expect"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời gian dự tính!",
                  },
                ]}
              >
                <TimePicker
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="HH:mm:ss"
                  format="HH:mm:ss"
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type_lesson"
                rules={[
                  { required: true, message: "Vui lòng chọn loại bài học!" },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Type of lesson"
                  onChange={onTypeChange}
                >
                  <Option value="video">Video</Option>
                  <Option value="quiz">Quiz</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item wrapperCol={{ offset: 21, span: 3 }}>
            <Button size="large" type="primary" htmlType="submit">
              {isEdit ? "Sửa bài học" : "Thêm bài học"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddLessonForm;
