import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Table, Input, message, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/getService";
import { deleteProduct } from "../../api/deleteService";

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  quality: string;
  description: string;
  sizes: Size[];
}

export const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response.products);
      setFilteredProducts(response.products); // Hiển thị toàn bộ sản phẩm lúc đầu
    } catch (error) {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value) ||
        product.quality.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={image}
          alt="Product"
          style={{ width: "70px", height: "70px", objectFit: "contain" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Sizes",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes: Size[]) =>
        
    sizes.map((size) => `${size.size} (${size.quantity})`).join(", "),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 100    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <Tooltip title={text}>
      {text.length > 30 ? `${text.slice(0, 30)}...` : text}
    </Tooltip>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-product/${record._id}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{borderRadius: 8 }} className="bg-white dark:bg-[#233044] xl:ml-[305px] xl:mr-[20px]  px-4 py-2 mx-auto rounded-lg">
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }} className="">
        <Input
          placeholder="Search products"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        className="dark:bg-[#1b2635]"
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={loading}
        bordered
        size="small"
        scroll={{
            x: "max-content",
            y: 500
        }}
      />
    </div>
  );
};
