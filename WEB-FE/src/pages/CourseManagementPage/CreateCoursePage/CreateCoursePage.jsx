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
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCourseGraphQL } from "../../../redux/slices/courseSlice";
import { toast } from "react-toastify";
import { createClient } from "@supabase/supabase-js";
import {
  getUserLoginSelector,
  getUserSelector,
} from "../../../redux/selectors";

const { Title, Text } = Typography;

const supabaseUrl = "http://10.0.0.178:7080";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

const supabase = createClient(supabaseUrl, supabaseKey);

export const CreateCoursePage = () => {
  const dispatch = useDispatch();

  const [thumbnail, setThumbnail] = useState({
    key: "",
    imagePreview: "",
  });
  const [targets, setTargets] = useState([]);
  const [requires, setRequires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expiredDate, setExpiredDate] = useState(new Date());

  const userSelector = useSelector(getUserLoginSelector);

  const inputRef = useRef(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSetImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Set state or perform any other action with the image preview
      setThumbnail({ ...thumbnail, imagePreview: reader.result });
    };
    if (file.originFileObj) {
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.file;
    if (file) {
      try {
        handleSetImagePreview(file);
        console.log(
          `${userSelector.userId !== "" && userSelector.userId}/${file.name}`
        );

        const response = await supabase.storage
          .from("assets")
          .upload(
            `${userSelector.id !== "" && userSelector.id}/${file.name}`,
            file,
            {
              upsert: true,
            }
          );

        if (response.error) {
          console.error("Error uploading file:", response.error.message);
        } else if (response.data) {
          const keyImg = response.data.fullPath;
          setThumbnail((prev) => ({
            ...thumbnail,
            key: keyImg,
          }));
          console.log("Tải tài liệu thành công:", response.data);
        } else {
          console.error("Định dạng phản hồi không xác định:", response);
        }
      } catch (error) {
        console.error("Lỗi tải tập tin lên:", error.message);
      }
    }
  };

  useEffect(() => {
    console.log("thumbnail", thumbnail);
    // ComponentWillUnmount
    return () => {
      // Thu hồi URL khi component bị unmount để tránh rò rỉ bộ nhớ
      if (thumbnail.imagePreview !== "") {
        URL.revokeObjectURL(thumbnail.imagePreview);
      }
    };
  }, [thumbnail]);

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
    console.log("submit form");

    if (thumbnail.imagePreview === "") {
      toast.error("Vui lòng tải lên thumbnail!");
      return false;
    }
    const newData = {
      ...values,
      target: targets,
      requirement: requires,
      thumbnail: thumbnail.imagePreview,

      // imageUrl: imageUrl,
    };
    dispatch(createCourseGraphQL(newData))
      .then((res) => {
        if (res.payload == "Khóa học đã tồn tại!!!") {
          toast.warning("Khóa học đã tồn tại!!");
        } else {
          toast.success("Khóa học được tạo thành công");
          form.setFieldsValue({
            title: "",
            category: "",
            description: "",
            price: "",
            requirement: [""],
            target: [""],
            thumbnail: "",
            time_available: "",
          });
          setRequires("");
          setTargets("");
          setThumbnail("");
          navigate("/course-management").then((res) =>
            window.location.reload()
          );
        }
      })
      .catch((err) => {
        toast.error("Đã xảy ra lỗi khi tạo khóa học");
      });
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
        <Link to="/course-management">
          <Button>
            <ArrowLeftOutlined />
          </Button>
        </Link>
        <Title style={{ margin: "0px 10px" }} level={3}>
          Tạo khóa học
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
            label="Tiêu đề"
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
            label="Mô tả"
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
            label="Mục tiêu"
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
            label="Yêu cầu"
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
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[
              {
                required: true,
                message: "Hãy chọn danh mục",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Hãy chọn danh mục"
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "Backend",
                  label: "Backend",
                },
                {
                  value: "Frontend",
                  label: "Frontend",
                },
                {
                  value: "Pro",
                  label: "Pro",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              {
                type: "number",
                min: 1000, // Set the minimum value
                message: "Hãy nhập giá từ 1000 trở lên nhé!",
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
            label="Thời gian hết hạn khóa học"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập thời gian hết hạn của khóa học!",
              },
              {
                type: "number",
                min: 1,
                message: "Vui lòng nhập số từ 1 trở lên!",
              },
            ]}
            name="time_available"
          >
            <InputNumber
              prefix="Tháng: "
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
              Thêm khóa học mới
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
              onChange={handleFileChange}
            >
              {thumbnail.imagePreview !== "" ? (
                <div
                  style={{
                    width: "500px",
                    height: "300px",
                  }}
                >
                  <img
                    src={thumbnail.imagePreview}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: "7px",
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
                    Tải lên
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
