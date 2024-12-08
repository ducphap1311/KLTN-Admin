import React from "react";
import { useForm, SubmitHandler, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Input, Select, Space, message } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface ProductForm {
  image: string;
  name: string;
  price: number;
  sizes: { size: string; quantity: number }[];
  description: string;
  brand: string;
  quality?: string;
}

const schema = yup
  .object({
    image: yup
      .string()
      .url("Invalid image URL")
      .required("Image URL is required"),
    name: yup.string().required("Product name is required"),
    price: yup
      .number()
      .typeError("Price must be a positive number")
      .positive("Price must be a positive number")
      .required("Price is required"),
    sizes: yup
      .array()
      .of(
        yup.object({
          size: yup.string().required("Size is required"),
          quantity: yup
            .number()
            .typeError("Quantity must be a positive number")
            .positive("Quantity must be a positive number")
            .required("Quantity is required"),
        })
      .required("Size is required")
    )
    .required()
      .min(1, "At least one size is required"),
    description: yup.string().required("Description is required"),
    brand: yup
      .string()
      // .oneOf(["men", "women", "kids"], "Invalid brand")
      .required("Brand is required"),
    quality: yup.string().optional(),
  })
  // .required();

const AddForm = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      image: "", // Khởi tạo giá trị mặc định cho image
      name: "", // Khởi tạo giá trị mặc định cho name
      price: 0, // Giá mặc định
      description: "", // Mô tả mặc định
      brand: "", // Danh mục mặc định
      quality: "", // Chất lượng mặc định
      sizes: [{ size: "", quantity: 0 }], // Phải có ít nhất một đối tượng mặc định trong mảng sizes
    },
  });

  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    console.log("Form data:", data); 
    try {
      // Gửi dữ liệu tới API
      const response = await fetch("http://localhost:5000/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Product added:", result);

      // Hiển thị thông báo thành công
      message.success("Product added successfully!");
      navigate("/")
    } catch (error) {
      console.error("Failed to add product:", error);
      message.error("Failed to add product!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto xl:ml-[305px] xl:mr-[20px] mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image URL */}
        <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <div>
            <Input {...field} placeholder="Enter image URL" />
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>
        )}
      />

      {/* Product Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div>
            <Input {...field} placeholder="Enter product name" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
        )}
      />

      {/* Price */}
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <div>
            <Input {...field} type="number" placeholder="Enter price" />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>
        )}
      />

        {/* Sizes */}
        {/* <div>
          <label className="block mb-2 font-semibold">Sizes</label>
          {fields.map((field, index) => (
            <Space key={field.id} direction="horizontal" className="mb-2">
              <Input

                {...register(`sizes.${index}.size` as const)}
                placeholder="Size"
              />
              <Input
                {...register(`sizes.${index}.quantity` as const)}
                type="number"
                placeholder="Quantity"
              />
              <Button danger onClick={() => remove(index)}>
                Remove
              </Button>
            </Space>
          ))}
          <Button
            type="dashed"
            onClick={() => append({ size: "", quantity: 0 })}
          >
            Add Size
          </Button>
          {errors.sizes && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sizes.message as string}
            </p>
          )}
        </div> */}
          <div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700">Sizes</label>
  {fields.map((field, index) => (
    <div key={field.id} className="flex items-center space-x-2">
      <Controller
        name={`sizes.${index}.size`}
        control={control}
        render={({ field: sizeField }) => (
          <div className="flex-grow">
            <Input 
              {...sizeField} 
              placeholder="Size" 
              status={errors.sizes?.[index]?.size ? "error" : ""}
            />
            {errors.sizes?.[index]?.size && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sizes[index].size.message}
              </p>
            )}
          </div>
        )}
      />
      <Controller
        name={`sizes.${index}.quantity`}
        control={control}
        render={({ field: quantityField }) => (
          <div className="flex-grow">
            <Input 
              {...quantityField} 
              type="number" 
              placeholder="Quantity" 
              status={errors.sizes?.[index]?.quantity ? "error" : ""}
            />
            {errors.sizes?.[index]?.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sizes[index].quantity.message}
              </p>
            )}
          </div>
        )}
      />
      {fields.length > 1 && (
        <Button 
          danger 
          type="text" 
          onClick={() => remove(index)}
          className="flex items-center justify-center"
        >
          Remove
        </Button>
      )}
    </div>
  ))}
  <Button 
    type="dashed" 
    onClick={() => append({ size: "", quantity: 0 })}
    block
  >
    Add Size
  </Button>
</div>
        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold">Description</label>
          {/* Description */}
<Controller
  name="description"
  control={control}
  render={({ field }) => (
    <div>
      <TextArea 
        {...field} 
        placeholder="Enter product description" 
        rows={4} 
      />
      {errors.description && (
        <p className="text-red-500">
          {errors.description.message}
        </p>
      )}
    </div>
  )}
/>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-semibold">Brand</label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-full"
                placeholder="Select a brand"
              >
                <Select.Option value="MLB">MLB</Select.Option>
                <Select.Option value="Adidas">Adidas</Select.Option>
                <Select.Option value="Crocs">Crocs</Select.Option>
              </Select>
            )}
          />
          {errors.brand && (
            <p className="text-red-500 text-sm mt-1">
              {errors.brand.message}
            </p>
          )}
        </div>

        {/* Quality */}
        <div>
          <label className="block mb-2 font-semibold">Quality</label>
          <Controller
  name="quality"
  control={control}
  render={({ field }) => (
    <div>
      <Select
        {...field}
        style={{ width: '100%' }}
        placeholder="Select product quality"
        status={errors.quality ? "error" : ""}
      >
        <Select.Option value="best seller">Best Seller</Select.Option>
        <Select.Option value="new">Most Popular</Select.Option>
      </Select>
      {errors.quality && (
        <p className="text-red-500 text-xs mt-1">
          {errors.quality.message}
        </p>
      )}
    </div>
  )}
/>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
