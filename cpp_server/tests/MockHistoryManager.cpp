#include "MockHistoryManager.h"

MockHistoryManager::MockHistoryManager(IStorage& storage) : HistoryManager(storage) {}

std::vector<int> MockHistoryManager::getRecommendations(int userId, int productId) const {
    // We use const_cast because we need to update tracking fields in a const function
    auto* nonConstThis = const_cast<MockHistoryManager*>(this);
    nonConstThis->lastRecUserId = userId;
    nonConstThis->lastRecProductId = productId;
    nonConstThis->getRecommendationsCallCount++;
    
    return fakeRecommendationsToReturn;
}

void MockHistoryManager::addProductToUser(int userId, int productId) {
    addProductCalls.push_back({userId, productId});
}

// Mock implementation for checking if a user exists
bool MockHistoryManager::checkUserExists(int userId) const {
    return mockUserExistsResult;
}

// Mock implementation for removing a product
bool MockHistoryManager::removeProductFromUser(int userId, int productId) {
    return mockRemoveProductResult;
}