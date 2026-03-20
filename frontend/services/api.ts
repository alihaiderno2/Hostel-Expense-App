import axios from 'axios';
import  * as secureStore from 'expo-secure-store';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use( async (config) => {
    const token = await secureStore.getItemAsync('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
    }, (error) => {
        return Promise.reject(error);
    }
);