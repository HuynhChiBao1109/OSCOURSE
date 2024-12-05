import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Steps,
  Select,
  DatePicker,
  Typography,
} from "antd";
import { useDispatch } from "react-redux";
import {
  checkChildrenOrParentExistGraphQL,
  createChildrenGraphQL,
  createParentGraphQL,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";

const RegisterForm = ({
  isRegisterModalOpen,
  handleRegisterOk,
  handleRegisterCancel,
  openLoginModal,
}) => {
  const { Step } = Steps;
  const { Option } = Select;
  const { Title } = Typography;

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [parentInfo, setParentInfo] = useState({});
  const [childInfo, setChildInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const initialValueParent = {
    name: "",
    date_of_birth: null,
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const initialValueChild = {
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    date_of_birth: null,
    gender: "",
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCancelModal = () => {
    form.resetFields();
    form1.resetFields();
    setCurrentStep(0);
    handleRegisterCancel();
  };

  const handleFinish = () => {
    const parentFormInfo = form.getFieldsValue(true);
    const childrenFormInfo = form1.getFieldsValue(true);
    console.log("Parent Information:", parentFormInfo);
    console.log("Child Information:", childrenFormInfo);
    const userInfo = {
      childrenUsername: form1.getFieldValue("username"),
      parentEmail: form.getFieldValue("email"),
    };
    console.log(userInfo);
    try {
      setIsLoading(true);
      //check whether children or parent exist
      dispatch(checkChildrenOrParentExistGraphQL(userInfo))
        .then((response) => {
          //create parent

          if (
            response.type.substring(response.type.lastIndexOf("/") + 1) ===
            "rejected"
          ) {
            toast.error(response.error.message);
            setIsLoading(false);
            return false;
          }
          dispatch(createParentGraphQL(parentFormInfo))
            .then((response) => {
              //create children
              console.log("Parent", response);
              if (
                response.type.substring(response.type.lastIndexOf("/") + 1) ===
                "rejected"
              ) {
                toast.error(response.error.message);
                setIsLoading(false);
                return false;
              }
              toast.success("Parent created successfully!");
              const newChildrenForm = {
                ...childrenFormInfo,
                parent_id: response.payload.id,
              };
              console.log("newChildrenForm", newChildrenForm);
              dispatch(createChildrenGraphQL(newChildrenForm))
                .then((response) => {
                  console.log("Children", response);
                  if (
                    response.type.substring(
                      response.type.lastIndexOf("/") + 1
                    ) === "rejected"
                  ) {
                    toast.error("Children created failed!");
                    setIsLoading(false);
                    return false;
                  }
                  setIsLoading(false);
                  toast.success("Children created successfully!");
                  handleCancelModal();
                })
                .catch((err) => {
                  toast.error("Create children failed!");
                  console.log(err);
                });
            })
            .catch((err) => {
              toast.error("Create parent failed!");
              console.log(err);
            });
        })
        .catch((err) => {
          toast.error("Exist!");
          console.log(err);
        });
    } catch (error) {
      toast.error("Having a error occurred!");
      console.log(error);
    }
  };

  const handleParentInfoChange = (name, value) => {
    console.log(`${name}`, value);
    if (name === "date_of_birth") {
      const dateObj = new Date(value);
      setParentInfo({ ...childInfo, [name]: dateObj });
    } else {
      setParentInfo({ ...parentInfo, [name]: value });
    }
  };

  const handleChildInfoChange = (name, value) => {
    console.log(`${name}`, value);
    if (name === "date_of_birth") {
      const dateObj = new Date(value);
      setChildInfo({ ...childInfo, [name]: dateObj });
    } else {
      setChildInfo({ ...childInfo, [name]: value });
    }
  };

  return (
    <Modal
      maskClosable={false}
      destroyOnClose={true}
      width={1000}
      title={<p style={{ textAlign: "center" }}>Đăng ký tài khoản O5Course</p>}
      open={isRegisterModalOpen}
      onOk={handleRegisterOk}
      onCancel={handleCancelModal}
      cancelButtonProps={{ style: { display: "none", fontWeight: "bolder" } }}
      okButtonProps={{ style: { display: "none" } }}
      styles={{
        body: { maxHeight: "70vh", overflow: "auto" },
      }}
    >
      <div>
        <Steps current={currentStep}>
          <Step title="Parent Information" />
          <Step title="Child Information" />
          <Step title="Finish" />
        </Steps>
        <div style={{ marginTop: 24, padding: "0 80px" }}>
          {currentStep === 0 && (
            <div>
              <Form
                form={form}
                name="parentInfo"
                onFinish={next}
                initialValues={initialValueParent}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      handleParentInfoChange("name", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="date_of_birth"
                  label="Date of Birth"
                  rules={[
                    {
                      required: true,
                      message: "Please select your date of birth!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={(date, dateString) => {
                      handleChildInfoChange("date_of_birth", dateString);
                    }}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    { required: true, message: "Please select your gender!" },
                  ]}
                >
                  <Select
                    onChange={(e) => handleParentInfoChange("gender", e)}
                    placeholder="Select a gender"
                  >
                    <Option value="men">Men</Option>
                    <Option value="women">Women</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email" },
                  ]}
                >
                  <Input
                    type="email"
                    onChange={(e) =>
                      handleParentInfoChange("email", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                    {
                      pattern: /^0\d{9}$/,
                      message: "Phone number is not a valid phone number!",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      handleParentInfoChange("phone", e.target.value)
                    }
                    type="tel"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    onChange={(e) =>
                      handleParentInfoChange("password", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
          {/* Child information form */}
          {currentStep === 1 && (
            <div>
              <Form
                layout="vertical"
                name="childInfo"
                onFinish={next}
                initialValues={initialValueChild}
                form={form1}
              >
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Please input child's Username!",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      handleChildInfoChange("username", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please input child's Name!" },
                  ]}
                >
                  <Input
                    onChange={(e) =>
                      handleChildInfoChange("name", e.target.value)
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input child's password!",
                    },
                  ]}
                >
                  <Input.Password
                    onChange={(e) =>
                      handleChildInfoChange("password", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="date_of_birth"
                  label="Date of birth"
                  rules={[
                    {
                      required: true,
                      message: "Please input child's date of birth!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={(date, dateString) => {
                      handleChildInfoChange("date_of_birth", dateString);
                    }}
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                      message: "Please select child's gender!",
                    },
                  ]}
                >
                  <Select
                    onChange={(e) => handleChildInfoChange("gender", e)}
                    placeholder="Select a gender"
                  >
                    <Option value="men">Men</Option>
                    <Option value="women">Women</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button style={{ margin: "0 8px" }} onClick={prev}>
                    Previous
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
          {currentStep === 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontSize: "30px",
              }}
            >
              The system records parent's information:
              <Typography variant="body1">
                Parent Name: {parentInfo.username}
              </Typography>
              <Typography variant="body1">Email: {parentInfo.email}</Typography>
              <Typography variant="body1">Information of the child:</Typography>
              <Typography variant="body1">
                Child Name: {childInfo.username}
              </Typography>
              <div>
                <Button style={{ margin: "0 8px" }} onClick={prev}>
                  Previous
                </Button>
                <Button
                  loading={isLoading}
                  type="primary"
                  onClick={handleFinish}
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RegisterForm;
