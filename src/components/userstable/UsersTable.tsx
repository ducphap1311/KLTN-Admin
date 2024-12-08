import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Select, Input, Popconfirm } from "antd";
import axios from "axios";

const { Option } = Select;

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch data từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "https://kltn-server.vercel.app/api/v1/allusers"
      );
      setUsers(response.data.users);
      filterAndSearch(response.data.users, searchTerm, filterStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterAndSearch(users, value, filterStatus);
  };

  // Hàm lọc trạng thái
  const handleFilterStatus = (status: string | null) => {
    setFilterStatus(status);
    filterAndSearch(users, searchTerm, status);
  };

  // Hàm gộp lọc và tìm kiếm
  const filterAndSearch = (
    usersList: User[],
    search: string,
    status: string | null
  ) => {
    let filtered = usersList;

    // Áp dụng tìm kiếm
    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Áp dụng lọc theo trạng thái
    if (status === "banned") {
      filtered = filtered.filter((user) => !user.isActive);
    } else if (status === "active") {
      filtered = filtered.filter((user) => user.isActive);
    }

    setFilteredUsers(filtered);
  };

  const handleVerifyChange = async (id: string, isVerified: boolean) => {
    try {
      const response = await axios.patch(`https://kltn-server.vercel.app/api/v1/user/${id}`, {
        isVerified,
      });
      if (response.status === 200) {
        message.success("Account verified successfully.");
        const updatedUsers = users.map((user) =>
          user._id === id ? { ...user, isVerified } : user
        );
        setUsers(updatedUsers);
        filterAndSearch(updatedUsers, searchTerm, filterStatus);
      }
    } catch (error) {
      console.error("Error updating verify status:", error);
      message.error("Failed to update verify status.");
    }
  };

  const toggleAccountStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await axios.patch(`https://kltn-server.vercel.app/api/v1/user/${id}`, {
        isActive: !isActive,
      });
      if (response.status === 200) {
        message.success(`Account has been ${isActive ? "banned" : "activated"}.`);
        const updatedUsers = users.map((user) =>
          user._id === id ? { ...user, isActive: !isActive } : user
        );
        setUsers(updatedUsers);
        filterAndSearch(updatedUsers, searchTerm, filterStatus);
      }
    } catch (error) {
      console.error("Error updating account status:", error);
      message.error("Failed to update account status.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
      render: (text: string) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "volcano" : "green"}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified: boolean, record: User) =>
        isVerified ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Popconfirm
            title="Are you sure to mark this account as verified?"
            onConfirm={() => handleVerifyChange(record._id, true)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default">Mark as Verified</Button>
          </Popconfirm>
        ),
    },
    {
      title: "Status",
      key: "actions",
      render: (text: any, record: User) => (
        <Popconfirm
          title={`Are you sure to ${record.isActive ? "ban" : "activate"} this account?`}
          onConfirm={() => toggleAccountStatus(record._id, record.isActive)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            disabled={record.role === "admin"}
            type={record.isActive ? "primary" : "default"}
            className={record.isActive ? "bg-green-500" : ""}
            danger={!record.isActive}
          >
            {record.isActive ? "Active" : "Banned"}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="mx-auto mt-10 xl:ml-[305px] xl:mr-[20px]">
      <h1 className="text-2xl font-bold mb-4">Users Table</h1>
      <div className="mb-4 flex justify-between">
        <Input
          placeholder="Search by email or name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/3"
        />
        <div className="flex gap-4">
          <Button
            type={filterStatus === "active" ? "primary" : "default"}
            onClick={() => handleFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            type={filterStatus === "banned" ? "primary" : "default"}
            onClick={() => handleFilterStatus("banned")}
          >
            Banned
          </Button>
          <Button
            type={!filterStatus ? "primary" : "default"}
            onClick={() => handleFilterStatus(null)}
          >
            All
          </Button>
        </div>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        bordered
        className="bg-white shadow rounded-lg"
        scroll={{
          x: "max-content",
          y: 400,
        }}
      />
    </div>
  );
};

export default UsersTable;
