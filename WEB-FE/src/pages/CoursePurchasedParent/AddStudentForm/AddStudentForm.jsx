import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
const AddStudentForm = ({ progress }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button
        style={{
          position: "absolute",
          top: 14,
          right: 10,
          fontSize: "16px",
          fontWeight: "bold",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
        icon={<MoreOutlined />}
        type="primary"
        onClick={showModal}
      ></Button>
      <Modal
        title="Add Student Form"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ htmlType: "submit", disabled: progress > 0 }}
      >
        <Form name="basic" form={form} wrapperCol={{ span: 24 }}>
          <Form.Item
            label="Student Name"
            name="learnerName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên học sinh!",
              },
            ]}
          >
            <Input disabled={progress > 0} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddStudentForm;
