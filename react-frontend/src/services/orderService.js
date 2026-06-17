import { apiClient } from '../utils/apiClient';

/**
 * Sends a finalized order to the backend.
 * 
 * @param {Object} orderData The payload containing the order details.
 * Expected structure: 
 * {
 *   restaurantId: 'uuid',
 *   items: [
 *     { productId: 'uuid', quantity: 2 },
 *     ...
 *   ]
 * }
 * @returns {Promise<Object>} The response data if successful.
 */
export const placeOrder = async (orderData) => {
    const { response, data } = await apiClient('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        // The backend returns { error: "message" } on failure
        throw new Error(data?.error || 'Failed to place the order. Please try again.');
    }

    return data;
};
