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

    // New variables for the HTTP commands mock
    // Controls what checkUserExists() returns in tests
    bool mockUserExistsResult = false; 
    // Controls what removeProductFromUser() returns in tests
    bool mockRemoveProductResult = true; 

    // Declarations only
    std::vector<int> getRecommendations(int userId, int productId) const override;
    void addProductToUser(int userId, int productId) override;
    bool checkUserExists(int userId) const override;
    bool removeProductFromUser(int userId, int productId) override;
};

#endif