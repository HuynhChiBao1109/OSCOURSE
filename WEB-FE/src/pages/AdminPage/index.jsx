import { CameraOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserGraphQL,
  createUserGraphQL,
  deleteUserGraphQL,
} from "../../redux/slices/userSlice";
import styles from "./AdminPage.module.css";
import {
  getAllUserSelector,
  getAllUserSelectorGraphQL,
} from "../../redux/selectors";
import { toast } from "react-toastify";
import moment from "moment/moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { Column } = Table;
const { Option } = Select;

const initialFormState = {
  avatar: "",
  email: "",
  phone: "",
  role: "",
  gender: "",
};
export const AccountPage = () => {
  const isLoading = useSelector((state) => state.userSlice.loading);
  const { Title } = Typography;

  // Change to admin
  const [adminRole, setAdminRole] = useState(false);
  // const userListSelector = useSelection(getListUserSelector);
  // console.log(userListSelector);
  // const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);
  const [dataSource, setDataSource] = useState([[]]);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [filterRole, setFilterRole] = useState(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const dateFormat = "MM-DD-YYYY";
  const [paging, setPaging] = useState({
    pageSize: 10,
    currentPage: 1,
  });

  const [userdata, setUserData] = useState("");

  const dispatch = useDispatch();

  //   const users = useSelector((user) => user.userSlice.users);
  const userQL = useSelector(getAllUserSelectorGraphQL);
  const users = useSelector(getAllUserSelector);

  useEffect(() => {
    // dispatch(fetchUsers());
    // dispatch(fetchUserIDGraphQL("65e1a3e435e4ea6710264c24"));
    dispatch(
      fetchUserGraphQL({
        searchName: searchKeyword,
        role: filterRole,
        currentPage: 1,
        pageSize: 10,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setUserData(userQL);
  }, [userQL]);

  // Xử lý sự kiện thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // Xử lý sự kiện thay đổi giá trị của Selector/Dropdown
  const handleFilterChange = (value) => {
    setFilterRole(value);
  };

  const handleSearch = () => {
    message.success("Tìm kiếm thành công");
    dispatch(
      fetchUserGraphQL({
        currentPage: 1,
        pageSize: 10,
        searchName: searchKeyword,
        role: filterRole,
      })
    );
  };

  const handleForm = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        ["date_of_birth"]: e,
      }));
    }
  };

  const handleRoleChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleGenderChange = (value) => {
    console.log(value);
    setFormValues((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleCreateUser = () => {
    setModalVisible(true);
  };

  const handleModalSuccess = async () => {
    try {
      await form.validateFields();

      // MỞ RA THÊM ẢNH VÀO
      // if (!formValues.avatar) {
      //   message.error("Vui lòng chọn ảnh đại diện");
      //   return;
      // }

      if (!/^\d+$/.test(formValues.phone)) {
        message.error("Số điện thoại chỉ được chứa các chữ số");
        return;
      }

      console.log("Form submitted:", formValues);
      const id = null;
      if (id) {
        // Update
        console.log("Vào đây là đúng:", formValues);
      } else {
        // Create
        console.log("Vào đây là đúng", formValues);
      }

      formValues.status = "active";
      formValues.avatar =
        "https://images.viblo.asia/avatar/fec3d2c7-f858-4f81-9d4c-2020a6804a3e.png";
      // dispatch(usersSlice.actions.setUser(response.data));
      console.log("Vào đây là đúng", formValues);
      dispatch(createUserGraphQL(formValues)).then((res) => {
        console.log(res);
        if (res.payload == "Người dùng đã tồn tại") {
          message.warning("Email đã tồn tại");
        } else if (res.payload.id) {
          message.success("Người dùng đã được tạo");
          fetchUserGraphQL({
            searchName: null,
            role: null,
            currentPage: paging?.currentPage,
            pageSize: paging?.pageSize,
          });

          // Close modal & reset form
          setModalVisible(false);
          form.resetFields();
        } else {
          message.warning("Fail to create user");
        }
      });

      setSelectedImage(null);
    } catch (e) {
      console.error("Validation failed:", e);
      message.error(e.message); // Hiển thị thông báo lỗi
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedImage(null);
    setFormValues(initialFormState);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFormValues((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (record) => {
    console.log("record: " + record);
    setFormValues(record);
    form.setFieldsValue(record);
    setSelectedImage(record.avatar);
    setModalVisible(true);
  };

  const handleDeleteBtn = (id) => {
    setDeleteId(id); // Lưu ID của người dùng cần xóa
    setConfirmDeleteVisible(true); // Hiển thị Modal xác nhận
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUserGraphQL(deleteId)).then((res) => {
      toast.info("Vô hiệu hóa tài khoản");
      setConfirmDeleteVisible(false); // Ẩn Modal xác nhận
    });
  };

  const handleCancelDelete = () => {
    setConfirmDeleteVisible(false); // Ẩn Modal xác nhận
  };

  const handleDateChange = (date, dateString, fieldName) => {
    setFormValues({ ...formValues, [fieldName]: date });
  };

  const handlePageChange = (page) => {
    setPaging((prevState) => ({ ...prevState, currentPage: page }));
    dispatch(
      fetchUserGraphQL({
        searchName: searchKeyword,
        role: filterRole,
        currentPage: page,
        pageSize: paging?.pageSize,
      })
    );
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (!userQL) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const initialFormValue = {
    avatar: "", // Ảnh đại diện
    email: "", // Email
    phone: "", // Số điện thoại
    role: "", // Vai trò (parent/staff)
    gender: "", // Giới tính (men/women)
    password: "", // Mật khẩu
    name: "", // Họ và tên
    date_of_birth: null, // Ngày sinh
  };

  return (
    <div>
      <Title level={2}>Quản lý tài khoản</Title>
      <div>
        <Input
          placeholder="Nhập từ khóa Họ tên"
          value={searchKeyword}
          onChange={handleSearchChange}
          style={{ marginBottom: 16, width: 200, marginRight: 10 }}
        />

        <Select
          placeholder="Chọn vai trò"
          style={{ width: 200, marginBottom: 16 }}
          onChange={handleFilterChange}
          allowClear
        >
          <Option value="parent">Phụ huynh</Option>
          <Option value="staff">Nhân viên</Option>
        </Select>
        <Button
          onClick={handleSearch}
          icon={<SearchOutlined />}
          style={{ marginLeft: 10 }}
          type="primary"
        >
          Tìm Kiếm
        </Button>
      </div>
      <div className={styles.createBtn}>
        <Button type="primary" onClick={handleCreateUser}>
          Tạo người dùng
        </Button>
      </div>
      <Table
        loading={isLoading}
        dataSource={userdata?.user}
        rowKey="id"
        pagination={{
          current: userdata?.info?.currentPage,
          pageSize: userdata?.info?.pageSize,
          total:
            Number.parseInt(userdata?.info?.totalPage) *
            Number.parseInt(userdata?.info?.pageSize),
          onChange: handlePageChange,
        }}
      >
        <Column
          title="Ảnh Đại Diện"
          dataIndex="avatar"
          key="avatar"
          render={(avatar) => (
            <img
              src={
                avatar ||
                "https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
              }
              alt="Avatar"
              style={{ width: 70, height: 70, borderRadius: "50%" }}
            />
          )}
        />
        <Column title="Họ Tên" dataIndex="name" key="fullName" />
        <Column
          title="Vai trò"
          dataIndex="role"
          key="role"
          render={(role) => (
            <Tag
              color={
                role === "parent"
                  ? "#108ee9"
                  : role === "staff"
                  ? "#87d068"
                  : "#f50"
              }
            >
              {typeof role === "string" ? capitalizeFirstLetter(role) : ""}
            </Tag>
          )}
        />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Số Điện thoại" dataIndex="phone" key="phone" />
        <Column
          title="Ngày sinh"
          dataIndex="date_of_birth"
          key="date_of_birth"
          render={(date_of_birth) => moment(date_of_birth).format("MM-DD-YYYY")}
        />
        <Column title="Giới tính" dataIndex="gender" key="gender" />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          render={(status) => (
            <Tag
              color={
                status === "active"
                  ? "green"
                  : status === "inactive"
                  ? "red"
                  : "#b2b2b2"
              }
            >
              {typeof status === "string" ? status.toUpperCase() : ""}
            </Tag>
          )}
        />

        <Column
          title="Hành động"
          key="action"
          render={(text, record) => (
            <span>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => handleEdit(record)}
              >
                Chỉnh sửa
              </Button>
              {console.log(record)}
            </span>
          )}
        />
      </Table>
      <Modal
        title={"Create User"}
        visible={modalVisible}
        onOk={handleModalSuccess}
        onCancel={handleModalCancel}
      >
        <Form
          initialValues={initialFormValue}
          layout="vertical"
          className={styles.formContainer}
          form={form}
        >
          {/* {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className={styles.formSelectImg}
            />
          ) : (
            <Button
              className={styles.formBtnImg}
              onClick={() => fileInputRef.current.click()}
            >
              <CameraOutlined className={styles.formImg} />
            </Button>
          )} */}

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Họ Tên</span>}
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              className={styles["ant-input"]}
              onChange={handleForm}
              name="name"
              value={formValues.name}
            />
          </Form.Item>
          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              {
                min: 6,
                message: "Mật khẩu phải có độ dài ít nhất 6 ký tự.",
              },
            ]}
          >
            <Input.Password
              className={styles["ant-input"]}
              onChange={handleForm}
              name="password"
              value={formValues.password}
            />
          </Form.Item>
          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Email</span>}
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
                type: "email",
              },
            ]}
          >
            <Input
              className={styles["ant-input"]}
              onChange={handleForm}
              name="email"
              value={formValues.email}
            />
          </Form.Item>
          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Điện thoại</span>}
            name="phone"
            validateTrigger={["onChange", "onBlur"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
                validateTrigger: "onSubmit",
              },
              {
                validator: (rule, value) => {
                  if (value && value[0] !== "0") {
                    return Promise.reject("Số 0 phải ở đầu tiên.");
                  } else if (value && !/^\d{10}$/.test(value)) {
                    return Promise.reject("Số điện thoại phải có 10 chữ số.");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              className={styles["ant-input"]}
              onChange={handleForm}
              name="phone"
              value={formValues.phone}
            />
          </Form.Item>
          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Năm sinh</span>}
            name="date_of_birth"
            rules={[{ required: true, message: "Vui lòng chọn năm sinh!" }]}
          >
            <DatePicker
              defaultValue={null}
              format="MM-DD-YYYY"
              maxDate={dayjs("12-31-2018", dateFormat)}
              className={styles["ant-input"]}
              onChange={(date, dateString) =>
                handleDateChange(date, dateString, "date_of_birth")
              }
              style={{ width: "100%" }}
              value={
                formValues.date_of_birth
                  ? moment(formValues.date_of_birth)
                  : null
              }
            />
          </Form.Item>

          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Vai trò</span>}
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              className={styles["ant-select"]}
              onChange={handleRoleChange}
            >
              <Option value="parent">Parent</Option>
              <Option value="staff">Staff</Option>

              {adminRole ? <Option value="Staff">Staff</Option> : ""}
            </Select>
          </Form.Item>

          <Form.Item
            className={styles.formItemContainer}
            label={<span className={styles.formLabel}>Giới tính</span>}
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select
              className={styles["ant-select"]}
              onChange={handleGenderChange}
            >
              <Option value="men">Nam</Option>
              <Option value="women">Nữ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa"
        visible={confirmDeleteVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
      </Modal>
    </div>
  );
};
