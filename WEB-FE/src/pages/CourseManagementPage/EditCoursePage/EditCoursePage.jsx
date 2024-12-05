import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCourseGraphQL } from "../../../redux/slices/courseSlice";

const { Title, Text } = Typography;

const fakeData = {
  title: "HTML&CSS Pro",
  description: "This is a best seller course",
  targets: ["Biết đọc", "Biết nói", "Biết viết"],
  requirements: ["Chăm chỉ", "Chăm ngoan", "Nghe lời"],
  category: "Html",
  price: 50000,
  timeAvailable: 5,
  thumbnail:
    "https://i.pinimg.com/564x/0e/48/2e/0e482efba911b30ef9d6cbe70ad0c25a.jpg",
};

export const EditCoursePage = () => {
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState();
  const [targets, setTargets] = useState([]);
  const [requires, setRequires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expiredDate, setExpiredDate] = useState(new Date());

  const inputRef = useRef(null);

  const [form] = Form.useForm();

  useEffect(() => {
    if (fakeData) {
      form.setFieldsValue({
        title: fakeData.title,
        description: fakeData.description,
        category: fakeData.category,
        price: fakeData.price,
        timeAvailable: fakeData.timeAvailable,
      });
      setTargets(fakeData.targets);
      setRequires(fakeData.requirements);
      setImageUrl(fakeData.thumbnail);
    }
  }, []);

  useEffect(() => {
    // ComponentWillUnmount
    return () => {
      // Thu hồi URL khi component bị unmount để tránh rò rỉ bộ nhớ
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleChange = (info) => {
    // Khi file bắt đầu upload
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    // Khi file đã được chọn và không có quá trình upload lên server
    if (info.file.status === "done" || info.file.status === "error") {
      setLoading(false);
      // Tạo một URL cho file để có thể hiển thị trực tiếp
      const fileUrl = URL.createObjectURL(info.file.originFileObj);
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageUrl(fileUrl);
    }
  };

  const onFinish = (values) => {
    const newData = {
      values: {
        ...values,
        target: targets,
        requirement: requires,
        thumbnail: imageUrl,
        expired_time: expiredDate,
      },

      // imageUrl: imageUrl,
    };
    console.log("new value", newData);
    dispatch(createCourseGraphQL(newData));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleAddTagTarget = (e) => {
    e.preventDefault();
    let newTarget = e.target.value;
    if (
      !targets.find((target) => target === newTarget) &&
      newTarget.trim() != ""
    ) {
      setTargets([...targets, newTarget]);
    }
    form.setFieldValue("target", ""); //clear input after add tag
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    let newRequirement = e.target.value;
    if (
      !requires.find((require) => require === newRequirement) &&
      newRequirement.trim() != ""
    ) {
      setRequires([...requires, newRequirement]);
    }
    form.setFieldValue("requirement", ""); //clear input after add tag
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setExpiredDate(date);
  };

  console.log("date", expiredDate);
  const courseId = "123";
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "2rem",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}
      >
        <Link to={`/course-detail-management/${courseId}`}>
          <Button>
            <ArrowLeftOutlined />
          </Button>
        </Link>
        <Title style={{ margin: "0px 10px" }} level={3}>
        Chỉnh sửa khóa học
        </Title>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
            offset: 0,
          }}
          wrapperCol={{
            span: 16,
            offset: 0,
          }}
          style={{
            width: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiêu đề của bạn!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả của bạn!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Target"
            name="target"
            rules={[
              {
                required: targets.length == 0,
                message: "Vui lòng nhập mục tiêu của bạn!",
              },
            ]}
          >
            <Input
              allowClear
              ref={inputRef}
              onPressEnter={(e) => handleAddTagTarget(e)}
              size="large"
            />
          </Form.Item>

          {targets.length > 0 && (
            <div>
              {targets.map((target) => {
                return (
                  <div key={target} style={{ width: "100%", margin: "10px" }}>
                    <Tag
                      color="green"
                      style={{ padding: "10px", fontSize: "16px" }}
                      closeIcon
                      onClose={(e) => {
                        e.preventDefault();
                        let newTags = targets.filter((tag) => tag !== target);
                        setTargets(newTags);
                      }}
                    >
                      {target}
                    </Tag>
                  </div>
                );
              })}
            </div>
          )}

          <Form.Item
            label="Requirement"
            name="requirement"
            rules={[
              {
                required: requires.length == 0,
                message: "Vui lòng nhập mục tiêu của bạn!",
              },
            ]}
          >
            <Input
              allowClear
              ref={inputRef}
              onPressEnter={(e) => handleAddRequirement(e)}
              size="large"
            />
          </Form.Item>

          {requires.length > 0 && (
            <div>
              {requires.map((require) => {
                return (
                  <div key={require} style={{ width: "100%", margin: "10px" }}>
                    <Tag
                      color="magenta"
                      style={{ padding: "10px", fontSize: "16px" }}
                      closeIcon
                      onClose={(e) => {
                        e.preventDefault();
                        let newTags = requires.filter((tag) => tag !== require);
                        setRequires(newTags);
                      }}
                    >
                      {require}
                    </Tag>
                  </div>
                );
              })}
            </div>
          )}
          <Form.Item label="Category" name="category">
            <Select
              size="large"
              placeholder="Chọn danh mục"
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "Html",
                  label: "Html",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                type: "number",
                min: 1000, // Set the minimum value
                message: "Hãy nhập số từ 1000 trở lên nhé!",
              },
              {
                required: true,
                message: "Vui lòng nhập giá khóa học!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} size="large" type="number" />
          </Form.Item>

          <Form.Item
            label="Time available"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập thời gian rảnh của bạn!",
              },
              {
                type: "number",
                min: "1",
                message: "Vui lòng nhập số từ 1 trở lên!",
              },
            ]}
            name="timeAvailable"
          >
            <InputNumber
              prefix="Months: "
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Button
              size="large"
              style={{ width: "10rem", float: "right" }}
              type="primary"
              htmlType="submit"
            >
              Add New Course
            </Button>
          </Form.Item>
        </Form>

        <div style={{ width: "50%" }}>
          <Title level={1}>Thumbnail</Title>
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            <Upload
              name="avatar"
              className="avatar-uploader"
              showUploadList={false}
              // beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <div
                  style={{
                    width: "500px",
                    height: "300px",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: "7px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ) : (
                <button
                  style={{
                    border: "1px dashed gray",
                    padding: "10px",
                    width: "500px",
                    height: "300px",
                    borderRadius: "7px",
                    background: "none",
                    cursor: "pointer",
                  }}
                  type="button"
                >
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              )}
            </Upload>
          </div>
        </div>
      </div>
    </div>
  );
};
