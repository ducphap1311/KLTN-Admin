import * as request from '../utils/request'

export const deleteProduct = async (id: string) => {    
    try {
        const response = await fetch(`https://kltn-server.vercel.app/api/v1/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}

export const deleteCategory = async (id: string) => {
    try {
        const response = await request.remove(`/category/${id}`)
        return response
    } catch (error) {
        console.log(error);
    }
}