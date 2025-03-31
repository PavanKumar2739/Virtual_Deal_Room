import { apiInstance } from "./axiosConfig"

export const ServiceRequest = {

    callPostApi: async function (path, data, cancel = false) {
        const response = await apiInstance.request({
            url: path,
            method: 'POST',
            data,
        })
        return response.data;
    },
    callGetApi: async function (path, data, cancel = false) {
        const response = await apiInstance.request({
            url: path,
            method: 'GET',
            data,
        })
        return response.data;
    },
}