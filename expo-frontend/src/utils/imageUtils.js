export const getImageUrl = (imagePath, fallbackUrl) => {
    if (!imagePath) return fallbackUrl;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    return `${apiUrl}/${imagePath.replace(/\\/g, '/')}`;
};
