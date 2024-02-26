
import { del, get, post, put } from "./base-api";
import axios from 'axios';
import { DOCOTEAM_API as API } from '../config';
// admin login
export const filesAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/filesCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};
// files list
export const getFilesList = async (limit: number, page: number) => {
    return get(`/filesList?limit=${limit}&&page=${page}`);
};

// files delete
export const filesDelete = async (id: string) => {
    return del(`/deleteFiles/${id}`);
};

// favorite update files
export const favoriteFile = async (id:string) => {
    return put(`/fileFavorite/${id}`);
};

// update shares files
export const shareUpdate = async (id:string,share={}) => {
    return put(`/fileShare/${id}`,share);
};

// favorite files list
export const getFavoriteList = async () => {
    return get(`/favoriteList`);
};
