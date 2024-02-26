
import { post } from "./base-api";
// admin login
export const loginAdmin = async (body = {}) => {
    return post(`/adminLogin`, body);
};