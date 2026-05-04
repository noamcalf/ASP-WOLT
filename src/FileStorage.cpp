#include "FileStorage.h"

// Constructor: Initializes the file path and triggers the initial data load
FileStorage::FileStorage(const std::string& path) : filePath(path) {
    // Call the helper function to populate the cache immediately upon creation
    loadFromFile(); 
}

void FileStorage::loadFromFile() {
    // TODO: Implement reading from filePath.
    // Read line by line ("userId productId") and populate memoryCache.
    // Make sure to handle the case where the file does not exist yet.
}

void FileStorage::saveUserProduct(int userId, int productId) {
    // TODO: 
    // 1. Add the productId to the memoryCache for the given userId.
    // 2. Append the new action ("userId productId\n") to the physical file (use std::ios::app).
}

std::vector<int> FileStorage::getUserHistory(int userId) const {
    // TODO: Implement returning the user's history directly from memoryCache.
    // If the user doesn't exist, return an empty vector.
    return {}; 
}

std::vector<int> FileStorage::getAllUserIds() const {
    // TODO: Implement returning all unique user IDs by extracting keys from memoryCache.
    return {}; 
}