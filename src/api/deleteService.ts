import * as request from '../utils/request'

export const deleteProduct = async (id: string) => {    
    try {
        const response = await request.remove(`/product/${id}`)
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