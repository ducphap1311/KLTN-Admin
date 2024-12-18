import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  List,
  Avatar,
  Input,
  message as antMessage,
  Spin,
  Modal,
  Radio,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProcessOrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [trackingCode, setTrackingCode] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [viettelOrderCode, setViettelOrderCode] = useState<string>("");
  const [numberOfCopies, setNumberOfCopies] = useState<number>(1);

  const handleConfirm = async (trackingCode) => {
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
        // antMessage.success("Order updated successfully with tracking code.");
        setIsEditing(false);
        // setTrackingCode("");
        // navigate("/ship-orders");
      } else {
        throw new Error("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      antMessage.error("Failed to update order. Please try again.");
    }
  };

  const fetchToken = async () => {
    const response = await fetch(
      "https://partner.viettelpost.vn/v2/user/Login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          USERNAME: "0773450028",
          PASSWORD: "01629014135Aa.",
        }),
      }
    );
    const responseData = await response.json();
    setAdminToken(responseData.data.token);
  };

  useEffect(() => {
    fetchToken();
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `https://kltn-server.vercel.app/api/v1/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        } else {
          throw new Error("Failed to fetch order details.");
        }
      } catch (error) {
        antMessage.error("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  const handleLinkShipping = () => setShowModal(true);

  const handleCreateOrder = async () => {
    try {
      const body = {
        SENDER_FULLNAME: "DH Sneaker",
        SENDER_ADDRESS: "143/3 Hai Bà Trưng Tân Đông Hiệp Dĩ An Bình Dương",
        SENDER_PHONE: "0773450028",
        RECEIVER_FULLNAME: order?.name,
        RECEIVER_ADDRESS: order?.address,
        RECEIVER_PHONE: order?.phone,
        PRODUCT_NAME: "Giày DH Sneaker",
        PRODUCT_QUANTITY: 1,
        PRODUCT_PRICE: 1000000,
        PRODUCT_WEIGHT: 250,
        PRODUCT_HEIGHT: 25,
        PRODUCT_TYPE: "HH",
        ORDER_PAYMENT: 3,
        ORDER_SERVICE: "VSL7",
        ORDER_NOTE: "Cho xem hàng, không cho thử",
        MONEY_COLLECTION: order?.orderTotal,
      };

      const response = await fetch(
        "https://partner.viettelpost.vn/v2/order/createOrder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Token: adminToken,
          },
          body: JSON.stringify(body),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData?.data?.ORDER_NUMBER) {
        // Lưu mã đơn hàng trả về từ ViettelPost
        setViettelOrderCode(responseData.data.ORDER_NUMBER);
        // setTrackingCode(responseData.data.ORDER_NUMBER)
        handleConfirm(responseData.data.ORDER_NUMBER)
        // Đóng modal xác nhận
        setShowModal(false);
        // Hiển thị modal tạo đơn thành công
        setSuccessModal(true);
      } else {
        antMessage.error("Failed to create ViettelPost order.");
      }
    } catch (error) {
      antMessage.error("An error occurred while creating the order.");
    }
  };

  const handleLienChange = (e: any) => {
    setNumberOfCopies(e.target.value);
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
              <Text strong className="block text-lg">
                Order Information
              </Text>
              {/* <p>
                <Text strong>Order ID:</Text> {order._id}
              </p> */}
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
                <Text strong>Total Amount:</Text>{" "}
                {order.orderTotal.toLocaleString("vi-VN")} VND
              </p>
              <p>
                <Text strong>Status:</Text> {order.status}
              </p>
              <p>
                <Text strong>Tracking Code:</Text>{" "}
                {order.trackingCode || "Not Assigned"}
              </p>
            </div>
            <div>
              <Text strong className="block text-lg mb-4">
                Cart Items
              </Text>
              <List
                itemLayout="horizontal"
                dataSource={order.cartItems}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={`Size: ${item.size}, Amount: ${item.amount}, Price: ${item.price.toLocaleString("vi-VN")} VND`}
                    />
                  </List.Item>
                )}
              />
            </div>
            {!order.trackingCode && (
              <div className="mt-6 flex gap-4">
                {!isEditing ? (
                  <>
                    <Button
                      type="primary"
                      onClick={handleLinkShipping}
                      className="bg-blue-500 text-white"
                    >
                      Link to Shipping Partner
                    </Button>
                    <Button
                      type="default"
                      onClick={() => navigate(-1)}
                      className="bg-gray-300"
                    >
                      Back
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      {/* Modal xác nhận tạo đơn */}
      <Modal
        title="Confirm Shipping Order"
        visible={showModal}
        onOk={handleCreateOrder}
        onCancel={() => setShowModal(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure to create order for ViettelPost?</p>
      </Modal>

      {/* Modal hiển thị sau khi tạo đơn thành công */}
      
<Modal
  title={null}
  visible={successModal}
  footer={null}
  onCancel={() => setSuccessModal(false)}
  centered
>
  <div style={{ textAlign: "center", padding: "20px" }}>
    <CheckCircleOutlined
      style={{ fontSize: "48px", color: "#52c41a", marginBottom: "10px" }}
    />
    <Title level={4} style={{ marginBottom: "10px" }}>
      Create Order Successfully
    </Title>
    <p>
      Create and send order successfully:{" "}
      <strong>{viettelOrderCode}</strong>
    </p>
    <Button className="mt-2 bg-green-500 text-white px-5" onClick={() => navigate("/ship-orders")}>OK</Button>
  </div>
</Modal>
    </>
  );
};

export default ProcessOrderPage;
