#ifndef MOCK_HISTORY_MANAGER_H
#define MOCK_HISTORY_MANAGER_H

#include <vector>
#include <utility>
#include "../src/HistoryManager.h"
#include "../src/IStorage.h"

class MockHistoryManager : public HistoryManager {
public:
    explicit MockHistoryManager(IStorage& storage);

    // Tracking fields for legacy tests
    int lastRecUserId = 0;
    int lastRecProductId = 0;
    int getRecommendationsCallCount = 0;
    std::vector<std::pair<int, int>> addProductCalls;

    // Data for new output tests
    std::vector<int> fakeRecommendationsToReturn;

    // Declarations only
    std::vector<int> getRecommendations(int userId, int productId) const override;
    void addProductToUser(int userId, int productId) override;
};

#endif