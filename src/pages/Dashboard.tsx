import React, { useEffect, useState } from "react";
import { Card, Statistic, Table, message as antMessage, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { DollarCircleOutlined, ShoppingCartOutlined, LineChartOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";
import axios from "axios";

const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalShippingCost, setTotalShippingCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("https://kltn-server.vercel.app/api/v1/allorders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const orders = response.data.orders;

      // Calculate metrics
      const pending = orders.filter((order) => order.status === "Pending");
      const revenue = orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((sum, order) => sum + order.orderTotal, 0);
      const total = orders.filter((order) => order.status !== "Cancelled").length;
      const shippingCost = orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((sum, order) => sum + order.amount, 0); // Assuming 'amount' stores shipping cost

      setPendingOrders(pending);
      setTotalRevenue(revenue);
      setTotalOrders(total);
      setTotalShippingCost(shippingCost);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      antMessage.error("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Amount",
      dataIndex: "orderTotal",
      key: "orderTotal",
      render: (text) => `${text.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/process-order`, { state: { orderId: record._id } })}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1b2635] pt-20">
      <Header />
      <Sidebar />
      <div className="xl:ml-[305px] xl:mr-[20px] px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-200">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg cursor-pointer" onClick={() => navigate("/orders")}>
            <Statistic
              title="New Orders"
              value={pendingOrders.length}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
              valueStyle={{ color: "#3f51b5" }}
            />
          </Card>

          <Card className="shadow-lg">
            <Statistic
              title="Revenue (This Month)"
              value={totalRevenue}
              precision={2}
              prefix={<DollarCircleOutlined className="text-green-500" />}
              valueStyle={{ color: "#27ae60" }}
              suffix="VND"
            />
          </Card>

          <Card className="shadow-lg">
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<DatabaseOutlined className="text-orange-500" />}
              valueStyle={{ color: "#e67e22" }}
            />
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">
            Pending Orders
          </h2>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={pendingOrders}
            loading={loading}
            bordered
            className="bg-white shadow rounded-lg"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
