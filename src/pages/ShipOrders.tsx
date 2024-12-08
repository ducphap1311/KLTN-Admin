import React, { useEffect, useState } from "react";
import { Table, Select, message as antMessage, Input, Tooltip, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";

const { Option } = Select;

interface Order {
  _id: string;
  name: string;
  address: string;
  phone: string;
  amount: number;
  orderTotal: number;
  isPaid: boolean;
  status: string;
  trackingCode: string;
  createdAt: string;
  email: string;
}

const ShipOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set(["Shipping", "Delivered", "Cancelled"]));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>(
          "https://kltn-server.vercel.app/api/v1/allorders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const shippedOrders = response.data.orders.filter(
          (order) => order.trackingCode // Chỉ lấy đơn hàng có mã vận đơn
        );
        setOrders(shippedOrders);
        setFilteredOrders(shippedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        antMessage.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  const applyFilters = (term: string = searchTerm, statusSet: Set<string> = statusFilters) => {
    let filtered = orders;

    // Lọc theo từ khóa tìm kiếm
    if (term) {
      const lowerCaseTerm = term.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.trackingCode.toLowerCase().includes(lowerCaseTerm) ||
          order.name.toLowerCase().includes(lowerCaseTerm) ||
          order.phone.toLowerCase().includes(lowerCaseTerm) ||
          order.email.toLowerCase().includes(lowerCaseTerm)
      );
    }

    // Lọc theo trạng thái
    if (statusSet.size > 0) {
      filtered = filtered.filter((order) => statusSet.has(order.status));
    }

    setFilteredOrders(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value);
  };

  const handleCheckboxChange = (status: string, checked: boolean) => {
    const newStatusFilters = new Set(statusFilters);
    if (checked) {
      newStatusFilters.add(status);
    } else {
      newStatusFilters.delete(status);
    }
    setStatusFilters(newStatusFilters);
    applyFilters(searchTerm, newStatusFilters);
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await axios.patch(
        `https://kltn-server.vercel.app/api/v1/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      antMessage.success("Order status updated successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      applyFilters(searchTerm, statusFilters); // Áp dụng lại bộ lọc
    } catch (error) {
      console.error("Error updating order status:", error);
      antMessage.error("Failed to update order status");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      render: (text: string) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-gray-600 truncate block max-w-[200px]">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 100,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Tracking Code",
      dataIndex: "trackingCode",
      key: "trackingCode",
      render: (trackingCode: string) => (
        <a
          href={`https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?code=${trackingCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {trackingCode}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Select
          value={status}
          onChange={(value) => updateOrderStatus(record._id, value)}
          className="w-40"
        >
          <Option value="Shipping">Shipping</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: Order) => (
        <Button
          type="default"
          onClick={() => navigate("/process-order", { state: { orderId: record._id } })}
          className="bg-blue-500 text-white"
        >
          View Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-[#f7f9fc] dark:bg-[#1b2635] min-h-screen pt-20">
      <Header />
      <Sidebar />
      <div className="mx-auto mt-10 xl:ml-[305px] xl:mr-[20px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Shipped Orders</h1>
          <Input
            placeholder="Search by tracking code, customer name, or phone"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Checkbox
            checked={statusFilters.has("Shipping")}
            onChange={(e) => handleCheckboxChange("Shipping", e.target.checked)}
          >
            Shipping
          </Checkbox>
          <Checkbox
            checked={statusFilters.has("Delivered")}
            onChange={(e) => handleCheckboxChange("Delivered", e.target.checked)}
          >
            Delivered
          </Checkbox>
          <Checkbox
            checked={statusFilters.has("Cancelled")}
            onChange={(e) => handleCheckboxChange("Cancelled", e.target.checked)}
          >
            Cancelled
          </Checkbox>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredOrders}
          pagination={{ pageSize: 5 }}
          // loading={}
          bordered
          className="bg-white shadow rounded-lg"
          scroll={{
            x: "max-content",
            y: 400,
          }}
        />
      </div>
    </div>
  );
};

export default ShipOrders;
