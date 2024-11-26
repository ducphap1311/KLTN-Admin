import * as request from '../utils/request'

export const searchProduct = async (urlName: string) => {
    try {
        const response = await request.get(`/product?productName=${urlName}`)
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}