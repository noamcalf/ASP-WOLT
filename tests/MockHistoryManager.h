#pragma once

#include "HistoryManager.h"
#include <vector>
#include <utility>

// Manual mock for HistoryManager
class MockHistoryManager : public HistoryManager {
public:
    // Tracking variables
    std::vector<std::pair<int, int>> addProductCalls;
    mutable int getRecommendationsCallCount = 0;
    mutable int lastRecUserId = -1;
    mutable int lastRecProductId = -1;

    // Stub data
    std::vector<int> fakeRecommendationsToReturn;

    // Constructor declaration
    MockHistoryManager(IStorage& storage);

    // Method declarations (override)
    void addProductToUser(int userId, int productId) override;
    std::vector<int> getRecommendations(int userId, int productId) const override;
};