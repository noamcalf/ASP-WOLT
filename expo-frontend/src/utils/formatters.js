/**
 * Formatters Utility
 * Centralizes common formatting logic (like currency, dates, etc.) to enforce DRY principles.
 */

/**
 * Formats a number as an Israeli Shekel (ILS) price with exactly two decimal places.
 * Example: formatPrice(65) returns "65.00"
 * @param {number|string} price - The raw price value
 * @returns {string} The formatted price
 */
export const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
        return "0.00";
    }
    return parseFloat(price).toFixed(2);
};

/**
 * Formats an enum status string (e.g. 'ON_ITS_WAY') to a readable title case string ('On Its Way').
 * @param {string} status - The raw status string
 * @returns {string} The formatted status string
 */
export const formatStatus = (status) => {
    if (!status) return '';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};
