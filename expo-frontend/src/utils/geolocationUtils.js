/**
 * Calculates the great-circle distance between two points on the Earth's surface.
 * Uses the Haversine formula.
 * 
 * @param {number} lat1 Latitude of point 1 in decimal degrees
 * @param {number} lon1 Longitude of point 1 in decimal degrees
 * @param {number} lat2 Latitude of point 2 in decimal degrees
 * @param {number} lon2 Longitude of point 2 in decimal degrees
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Radius of the Earth in kilometers
    const R = 6371; 
    
    // Convert degrees to radians
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const radLat1 = lat1 * (Math.PI / 180);
    const radLat2 = lat2 * (Math.PI / 180);

    // Haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
};

/**
 * Estimates delivery time based on distance.
 * 
 * @param {number} distanceKm Distance in kilometers
 * @returns {string} Estimated delivery time range (e.g., "25-35 min")
 */
export const estimateDeliveryTime = (distanceKm) => {
    // Base preparation time: 15 minutes
    const basePrepTime = 15;
    
    // 5 minutes of travel time per kilometer
    const travelTime = distanceKm * 5;
    
    // Calculate exact estimated time
    const exactTime = Math.round(basePrepTime + travelTime);
    
    // Create a 10-minute window (e.g., 20-30 min) to give a realistic range
    const minTime = Math.max(10, exactTime - 5); // ensure we don't say 0-10 mins
    const maxTime = minTime + 10;
    
    return `${minTime}-${maxTime} min`;
};
