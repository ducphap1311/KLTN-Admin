import * as request from "../utils/request";

interface Product {
  name: string;
  basePrice: number;
  stock: number;
  description: string;
  discountPercentage: number;
}

interface Category {
  name: string;
}

export const uploadImage = async (id: string, formData: {}) => {
  try {
    const response = await request.patch(`/product/picture/${id}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editProduct = async (id: string, body: any) => {
  try {
    const response = await fetch(
      `https://kltn-server.vercel.app/api/v1/products/${id}`,
      {
          headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (id: string, body: Category) => {
  try {
    const response = await request.patch(`/category/${id}`, body);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
