import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Modal, Form, message as antMessage, Tooltip } from "antd";
import axios from "axios";
import { Header } from "../components/header/AdminHeader";
import { Sidebar } from "../components/sidebar/Sidebar";

const { Option } = Select;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [form] = Form.useForm();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://kltn-server.vercel.app/api/v1/blogs");
      setBlogs(response.data.data);
      setFilteredBlogs(response.data.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(response.data.data.map((blog) => blog.category || "General")),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      antMessage.error("Failed to fetch blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBlogs(filtered);
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
    const filtered = blogs.filter((blog) => blog.category === value || value === "");
    setFilteredBlogs(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://kltn-server.vercel.app/api/v1/blogs/${id}`);
      antMessage.success("Blog deleted successfully.");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      antMessage.error("Failed to delete blog.");
    }
  };

  const handleAddOrEdit = (blog) => {
    setCurrentBlog(blog);
    setIsModalVisible(true);
    if (blog) {
      form.setFieldsValue(blog);
    } else {
      form.resetFields();
    }
  };

  const handleSave = async (values) => {
    try {
      if (currentBlog) {
        await axios.put(`https://kltn-server.vercel.app/api/v1/blogs/${currentBlog._id}`, values);
        antMessage.success("Blog updated successfully.");
      } else {
        await axios.post("https://kltn-server.vercel.app/api/v1/blogs", values);
        antMessage.success("Blog created successfully.");
      }
      fetchBlogs();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      antMessage.error("Failed to save blog.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image || "/placeholder.jpg"}
          alt="Blog"
          style={{ width: "100px", height: "60px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "category",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      render: (text) => <>{new Date(text).toLocaleDateString()}</>,
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleAddOrEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1b2635] pt-20">
      <Header />
      <Sidebar />
      <div className="xl:ml-[305px] xl:mr-[20px] px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-200">
          Blogs Management
        </h1>

        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-1/3"
          />
          <Select
            placeholder="Filter by category"
            value={selectedCategory}
            onChange={handleCategoryFilter}
            allowClear
            className="w-1/4"
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={() => handleAddOrEdit(null)}>
            Add New Blog
          </Button>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredBlogs}
          loading={loading}
          bordered
          className="bg-white shadow rounded-lg"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title={currentBlog ? "Edit Blog" : "Add Blog"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
          okText="Save"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter blog title" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Content"
              rules={[{ required: true, message: "Please enter content" }]}
            >
              <Input.TextArea rows={4} placeholder="Enter blog content" />
            </Form.Item>
            <Form.Item
              name="author"
              label="Author"
              rules={[{ required: true, message: "Please enter an author" }]}
            >
              <Input placeholder="Enter author name" />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Input placeholder="Enter category" />
            </Form.Item>
            <Form.Item name="tags" label="Tags">
              <Input placeholder="Enter tags (comma-separated)" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image URL"
              rules={[{ required: true, message: "Please enter an image URL" }]}
            >
              <Input placeholder="Enter image URL" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Blogs;