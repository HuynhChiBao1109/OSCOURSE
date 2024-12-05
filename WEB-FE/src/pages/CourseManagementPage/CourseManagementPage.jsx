import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourseSelector,
  getCourseSelector,
  getLoadingSelector,
  getUserLoginSelector,
  getUserSelector,
} from "../../redux/selectors";
import Search from "antd/es/input/Search";
import {
  fetchCourseGraphQL,
  removeCourseById,
} from "../../redux/slices/courseSlice";
import Column from "antd/es/table/Column";

const { Title } = Typography;

export const CourseManagement = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserLoginSelector);
  const isLoading = useSelector(getLoadingSelector);
  const courseList = useSelector(getAllCourseSelector);
  const course = useSelector(getCourseSelector);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState();
  const [courses, setCourses] = useState();
  const [filteredMemData, setFilteredMemData] = useState();
  const [paging, setPaging] = useState({
    pageSize: 20,
    currentPage: 1,
    total: 1,
  });
  const [searchName, setSearchName] = useState(null);

  console.log("courseList", courseList);
  console.log("courses", courses);
  console.log("course", course);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(
      fetchCourseGraphQL({
        currentPage: paging.currentPage,
        pageSize: paging.pageSize,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (courseList) {
      setCourses(courseList);
      setPaging({
        currentPage: Number(course.info.currentPage),
        pageSize: Number(course.info.pageSize),
        total: course.info.totalPage * Number(course.info.pageSize),
      });
    } else {
      <Spin />;
    }
  }, [courseList, course]);

  const confirmDelete = (id) => {
    console.log(id);
    dispatch(removeCourseById(id));
    message.success("Xóa khóa học thành công!");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Xóa khóa học không thành công!");
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearchCourse = (value) => {
    setSearchName(value);
  };

  const handleSearch = () => {
    message.info(`Tìm kiếm với ${searchName}`);
    dispatch(
      fetchCourseGraphQL({
        searchName: searchName,
        currentPage: 1,
        pageSize: 10,
      })
    );
    if (value.trim() !== "") {
      const filterData = courses.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filterData);
    } else {
      setFilteredData(courses);
    }
  };

  const handleSearchMember = (value) => {
    if (value.trim() !== "") {
      const filterData = memberData.filter((item) => item.name.includes(value));

      setFilteredMemData(filterData);
    } else {
      setFilteredMemData(memberData);
    }
  };

  const handlePageChange = (page) => {
    setPaging((prevState) => ({ ...prevState, currentPage: page }));

    dispatch(
      fetchCourseGraphQL({
        pageSize: paging.pageSize,
        currentPage: page,
      })
    );
  };

  const memberData = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      status: "Studying",
    },
    {
      id: "2",
      name: "Nguyễn Văn B",
      status: "Done",
    },
    {
      id: "3",
      name: "Nguyễn Văn C",
      status: "Studying",
    },
    {
      id: "4",
      name: "Nguyễn Văn D",
      status: "Studying",
    },
  ];
  const memberColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Done" ? "green" : "orange"} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete a member"
            description="Bạn có chắc chắn muốn xóa thành viên này?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data = [
    {
      id: "1",
      name: "HTML & CSS",
      member: 32,
      status: "public",
    },
    {
      id: "2",
      name: "Javascript",
      member: 42,
      status: "public",
    },
    {
      id: "3",
      name: "NodeJS",
      member: 32,
      status: "private",
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lí khóa học</Title>
      <Input
        placeholder="Nhập theo tên"
        size="medium"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearchCourse(e.target.value)}
        allowClear
        style={{ width: 300 }}
      />
      <Button
        icon={<SearchOutlined />}
        style={{ marginLeft: "10px" }}
        onClick={handleSearch}
      >
        Tìm khóa học
      </Button>
      <div style={{ textAlign: "end" }}>
        {user.role === "admin" && (
          <Link to="/create-course">
            <Button size="middle" style={{ margin: "20px 0px" }} type="primary">
              Thêm khóa học mới
            </Button>
          </Link>
        )}
        <Table
          loading={isLoading}
          scroll={{ x: "auto" }}
          dataSource={filteredData || courses}
          pagination={{
            currentPage: paging.currentPage,
            pageSize: paging.pageSize,
            total: paging.total,
            onChange: handlePageChange,
          }}
        >
          <Column
            title="Thumbnail"
            dataIndex="thumbnail"
            key="thumbnail"
            render={(thumbnail) => (
              <Image
                width={200}
                height={"112px"}
                src={thumbnail}
                key={thumbnail}
              ></Image>
            )}
          />
          <Column title="Tên khóa học" dataIndex="title" key="title" />
          <Column
            title="Thành viên"
            dataIndex="total_student_join"
            key="total_student_join"
          />
          <Column
            title="Trạng thái"
            dataIndex="status"
            key="status"
            render={(status) => (
              <Tag
                color={status === "public" ? "geekblue" : "volcano"}
                key={status}
              >
                {status}
              </Tag>
            )}
          />
          <Column
            title="Hành động"
            key="action"
            render={(_, record) => (
              <>
                <Space size="middle">
                  <Popconfirm
                    title="Delete the course"
                    description="Bạn có chắc chắn xóa khóa học này?"
                    onConfirm={() => confirmDelete(record.id)}
                    onCancel={cancel}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button icon={<DeleteOutlined />} danger></Button>
                  </Popconfirm>
                  <Button icon={<TeamOutlined />} onClick={showModal}></Button>
                  <Modal
                    cancelButtonProps={{ style: { display: "none" } }}
                    okButtonProps={{ style: { display: "none" } }}
                    title={<Title level={3}>Các thành viên</Title>}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={1000}
                  >
                    <div style={{ textAlign: "end" }}>
                      <Input
                        placeholder="Nhập theo tên"
                        size="medium"
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearchMember(e.target.value)}
                        allowClear
                        style={{ width: 300, marginBottom: 20 }}
                      />
                    </div>

                    <Collapse
                      style={{ marginBottom: "1rem" }}
                      items={[
                        {
                          key: "1",
                          label: "Create a new member",
                          children: (
                            <Form layout="inline" form={form}>
                              <Form.Item label="Name">
                                <Input placeholder="Member name" />
                              </Form.Item>
                              <Form.Item>
                                <Button type="primary" htmlType="submit">
                                  Tạo
                                </Button>
                              </Form.Item>
                            </Form>
                          ),
                        },
                      ]}
                    />
                    <Table
                      loading={isLoading}
                      scroll={{ x: "auto" }}
                      columns={memberColumns}
                      dataSource={filteredMemData || memberData}
                    />
                  </Modal>
                  {user.role === "admin" && (
                    <Link to={`/course-detail-management/${record.id}`}>
                      <Button icon={<EditOutlined />}></Button>
                    </Link>
                  )}
                </Space>
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
