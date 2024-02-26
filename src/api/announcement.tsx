
import { get, post, put } from "./base-api";
import axios from 'axios';
import { DOCOTEAM_API as API } from '../config';
// admin login
export const postAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/postCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};
// post list
export const getPostList = async () => {
    return get(`/postList`);
};