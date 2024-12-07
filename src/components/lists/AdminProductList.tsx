import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Table, Input, message, Tooltip, Checkbox } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/getService";

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
  isActive: boolean;
}

export const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showDisabled, setShowDisabled] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchProducts = async (applyCurrentFilters = false) => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response.products);

      if (applyCurrentFilters) {
        applyFilters(searchTerm, showActive, showDisabled, response.products);
      } else {
        setFilteredProducts(response.products);
      }
    } catch (error) {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/products/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        message.success(`Product ${isActive ? "activated" : "disabled"} successfully!`);
        fetchProducts(true); // Fetch lại data và áp dụng bộ lọc hiện tại
      } else {
        throw new Error("Failed to update product status.");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      message.error("Failed to update product status.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applyFilters(value, showActive, showDisabled);
  };

  const applyFilters = (
    search: string = searchTerm,
    active: boolean = showActive,
    disabled: boolean = showDisabled,
    data: Product[] = products
  ) => {
    let filtered = data;

    if (!active) {
      filtered = filtered.filter((product) => !product.isActive);
    }

    if (!disabled) {
      filtered = filtered.filter((product) => product.isActive);
    }

    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.quality.toLowerCase().includes(search)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleActiveFilterChange = (e: any) => {
    setShowActive(e.target.checked);
    applyFilters(searchTerm, e.target.checked, showDisabled);
  };

  const handleDisabledFilterChange = (e: any) => {
    setShowDisabled(e.target.checked);
    applyFilters(searchTerm, showActive, e.target.checked);
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
      width: 100,
    },
    {
      title: "Quality",
      dataIndex: "quality",
      key: "quality",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          {text.length > 30 ? `${text.slice(0, 30)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Product) => (
        <Popconfirm
          title={`Are you sure you want to ${
            isActive ? "disable" : "activate"
          } this product?`}
          onConfirm={() => updateProductStatus(record._id, !isActive)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type={isActive ? "primary" : "default"}
            className={`${isActive ? "bg-green-500" : "text-red-500 border-red-500"}`}
          >
            {isActive ? "Active" : "Disabled"}
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/edit-product/${record._id}`)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{ borderRadius: 8 }}
      className="bg-white dark:bg-[#233044] xl:ml-[305px] xl:mr-[20px] px-4 py-2 mx-auto rounded-lg"
    >
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Search products by name"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Checkbox checked={showActive} onChange={handleActiveFilterChange}>
            Active
          </Checkbox>
          <Checkbox checked={showDisabled} onChange={handleDisabledFilterChange}>
            Disabled
          </Checkbox>
        </div>
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
          y: 500,
        }}
        rowClassName={(record) =>
          record.isActive ? "" : "bg-gray-100 dark:bg-gray-800"
        }
      />
    </div>
  );
};
