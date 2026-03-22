import axios from 'axios';
import  * as secureStore from 'expo-secure-store';

const API_URL = 'https://hostel-expense-app.onrender.com/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

api.interceptors.request.use( async (config) => {
    try {
        const token = await secureStore.getItemAsync('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
    } catch (error) {
        console.error('Error retrieving token from secure store:', error);
    }
    return config;
    }, (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);