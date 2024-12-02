import * as request from "../utils/request";

export const getAllProducts = async () => {
  const response = await fetch("http://localhost:5000/api/v1/products");
  return response.json();
};


export const getAllCategories = async () => {
    try {
        const response = await request.get("/category");
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getCategory = async (id: string) => {
    try {
        const response = await request.get(`/category/id/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getUser = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/v1/dashboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        });
        const responseData = await response.json()

        return responseData;
    } catch (error) {
        console.log(error);
    }
};

export const getProduct = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:5000/api/v1/products/${id}`);
        const responseData = await response.json()
        return responseData.product;
    } catch (error) {
        console.log(error);
    }
};

export const getSingleProduct = async (id: string) => {
    try {
        const response = await request.get(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
