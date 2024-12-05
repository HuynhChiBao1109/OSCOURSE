import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getUserSelector } from "../../../../redux/selectors";
import UploadVideo from "../AddLessonForm/UploadVideo/UploadVideo";

export const AddVideoForm = ({ courseId, chapterId, lessonId }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userSelector = useSelector(getUserSelector);
  const lessonForm = {
    course_id: courseId,
    course_chapter_id: chapterId,
    lession_id: lessonId,
  };
  console.log("lessonForm at AddVideoForm", lessonForm);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <>
      <Button
        type="default"
        onClick={showModal}
        style={{ marginRight: "10px" }}
      >
        Thêm video
      </Button>
      <Modal
        maskClosable={false}
        width={700}
        title="Add Video"
        open={isModalOpen}
        form={form}
        layout="vertical"
        onOk={handleOk}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handleCancel}
        styles={{
          body: { maxHeight: "60vh", overflow: "auto" },
        }}
      >
        <Form layout="vertical" form={form} name="uploadVideoForm">
          <Form.Item
            label="Video"
            name="video"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Please upload video!" }]}
          >
            <UploadVideo lessonForm={lessonForm} />
          </Form.Item>
          <Form.Item
            initialValue={userSelector.userId !== "" && userSelector.userId}
            name="userId"
            hidden
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
