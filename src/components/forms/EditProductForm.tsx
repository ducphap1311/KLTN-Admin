import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProduct } from "../../api/getService";
import { editProduct } from "../../api/editService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input, Select, Space, Spin } from "antd";

const { TextArea } = Input;

interface Size {
  size: string;
  quantity: number;
}

interface Inputs {
  image: string;
  name: string;
  price: number;
  sizes: Size[];
  description: string;
  category: string;
  quality?: string;
}

const schema = yup.object({
  image: yup
    .string()
    .url("Invalid image URL")
    .required("Image URL is required"),
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  sizes: yup
    .array()
    .of(
      yup.object({
        size: yup.string().required("Size is required"),
        quantity: yup
          .number()
          .typeError("Quantity must be a number")
        //   .positive("Quantity must be greater than 0")
          .required("Quantity is required"),
      })
    )
    .required()
    .min(1, "At least one size is required"),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  quality: yup.string().optional(),
}).required();

export const EditForm = () => {
  const [loadingPage, setLoadingPage] = useState(false)
  const { id } = useParams();
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {                                                    
      image: "",
    name: "",
    price: 0,
    sizes: [{ size: "", quantity: 1 }],
    description: "",
    category: "",
    quality: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    
    setLoadingButton(true);
    if (id) {
      try {
        const response = await editProduct(id, data);
        if (response) {
          toast.success("Edit product successfully!");
          navigate("/");
        }
      } catch (error) {
        toast.error("Failed to edit product.");
      } finally {
        setLoadingButton(false);
      }
    }
  };

  const fillEditForm = async () => {
    setLoadingPage(true)
    if (id) {
      try {
        const response = await getProduct(id);
        const { image, name, price, sizes, description, category, quality } =
          response;
        
        reset({
          image,
          name,
          price,
          sizes,
          description,
          category,
          quality,
        });
      } catch (error) {
        toast.error("Failed to load product data.");
      }
    }
    setLoadingPage(false)
  };

  useEffect(() => {
    fillEditForm();
  }, []);

  if(loadingPage) return <Spin />

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md xl:ml-[305px] xl:mr-[20px]">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image URL */}
        <div>
          <label className="block mb-2 font-semibold">Image URL</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter image URL" />
            )}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block mb-2 font-semibold">Product Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter product name" />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-semibold">Price</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input {...field} type="number" placeholder="Enter price" />
            )}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Sizes */}
        <div>
          <label className="block mb-2 font-semibold">Sizes</label>
          {fields.map((field, index) => (
            <Space key={field.id}  className="mb-2 w-full flex items-center gap-4">
              <Controller
                name={`sizes.${index}.size`}
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Size" />
                )}
              />
              <Controller
                name={`sizes.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <Input {...field} type="number" placeholder="Quantity" />
                )}
              />
              <Button danger onClick={() => remove(index)}>
                Remove
              </Button>
            </Space>
          ))}
          <Button type="dashed" onClick={() => append({ size: "", quantity: 1 })}>
            Add Size
          </Button>
          {errors.sizes && (
            <p className="text-red-500 text-sm">{errors.sizes.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder="Enter product description" />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-[100px]"
                placeholder="Select a category"
                options={[
                  { value: "men", label: "Men" },
                  { value: "women", label: "Women" },
                  { value: "kids", label: "Kids" },
                ]}
              />
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        {/* Quality */}
        <div>
          <label className="block mb-2 font-semibold">Quality</label>
          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <Select
              style={{width: 100}}
                {...field}
                placeholder="Select quality"
                options={[
                  { value: "best seller", label: "Best Seller" },
                  { value: "new", label: "New" },
                ]}
              />
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="primary" htmlType="submit" loading={loadingButton}>
            Save Changes
          </Button>
          <Button onClick={() => reset()} danger>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
