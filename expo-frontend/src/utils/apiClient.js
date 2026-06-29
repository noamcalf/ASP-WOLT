/**
 * Global API Client (Interceptor)
 * This file wraps the native fetch API to automatically inject the JWT token 
 * from localStorage into the Authorization header for every request.
 */

// We load the base URL of our backend server from the .env file.
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo, environment variables must start with EXPO_PUBLIC_ and are accessed via process.env
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'; 

export const apiClient = async (endpoint, options = {}) => {
    // 1. Get the token from local memory (AsyncStorage)
    // Here we retrieve the token that we saved when the user logged in.
    let token = null;
    try {
        token = await AsyncStorage.getItem('token');
    } catch (e) {}

    // 2. Setup the headers
    // By default, we tell the server we are sending JSON data.
    // If the caller provided other headers, we merge them in.
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // If we are sending FormData (for file uploads), the browser MUST automatically set 
    // the Content-Type to 'multipart/form-data' with the correct boundary.
    // If we leave 'application/json' or set it manually, the upload will fail!
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    // 3. The "Interceptor" Logic: Inject the token if it exists!
    // If there is no token (e.g. user is not logged in), this step is skipped.
    // This perfectly handles public requests that don't need a token.
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. Combine all the configurations
    let body = options.body;
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
        body = JSON.stringify(body);
    }

    const config = {
        ...options,
        headers,
        body,
    };

    try {
        // 5. Execute the actual network request
        // We append the endpoint (e.g. '/api/orders') to the base URL.
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // We try to parse the JSON response from the server.
        const data = await response.json().catch(() => null); 
        
        // Return both the raw response object (to check status codes like 200, 401)
        // and the parsed data.
        return { response, data };
    } catch (error) {
        // Handle network errors (e.g. server is down, no internet connection)
        console.error('API Client Error:', error);
        throw error;
    }
};

export default apiClient;
