import * as request from "../utils/request";

interface User {
    name?: string;
    address?: string;
    email: string;
    password: string;
};

interface Product {
    readonly id?: string,
    name: string,
    picture?: string,
    basePrice: number,
    stock: number,
    description: string,
    discountPercentage: number,
    categories: string[]
}

interface Category {
    id?: string,
    name: string
}

export const login = async (bodyParameters: User) => {
    try {
        const response = await request.post("/login", bodyParameters);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const createProduct = async (bodyParameters: Product) => {
    try {
        const response = await request.post("/product", bodyParameters);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const createCategory = async (bodyParameters: Category) => {
    try {
        const response = await request.post("/category", bodyParameters)
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}

export const createUser = async (bodyParameters: User) => {
    try {
        const response = await request.post('/user', bodyParameters)        
        return response.data
    } catch (error) {
        console.log(error);
    }
}
