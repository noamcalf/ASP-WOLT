#include "MockHistoryManager.h"

// Constructor implementation
MockHistoryManager::MockHistoryManager(IStorage& storage) : HistoryManager(storage) {}

// Method implementations
void MockHistoryManager::addProductToUser(int userId, int productId) {
    // Record that this method was called and save the arguments
    addProductCalls.push_back({userId, productId});
}

std::vector<int> MockHistoryManager::getRecommendations(int userId, int productId) const {
    // Record the call details
    getRecommendationsCallCount++;
    lastRecUserId = userId;
    lastRecProductId = productId;
    
    // Return the fake data
    return fakeRecommendationsToReturn;
}