import React, { useEffect, useState } from "react";
import { Table, Button, message as antMessage, Tooltip, Modal, Input, Tag, Checkbox, Popconfirm } from "antd";
import axios from "axios";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";

interface Message {
  _id: string;
  name: string;
  email: string;
  phonenumber: number;
  location: string;
  message: string;
  isReplied: boolean;
}

const MessagesTable: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isReplyModalVisible, setIsReplyModalVisible] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  const [showReplied, setShowReplied] = useState<boolean>(true);
  const [showNotReplied, setShowNotReplied] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get<{ message: Message[] }>(
          "https://kltn-server.vercel.app/api/v1/messages"
        );
        setMessages(response.data.message);
        setFilteredMessages(response.data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
        antMessage.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    applyFilters(searchTerm, messages);
  }, [showReplied, showNotReplied]);

  const deleteMessage = async (id: string) => {
    try {
      const response = await axios.delete(
        `https://kltn-server.vercel.app/api/v1/messages/${id}`
      );
      if (response.status === 200 || response.status === 204) {
        antMessage.success("Message deleted successfully");
        const updatedMessages = messages.filter((message) => message._id !== id);
        setMessages(updatedMessages);
        applyFilters(searchTerm, updatedMessages);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      antMessage.error("Failed to delete message");
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      antMessage.error("Reply content cannot be empty");
      return;
    }
    try {
      const response = await axios.post("https://kltn-server.vercel.app/api/v1/reply-email", {
        email: currentMessage?.email,
        message: replyContent,
      });

      if (response.status === 200) {
        antMessage.success("Reply sent successfully");

        if (currentMessage) {
          await axios.patch(`https://kltn-server.vercel.app/api/v1/messages/${currentMessage._id}`, {
            isReplied: true,
          });

          const updatedMessages = messages.map((msg) =>
            msg._id === currentMessage._id ? { ...msg, isReplied: true } : msg
          );
          setMessages(updatedMessages);
          applyFilters(searchTerm, updatedMessages);
        }

        setIsReplyModalVisible(false);
        setReplyContent("");
      }
    } catch (error) {
      console.error("Error sending reply or updating status:", error);
      antMessage.error("Failed to send reply or update message status");
    }
  };

  const applyFilters = (term: string, data: Message[]) => {
    const filtered = data.filter((message) => {
      const matchesSearch =
        message.name.toLowerCase().includes(term.toLowerCase()) ||
        message.email.toLowerCase().includes(term.toLowerCase());

      const matchesRepliedFilter =
        (showReplied && message.isReplied) || (showNotReplied && !message.isReplied);

      return matchesSearch && matchesRepliedFilter;
    });

    setFilteredMessages(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, messages);
  };

  const handleFilterChange = (filter: "replied" | "notReplied", checked: boolean) => {
    if (filter === "replied") setShowReplied(checked);
    if (filter === "notReplied") setShowNotReplied(checked);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
      width: 150,
      render: (text: number) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 150,
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-gray-700 truncate block max-w-[200px]">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Replied",
      dataIndex: "isReplied",
      key: "isReplied",
      render: (isReplied: boolean) => (
        <Tag color={isReplied ? "green" : "red"}>
          {isReplied ? "Replied" : "Not Replied"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: Message) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Are you sure you want to delete this message?"
            onConfirm={() => deleteMessage(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="default"
            onClick={() => {
              setCurrentMessage(record);
              setIsReplyModalVisible(true);
            }}
          >
            Reply
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
          <h1 className="text-2xl font-bold">Messages Table</h1>
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-1/3"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Checkbox
            checked={showReplied}
            onChange={(e) => handleFilterChange("replied", e.target.checked)}
          >
            Show Replied
          </Checkbox>
          <Checkbox
            checked={showNotReplied}
            onChange={(e) => handleFilterChange("notReplied", e.target.checked)}
          >
            Show Not Replied
          </Checkbox>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredMessages}
          loading={loading}
          bordered
          className="bg-white shadow rounded-lg"
          scroll={{
            x: "max-content",
            y: 400,
          }}
        />
      </div>
      <Modal
        title={`Reply to ${currentMessage?.email}`}
        visible={isReplyModalVisible}
        onOk={handleSendReply}
        onCancel={() => setIsReplyModalVisible(false)}
        okText="Send"
        cancelText="Cancel"
      >
        <Input.TextArea
          rows={4}
          placeholder="Enter your reply message here..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default MessagesTable;
