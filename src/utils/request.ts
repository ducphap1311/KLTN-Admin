import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:8070",
});

export const get = async (path: string) => {
    const response = await request.get(path);
    return response;
};

export const post = async (path: string, bodyParameters: {}) => {
    const response = await request.post(path, bodyParameters);
    return response;
};

export const patch = async (path: string, body: {}) => {
    const response = await request.patch(path, body);
    return response;
};

export const remove = async (path: string) => {
    const response = await request.delete(path);
    return response;
};

// Add a request interceptor
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

// Add a response interceptor
request.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(
                    "http://localhost:8070/refresh",
                    {
                        refreshToken,
                    }
                );
                const { accessToken } = response.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (error) {
                console.log(error);
            }
        }
        return Promise.reject(error);
    }
);
