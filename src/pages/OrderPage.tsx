import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message as antMessage,
  Tag,
  Tooltip,
  Modal,
  List,
  Avatar,
  Input,
  Select,
} from "antd";
import axios from "axios";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

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
  email: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<{ orders: Order[] }>(
          "http://localhost:5000/api/v1/allorders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const ordersWithoutTrackingCode = response.data.orders.filter(
          (order) => !order.trackingCode && (order.status === "Pending")
        );

        setOrders(ordersWithoutTrackingCode);
        setFilteredOrders(ordersWithoutTrackingCode);
      } catch (error) {
        console.error("Error fetching orders:", error);
        antMessage.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Search handler
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lowerCaseValue = value.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(lowerCaseValue) ||
        order.name.toLowerCase().includes(lowerCaseValue) ||
        order.phone.toLowerCase().includes(lowerCaseValue) ||
        order.email.toLowerCase().includes(lowerCaseValue) // Thêm điều kiện tìm kiếm theo phone
    );
    
    setFilteredOrders(filtered);
  };

  // Delete order
  const deleteOrder = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      antMessage.success("Order deleted successfully");
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== id)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      antMessage.error("Failed to delete order");
    }
  };

  // Confirm delete
  const confirmDeleteOrder = (id: string) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: () => deleteOrder(id),
    });
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      antMessage.success("Order status updated successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      antMessage.error("Failed to update order status");
    }
  };

  // View order details
  const viewOrderDetails = async (order: Order) => {
    try {
      const response = await axios.get<{ order: Order }>(
        `http://localhost:5000/api/v1/orders/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setSelectedOrder(response.data.order);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      antMessage.error("Failed to fetch order details.");
    }
  };
  const handleProcessOrder = (orderId: string) => {
  navigate("/process-order", { state: { orderId } });
};
  // Close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Table columns
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
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => {
      const formattedDate = new Date(date).toLocaleDateString(); // Format ngày
      return <span className="text-gray-600">{formattedDate}</span>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string, record: Order) => {
      if(status === "Pending")
      return <Tag color="yellow">{status}</Tag>
      // <Select
      //   defaultValue={status}
      //   onChange={(value) => updateOrderStatus(record._id, value)}
      //   className="w-40"
      // >
      //   <Option value="Pending">Pending</Option>
      //   <Option value="Shipping">Shipping</Option>
      //   <Option value="Delivered">Delivered</Option>
      //   <Option value="Cancelled">Cancelled</Option>
      // </Select>
},
  },
  {
    title: "Actions",
    key: "actions",
    render: (text: any, record: Order) => (
      <div className="flex gap-2">
        <Button
          type="default"
          onClick={() => handleProcessOrder(record._id)} // Pass only order ID
          className="bg-blue-500 text-white"
        >
          Process Order
        </Button>
      </div>
    ),
  },
];


  return (
    <div className="bg-[#f7f9fc] dark:bg-[#1b2635] min-h-screen pt-20">
      <Header />
      <Sidebar />
      <div className="mx-auto mt-10 xl:ml-[305px] xl:mr-[20px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Orders Table</h1>
          <Input
            placeholder="Search by ID, name, or phone"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          bordered
          className="bg-white shadow rounded-lg"
          scroll={{
            x: "max-content",
            y: 400,
          }}
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.orderTotal}
            </p>
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={`Size: ${item.size}, Amount: ${item.amount}, Price: $${item.price}`}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderPage;
