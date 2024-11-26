import * as request from "../utils/request";

export const getAllProducts = async (offset: number, page = 1) => {
    try {
        const response = await request.get(`/product?offset=${offset}&page=${page}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
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
        const response = await request.get("/user");
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getProduct = async (id: string) => {
    try {
        const response = await request.get(`/product/id/${id}`);
        return response.data;
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
