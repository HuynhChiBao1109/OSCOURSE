import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal, Spin, Table, Tag, Typography } from "antd";
import Column from "antd/es/table/Column";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactionByAdminSelector } from "../../redux/selectors";
import { fetchTransactionByAdminAsync } from "../../redux/slices/transactionSlice";
import { formatPrice } from "../../utils";
import dayjs from "dayjs";

const TransactionPage = () => {
  const dispatch = useDispatch();
  const transactionList = useSelector(getAllTransactionByAdminSelector);

  const [filteredTransaction, setFilteredTransaction] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [paging, setPaging] = useState({});

  useEffect(() => {
    dispatch(fetchTransactionByAdminAsync({ currentPage: 1, pageSize: 20 }));
  }, []);

  const { Title } = Typography;

  useEffect(() => {
    setPaging(transactionList?.info);
  }, [transactionList]);

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      align: "end",
      render: (status) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "pending"
              ? "blue"
              : status === "failed"
              ? "red"
              : "#b2b2b2"
          }
        >
          {typeof status === "string" ? status.toUpperCase() : ""}
        </Tag>
      ),
    },
  ];

  const handlePageChange = (page) => {
    dispatch(
      fetchTransactionByAdminAsync({
        currentPage: page,
        pageSize: 10,
      })
    );
  };

  if (!transactionList) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD-MM-YYYY"); // Định dạng ngày tháng thành 'YYYY-MM-DD'
  };
  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>Lịch sử giao dịch</Title>

      <Table dataSource={transactionList.transaction} rowKey="id">
        <Column
          title="Ngày tạo"
          dataIndex="created_at"
          key="created_at"
          align="center"
          render={(created_at) => <span>{formatDate(created_at)}</span>}
        />
        <Column
          title="Học sinh"
          dataIndex="children_name"
          key="
          children_id"
        />
        <Column title="Khóa học" dataIndex="course_name" key="course_id" />
        <Column
          title="Số tiền"
          dataIndex="amount"
          key="money"
          sorter={(a, b) => a.money - b.money}
          render={(money) => <div>{formatPrice(money)}đ</div>}
        />

        <Column
          title="Mã giao dịch"
          dataIndex="transaction_code"
          key="transaction_code
"
        />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          render={(status) => (
            <Tag
              color={
                status === "completed"
                  ? "green"
                  : status === "pending"
                  ? "blue"
                  : "red"
              }
            >
              {status.toUpperCase()}
            </Tag>
          )}
        />
      </Table>
      <Modal
        title="Transaction Detail"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <Table
          columns={columns}
          dataSource={transactionList}
          pagination={{
            current: paging?.currentPage,
            pageSize: paging?.pageSize,
            total: Number.parseInt(paging?.totalPage * paging?.pageSize),
            onChange: handlePageChange,
          }}
          size="middle"
          bordered={false}
          showHeader={false}
          style={{ marginBottom: 0 }}
        />
      </Modal>
    </div>
  );
};

export default TransactionPage;
