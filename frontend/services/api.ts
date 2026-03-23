import axios from 'axios';
import  * as secureStore from 'expo-secure-store';

const DEFAULT_API_URL = 'https://hostel-expense-app.onrender.com/api';
const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Render free instances can cold-start, so give requests more time.
    timeout: 30000,
});

api.interceptors.request.use( async (config) => {
    try {
        const token = await secureStore.getItemAsync('token');
        const url = config.url || '';
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

        if (token && !isAuthEndpoint) {
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