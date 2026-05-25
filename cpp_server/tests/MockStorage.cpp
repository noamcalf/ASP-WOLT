#include "MockStorage.h"
#include <algorithm>

void MockStorage::saveUserProduct(int userId, int productId) {
    mockDataMap[userId].push_back(productId);
}

std::vector<int> MockStorage::getUserHistory(int userId) const {
    if (mockDataMap.find(userId) != mockDataMap.end()) {
        return mockDataMap[userId];
    }
    return {};
}

std::vector<int> MockStorage::getAllUserIds() const {
    std::vector<int> userIds;
    for (const auto& pair : mockDataMap) {
        userIds.push_back(pair.first);
    }
    return userIds;
}

// Checks if the user exists in our fake memory map
bool MockStorage::userExists(int userId) const {
    return mockDataMap.find(userId) != mockDataMap.end();
}

// Removes the product from the fake memory map if the user exists
void MockStorage::deleteProducts(int userId, int productId) {
    if (mockDataMap.find(userId) != mockDataMap.end()) {
        auto& products = mockDataMap[userId];
        products.erase(std::remove(products.begin(), products.end(), productId), products.end());
    }
}