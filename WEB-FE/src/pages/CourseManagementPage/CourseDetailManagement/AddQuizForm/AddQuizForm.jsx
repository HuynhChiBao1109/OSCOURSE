import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import {
  addQuizLessonInChapter,
  putQuizInLesson,
} from "../../../../redux/slices/courseSlice";
const AddQuizForm = ({ lessonId, isEdit, passConditions, quiz }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (isEdit && quiz) {
      form.setFieldsValue({
        items: quiz.map((quiz) => ({
          question: quiz.question,
          answer: quiz.answer,
          option1: quiz.options[0],
          option2: quiz.options[1],
          option3: quiz.options[2],
        })),
      });
    }
  }, [isEdit, quiz]);

  const onFinish = (values) => {
    const quizzes = values.items.map((item) => ({
      answer: item.answer,
      options: [item.option1, item.option2, item.option3],
      question: item.question,
    }));

    // Calculate the total number of answers across all quizzes
    const totalAnswers = quizzes.reduce(
      (total, current) => total + current.answer.trim().length,
      0
    );

    // Assuming the pass condition is 80% of the total answers across all quizzes
    const passCondition = Math.ceil(totalAnswers * 0.8);

    if (isEdit) {
      const updateData = {
        course_lesson_id: lessonId,
        quiz: quizzes,
        pass_condition: passCondition,
      };
      console.log("Lesson ID:", lessonId);
      console.log("Update Data:", updateData);
      dispatch(putQuizInLesson(updateData));
      message.success("Update quiz successfully!");
      form.resetFields();
      setIsModalOpen(false);
      window.location.reload();
    } else {
      const submissionData = {
        id: lessonId,
        quiz: quizzes,
        pass_condition: passCondition,
      };
      console.log("Lesson ID:", lessonId);
      console.log("Submission Data:", submissionData);
      dispatch(addQuizLessonInChapter(submissionData));
      message.success("Create quiz successfully!");
      form.resetFields();
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Button
        type="default"
        onClick={showModal}
        style={{ marginRight: "10px" }}
      >
        {isEdit ? "Sửa quiz" : "Thêm quiz"}
      </Button>
      <Modal
        width={700}
        title="Add Quiz"
        open={isModalOpen}
        form={form}
        layout="vertical"
        onOk={handleOk}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={handleCancel}
        styles={{
          body: { maxHeight: "60vh", overflow: "auto" },
        }}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          form={form}
          name="dynamic_form_complex"
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
          onFinish={onFinish}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Question ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Question"
                      name={[field.name, "question"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập câu hỏi!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Answer"
                      name={[field.name, "answer"]}
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập câu trả lời!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Option 1"
                      name={[field.name, "option1"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập phương án 1!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Option 2"
                      name={[field.name, "option2"]}
                      rules={[
                        {
                          required: true,
                          message: "Please input option 2!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Option 3"
                      name={[field.name, "option3"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập phương án 3!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Thêm mục
                </Button>
              </div>
            )}
          </Form.List>

          <Button
            size="large"
            style={{ float: "right", width: "200px", marginTop: "20px" }}
            type="primary"
            htmlType="submit"
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal>
    </>
  );
};
export default AddQuizForm;
