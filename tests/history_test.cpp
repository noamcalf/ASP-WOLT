#include <gtest/gtest.h>
#include "HistoryManager.h"
#include "IStorage.h"
#include "MockStorage.h"

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