
import { get, post, put } from "./base-api";
import axios from 'axios';
import { DOCOTEAM_API as API } from '../config';
// admin login
export const memberAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/memberCreate`, body);
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};
// member list
export const getMemberList = async () => {
    return get(`/memberList`);
};
// single member
export const singleMember = async (id:string) => {
    return get(`/memberSingle/${id}`);
};
// update member info
// export const updateMember = async (id:string, body = {}) => {
//     return put(`/editMember/${id}`, body);
// };

export const updateMember = async (id:string,body = {}) => {
    try {
        const response = await axios.put(`${API}/editMember/${id}`, body,{headers: {
            'Content-Type': 'multipart/form-data',
          },});
        return response.data;
    } catch (error:any) {
        return error.response.data;
    }
};

// member list search
export const searchMember = async (id:string) => {
    return get(`/memberSearch/${id}`);
};