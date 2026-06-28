// Set the basic URL path of the backend server for easy communication
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Set shortcuts for each route of the API:
export const API_ROUTES = {
    LOGIN: `${BASE_URL}/api/tokens`,
    REGISTER: `${BASE_URL}/api/users`,
    RESTAURANTS: `${BASE_URL}/api/restaurants`,
    SEARCH: `${BASE_URL}/api/search`
};
