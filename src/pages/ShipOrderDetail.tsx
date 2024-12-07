import React from "react";
import { Card, Typography, List, Avatar } from "antd";
import { useLocation } from "react-router-dom";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";

const { Title, Text } = Typography;

const ShipOrderDetail: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text type="danger" className="text-lg">
          No order details available.
        </Text>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div className="bg-[#f7f9fc] dark:bg-[#1b2635] min-h-screen pt-20 mx-auto mt-10 xl:ml-[305px] xl:mr-[20px]">
        <div className="container mx-auto px-6">
          <Title level={2} className="mb-4 text-gray-900 dark:text-gray-200">
            Order Details
          </Title>
          <Card className="shadow-lg">
  <div className="mb-4">
    <Text strong className="block text-lg">Order Information</Text>
    <p>
      <Text strong>Order ID:</Text> {order._id}
    </p>
    <p>
      <Text strong>Customer Name:</Text> {order.name}
    </p>
    <p>
      <Text strong>Address:</Text> {order.address}
    </p>
    <p>
      <Text strong>Phone:</Text> {order.phone}
    </p>
    <p>
      <Text strong>Total Amount:</Text> ${order.orderTotal}
    </p>
    <p>
      <Text strong>Tracking Code:</Text> {order.trackingCode}
    </p>
    <p>
      <Text strong>Status:</Text> {order.status}
    </p>
    <p>
      <Text strong>Date:</Text>{" "}
      {new Date(order.createdAt).toLocaleDateString("en-GB")}
    </p>
  </div>
</Card>

        </div>
      </div>
    </>
  );
};

export default ShipOrderDetail;
