import React, { useEffect, useState } from "react";
import { Card, Button, Typography, List, Avatar, Input, message as antMessage, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";

const { Title, Text } = Typography;

interface CartItem {
  _id: string;
  image: string;
  name: string;
  price: number;
  size: string;
  amount: number;
}

interface Order {
  _id: string;
  name: string;
  address: string;
  phone: string;
  amount: number;
  orderTotal: number;
  isPaid: boolean;
  status: string;
  cartItems: CartItem[];
  createdAt: string;
  trackingCode: string;
}

const ProcessOrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string>("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`https://kltn-server.vercel.app/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          throw new Error("Failed to fetch order details.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        antMessage.error("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const handleLinkShipping = () => {
    window.open("https://viettelpost.vn/order/tao-don-le", "_blank");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTrackingCode("");
  };

  const handleConfirm = async () => {
    if (!trackingCode.trim()) {
      antMessage.error("Please enter a valid tracking code.");
      return;
    }
    try {
      const response = await fetch(`https://kltn-server.vercel.app/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ trackingCode, status: "Shipping" }),
      });
      if (response.ok) {
        antMessage.success("Order updated successfully with tracking code.");
        setIsEditing(false);
        setTrackingCode("");
        navigate("/ship-orders");
      } else {
        throw new Error("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      antMessage.error("Failed to update order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
         <Header />
        <Sidebar />
        <Spin></Spin>
      </div>
    );
  }

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
              <p><Text strong>Order ID:</Text> {order._id}</p>
              <p><Text strong>Customer Name:</Text> {order.name}</p>
              <p><Text strong>Address:</Text> {order.address}</p>
              <p><Text strong>Phone:</Text> {order.phone}</p>
              <p><Text strong>Total Amount:</Text> {order.orderTotal.toLocaleString('vi-VN')} VND</p>
              <p><Text strong>Status:</Text> {order.status}</p>
              <p><Text strong>Tracking Code:</Text> {order.trackingCode || "Not Assigned"}</p>
            </div>
            <div>
              <Text strong className="block text-lg mb-4">Cart Items</Text>
              <List
                itemLayout="horizontal"
                dataSource={order.cartItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={`Size: ${item.size}, Amount: ${item.amount}, Price: ${item.price.toLocaleString('vi-VN')} VND`}
                    />
                  </List.Item>
                )}
              />
            </div>
            {!order.trackingCode && (
              <div className="mt-6 flex gap-4">
                {!isEditing ? (
                  <>
                    <Button type="primary" onClick={handleLinkShipping} className="bg-blue-500 text-white">
                      Link to Shipping Partner
                    </Button>
                    <Button type="default" onClick={() => navigate(-1)} className="bg-gray-300">
                      Back
                    </Button>
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Enter tracking code"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="w-1/3"
                    />
                    <Button type="primary" onClick={handleConfirm}>
                      Confirm
                    </Button>
                    <Button type="default" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProcessOrderPage;
