import axios from 'axios';
export const BASE_URL = 'http://localhost:8000';
export const FLASK_URL = 'http://localhost:5000';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: FLASK_URL
});