#include "MockStorage.h"

void MockStorage::saveUserProduct(int userId, int productId) {
    mockDataMap[userId].push_back(productId);
}

std::vector<int> MockStorage::getUserHistory(int userId) const {
    if (mockDataMap.find(userId) != mockDataMap.end()) {
        return mockDataMap[userId];
    }
    return {};
}