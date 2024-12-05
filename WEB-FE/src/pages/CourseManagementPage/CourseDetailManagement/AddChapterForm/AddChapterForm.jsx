import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Typography, message } from "antd";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addChapterCourse,
  fetchCourseIDGraphQL,
  updateChapterCourse,
} from "../../../../redux/slices/courseSlice";
import { getCourseByIdSelector } from "../../../../redux/selectors";

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

const AddChapterForm = ({
  buttonType,
  buttonName,
  style,
  isEdit,
  chapterName,
  onFetch,
  chapterId,
  chapterOrder,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const courseDetail = useSelector(getCourseByIdSelector);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [course, setCourse] = useState();

  useEffect(() => {
    if (id) {
      dispatch(fetchCourseIDGraphQL(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (courseDetail) {
      setCourse(courseDetail.chapter);
    }
  }, [courseDetail]);

  useEffect(() => {
    if (isEdit && chapterName && chapterOrder) {
      form.setFieldsValue({
        chapter_name: chapterName,
      });
    }
  }, [isEdit, chapterName, chapterOrder, form]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    console.log("chapter order", values.chapter_order);
    if (isEdit) {
      const updateData = {
        ...values,
        course_id: id,
        id: chapterId,
        chapter_order: chapterOrder,
      };
      dispatch(updateChapterCourse(updateData));
      form.resetFields();
      setIsModalVisible(false);
      message.success("Chapter updated successfully!");
    } else {
      const chapterOrderInput = course.length + 1;

      const newData = {
        ...values,
        course_id: id,
        chapter_order: chapterOrderInput,
      };
      dispatch(addChapterCourse(newData));
      form.resetFields();
      setIsModalVisible(false);
      message.success("Chapter added successfully!");
      window.location.reload();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ ...style }}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          showModal();
        }}
        type={buttonType}
      >
        {buttonName}
      </Button>
      <Modal
        destroyOnClose
        title={isEdit ? "Update Chapter" : "Add Chapter"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null} // Hide the default footer
      >
        <Form
          {...layout}
          form={form}
          name="addChapterForm"
          initialValues={{ chapter_order: chapterOrder }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Chapter Name"
            name="chapter_name"
            rules={[{ required: true, message: "Vui lòng nhập tên chương!" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update Chapter" : "Add Chapter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddChapterForm;
