#include <gtest/gtest.h>
#include "HistoryManager.h"
#include "IStorage.h"

// Fake Storage for testing purposes only (Mock Object)
class MockStorage : public IStorage {
public:
    std::vector<int> mockData;
    
    // Fake implementation: just pushes to a temporary vector
    void saveUserProduct(int userId, int productId) override {
        mockData.push_back(productId);
    }
    
    // Fake implementation: returns the temporary vector
    std::vector<int> getUserHistory(int userId) const override {
        return mockData;
    }
};

TEST(HistoryManagerTest, AddAndRetrieveUserHistory) {
    // 1. Create the fake storage
    MockStorage fakeStorage;
    
    // 2. Create the manager and inject the fake storage
    HistoryManager manager(fakeStorage);
    
    // 3. Add products
    manager.addProductToUser(1, 104);
    manager.addProductToUser(1, 105);

    // 4. Define expected outcome
    std::vector<int> expected = {104, 105};
    
    // 5. Assert
    EXPECT_EQ(manager.getUserHistory(1), expected);
}